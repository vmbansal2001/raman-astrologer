import { notFound } from "next/navigation";
import { getEntryByPath, getPublishedRoutes } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { DetailPage } from "@/components/detail-page";
export async function generateStaticParams() {
  return (await getPublishedRoutes("consultation")).map((entry) => ({
    slug: entry.slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const entry = await getEntryByPath(`/consultations/${(await params).slug}/`);
  return entry ? metadataFor(entry.title, entry.excerpt, entry.path) : {};
}
export default async function Consultation({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const entry = await getEntryByPath(`/consultations/${(await params).slug}/`);
  if (!entry || entry.type !== "consultation") notFound();
  return <DetailPage entry={entry} />;
}
