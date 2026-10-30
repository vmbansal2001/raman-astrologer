import Link from "next/link";
import { site, socialLinks, whatsappLink } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { Icon, SunMark } from "./icons";
import { TrackedLink } from "./tracked-link";

export function SiteFooter({ settings = site }: { settings?: SiteSettings }) {
  return (
    <>
      <section className="closing-cta">
        <div className="container closing-inner">
          <div>
            <span className="eyebrow light">YOUR NEXT CHAPTER</span>
            <h2>
              Let’s begin with
              <br />
              <em>a conversation.</em>
            </h2>
            <p>You don’t need all the answers to take the first step.</p>
          </div>
          <div className="closing-actions">
            <Link
              href="/contact/?type=consultation#enquiry"
              className="button button-cream"
            >
              Request a consultation
              <Icon name="arrow-up" />
            </Link>
            <TrackedLink
              event="whatsapp_click"
              href={whatsappLink(undefined, undefined, settings.whatsapp)}
              className="text-link light"
            >
              <Icon name="message" size={18} />
              Or talk to us on WhatsApp
              <Icon name="arrow-up" size={15} />
            </TrackedLink>
          </div>
          <SunMark className="closing-sun" />
        </div>
      </section>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link className="brand" href="/">
                <SunMark />
                <span>
                  <strong>RAMAN</strong>
                  <span className="brand-subtitle">VEDIC ASTROLOGER</span>
                </span>
              </Link>
              <p>
                Personal guidance for life’s important questions.
                <br />
                Rooted in the traditions of Vedic astrology.
              </p>
              <span className="footer-location">
                <Icon name="pin" size={15} />
                {settings.city}
              </span>
            </div>
            <div className="footer-column">
              <h3>Explore</h3>
              <Link href="/consultations/">Consultations</Link>
              <Link href="/remedies/">Astrological remedies</Link>
              <Link href="/learn-astrology/">Learn astrology</Link>
              <Link href="/blog/">The knowledge journal</Link>
            </div>
            <div className="footer-column">
              <h3>The practice</h3>
              <Link href="/about/">About Acharya Raman</Link>
              <Link href="/about/#credentials">
                Qualifications & recognition
              </Link>
              <Link href="/contact/">Get in touch</Link>
              <Link href="/privacy/">Privacy</Link>
            </div>
            <div className="footer-column footer-contact">
              <h3>A conversation away</h3>
              <a href={`tel:${settings.phone.replaceAll(" ", "")}`}>
                {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
              <div className="footer-socials">
                {socialLinks.slice(0, 4).map((link) => (
                  <a
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.title}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {settings.name}. All rights reserved.
            </span>
            <span>Tradition, with a thoughtful perspective.</span>
            <Link href="/terms/">Terms of service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
