import Link from "next/link";
import Image from "next/image";
import { getContentIndex, getSettings, getSingleton } from "@/lib/content";
import { practitioner } from "@/lib/profile";
import type { ContentEntry } from "@/lib/types";
import { enquiryLink, origin, whatsappLink, absoluteUrl } from "@/lib/site";
import { BreadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { ContentBody, bodyHeadings } from "./content-body";
import { ArticleCard, OfferingCard, PageIntro } from "./ui";
import { Icon } from "./icons";
import { TrackedLink } from "./tracked-link";

export async function DetailPage({ entry }: { entry: ContentEntry }) {
  const [index, settings, profile] = await Promise.all([
    getContentIndex(),
    getSettings(),
    getSingleton("practitioner", practitioner),
  ]);
  const article = entry.type === "article";
  const remedy = entry.type === "remedy";
  const parent = article
    ? { title: "Articles", href: "/blog/" }
    : remedy
      ? { title: "Remedies", href: "/remedies/" }
      : { title: "Consultations", href: "/consultations/" };
  const related = index
    .filter(
      (item) =>
        item.type === (article ? "article" : entry.type) &&
        item.category === entry.category &&
        item.id !== entry.id,
    )
    .slice(0, 3);
  const keywords = entry.title
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length > 4);
  const readings = !article
    ? index
        .filter(
          (item) =>
            item.type === "article" &&
            ((entry.planet && item.planet === entry.planet) ||
              keywords.some((word) => item.title.toLowerCase().includes(word))),
        )
        .slice(0, 3)
    : [];
  const headings = bodyHeadings(entry.body || []);
  const variants = entry.variants?.length ? (
    <section className="questions-panel">
      <h2>Size options to discuss</h2>
      <p style={{ fontSize: 12, marginBottom: 15 }}>
        The catalogue describes these sizes. Current availability, suitability,
        and fees are confirmed on enquiry.
      </p>
      <ul>
        {entry.variants.map((variant) => (
          <li key={variant.label}>
            <Icon name="gem" size={15} />
            {variant.label}
          </li>
        ))}
      </ul>
    </section>
  ) : null;
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { title: parent.title, path: parent.href },
          { title: entry.title, path: entry.path },
        ]}
      />
      {article && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: entry.title,
            description: entry.excerpt,
            mainEntityOfPage: `${origin}${entry.path}`,
            datePublished: entry.publishedAt,
            dateModified: entry.updatedAt,
            author: {
              "@type": "Person",
              name: settings.name,
              url: `${origin}/about/`,
            },
            publisher: {
              "@type": "Organization",
              name: "Raman Astrologer",
              url: origin,
            },
            ...(entry.image ? { image: absoluteUrl(entry.image.src) } : {}),
          }}
        />
      )}
      <div className="detail-intro">
        <PageIntro
          eyebrow={entry.categoryTitle}
          title={entry.title}
          description={entry.excerpt}
          breadcrumbs={[parent, { title: entry.title }]}
        >
          {article ? (
            <div className="detail-meta">
              <span>
                <Icon name="book" size={14} />
                {settings.name}
              </span>
              <span>
                <Icon name="clock" size={14} />
                {entry.readingMinutes} min read
              </span>
              <time dateTime={entry.publishedAt}>
                {new Date(entry.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                })}
              </time>
            </div>
          ) : (
            <div className="intro-actions">
              <Link
                className="button"
                href={enquiryLink(remedy ? "remedy" : "consultation", entry)}
              >
                Enquire about {remedy ? "this remedy" : "a consultation"}
                <Icon name="arrow-up" size={18} />
              </Link>
              <TrackedLink
                event="whatsapp_click"
                offering={entry.id}
                href={whatsappLink(entry.title, entry.path, settings.whatsapp)}
                className="text-link"
              >
                <Icon name="message" size={17} />
                Talk on WhatsApp
              </TrackedLink>
            </div>
          )}
        </PageIntro>
      </div>
      <div className="container detail-layout">
        <article className="detail-main">
          {!article && entry.questions?.length > 0 && (
            <section className="questions-panel">
              <h2>Questions we can explore</h2>
              <ul>
                {entry.questions.map((question) => (
                  <li key={question}>
                    <Icon name="check" size={15} />
                    {question}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {variants}
          {entry.sensitive && (
            <aside className="editorial-note">
              The following material describes traditional astrological
              interpretations. It is not a diagnosis or a guarantee of an
              outcome. For health, legal, or financial concerns, seek advice
              from a qualified professional.
            </aside>
          )}
          <ContentBody body={entry.body || []} />
          {article && (
            <div className="article-author">
              <Image
                src={profile.photo.src}
                width={65}
                height={65}
                alt={settings.name}
              />
              <div>
                <h3>{settings.name}</h3>
                <p>
                  Vedic astrologer in Gurugram, with over 20 years of practice.
                </p>
                <Link href="/about/">About the author →</Link>
              </div>
            </div>
          )}
        </article>
        <aside className="detail-sidebar">
          {article && headings.length > 2 && (
            <nav className="toc" aria-label="On this page">
              <h2>In this article</h2>
              {headings.slice(0, 12).map((heading) => (
                <a key={heading.id} href={`#${heading.id}`}>
                  {heading.text}
                </a>
              ))}
            </nav>
          )}
          <div className="sidebar-card">
            <Icon
              name={article ? "compass" : remedy ? "sun" : "heart"}
              size={31}
            />
            <span className="eyebrow">A PERSONAL PERSPECTIVE</span>
            <h2>
              {article
                ? "Your chart. Your questions."
                : remedy
                  ? "Tradition, with personal guidance."
                  : "Let’s explore your questions."}
            </h2>
            <p>
              {article
                ? "Every chart has its own context. Bring your questions to a personal conversation with Acharya Raman."
                : "Share what you would like to understand. We’ll discuss suitability, current fees, and arrangements with you personally."}
            </p>
            <Link
              className="button"
              href={enquiryLink(
                remedy ? "remedy" : "consultation",
                article ? undefined : entry,
              )}
            >
              {article ? "Request a consultation" : "Make an enquiry"}
              <Icon name="arrow-up" size={16} />
            </Link>
            <TrackedLink
              className="text-link"
              event="whatsapp_click"
              offering={entry.id}
              href={whatsappLink(entry.title, entry.path, settings.whatsapp)}
            >
              <Icon name="message" size={16} />
              Talk on WhatsApp
            </TrackedLink>
            <div className="sidebar-fees">
              <Icon name="shield" size={14} />
              Enquire for fees · Arranged personally
            </div>
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="section related-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">CONTINUE EXPLORING</span>
                <h2>
                  {article ? (
                    <>
                      A little more <em>perspective.</em>
                    </>
                  ) : (
                    <>
                      Related <em>{remedy ? "remedies" : "consultations"}.</em>
                    </>
                  )}
                </h2>
              </div>
              <Link href={parent.href} className="text-link">
                Explore all {parent.title.toLowerCase()}
                <Icon name="arrow-up" size={17} />
              </Link>
            </div>
            <div className={article ? "article-grid" : "offering-grid"}>
              {related.map((item, i) =>
                article ? (
                  <ArticleCard item={item} key={item.id} />
                ) : (
                  <OfferingCard item={item} number={i + 1} key={item.id} />
                ),
              )}
            </div>
          </div>
        </section>
      )}
      {!article && readings.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">FROM THE JOURNAL</span>
                <h2>
                  Explore the <em>ideas behind the practice.</em>
                </h2>
              </div>
            </div>
            <div className="article-grid">
              {readings.map((item) => (
                <ArticleCard item={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
