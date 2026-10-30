import { notFound } from "next/navigation";
import Link from "next/link";
import { getContentIndex, paginate, searchEntries } from "@/lib/content";
import { remedyTopics } from "@/lib/site";
import { metadataFor } from "@/lib/seo";
import { PageIntro, OfferingCard, Pagination } from "@/components/ui";
import { Icon } from "@/components/icons";
type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const { category } = await params;
  const topic = remedyTopics.find((topic) => topic.slug === category);
  if (!topic) return {};
  const query = await searchParams;
  const page = Math.max(1, parseInt(query.page || "1") || 1);
  return metadataFor(
    `${topic.title}${page > 1 ? ` — Page ${page}` : ""}`,
    topic.description,
    `/remedies/${topic.slug}/${page > 1 ? `?page=${page}` : ""}`,
    { noindex: !!query.q },
  );
}
export default async function RemedyCategory({ params, searchParams }: Props) {
  const { category } = await params;
  const query = await searchParams;
  const topic = remedyTopics.find((topic) => topic.slug === category);
  if (!topic) notFound();
  const all = (await getContentIndex()).filter(
    (entry) => entry.type === "remedy" && entry.category === category,
  );
  const filtered = searchEntries(all, query.q || "");
  const result = paginate(filtered, query.page);
  if (result.outOfRange) notFound();
  return (
    <>
      <PageIntro
        eyebrow="EXPLORE THE TRADITION"
        title={topic.title}
        description={topic.description}
        breadcrumbs={[
          { title: "Remedies", href: "/remedies/" },
          { title: topic.title },
        ]}
      />
      <section className="directory-section">
        <div className="container">
          <div className="directory-toolbar">
            <form
              className="search-form"
              action={`/remedies/${category}/`}
              role="search"
            >
              <Icon name="search" size={18} />
              <label className="sr-only" htmlFor="remedy-search">
                Search {topic.title}
              </label>
              <input
                name="q"
                id="remedy-search"
                type="search"
                defaultValue={query.q}
                placeholder={`Search ${topic.title.toLowerCase()}…`}
                maxLength={100}
              />
              <button>Search</button>
            </form>
            <span className="result-count">{filtered.length} offerings</span>
          </div>
          <nav className="filter-tabs" aria-label="Remedy categories">
            {remedyTopics.map((item) => (
              <Link
                key={item.slug}
                href={`/remedies/${item.slug}/`}
                aria-current={item.slug === category ? "page" : undefined}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          {result.items.length ? (
            <div className="offering-grid">
              {result.items.map((item) => (
                <OfferingCard item={item} key={item.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No matching remedies.</h2>
              <p>Try a different name or browse the complete collection.</p>
              <Link
                className="button button-outline"
                href={`/remedies/${category}/`}
              >
                Clear search
              </Link>
            </div>
          )}
          <Pagination
            current={result.current}
            pages={result.pages}
            base={`/remedies/${category}/`}
            query={query.q ? { q: query.q } : {}}
          />
        </div>
      </section>
    </>
  );
}
