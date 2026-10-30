import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentIndex, paginate, searchEntries } from "@/lib/content";
import { metadataFor } from "@/lib/seo";
import { PageIntro, Pagination } from "@/components/ui";
import { Icon } from "@/components/icons";
export const metadata = metadataFor(
  "Search the practice and journal",
  "Find consultations, traditional remedies, courses, and Vedic astrology articles.",
  "/search/",
  { noindex: true },
);
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const query = await searchParams;
  const q = (query.q || "").slice(0, 100);
  const matches = q.trim() ? searchEntries(await getContentIndex(), q) : [];
  const result = paginate(matches, query.page, 20);
  if (result.outOfRange) notFound();
  return (
    <>
      <PageIntro
        eyebrow="FOLLOW YOUR QUESTION"
        title={
          <>
            Find a little <em>perspective.</em>
          </>
        }
        description="Search the full practice: consultation topics, remedies, and the knowledge journal."
        breadcrumbs={[{ title: "Search" }]}
      >
        <form
          className="search-form journal-search"
          action="/search/"
          role="search"
        >
          <Icon name="search" size={18} />
          <label className="sr-only" htmlFor="site-search">
            Search the website
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            defaultValue={q}
            maxLength={100}
            placeholder="Try career, Kundli, or Sade Sati…"
          />
          <button>Search</button>
        </form>
      </PageIntro>
      <section className="directory-section">
        <div className="container">
          {q && (
            <p className="result-count" style={{ marginBottom: 23 }}>
              {matches.length} results for “{q}”
            </p>
          )}
          {result.items.length ? (
            <div className="search-result-list">
              {result.items.map((entry) => (
                <Link
                  href={entry.path}
                  className="search-result"
                  key={entry.id}
                >
                  <span className="result-kind">
                    {entry.type === "article"
                      ? "Journal"
                      : entry.type === "remedy"
                        ? "Remedy"
                        : "Consultation"}
                  </span>
                  <div>
                    <h2>{entry.title}</h2>
                    <p>{entry.excerpt}</p>
                  </div>
                  <Icon name="arrow-up" size={20} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="compass" size={40} />
              <h2>
                {q
                  ? "Try another starting point."
                  : "What would you like to explore?"}
              </h2>
              <p>
                {q
                  ? "Try fewer words, a broader topic, or explore our consultation directory."
                  : "Search for a question, a planet, or a topic that interests you."}
              </p>
              <Link className="button button-outline" href="/consultations/">
                Browse consultations
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          )}
          <Pagination
            base="/search/"
            current={result.current}
            pages={result.pages}
            query={{ q }}
          />
        </div>
      </section>
    </>
  );
}
