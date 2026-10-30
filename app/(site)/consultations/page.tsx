import Link from "next/link";
import { getContentIndex, searchEntries } from "@/lib/content";
import { consultationTopics } from "@/lib/site";
import { metadataFor } from "@/lib/seo";
import { Icon } from "@/components/icons";
import { OfferingCard, PageIntro } from "@/components/ui";

type Query = { q?: string; category?: string };
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const q = await searchParams;
  return metadataFor(
    "Personal Vedic astrology consultations",
    "Explore 41 consultation topics, from career and relationships to birth-time rectification. Find your topic and request a personal conversation with Acharya Raman.",
    "/consultations/",
    { noindex: !!(q.q || q.category) },
  );
}

export default async function Consultations({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const all = (await getContentIndex()).filter(
    (item) => item.type === "consultation",
  );
  const category = consultationTopics.some(
    (topic) => topic.slug === query.category,
  )
    ? query.category
    : "";
  const selected = category
    ? all.filter((item) => item.category === category)
    : all;
  const items = searchEntries(selected, query.q || "");
  const link = (slug?: string) => {
    const p = new URLSearchParams();
    if (slug) p.set("category", slug);
    if (query.q) p.set("q", query.q);
    return `/consultations/${p.size ? `?${p}` : ""}`;
  };
  return (
    <>
      <PageIntro
        eyebrow="PERSONAL GUIDANCE"
        title={
          <>
            For the questions
            <br />
            <em>that matter to you.</em>
          </>
        }
        description="Life rarely fits into neat categories. Find a starting point below, or tell us what’s on your mind. Every consultation begins with your questions."
        breadcrumbs={[{ title: "Consultations" }]}
      />
      <section className="directory-section">
        <div className="container">
          <div className="directory-toolbar">
            <form
              className="search-form"
              role="search"
              action="/consultations/"
            >
              <Icon name="search" size={18} />
              <label className="sr-only" htmlFor="consultation-search">
                Search consultations
              </label>
              <input
                id="consultation-search"
                name="q"
                defaultValue={query.q}
                placeholder="What would you like guidance on?"
                type="search"
                maxLength={100}
              />
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
              <button>Search</button>
            </form>
            <span className="result-count">
              {items.length} consultation{" "}
              {items.length === 1 ? "topic" : "topics"}
            </span>
          </div>
          <nav className="filter-tabs" aria-label="Consultation categories">
            <Link href={link()} aria-current={!category ? "page" : undefined}>
              All consultations
            </Link>
            {consultationTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={link(topic.slug)}
                aria-current={category === topic.slug ? "page" : undefined}
              >
                {topic.title}
              </Link>
            ))}
          </nav>
          {items.length ? (
            <div className="offering-grid">
              {items.map((item, i) => (
                <OfferingCard key={item.id} item={item} number={i + 1} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="compass" size={37} />
              <h2>Let’s find another starting point.</h2>
              <p>
                Try a broader search, browse all topics, or tell us your
                question directly.
              </p>
              <Link className="button button-outline" href="/consultations/">
                See all consultations
                <Icon name="arrow" size={17} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
