import Link from "next/link";
import Image from "next/image";
import type { ContentSummary } from "@/lib/types";
import { articleTopics, consultationTopics, remedyTopics } from "@/lib/site";
import { Icon } from "./icons";

export function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span className={`eyebrow${light ? " light" : ""}`}>
      <span className="eyebrow-star">✧</span>
      {children}
    </span>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { title: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Link href="/">Home</Link>
      {items.map((item) => (
        <span key={item.title}>
          <Icon name="right" size={12} />
          {item.href ? (
            <Link href={item.href}>{item.title}</Link>
          ) : (
            <span aria-current="page">{item.title}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
  breadcrumbs,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  children?: React.ReactNode;
  breadcrumbs?: { title: string; href?: string }[];
}) {
  return (
    <section className="page-intro">
      <div className="container">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p className="intro-description">{description}</p>
        {children}
      </div>
    </section>
  );
}

export function OfferingCard({
  item,
  number,
}: {
  item: ContentSummary;
  number?: number;
}) {
  const topic = [...consultationTopics, ...remedyTopics].find(
    (topic) => topic.slug === item.category,
  );
  return (
    <Link
      className={`offering-card${item.type === "remedy" ? " remedy-card" : ""}`}
      href={item.path}
    >
      {item.type === "remedy" && item.image ? (
        <div className="remedy-image">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width}
            height={item.image.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="offering-card-top">
          <span className="offering-icon">
            <Icon name={topic?.icon || "stars"} size={28} />
          </span>
          <span className="card-number">
            {String(number ?? 1).padStart(2, "0")}
          </span>
        </div>
      )}
      <div className="offering-card-content">
        <span className="card-category">{item.categoryTitle}</span>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
        <span className="card-link">
          Explore {item.type === "remedy" ? "remedy" : "consultation"}
          <Icon name="arrow-up" size={18} />
        </span>
      </div>
    </Link>
  );
}

export function ArticleCard({
  item,
  featured = false,
}: {
  item: ContentSummary;
  featured?: boolean;
}) {
  const topic = articleTopics.find((topic) => topic.slug === item.category);
  return (
    <article
      className={`article-card${featured ? " article-card-featured" : ""}`}
    >
      <Link
        href={item.path}
        className={`article-visual article-visual-${item.category}`}
        aria-label={`Read ${item.title}`}
      >
        <div className="article-visual-orbit" />
        <Icon name={topic?.icon || "sun"} size={70} />
        <span>{item.categoryTitle}</span>
        <span className="article-image-arrow">
          <Icon name="arrow-up" size={20} />
        </span>
      </Link>
      <div className="article-meta">
        <span>{item.categoryTitle}</span>
        <span>{item.readingMinutes} min read</span>
      </div>
      <h3>
        <Link href={item.path}>{item.title}</Link>
      </h3>
      <p>{item.excerpt}</p>
      <Link className="text-link" href={item.path}>
        Read article
        <Icon name="arrow-up" size={16} />
      </Link>
    </article>
  );
}

export function Pagination({
  current,
  pages,
  base,
  query = {},
}: {
  current: number;
  pages: number;
  base: string;
  query?: Record<string, string>;
}) {
  if (pages <= 1) return null;
  const href = (page: number) => {
    const params = new URLSearchParams(query);
    if (page > 1) params.set("page", String(page));
    const value = params.toString();
    return `${base}${value ? `?${value}` : ""}`;
  };
  const visible = Array.from(
    new Set([
      1,
      ...Array.from({ length: 5 }, (_, i) => current + i - 2),
      pages,
    ]),
  )
    .filter((page) => page > 0 && page <= pages)
    .sort((a, b) => a - b);
  return (
    <nav className="pagination" aria-label="Pagination">
      {current > 1 && (
        <Link href={href(current - 1)} aria-label="Previous page">
          <Icon name="left" />
        </Link>
      )}
      {visible.map((page, index) => (
        <span key={page}>
          {index > 0 && page - visible[index - 1] > 1 && (
            <span className="pagination-ellipsis">…</span>
          )}
          <Link
            href={href(page)}
            aria-label={`Page ${page}`}
            aria-current={page === current ? "page" : undefined}
          >
            {page}
          </Link>
        </span>
      ))}
      {current < pages && (
        <Link href={href(current + 1)} aria-label="Next page">
          <Icon name="right" />
        </Link>
      )}
    </nav>
  );
}

export function Process({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`process-grid${compact ? " compact" : ""}`}>
      {[
        {
          title: "Share what’s on your mind",
          text: "Choose a topic or simply tell us what you’d like to understand.",
        },
        {
          title: "Let’s arrange a conversation",
          text: "We’ll discuss your question, the current fees, and the arrangements personally.",
        },
        {
          title: "Explore a fresh perspective",
          text: "Bring your questions to a thoughtful conversation about your chart.",
        },
      ].map((step, index) => (
        <div className="process-step" key={step.title}>
          <span className="process-number">0{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </div>
      ))}
    </div>
  );
}
