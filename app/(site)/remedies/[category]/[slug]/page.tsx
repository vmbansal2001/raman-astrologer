import { notFound } from "next/navigation";
import { getEntryByPath, getPublishedRoutes } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { DetailPage } from "@/components/detail-page";
type Props = { params: Promise<{ category: string; slug: string }> };
export async function generateStaticParams() {
  return (await getPublishedRoutes("remedy")).map((entry) => ({
    category: entry.category,
    slug: entry.slug,
  }));
}
async function entryFor(params: Props["params"]) {
  const { category, slug } = await params;
  return getEntryByPath(`/remedies/${category}/${slug}/`);
}
export async function generateMetadata({ params }: Props) {
  const entry = await entryFor(params);
  return entry ? metadataFor(entry.title, entry.excerpt, entry.path) : {};
}
export default async function Remedy({ params }: Props) {
  const entry = await entryFor(params);
  if (!entry || entry.type !== "remedy") notFound();
  return <DetailPage entry={entry} />;
}
