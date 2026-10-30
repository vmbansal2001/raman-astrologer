import { notFound } from "next/navigation";
import { Journal, type JournalQuery } from "@/components/journal";
import { articleTopics as defaultTopics } from "@/lib/site";
import { getArticleTopics } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<JournalQuery>;
};
export function generateStaticParams() {
  return defaultTopics.map((topic) => ({ slug: topic.slug }));
}
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const topic = (await getArticleTopics()).find((topic) => topic.slug === slug);
  if (!topic) return {};
  const query = await searchParams;
  const page = Math.max(1, parseInt(query.page || "1") || 1);
  return metadataFor(
    `${topic.title}${page > 1 ? ` — Page ${page}` : ""}`,
    topic.description,
    `/blog/topics/${slug}/${page > 1 ? `?page=${page}` : ""}`,
    { noindex: !!(query.q || query.planet || query.sign || query.house) },
  );
}
export default async function TopicPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const topic = (await getArticleTopics()).find((topic) => topic.slug === slug);
  if (!topic) notFound();
  return <Journal topic={topic} query={await searchParams} />;
}
