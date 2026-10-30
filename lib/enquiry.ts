import { z } from "zod";

export const enquiryTypes = [
  "consultation",
  "remedy",
  "course",
  "general",
] as const;
export const enquirySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your name.")
      .max(100, "Please use no more than 100 characters."),
    type: z.enum(enquiryTypes, { error: "Choose an enquiry type." }),
    offering: z.string().max(120).default(""),
    contactMethod: z.enum(["whatsapp", "phone", "email"], {
      error: "Choose how you would like us to contact you.",
    }),
    phone: z.string().trim().max(35).default(""),
    email: z.string().trim().max(200).default(""),
    message: z
      .string()
      .trim()
      .min(
        10,
        "Please share a little more about your question (at least 10 characters).",
      )
      .max(4000, "Please keep your message within 4,000 characters."),
    birthDate: z.string().max(10).default(""),
    birthTimeStatus: z
      .enum(["known", "approximate", "unknown"])
      .default("unknown"),
    birthTime: z.string().max(5).default(""),
    birthPlace: z.string().trim().max(200).default(""),
    qualification: z.string().trim().max(200).default(""),
    consent: z.literal(true, {
      error: "Please agree to the handling of your enquiry.",
    }),
    website: z.string().max(0, "Unable to accept this enquiry.").default(""),
  })
  .superRefine((value, ctx) => {
    if (value.contactMethod === "email") {
      if (!z.email().safeParse(value.email).success)
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Enter a valid email address.",
        });
    } else if (!/^\+[1-9]\d{7,14}$/.test(value.phone.replace(/[\s()-]/g, ""))) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Include your country code, for example +91 99113 51351.",
      });
    }
    if (value.email && !z.email().safeParse(value.email).success)
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Enter a valid email address or leave this field empty.",
      });
    if (value.birthDate) {
      const date = new Date(`${value.birthDate}T00:00:00Z`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(value.birthDate) ||
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== value.birthDate ||
        date > new Date() ||
        date.getUTCFullYear() < 1850
      )
        ctx.addIssue({
          code: "custom",
          path: ["birthDate"],
          message: "Enter a valid birth date that is not in the future.",
        });
    }
    if (
      value.birthTimeStatus !== "unknown" &&
      value.birthTime &&
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(value.birthTime)
    )
      ctx.addIssue({
        code: "custom",
        path: ["birthTime"],
        message: "Enter a valid time.",
      });
    if (value.type === "course" && !value.qualification)
      ctx.addIssue({
        code: "custom",
        path: ["qualification"],
        message: "Please share your educational qualification.",
      });
  });

export type Enquiry = z.infer<typeof enquirySchema>;
export function enquiryErrors(issues: z.core.$ZodIssue[]) {
  return Object.fromEntries(
    issues.map((issue) => [String(issue.path[0] || "form"), issue.message]),
  );
}
