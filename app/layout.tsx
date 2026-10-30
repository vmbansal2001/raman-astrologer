import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { origin } from "@/lib/site";

const display = localFont({
  src: [
    {
      path: "../public/fonts/cormorant-roman.woff2",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../public/fonts/cormorant-italic.woff2",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
});
const sans = localFont({
  src: "../public/fonts/dm-sans.woff2",
  variable: "--font-body",
  display: "swap",
  weight: "400 700",
});

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "Acharya Raman Kamra | Vedic Astrologer in Gurugram",
    template: "%s | Raman Astrologer",
  },
  description:
    "Personal Vedic astrology guidance from Acharya Raman Kamra. Explore consultations, traditional remedies, astrology courses, and a comprehensive knowledge journal.",
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
