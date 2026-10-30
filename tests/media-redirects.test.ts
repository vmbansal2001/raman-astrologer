import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import legacy from "../content/legacy-media.json";
import previous from "../content/media-redirects.json";
import assets from "../content/assets.json";

const redirects: Record<string, string> = { ...legacy, ...previous };
const groups = [
  ["WordPress image", Object.keys(legacy)[0]],
  [
    "original generated image",
    Object.keys(previous).find((path) =>
      /^\/media\/[a-f0-9]{16}\.webp$/.test(path),
    )!,
  ],
  [
    "shared local image",
    Object.keys(previous).find((path) =>
      /^\/media\/[a-f0-9]{64}\.webp$/.test(path),
    )!,
  ],
];
for (const [name, path] of groups) {
  test(`${name} URLs redirect directly to Sanity with one permanent redirect`, () => {
    assert(path);
    const response = proxy(
      new NextRequest(`https://ramanastrologer.com${path}?old-size=400`),
    );
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), redirects[path]);
    assert(
      response.headers
        .get("location")
        ?.startsWith("https://cdn.sanity.io/images/xqbous5j/production/"),
    );
  });
}

test("all migrated image mappings and site images use the 99 uploaded Sanity assets", () => {
  const destinations = new Set(Object.values(redirects));
  assert.equal(destinations.size, 99);
  assert.equal(
    Object.keys(previous).filter((path) =>
      /^\/media\/[a-f0-9]{64}\.webp$/.test(path),
    ).length,
    99,
  );
  for (const destination of destinations) {
    assert(
      destination.startsWith(
        "https://cdn.sanity.io/images/xqbous5j/production/",
      ),
    );
    assert(
      !redirects[destination],
      "An image redirect must not point to another legacy URL",
    );
  }
  for (const image of Object.values(assets))
    assert(destinations.has(image.src));
});

test("unknown image URLs are not redirected to an unrelated asset", () => {
  const response = proxy(
    new NextRequest("https://ramanastrologer.com/media/unknown-image.webp"),
  );
  assert.equal(response.headers.get("location"), null);
  assert.equal(response.headers.get("x-middleware-next"), "1");
});

test("previous optimized image URLs keep their sizing and move to the CDN source", () => {
  const source = groups[2][1];
  const url = new URL("https://ramanastrologer.com/_next/image/");
  url.searchParams.set("url", source);
  url.searchParams.set("w", "640");
  url.searchParams.set("q", "75");
  const response = proxy(new NextRequest(url));
  assert.equal(response.status, 308);
  const destination = new URL(response.headers.get("location")!);
  assert.equal(destination.origin, url.origin);
  assert.equal(destination.searchParams.get("url"), redirects[source]);
  assert.equal(destination.searchParams.get("w"), "640");
  assert.equal(destination.searchParams.get("q"), "75");
  const next = proxy(new NextRequest(destination));
  assert.equal(next.headers.get("location"), null);
  assert.equal(next.headers.get("x-middleware-next"), "1");
});

test("malformed optimizer sources pass through to Next.js input validation", () => {
  const url = new URL("https://ramanastrologer.com/_next/image/");
  url.searchParams.set("url", "/\\");
  const response = proxy(new NextRequest(url));
  assert.equal(response.headers.get("location"), null);
  assert.equal(response.headers.get("x-middleware-next"), "1");
});
