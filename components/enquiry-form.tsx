"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { enquiryErrors, enquirySchema, type Enquiry } from "@/lib/enquiry";
import { Icon } from "./icons";

export interface EnquiryOption {
  id: string;
  title: string;
  type: string;
}
export function EnquiryForm({
  options,
  initialType = "consultation",
  initialOffering = "",
  available,
  whatsapp,
}: {
  options: EnquiryOption[];
  initialType?: Enquiry["type"];
  initialOffering?: string;
  available: boolean;
  whatsapp: string;
}) {
  const [type, setType] = useState<Enquiry["type"]>(initialType);
  const [offering, setOffering] = useState(initialOffering);
  const [method, setMethod] = useState("whatsapp");
  const [timeStatus, setTimeStatus] = useState("unknown");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const field = (name: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const error = (name: string) =>
    errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || !available) return;
    const data = new FormData(event.currentTarget);
    const values = {
      ...Object.fromEntries(data),
      consent: data.get("consent") === "on",
      birthTimeStatus: timeStatus,
      birthTime: timeStatus === "unknown" ? "" : data.get("birthTime") || "",
    };
    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      const next = enquiryErrors(parsed.error.issues);
      setErrors(next);
      const name = Object.keys(next)[0];
      (form.current?.elements.namedItem(name) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    setErrorMessage("");
    try {
      const response = await fetch("/api/enquiries/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.accepted) {
        setErrors(result.errors || {});
        setStatus("error");
        setErrorMessage(
          result.message ||
            "We could not confirm receipt. Please try again or contact us on WhatsApp.",
        );
      } else {
        setStatus("success");
        if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true")
          track("enquiry_success", {
            type: parsed.data.type,
            offering: parsed.data.offering,
          });
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "We could not confirm receipt of your enquiry. Your details are still here. Please try again or contact us on WhatsApp.",
      );
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }
  if (status === "success")
    return (
      <div className="form-success" ref={statusRef} tabIndex={-1} role="status">
        <Icon name="check-circle" size={48} />
        <h2>Enquiry received.</h2>
        <p>
          Thank you for sharing your question. The practice will contact you
          personally to discuss the details and arrangements.
        </p>
        <p>
          Your appointment and any fees will be confirmed in that conversation.
        </p>
        <Link className="button button-outline" href="/blog/">
          Explore the journal
          <Icon name="arrow-up" size={17} />
        </Link>
      </div>
    );
  return (
    <>
      <h2>What’s on your mind?</h2>
      <p>
        Share your question and a way to reach you. Birth details are optional
        at this stage.
      </p>
      {!available && (
        <div
          className="form-notice"
          id="form-availability"
          style={{ marginBottom: 24 }}
        >
          The online form is not accepting messages at the moment. Please{" "}
          <a href={whatsapp}>contact us on WhatsApp</a> or call the practice to
          make your enquiry.
        </div>
      )}
      <form className="enquiry-form" onSubmit={submit} ref={form} noValidate>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="enquiry-name">Your name *</label>
            <input
              id="enquiry-name"
              name="name"
              autoComplete="name"
              maxLength={100}
              required
              {...field("name")}
            />
            {error("name")}
          </div>
          <div className="form-field">
            <label htmlFor="enquiry-type">I’m enquiring about *</label>
            <select
              id="enquiry-type"
              name="type"
              value={type}
              onChange={(event) => {
                setType(event.target.value as Enquiry["type"]);
                setOffering("");
              }}
            >
              {["consultation", "remedy", "course", "general"].map((value) => (
                <option key={value} value={value}>
                  {value === "general"
                    ? "A general question"
                    : value === "remedy"
                      ? "A traditional remedy"
                      : value === "course"
                        ? "Learning astrology"
                        : "A consultation"}
                </option>
              ))}
            </select>
          </div>
        </div>
        {type !== "general" && (
          <div className="form-field">
            <label htmlFor="enquiry-offering">
              {type === "course"
                ? "Course"
                : type === "remedy"
                  ? "Remedy"
                  : "Consultation topic"}
            </label>
            <select
              id="enquiry-offering"
              name="offering"
              value={offering}
              onChange={(event) => setOffering(event.target.value)}
              {...field("offering")}
            >
              <option value="">Not sure yet — I’d like some guidance</option>
              {options
                .filter((option) => option.type === type)
                .map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.title}
                  </option>
                ))}
            </select>
            {error("offering")}
          </div>
        )}
        <div className="form-field">
          <label htmlFor="contact-method">How should we contact you? *</label>
          <select
            id="contact-method"
            name="contactMethod"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="phone">Phone call</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="enquiry-phone">
              Phone number {method !== "email" ? "*" : <span>(optional)</span>}
            </label>
            <input
              id="enquiry-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 99113 51351"
              maxLength={35}
              required={method !== "email"}
              {...field("phone")}
            />
            <span className="form-hint">Please include your country code.</span>
            {error("phone")}
          </div>
          <div className="form-field">
            <label htmlFor="enquiry-email">
              Email {method === "email" ? "*" : <span>(optional)</span>}
            </label>
            <input
              id="enquiry-email"
              name="email"
              type="email"
              autoComplete="email"
              required={method === "email"}
              maxLength={200}
              {...field("email")}
            />
            {error("email")}
          </div>
        </div>
        {type === "course" && (
          <div className="form-field">
            <label htmlFor="qualification">Educational qualification *</label>
            <input
              id="qualification"
              name="qualification"
              placeholder="For example, Class 12 or graduate"
              maxLength={200}
              {...field("qualification")}
            />
            {error("qualification")}
          </div>
        )}
        <div className="form-field">
          <label htmlFor="enquiry-message">Your question *</label>
          <textarea
            id="enquiry-message"
            name="message"
            rows={4}
            maxLength={4000}
            placeholder="Tell us a little about what you’d like to understand…"
            required
            {...field("message")}
          />
          {error("message")}
        </div>
        {(type === "consultation" || type === "remedy") && (
          <details className="birth-details">
            <summary>
              Add birth information<span>Optional at this stage</span>
              <Icon name="down" size={15} />
            </summary>
            <div>
              <div className="form-field">
                <label htmlFor="birth-date">Date of birth</label>
                <input
                  id="birth-date"
                  name="birthDate"
                  type="date"
                  min="1850-01-01"
                  max={new Date().toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata",
                  })}
                  {...field("birthDate")}
                />
                {error("birthDate")}
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="birth-time-status">Birth-time accuracy</label>
                  <select
                    id="birth-time-status"
                    name="birthTimeStatus"
                    value={timeStatus}
                    onChange={(event) => setTimeStatus(event.target.value)}
                  >
                    <option value="unknown">I don’t know my birth time</option>
                    <option value="approximate">
                      I have an approximate time
                    </option>
                    <option value="known">I know the recorded time</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="birth-time">Time of birth</label>
                  <input
                    id="birth-time"
                    name="birthTime"
                    type="time"
                    disabled={timeStatus === "unknown"}
                    {...field("birthTime")}
                  />
                  {error("birthTime")}
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="birth-place">Place of birth</label>
                <input
                  id="birth-place"
                  name="birthPlace"
                  placeholder="City and country"
                  maxLength={200}
                  {...field("birthPlace")}
                />
                {error("birthPlace")}
              </div>
            </div>
          </details>
        )}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="enquiry-website">Leave this field empty</label>
          <input
            name="website"
            id="enquiry-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div>
          <div className="consent-field">
            <input
              id="enquiry-consent"
              type="checkbox"
              name="consent"
              required
              {...field("consent")}
            />
            <label htmlFor="enquiry-consent">
              I agree to the handling of my details to respond to this enquiry,
              as described in the <Link href="/privacy/">privacy notice</Link>.
            </label>
          </div>
          {error("consent")}
        </div>
        {status === "error" && (
          <div
            className="form-status-error"
            ref={statusRef}
            tabIndex={-1}
            role="alert"
          >
            {errorMessage} <a href={whatsapp}>Talk on WhatsApp.</a>
          </div>
        )}
        <button
          className="button"
          type="submit"
          disabled={status === "sending" || !available}
          aria-describedby={!available ? "form-availability" : undefined}
        >
          {status === "sending" ? "Sending your enquiry…" : "Send your enquiry"}
          <Icon name="arrow-up" size={18} />
        </button>
        <span className="form-hint">
          This is an enquiry. Appointment availability, suitability, and current
          fees are discussed personally.
        </span>
      </form>
    </>
  );
}
