import type { SiteSettings, Topic } from "./types";

export const site: SiteSettings = {
  name: "Acharya Raman Kamra",
  email: "ramanjiastrologer@gmail.com",
  phone: "+91 99113 51351",
  alternatePhone: "+91 81302 01201",
  whatsapp: "919911351351",
  city: "Gurugram, India",
  heroTitle: "Ancient wisdom.\nA clearer tomorrow.",
  heroDescription:
    "Thoughtful Vedic astrology guidance for your relationships, career, and life's important decisions. A personal conversation, rooted in over 20 years of practice.",
};

export const origin = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ramanastrologer.com"
).replace(/\/$/, "");
export function absoluteUrl(value: string) {
  return new URL(value, `${origin}/`).toString();
}
export const navigation = [
  { title: "Consultations", href: "/consultations/" },
  { title: "Remedies", href: "/remedies/" },
  { title: "Learn astrology", href: "/learn-astrology/" },
  { title: "Articles", href: "/blog/" },
  { title: "About", href: "/about/" },
  { title: "Contact", href: "/contact/" },
];

export const consultationTopics: Topic[] = [
  {
    slug: "relationships",
    title: "Relationships & marriage",
    description:
      "Marriage, compatibility, and the relationships that matter to you.",
    icon: "heart",
  },
  {
    slug: "career",
    title: "Career, business & travel",
    description:
      "Professional direction, new ventures, and possibilities abroad.",
    icon: "briefcase",
  },
  {
    slug: "wealth",
    title: "Money & assets",
    description:
      "Financial questions, property decisions, and material wellbeing.",
    icon: "coins",
  },
  {
    slug: "family",
    title: "Education & children",
    description: "Learning, natural inclinations, and your child's journey.",
    icon: "book",
  },
  {
    slug: "wellbeing",
    title: "Health & wellbeing",
    description:
      "Traditional perspectives on wellbeing, with appropriate professional care.",
    icon: "leaf",
  },
  {
    slug: "legal",
    title: "Legal matters",
    description:
      "An astrological perspective on challenging legal circumstances.",
    icon: "scale",
  },
  {
    slug: "specialist",
    title: "Specialist guidance",
    description:
      "Birth-time rectification, Prashna, auspicious timings, and more.",
    icon: "stars",
  },
];

export const remedyTopics: Topic[] = [
  {
    slug: "pujas-and-homam",
    title: "Pujas & Homam",
    description:
      "Explore traditional prayers, rituals, and offerings with personal guidance.",
    icon: "flame",
  },
  {
    slug: "gemstones",
    title: "Gemstones",
    description:
      "Understand planetary associations and enquire about a suitable gemstone.",
    icon: "gem",
  },
  {
    slug: "rudrakshas",
    title: "Rudrakshas",
    description:
      "Discover the traditional significance of one to fourteen Mukhi beads.",
    icon: "circle",
  },
  {
    slug: "yantras",
    title: "Yantras",
    description:
      "Sacred geometric forms and their place in traditional spiritual practice.",
    icon: "sun",
  },
];

export const articleTopics: Topic[] = [
  {
    slug: "planets",
    title: "The nine planets",
    description: "Meet the grahas and explore their roles in Vedic astrology.",
    icon: "sun",
  },
  {
    slug: "zodiac-signs",
    title: "Zodiac signs",
    description:
      "An introduction to the twelve rashis and their traditional characteristics.",
    icon: "stars",
  },
  {
    slug: "houses",
    title: "Houses & house lords",
    description:
      "Understand the twelve houses, their meanings, and the placement of their lords.",
    icon: "home",
  },
  {
    slug: "nakshatras",
    title: "Nakshatras",
    description:
      "Explore the lunar mansions, their symbolism, and traditional interpretations.",
    icon: "moon",
  },
  {
    slug: "planetary-placements",
    title: "Planetary placements",
    description: "Read about planets in different houses and zodiac signs.",
    icon: "orbit",
  },
  {
    slug: "debilitated-planets",
    title: "Debilitated planets",
    description:
      "Study the traditional interpretation of planetary debilitation across houses.",
    icon: "orbit",
  },
  {
    slug: "conjunctions",
    title: "Planetary conjunctions",
    description:
      "Explore interpretations of combinations involving two to six planets.",
    icon: "circle",
  },
  {
    slug: "yogas",
    title: "Yogas",
    description:
      "Learn about named planetary combinations and their place in chart interpretation.",
    icon: "stars",
  },
  {
    slug: "dashas",
    title: "Dashas & timing",
    description:
      "An introduction to planetary periods and their role in Vedic astrology.",
    icon: "clock",
  },
  {
    slug: "gemstone-knowledge",
    title: "Gemstone knowledge",
    description:
      "Educational guides to the symbolism and traditional use of gemstones.",
    icon: "gem",
  },
  {
    slug: "classical-astrology",
    title: "Classical astrology",
    description:
      "Divisional charts, Ashtakavarga, classical concepts, and specialist reading.",
    icon: "book",
  },
];

export function whatsappLink(
  title?: string,
  path?: string,
  number = site.whatsapp,
) {
  const message = title
    ? `Namaste, I would like to enquire about ${title}.${path ? ` ${origin}${path}` : ""}`
    : "Namaste, I would like to enquire about a consultation with Acharya Raman Kamra.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function enquiryLink(
  type = "consultation",
  offering?: { id: string; title: string },
) {
  const params = new URLSearchParams({ type });
  if (offering) params.set("offering", offering.id);
  return `/contact/?${params.toString()}#enquiry`;
}

export const socialLinks = [
  { title: "YouTube", href: "https://www.youtube.com/c/theindianastrologer" },
  { title: "Instagram", href: "https://www.instagram.com/astrologerraman.in/" },
  { title: "Facebook", href: "https://www.facebook.com/astrologerraman.in/" },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/vedic-astro-raman-62082136/",
  },
  { title: "X", href: "https://twitter.com/ramankamra1" },
  {
    title: "Pinterest",
    href: "https://www.pinterest.com/astrologerramankamra/",
  },
  { title: "Tumblr", href: "https://astrologerraman.tumblr.com/" },
];
