import { notFound, permanentRedirect } from "next/navigation";
import { getContentIndex, getEntry } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { DetailPage } from "@/components/detail-page";
type Props = { params: Promise<{ slug: string }> };
async function lookup(params: Props["params"]) {
  const { slug } = await params;
  const summary = (await getContentIndex()).find(
    (entry) => entry.type === "article" && entry.slug === slug,
  );
  return summary ? getEntry(summary.id) : null;
}
export async function generateMetadata({ params }: Props) {
  const entry = await lookup(params);
  return entry
    ? metadataFor(entry.title, entry.excerpt, entry.path, { article: entry })
    : {};
}
export default async function NewArticle({ params }: Props) {
  const entry = await lookup(params);
  if (!entry) notFound();
  const { slug } = await params;
  if (entry.path !== `/blog/${slug}/`) permanentRedirect(entry.path);
  return <DetailPage entry={entry} />;
}
