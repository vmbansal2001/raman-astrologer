import { Journal, type JournalQuery } from "@/components/journal";
import { metadataFor } from "@/lib/seo";
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<JournalQuery>;
}) {
  const query = await searchParams;
  const page = Math.max(1, parseInt(query.page || "1") || 1);
  return metadataFor(
    `The Vedic astrology journal${page > 1 ? ` — Page ${page}` : ""}`,
    "Explore 566 Vedic astrology articles on planets, signs, houses, nakshatras, yogas, dashas, and more. Learn with Acharya Raman Kamra.",
    `/blog/${page > 1 ? `?page=${page}` : ""}`,
    { noindex: !!(query.q || query.planet || query.sign || query.house) },
  );
}
export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<JournalQuery>;
}) {
  return <Journal query={await searchParams} />;
}
