import "server-only";
import { cache } from "react";
import { draftMode } from "next/headers";
import siteAssets from "@/content/assets.json";
import type {
  ContentEntry,
  ContentImage,
  ContentSummary,
  SiteSettings,
  Topic,
} from "./types";
import { site, articleTopics, consultationTopics, remedyTopics } from "./site";
import { client } from "@/sanity/lib/client";
import { live } from "@/sanity/lib/live";

export const assets = siteAssets as Record<string, ContentImage>;
const typesQuery = '_type in ["article", "consultation", "remedy"]';
const imageProjection =
  'image{...,"src":coalesce(image.asset->url,src),"width":coalesce(image.asset->metadata.dimensions.width,width),"height":coalesce(image.asset->metadata.dimensions.height,height)}';
const summaryProjection = `{"id":coalesce(id,_id),legacyId,"type":_type,title,"slug":slug.current,path,legacyPath,category,categoryTitle,excerpt,publishedAt,updatedAt,readingMinutes,${imageProjection},"tags":coalesce(tags,[]),planet,sign,house,sensitive,"searchText":title + " " + coalesce(excerpt,"") + " " + pt::text(body)}`;

function normalize<T extends ContentSummary>(entry: T): T {
  const categoryTitle =
    [...articleTopics, ...consultationTopics, ...remedyTopics].find(
      (topic) => topic.slug === entry.category,
    )?.title ||
    entry.categoryTitle ||
    "The journal";
  const path =
    entry.path ||
    (entry.type === "article"
      ? `/blog/${entry.slug}/`
      : entry.type === "consultation"
        ? `/consultations/${entry.slug}/`
        : `/remedies/${entry.category}/${entry.slug}/`);
  return {
    ...entry,
    path,
    categoryTitle,
    tags: entry.tags || [],
    readingMinutes:
      entry.readingMinutes ||
      Math.max(
        1,
        Math.ceil((entry.searchText || "").split(/\s+/).length / 210),
      ),
    searchText: entry.searchText || entry.title,
    updatedAt: entry.updatedAt || entry.publishedAt,
  };
}

async function fetchCms<T>(
  query: string,
  params: Record<string, string> = {},
): Promise<T> {
  if (!client || !live)
    throw new Error(
      "Sanity is not configured. Set the project ID and dataset before running the website.",
    );
  const draft = (await draftMode()).isEnabled;
  const { data } = await live.sanityFetch({ query, params, stega: draft });
  return data as T;
}

// Build-time route discovery must use published CMS records without request
// cookies or the draft-preview context.
export const getPublishedRoutes = cache(
  async (type: ContentSummary["type"]) => {
    if (!client)
      throw new Error(
        "Sanity project configuration is required to build the website.",
      );
    return client.fetch<
      { slug: string; path: string | null; category: string }[]
    >(
      '*[_type == $type && defined(slug.current)]{"slug":slug.current,path,category}',
      { type },
      { perspective: "published", stega: false, useCdn: false },
    );
  },
);

export const getContentIndex = cache(async (): Promise<ContentSummary[]> => {
  const total = await fetchCms<number>(`count(*[${typesQuery}])`);
  if (!total) return [];
  // Full-text discovery needs every body, but one response for the entire
  // archive exceeds Next.js's 2 MB data-cache limit. Cache bounded batches.
  const batches = await Promise.all(
    Array.from({ length: Math.ceil(total / 100) }, (_, batch) =>
      fetchCms<ContentSummary[]>(
        `*[${typesQuery}] | order(publishedAt desc, _id asc)[${batch * 100}...${(batch + 1) * 100}]${summaryProjection}`,
      ),
    ),
  );
  return batches.flat().map(normalize);
});

export const getEntry = cache(
  async (id: string): Promise<ContentEntry | null> => {
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null;
    const remote = await fetchCms<ContentEntry | null>(
      `*[${typesQuery} && (id == $id || _id == $id)][0]{...,"id":coalesce(id,_id),"type":_type,"slug":slug.current,${imageProjection},body[]{...,"url":coalesce(image.asset->url,url),"width":coalesce(image.asset->metadata.dimensions.width,width),"height":coalesce(image.asset->metadata.dimensions.height,height)}}`,
      { id },
    );
    return remote ? normalize(remote) : null;
  },
);

export const getEntryByPath = cache(async (pathname: string) => {
  const item = (await getContentIndex()).find(
    (entry) => entry.path === pathname,
  );
  return item ? getEntry(item.id) : null;
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const remote = await fetchCms<Partial<SiteSettings>>(
    '*[_type == "siteSettings"][0]',
  );
  return {
    ...site,
    ...Object.fromEntries(
      Object.entries(remote || {}).filter(
        ([, value]) => value !== null && value !== undefined,
      ),
    ),
  };
});

export const getSingleton = cache(
  async <T>(type: string, fallback: T): Promise<T> => {
    const remote = await fetchCms<T>(
      `*[_type == $type][0]{...,${imageProjection},photo{...,"src":coalesce(image.asset->url,src),"width":coalesce(image.asset->metadata.dimensions.width,width),"height":coalesce(image.asset->metadata.dimensions.height,height)}}`,
      { type },
    );
    return remote
      ? ({
          ...fallback,
          ...Object.fromEntries(
            Object.entries(remote as object).filter(
              ([, value]) => value !== null && value !== undefined,
            ),
          ),
        } as T)
      : fallback;
  },
);

export const getCollection = cache(async <T>(type: string): Promise<T[]> => {
  return fetchCms<T[]>(
    `*[_type == $type] | order(order asc){...,"id":coalesce(id,_id),"slug":coalesce(slug.current,slug),${imageProjection}}`,
    { type },
  );
});

export const getArticleTopics = cache(async (): Promise<Topic[]> => {
  const remote = await fetchCms<Topic[]>(
    '*[_type == "topic"]{title,"slug":slug.current,description,icon}',
  );
  return articleTopics.map((topic) => {
    const edited = remote?.find((item) => item.slug === topic.slug);
    return edited
      ? {
          ...topic,
          ...Object.fromEntries(
            Object.entries(edited).filter(
              ([, value]) => value !== null && value !== undefined,
            ),
          ),
        }
      : topic;
  });
});

export function normalizeSearch(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(kundali|kundli)\b/g, "kundli")
    .replace(/\b(prashna|horary)\b/g, "prashna")
    .replace(/\b(saade|saadhe|sadi|sade)\s+(sati|sathi|saati)\b/g, "sade sati")
    .replace(/\b(dosh|dosha)\b/g, "dosha")
    .replace(/\b(career|job|promotion|promotions)\b/g, "career")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchEntries(entries: ContentSummary[], query: string) {
  const tokens = normalizeSearch(query).split(" ").filter(Boolean).slice(0, 12);
  if (!tokens.length) return entries;
  return entries
    .map((item) => {
      const title = normalizeSearch(item.title);
      const alias = normalizeSearch(
        `${item.categoryTitle} ${item.tags.join(" ")}`,
      );
      const body = normalizeSearch(item.searchText);
      let score = 0;
      for (const token of tokens) {
        if (title.includes(token)) score += 12;
        else if (alias.includes(token)) score += 5;
        else if (body.includes(token)) score += 1;
        else return { item, score: 0 };
      }
      return { item, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item);
}

export function paginate<T>(
  items: T[],
  rawPage: string | undefined,
  size = 12,
) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const requested = Math.max(1, Number.parseInt(rawPage || "1", 10) || 1);
  const current = Math.min(pages, requested);
  return {
    items: items.slice((current - 1) * size, current * size),
    pages,
    current,
    outOfRange: requested > pages,
  };
}
