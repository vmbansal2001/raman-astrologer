import type { PortableTextBlock } from "@portabletext/types";

export interface ContentImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ContentSummary {
  id: string;
  legacyId: number;
  type: "consultation" | "remedy" | "article";
  title: string;
  slug: string;
  path: string;
  legacyPath: string;
  category: string;
  categoryTitle: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  image?: ContentImage;
  tags: string[];
  planet?: string;
  sign?: string;
  house?: number;
  sensitive: boolean;
  searchText: string;
}

export interface ContentEntry extends ContentSummary {
  body: PortableTextBlock[];
  questions: string[];
  variants?: { label: string }[];
}

export interface Topic {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface SiteSettings {
  navigation?: { title: string; href: string }[];
  seoTitle?: string;
  seoDescription?: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone: string;
  whatsapp: string;
  city: string;
  heroTitle: string;
  heroDescription: string;
}
