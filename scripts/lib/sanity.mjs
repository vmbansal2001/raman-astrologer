import { createClient } from "@sanity/client";

try {
  process.loadEnvFile(".env.local");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

export function sanityConfiguration() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId)
    throw new Error(
      "Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET before running CMS checks.",
    );
  return {
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  };
}

export async function fetchSanity(query, params = {}) {
  const client = createClient({
    ...sanityConfiguration(),
    token: process.env.SANITY_API_READ_TOKEN,
    apiVersion: "2026-10-30",
    useCdn: false,
  });
  try {
    return await client.fetch(query, params, {
      perspective: "published",
      stega: false,
    });
  } catch (error) {
    let message = String(error.message || "Content request failed");
    for (const secret of [
      process.env.SANITY_API_READ_TOKEN,
      process.env.SANITY_API_WRITE_TOKEN,
    ])
      if (secret) message = message.replaceAll(secret, "[redacted]");
    // Do not propagate the SDK request object, which can contain credentials.
    throw new Error(
      `Sanity request failed (${error.statusCode || "network"}): ${message.slice(0, 600)}`,
    );
  }
}

export async function getPublishedContent() {
  const entries = await fetchSanity(
    '*[_type in ["article", "consultation", "remedy"]] | order(publishedAt desc, _id asc){"id":coalesce(id,_id),legacyId,"type":_type,title,"slug":slug.current,category,path,publishedAt}',
  );
  return entries.map((entry) => ({
    ...entry,
    path:
      entry.path ||
      (entry.type === "article"
        ? `/blog/${entry.slug}/`
        : entry.type === "consultation"
          ? `/consultations/${entry.slug}/`
          : `/remedies/${entry.category}/${entry.slug}/`),
  }));
}
