import { notFound } from "next/navigation";
import { getEntryByPath, getPublishedRoutes } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { DetailPage } from "@/components/detail-page";
type Props = {
  params: Promise<{ legacy: string[] }>;
};
export async function generateStaticParams() {
  return (await getPublishedRoutes("article"))
    .filter((entry) => /^\/\d{4}\/\d{2}\/\d{2}\//.test(entry.path || ""))
    .map((entry) => ({
      legacy: (entry.path || "").split("/").filter(Boolean),
    }));
}
export async function generateMetadata({ params }: Props) {
  const { legacy } = await params;
  const entry = await getEntryByPath(`/${legacy.join("/")}/`);
  return entry
    ? metadataFor(entry.title, entry.excerpt, entry.path, { article: entry })
    : {};
}
export default async function LegacyArticle({ params }: Props) {
  const { legacy } = await params;
  if (!/^\d{4}\/\d{2}\/\d{2}\//.test(legacy.join("/"))) notFound();
  const entry = await getEntryByPath(`/${legacy.join("/")}/`);
  if (!entry || entry.type !== "article") notFound();
  return <DetailPage entry={entry} />;
}
