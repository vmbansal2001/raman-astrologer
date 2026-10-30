import { createHash } from "node:crypto";
import { enquiryErrors, enquirySchema } from "@/lib/enquiry";
import { getContentIndex } from "@/lib/content";
import { origin } from "@/lib/site";

export const runtime = "nodejs";
const buckets = new Map<string, { count: number; reset: number }>();
const reply = (body: Record<string, unknown>, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");
  let sameHost = false;
  try {
    sameHost =
      !!requestOrigin &&
      new URL(requestOrigin).host === request.headers.get("host") &&
      ["https:", "http:"].includes(new URL(requestOrigin).protocol);
  } catch {}
  if (requestOrigin && !sameHost && requestOrigin !== origin)
    return reply(
      { accepted: false, message: "This enquiry could not be accepted." },
      403,
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply(
      {
        accepted: false,
        message: "Please send this enquiry using the website form.",
      },
      415,
    );
  if (Number(request.headers.get("content-length")) > 16000)
    return reply(
      { accepted: false, message: "Please shorten your enquiry." },
      413,
    );
  let body;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 16000)
      return reply(
        { accepted: false, message: "Please shorten your enquiry." },
        413,
      );
    body = JSON.parse(raw);
  } catch {
    return reply(
      { accepted: false, message: "Please check your enquiry and try again." },
      400,
    );
  }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success)
    return reply(
      {
        accepted: false,
        message: "Please check the highlighted fields.",
        errors: enquiryErrors(parsed.error.issues),
      },
      400,
    );
  const enquiry = parsed.data;
  const entries = await getContentIndex();
  const offering = enquiry.offering
    ? entries.find(
        (entry) => entry.id === enquiry.offering && entry.type === enquiry.type,
      )
    : undefined;
  const course =
    enquiry.type === "course" &&
    ["course-basic", "course-advanced"].includes(enquiry.offering);
  if (enquiry.offering && !offering && !course)
    return reply(
      {
        accepted: false,
        message: "Please choose a valid offering.",
        errors: {
          offering: "Choose a topic from the list or select general guidance.",
        },
      },
      400,
    );
  const formId = process.env.FORMSPREE_FORM_ID;
  if (!formId || process.env.ENQUIRIES_ENABLED !== "true")
    return reply(
      {
        accepted: false,
        message:
          "The online form is not accepting messages at the moment. Please contact the practice on WhatsApp or by phone.",
      },
      503,
    );
  const identity = createHash("sha256")
    .update(
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local",
    )
    .digest("hex");
  const now = Date.now();
  const bucket = buckets.get(identity);
  if (bucket && bucket.reset > now && bucket.count >= 5)
    return Response.json(
      {
        accepted: false,
        message:
          "Please wait a few minutes before trying again, or contact us on WhatsApp.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((bucket.reset - now) / 1000)),
          "Cache-Control": "no-store",
        },
      },
    );
  buckets.set(identity, {
    count: bucket && bucket.reset > now ? bucket.count + 1 : 1,
    reset: bucket && bucket.reset > now ? bucket.reset : now + 300000,
  });
  if (buckets.size > 5000)
    for (const [key, value] of buckets) {
      if (value.reset < now) buckets.delete(key);
    }
  if (buckets.size > 5000) buckets.delete(buckets.keys().next().value!);
  try {
    const response = await fetch(
      `https://formspree.io/f/${encodeURIComponent(formId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: enquiry.name,
          ...(enquiry.email ? { email: enquiry.email } : {}),
          phone: enquiry.phone,
          message: enquiry.message,
          enquiry_type: enquiry.type,
          offering:
            offering?.title ||
            (course
              ? enquiry.offering === "course-basic"
                ? "Basic astrology course"
                : "Advanced astrology study"
              : "General guidance"),
          preferred_contact: enquiry.contactMethod,
          ...(enquiry.type !== "course" && enquiry.type !== "general"
            ? {
                birth_date: enquiry.birthDate,
                birth_time_accuracy: enquiry.birthTimeStatus,
                birth_time:
                  enquiry.birthTimeStatus === "unknown"
                    ? ""
                    : enquiry.birthTime,
                birth_place: enquiry.birthPlace,
              }
            : {}),
          ...(enquiry.type === "course"
            ? { qualification: enquiry.qualification }
            : {}),
          source_page: offering
            ? `${origin}${offering.path}`
            : `${origin}/contact/`,
          consent: "Enquiry response consent provided",
          _subject: `${enquiry.type === "course" ? "Course" : enquiry.type === "remedy" ? "Remedy" : "Consultation"} enquiry — Raman Astrologer`,
        }),
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
        redirect: "error",
      },
    );
    if (!response.ok)
      return reply(
        {
          accepted: false,
          message:
            "We could not confirm receipt. Your details are still in the form. Please try again or contact us on WhatsApp.",
        },
        response.status === 429 ? 429 : 502,
      );
    const result = await response.json();
    if (result.ok !== true)
      return reply(
        {
          accepted: false,
          message:
            "We could not confirm receipt. Please contact us on WhatsApp or try again.",
        },
        502,
      );
    return reply(
      {
        accepted: true,
        message:
          "Enquiry received. We will contact you personally about the arrangements.",
      },
      202,
    );
  } catch {
    return reply(
      {
        accepted: false,
        message:
          "We could not confirm receipt. Please keep your details and try again, or contact us on WhatsApp.",
      },
      502,
    );
  }
}
