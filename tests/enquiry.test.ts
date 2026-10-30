import { test } from "node:test";
import assert from "node:assert/strict";
import { enquirySchema } from "../lib/enquiry";

const valid = {
  name: "Preview Visitor",
  type: "consultation",
  offering: "wp-893",
  contactMethod: "whatsapp",
  phone: "+91 99999 00000",
  email: "",
  message: "I would like to understand birth-time rectification.",
  consent: true,
  birthTimeStatus: "unknown",
};
test("an enquiry can be made without birth details", () => {
  const result = enquirySchema.safeParse(valid);
  assert(result.success);
  assert.equal(result.data.birthTimeStatus, "unknown");
  assert.equal(result.data.birthTime, "");
});
test("email-only enquiries do not require a phone number", () => {
  assert(
    enquirySchema.safeParse({
      ...valid,
      contactMethod: "email",
      email: "preview@example.test",
      phone: "",
    }).success,
  );
});
test("the selected contact method must be usable", () => {
  assert(!enquirySchema.safeParse({ ...valid, phone: "99999" }).success);
  assert(
    !enquirySchema.safeParse({
      ...valid,
      contactMethod: "email",
      email: "invalid",
    }).success,
  );
});
test("invalid dates and times are rejected", () => {
  assert(
    !enquirySchema.safeParse({ ...valid, birthDate: "2023-02-30" }).success,
  );
  assert(
    !enquirySchema.safeParse({ ...valid, birthDate: "2999-01-01" }).success,
  );
  assert(
    !enquirySchema.safeParse({
      ...valid,
      birthTimeStatus: "known",
      birthTime: "25:90",
    }).success,
  );
});
test("course enquiries require an educational qualification", () => {
  assert(
    !enquirySchema.safeParse({
      ...valid,
      type: "course",
      offering: "course-basic",
    }).success,
  );
  assert(
    enquirySchema.safeParse({
      ...valid,
      type: "course",
      offering: "course-basic",
      qualification: "Graduate",
    }).success,
  );
});
test("consent, reasonable message length, and the honeypot are enforced", () => {
  assert(!enquirySchema.safeParse({ ...valid, consent: false }).success);
  assert(!enquirySchema.safeParse({ ...valid, message: "hello" }).success);
  assert(
    !enquirySchema.safeParse({ ...valid, message: "x".repeat(4001) }).success,
  );
  assert(
    !enquirySchema.safeParse({ ...valid, website: "spam.example" }).success,
  );
});
test("unexpected client fields cannot change the intake destination", () => {
  const result = enquirySchema.parse({
    ...valid,
    recipient: "other@example.test",
    destination: "https://example.test",
    _subject: "override",
  });
  assert(!("recipient" in result));
  assert(!("destination" in result));
  assert(!("_subject" in result));
});
