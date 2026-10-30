import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { load } from "cheerio";
import { getPublishedContent } from "./lib/sanity.mjs";
const base = process.env.TEST_SITE_URL || "http://127.0.0.1:3001";
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const index = await getPublishedContent(),
  redirects = await read("content/redirects.json"),
  attachments = await read("content/legacy-attachments.json"),
  media = await read("content/legacy-media.json"),
  mediaRedirects = await read("content/media-redirects.json"),
  tags = await read("content/tag-index.json");
const canonicalPages = [
  "/",
  "/about/",
  "/contact/",
  "/consultations/",
  "/remedies/",
  "/learn-astrology/",
  "/blog/",
  "/privacy/",
  "/terms/",
];
const failures = [];
let contentChecked = 0,
  redirectsChecked = 0,
  imageAliasesChecked = 0,
  resourcesChecked = 0;
async function parallel(items, task) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (queue.length) {
        const item = queue.shift();
        try {
          await task(item);
        } catch (error) {
          failures.push({
            item:
              typeof item === "object"
                ? item.path || item.source || item[0]
                : item,
            message: String(error),
          });
        }
      }
    }),
  );
}
async function get(path) {
  return fetch(new URL(path, base), {
    redirect: "manual",
    signal: AbortSignal.timeout(20000),
  });
}
await parallel(index, async (entry) => {
  const response = await get(entry.path);
  assert.equal(response.status, 200, entry.path);
  const $ = load(await response.text());
  assert.equal($("h1").length, 1);
  assert.equal($("h1").text().trim(), entry.title);
  assert.equal(
    new URL($("link[rel=canonical]").attr("href")).pathname,
    entry.path,
  );
  assert($("meta[name=description]").attr("content"));
  if (entry.type === "article")
    assert(
      $("script[type='application/ld+json']")
        .map((_, node) => JSON.parse($(node).text()))
        .get()
        .some((item) => item["@type"] === "Article"),
    );
  contentChecked++;
  if (contentChecked % 150 === 0)
    console.log(`Checked ${contentChecked}/${index.length} content pages`);
});
await parallel(canonicalPages, async (path) => {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  const $ = load(await response.text());
  assert.equal($("h1").length, 1, path);
  assert.equal(new URL($("link[rel=canonical]").attr("href")).pathname, path);
  assert($("meta[name=description]").attr("content"), path);
});
const checkedPages = new Set([
  ...index.map((entry) => entry.path),
  ...canonicalPages,
]);
const redirectTargets = new Set([
  ...redirects
    .filter((item) => !item.source.includes(":"))
    .map((item) => item.destination),
  ...Object.values(attachments),
]);
await parallel(
  [...redirectTargets].filter((path) => !checkedPages.has(path)),
  async (path) => {
    const response = await get(path);
    assert.equal(
      response.status,
      200,
      `Redirect points to an unavailable page: ${path}`,
    );
    await response.text();
  },
);
await parallel(
  redirects.filter((item) => !item.source.includes(":")),
  async (item) => {
    const response = await get(item.source);
    assert([301, 308].includes(response.status));
    assert.equal(
      new URL(response.headers.get("location"), base).pathname,
      item.destination,
    );
    redirectsChecked++;
  },
);
await parallel(Object.entries(attachments), async ([source, destination]) => {
  const response = await get(source);
  assert.equal(response.status, 301);
  assert.equal(
    new URL(response.headers.get("location"), base).pathname,
    destination,
  );
  redirectsChecked++;
});
await parallel(Object.entries(media), async ([source, destination]) => {
  const response = await get(source);
  assert.equal(response.status, 301);
  assert.equal(
    new URL(response.headers.get("location"), base).href,
    new URL(destination, base).href,
  );
  resourcesChecked++;
});
await parallel(
  Object.entries(mediaRedirects),
  async ([source, destination]) => {
    const response = await get(source);
    assert.equal(response.status, 301);
    assert.equal(
      new URL(response.headers.get("location"), base).href,
      new URL(destination, base).href,
    );
    imageAliasesChecked++;
  },
);
await parallel([...new Set(Object.values(media))], async (source) => {
  const response = await get(source);
  assert.equal(response.status, 200);
  assert(response.headers.get("content-type").startsWith("image/"));
  await response.arrayBuffer();
});
const oldImagePath = Object.keys(mediaRedirects).find((path) =>
  /^\/media\/[a-f0-9]{64}\.webp$/.test(path),
);
const oldOptimized = new URL("/_next/image/", base);
oldOptimized.searchParams.set("url", oldImagePath);
oldOptimized.searchParams.set("w", "640");
oldOptimized.searchParams.set("q", "75");
const optimizedRedirect = await get(oldOptimized.href);
assert.equal(optimizedRedirect.status, 308);
const optimizedLocation = new URL(
  optimizedRedirect.headers.get("location"),
  base,
);
assert.equal(
  optimizedLocation.searchParams.get("url"),
  mediaRedirects[oldImagePath],
);
const optimizedImage = await get(optimizedLocation.href);
assert.equal(optimizedImage.status, 200);
assert(optimizedImage.headers.get("content-type").startsWith("image/"));
for (const route of [
  "/blog/?page=2",
  "/blog/topics/nakshatras/",
  "/blog/topics/planetary-placements/?planet=sun&house=1",
  "/consultations/?q=career",
  "/remedies/yantras/?page=3",
  "/search/?q=saade+sati",
  "/learn-astrology/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/terms/",
]) {
  try {
    assert.equal((await get(route)).status, 200, route);
  } catch (error) {
    failures.push({ route, message: String(error) });
  }
}
for (const route of [
  "/unknown-page-that-does-not-exist/",
  "/consultations/not-an-offering/",
  "/blog/?page=9999",
]) {
  try {
    assert.equal((await get(route)).status, 404, route);
  } catch (error) {
    failures.push({ route, message: String(error) });
  }
}
const tagSamples = Object.values(tags).slice(0, 3);
for (const tag of tagSamples) {
  try {
    const response = await get(`/tag/${tag.slug}/`);
    assert.equal(response.status, 200);
    const $ = load(await response.text());
    assert($("meta[name=robots]").attr("content").includes("noindex"));
  } catch (error) {
    failures.push({ tag: tag.slug, message: String(error) });
  }
}
for (const route of [
  "/search/?q=career",
  "/consultations/?category=career",
  "/blog/?planet=sun",
]) {
  try {
    const $ = load(await (await get(route)).text());
    assert($("meta[name=robots]").attr("content").includes("noindex"));
  } catch (error) {
    failures.push({ route, message: String(error) });
  }
}
const sitemap = await get("/sitemap.xml");
assert.equal(sitemap.status, 200);
const sitemapUrls = ((await sitemap.text()).match(/<url>/g) || []).length;
assert.equal(sitemapUrls, index.length + 24);
assert.equal((await get("/robots.txt")).status, 200);
assert.equal((await get("/opengraph-image/")).status, 200);
await fs.mkdir("test-results", { recursive: true });
const report = {
  contentPagesChecked: contentChecked,
  canonicalPagesChecked: canonicalPages.length,
  redirectsChecked,
  legacyMediaPathsChecked: resourcesChecked,
  reusedImagePathsChecked: imageAliasesChecked,
  uniqueImagesChecked: new Set(Object.values(media)).size,
  tagSamples: tagSamples.length,
  sitemapUrls,
  failures,
};
await fs.writeFile("test-results/routes.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
assert.equal(failures.length, 0);
