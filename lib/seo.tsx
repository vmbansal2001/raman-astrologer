import type { Metadata } from "next";
import { origin, site } from "./site";

export function metadataFor(
  title: string,
  description: string,
  path: string,
  options: {
    noindex?: boolean;
    article?: { publishedAt: string; updatedAt: string };
  } = {},
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: options.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | Raman Astrologer`,
      description,
      url: path,
      siteName: "Raman Astrologer",
      locale: "en_IN",
      type: options.article ? "article" : "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Acharya Raman Kamra — Vedic astrology guidance",
        },
      ],
      ...(options.article
        ? {
            publishedTime: options.article.publishedAt,
            modifiedTime: options.article.updatedAt,
            authors: [site.name],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export function BreadcrumbJsonLd({
  items,
}: {
  items: { title: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [{ title: "Home", path: "/" }, ...items].map(
          (item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.title,
            item: `${origin}${item.path}`,
          }),
        ),
      }}
    />
  );
}
