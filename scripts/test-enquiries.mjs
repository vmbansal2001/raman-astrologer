import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs/promises";
import { getPublishedContent } from "./lib/sanity.mjs";
const base = process.env.TEST_SITE_URL || "http://127.0.0.1:3001";
const proxyPort = Number(process.env.TEST_PROXY_PORT || 7001);
let sequence = 1;
const evidence = [];
const content = await getPublishedContent();
const consultation = content.find((entry) => entry.type === "consultation");
const remedy = content.find((entry) => entry.type === "remedy");
assert(
  consultation && remedy,
  "Published consultation and remedy fixtures are required.",
);
const valid = {
  name: "Preview Visitor",
  type: "consultation",
  offering: consultation.id,
  contactMethod: "whatsapp",
  phone: "+91 99999 00000",
  email: "",
  message: "I would like to understand birth-time rectification.",
  birthTimeStatus: "unknown",
  birthTime: "12:00",
  consent: true,
};
async function control(pathname, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port: proxyPort,
        method: body ? "POST" : "GET",
        path: `http://formspree.io${pathname}`,
        headers: { Host: "formspree.io", "Content-Type": "application/json" },
      },
      (res) => {
        let text = "";
        res.on("data", (chunk) => (text += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(text));
          } catch {
            reject(new Error(text));
          }
        });
      },
    );
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}
async function submit(values, options = {}) {
  const response = await fetch(`${base}/api/enquiries/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: new URL(base).origin,
      "X-Forwarded-For": options.ip || `198.51.100.${sequence++}`,
      ...(options.headers || {}),
    },
    body: typeof values === "string" ? values : JSON.stringify(values),
    signal: AbortSignal.timeout(15000),
  });
  return { status: response.status, data: await response.json() };
}
async function check(name, run) {
  await run();
  evidence.push({ name, passed: true });
  console.log(`PASS ${name}`);
}
for (const type of ["consultation", "remedy", "course", "general"])
  await check(`${type} accepted only after provider confirmation`, async () => {
    await control("/__control", { mode: "success" });
    const offering =
      type === "remedy"
        ? remedy.id
        : type === "course"
          ? "course-basic"
          : type === "general"
            ? ""
            : consultation.id;
    const response = await submit({
      ...valid,
      type,
      offering,
      ...(type === "course" ? { qualification: "Graduate" } : {}),
    });
    assert.equal(response.status, 202);
    assert.equal(response.data.accepted, true);
    const state = await control("/__state");
    assert.equal(state.requests, 1);
    assert.equal(state.accepted, 1);
    if (type === "consultation")
      assert.equal(
        state.lastPayload.birth_time,
        "",
        "Unknown time must not be turned into noon",
      );
    if (type === "course" || type === "general")
      assert(!("birth_date" in state.lastPayload));
    assert.equal(
      state.lastPayload.source_page.startsWith("https://ramanastrologer.com/"),
      true,
    );
  });
await check("validation stops invalid input before the provider", async () => {
  await control("/__control", { mode: "success" });
  for (const payload of [
    { ...valid, consent: false },
    { ...valid, phone: "123" },
    { ...valid, type: "course", offering: "course-basic" },
    { ...valid, offering: "unknown-offering" },
    { ...valid, website: "spam.example" },
  ]) {
    const response = await submit(payload);
    assert.equal(response.status, 400);
    assert.equal(response.data.accepted, false);
  }
  assert.equal((await control("/__state")).requests, 0);
});
await check("cross-origin and malformed requests are rejected", async () => {
  assert.equal(
    (await submit(valid, { headers: { Origin: "https://untrusted.example" } }))
      .status,
    403,
  );
  assert.equal((await submit("not-json")).status, 400);
  assert.equal(
    (await submit(valid, { headers: { "Content-Type": "text/plain" } })).status,
    415,
  );
});
for (const mode of [
  "server-error",
  "html-error",
  "rate-limit",
  "unconfirmed",
  "invalid-json",
])
  await check(`provider ${mode} is not reported as success`, async () => {
    await control("/__control", { mode });
    const response = await submit(valid);
    assert.equal(response.status, mode === "rate-limit" ? 429 : 502);
    assert.equal(response.data.accepted, false);
    assert.equal((await control("/__state")).requests, 1);
  });
await check(
  "an ambiguous timeout does not retry the provider write",
  async () => {
    await control("/__control", { mode: "timeout-after-accept" });
    const start = Date.now();
    const response = await submit(valid);
    assert.equal(response.status, 502);
    assert.equal(response.data.accepted, false);
    assert(Date.now() - start < 14500);
    const state = await control("/__state");
    assert.equal(state.requests, 1);
    assert.equal(state.accepted, 1);
  },
);
await check(
  "repeat submissions are bounded before reaching the provider",
  async () => {
    await control("/__control", { mode: "success" });
    const ip = "203.0.113.77";
    for (let i = 0; i < 5; i++)
      assert.equal((await submit(valid, { ip })).status, 202);
    assert.equal((await submit(valid, { ip })).status, 429);
    assert.equal((await control("/__state")).requests, 5);
  },
);
await fs.mkdir("test-results", { recursive: true });
await fs.writeFile(
  "test-results/enquiries.json",
  JSON.stringify(
    {
      environment:
        "Production Next.js server against a local Formspree stand-in via Postman proxy",
      liveDeliveryVerified: false,
      tests: evidence,
    },
    null,
    2,
  ),
);
console.log(
  `${evidence.length} HTTP integration scenarios passed. No live messages were sent.`,
);
