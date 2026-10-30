import type { MetadataRoute } from "next";
import { getContentIndex } from "@/lib/content";
import { articleTopics, origin, remedyTopics } from "@/lib/site";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getContentIndex();
  const main = [
    "/",
    "/about/",
    "/contact/",
    "/consultations/",
    "/remedies/",
    "/learn-astrology/",
    "/blog/",
    "/privacy/",
    "/terms/",
    ...remedyTopics.map((topic) => `/remedies/${topic.slug}/`),
    ...articleTopics.map((topic) => `/blog/topics/${topic.slug}/`),
  ];
  return [
    ...main.map((path) => ({ url: `${origin}${path}` })),
    ...entries.map((entry) => ({
      url: `${origin}${entry.path}`,
      lastModified: entry.updatedAt || entry.publishedAt,
    })),
  ];
}
