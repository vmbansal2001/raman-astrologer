import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getContentIndex,
  getArticleTopics,
  paginate,
  searchEntries,
} from "@/lib/content";
import type { Topic } from "@/lib/types";
import { ArticleCard, Eyebrow, PageIntro, Pagination } from "./ui";
import { Icon } from "./icons";

export interface JournalQuery {
  q?: string;
  page?: string;
  planet?: string;
  sign?: string;
  house?: string;
}
export async function Journal({
  query,
  topic,
}: {
  query: JournalQuery;
  topic?: Topic;
}) {
  const articleTopics = await getArticleTopics();
  const entries = (await getContentIndex()).filter(
    (entry) => entry.type === "article",
  );
  let filtered = topic
    ? entries.filter((entry) => entry.category === topic.slug)
    : entries;
  const planets = [
    "sun",
    "moon",
    "mars",
    "mercury",
    "jupiter",
    "venus",
    "saturn",
    "rahu",
    "ketu",
  ];
  const signs = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ];
  if (query.planet)
    filtered = filtered.filter(
      (entry) =>
        entry.planet === query.planet ||
        entry.title
          .toLowerCase()
          .split(/[^a-z]+/)
          .includes(query.planet!),
    );
  if (query.sign)
    filtered = filtered.filter((entry) => entry.sign === query.sign);
  if (query.house)
    filtered = filtered.filter((entry) => String(entry.house) === query.house);
  filtered = searchEntries(filtered, query.q || "");
  const result = paginate(filtered, query.page);
  if (result.outOfRange) notFound();
  const base = topic ? `/blog/topics/${topic.slug}/` : "/blog/";
  const paginationQuery = Object.fromEntries(
    Object.entries(query).filter(([key, value]) => key !== "page" && !!value),
  ) as Record<string, string>;
  return (
    <>
      <PageIntro
        eyebrow="THE KNOWLEDGE JOURNAL"
        title={
          topic ? (
            topic.title
          ) : (
            <>
              A little wisdom.
              <br />
              <em>A wider perspective.</em>
            </>
          )
        }
        description={
          topic
            ? topic.description
            : "Explore 566 articles on Vedic astrology. From your first introduction to the planets to a deeper study of charts, find an idea that sparks your curiosity."
        }
        breadcrumbs={
          topic
            ? [{ title: "Articles", href: "/blog/" }, { title: topic.title }]
            : [{ title: "Articles" }]
        }
      >
        <form
          className="search-form journal-search"
          action={base}
          role="search"
        >
          <Icon name="search" size={18} />
          <label className="sr-only" htmlFor="journal-search">
            Search articles
          </label>
          <input
            id="journal-search"
            type="search"
            name="q"
            placeholder="Search the journal…"
            defaultValue={query.q}
            maxLength={100}
          />
          <button>Search</button>
        </form>
      </PageIntro>
      <section className="directory-section">
        <div className="container">
          <nav className="filter-tabs" aria-label="Article topics">
            <Link href="/blog/" aria-current={!topic ? "page" : undefined}>
              All articles
            </Link>
            {articleTopics.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/topics/${item.slug}/`}
                aria-current={topic?.slug === item.slug ? "page" : undefined}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <form action={base} className="journal-filter">
            {query.q && <input type="hidden" name="q" value={query.q} />}
            <label>
              Planet
              <select name="planet" defaultValue={query.planet || ""}>
                <option value="">All planets</option>
                {planets.map((planet) => (
                  <option value={planet} key={planet}>
                    {planet[0].toUpperCase() + planet.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Zodiac sign
              <select name="sign" defaultValue={query.sign || ""}>
                <option value="">All signs</option>
                {signs.map((sign) => (
                  <option value={sign} key={sign}>
                    {sign[0].toUpperCase() + sign.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              House
              <select name="house" defaultValue={query.house || ""}>
                <option value="">All houses</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option value={i + 1} key={i}>
                    House {i + 1}
                  </option>
                ))}
              </select>
            </label>
            <button className="button button-outline">Apply filters</button>
            {Object.values(paginationQuery).some(Boolean) && (
              <Link className="text-link" href={base}>
                Clear filters
                <Icon name="close" size={13} />
              </Link>
            )}
            <span className="result-count">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
              {result.pages > 1
                ? ` · Page ${result.current} of ${result.pages}`
                : ""}
            </span>
          </form>
          {result.items.length ? (
            <div className="article-grid">
              {result.items.map((entry) => (
                <ArticleCard item={entry} key={entry.id} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="book" size={36} />
              <h2>A different question, perhaps?</h2>
              <p>
                No articles match these filters. Try a broader search or explore
                another topic.
              </p>
              <Link href={base} className="button button-outline">
                Reset search and filters
              </Link>
            </div>
          )}
          <Pagination
            current={result.current}
            pages={result.pages}
            base={base}
            query={paginationQuery}
          />
        </div>
      </section>
      {!topic && (
        <section className="section related-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <Eyebrow>FOLLOW YOUR CURIOSITY</Eyebrow>
                <h2>
                  Find a topic <em>to explore.</em>
                </h2>
              </div>
            </div>
            <div className="topics-grid">
              {articleTopics.map((item) => (
                <Link
                  href={`/blog/topics/${item.slug}/`}
                  className="topic-card"
                  key={item.slug}
                >
                  <Icon name={item.icon} size={24} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="topic-count">
                      {
                        entries.filter((entry) => entry.category === item.slug)
                          .length
                      }{" "}
                      articles →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
