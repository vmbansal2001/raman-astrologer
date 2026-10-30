import { notFound } from "next/navigation";
import tagIndex from "@/content/tag-index.json";
import { getContentIndex, paginate } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import {
  ArticleCard,
  OfferingCard,
  PageIntro,
  Pagination,
} from "@/components/ui";

type Props = {
  params: Promise<{ slug: string; pagination?: string[] }>;
  searchParams: Promise<{ page?: string }>;
};
const tags = tagIndex as Record<
  string,
  { title: string; slug: string; ids: string[] }
>;
function findTag(slug: string) {
  try {
    slug = decodeURIComponent(slug);
  } catch {
    notFound();
  }
  return tags[slug] || tags[encodeURIComponent(slug)];
}
export async function generateMetadata({ params, searchParams }: Props) {
  const { slug, pagination } = await params;
  const tag = findTag(slug);
  if (!tag) return {};
  const page = pagination?.[1] || (await searchParams).page;
  const path = `/tag/${tag.slug}/`;
  return metadataFor(
    tag.title,
    `Explore content related to ${tag.title}.`,
    page && page !== "1" ? `${path}?page=${page}` : path,
    { noindex: true },
  );
}
export default async function TagArchive({ params, searchParams }: Props) {
  const { slug, pagination } = await params;
  const tag = findTag(slug);
  if (
    !tag ||
    (pagination && (pagination.length !== 2 || pagination[0] !== "page"))
  )
    notFound();
  const query = await searchParams;
  const entries = (await getContentIndex()).filter((entry) =>
    tag.ids.includes(entry.id),
  );
  const result = paginate(entries, pagination?.[1] || query.page);
  if (result.outOfRange) notFound();
  return (
    <>
      <PageIntro
        eyebrow="EXPLORE THE ARCHIVE"
        title={tag.title}
        description={`Articles and offerings related to ${tag.title}.`}
        breadcrumbs={[
          { title: "Articles", href: "/blog/" },
          { title: tag.title },
        ]}
      />
      <section className="directory-section">
        <div className="container">
          <div className="offering-grid">
            {result.items.map((entry) =>
              entry.type === "article" ? (
                <ArticleCard key={entry.id} item={entry} />
              ) : (
                <OfferingCard key={entry.id} item={entry} />
              ),
            )}
          </div>
          <Pagination
            current={result.current}
            pages={result.pages}
            base={`/tag/${tag.slug}/`}
          />
        </div>
      </section>
    </>
  );
}
