import Image from "next/image";
import Link from "next/link";
import {
  assets,
  getCollection,
  getContentIndex,
  getSettings,
  getSingleton,
} from "@/lib/content";
import { faqs } from "@/lib/course";
import { practitioner, type Credential } from "@/lib/profile";
import {
  origin,
  remedyTopics,
  socialLinks,
  whatsappLink,
  absoluteUrl,
} from "@/lib/site";
import { metadataFor, JsonLd } from "@/lib/seo";
import { ArticleCard, Eyebrow, OfferingCard, Process } from "@/components/ui";
import { Icon, SunMark, ZodiacWheel } from "@/components/icons";
import { TrackedLink } from "@/components/tracked-link";

export async function generateMetadata() {
  const settings = await getSettings();
  return metadataFor(
    settings.seoTitle || "Acharya Raman Kamra — Vedic astrology guidance",
    settings.seoDescription ||
      "Personal Vedic astrology consultations, traditional remedies, and learning with Acharya Raman Kamra in Gurugram. Explore your questions with a thoughtful perspective.",
    "/",
  );
}

export default async function HomePage() {
  const [entries, settings, profile, credentials] = await Promise.all([
    getContentIndex(),
    getSettings(),
    getSingleton("practitioner", practitioner),
    getCollection<Credential>("credential"),
  ]);
  const medalImage =
    credentials.find((credential) => credential.id === "medal")?.image ||
    assets.medal;
  const featured = [11, 664, 739, 9, 631, 893]
    .map((id) => entries.find((entry) => entry.legacyId === id)!)
    .filter(Boolean);
  const articles = ["planets", "nakshatras", "yogas"]
    .map((category) =>
      entries.find(
        (entry) => entry.type === "article" && entry.category === category,
      )!,
    )
    .filter(Boolean);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": `${origin}/#practitioner`,
              name: settings.name,
              jobTitle: "Vedic Astrologer",
              url: origin,
              image: absoluteUrl(profile.photo.src),
              sameAs: socialLinks.map((link) => link.href),
            },
            {
              "@type": "ProfessionalService",
              "@id": `${origin}/#practice`,
              name: "Raman Astrologer",
              url: origin,
              telephone: settings.phone,
              email: settings.email,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Gurugram",
                addressRegion: "Haryana",
                addressCountry: "IN",
              },
            },
            { "@type": "WebSite", name: "Raman Astrologer", url: origin },
          ],
        }}
      />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <Eyebrow>VEDIC WISDOM. PERSONAL GUIDANCE.</Eyebrow>
            <h1>
              {settings.heroTitle.split("\n").map((line, i) =>
                i === 0 ? (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ) : (
                  <em key={line}>{line}</em>
                ),
              )}
            </h1>
            <p>{settings.heroDescription}</p>
            <div className="hero-actions">
              <Link
                className="button"
                href="/contact/?type=consultation#enquiry"
              >
                Request a consultation
                <Icon name="arrow-up" size={18} />
              </Link>
              <TrackedLink
                className="hero-whatsapp"
                event="whatsapp_click"
                href={whatsappLink(undefined, undefined, settings.whatsapp)}
              >
                <Icon name="message" size={19} />
                <span>
                  Let’s talk<small>on WhatsApp</small>
                </span>
              </TrackedLink>
            </div>
            <div className="hero-signature">
              <span className="signature-line" />
              <span>
                ACHARYA RAMAN KAMRA
                <small>Jyotish Acharya · Gurugram, India</small>
              </span>
            </div>
          </div>
          <div className="hero-art">
            <ZodiacWheel className="hero-wheel" />
            <div className="hero-portrait-frame">
              <Image
                className="hero-portrait"
                src={profile.photo.src}
                alt="Acharya Raman Kamra, Vedic astrologer"
                width={profile.photo.width}
                height={profile.photo.height}
                sizes="(max-width: 700px) 90vw, 42vw"
                priority
              />
            </div>
            <div className="hero-seal">
              <span>
                ROOTED IN
                <br />
                <strong>20+</strong>
                <br />
                YEARS OF PRACTICE
              </span>
            </div>
            <div className="hero-caption">
              <span className="caption-dot" />
              <span>
                A personal approach.
                <br />
                <strong>A thoughtful perspective.</strong>
              </span>
            </div>
            <span className="hero-vertical">
              TRADITION · UNDERSTANDING · PERSPECTIVE
            </span>
          </div>
        </div>
        <div className="container hero-bottom">
          <span>For the questions that matter.</span>
          <a href="#consultations">
            EXPLORE THE PRACTICE
            <Icon name="arrow-down" size={15} />
          </a>
        </div>
      </section>
      <section className="trust-strip" aria-label="About the practice">
        <div className="container trust-grid">
          <div>
            <Icon name="sun" size={24} />
            <span>
              20+ years<small>of Vedic astrology practice</small>
            </span>
          </div>
          <div>
            <Icon name="graduation" size={26} />
            <span>
              Jyotish Acharya<small>Bharatiya Vidya Bhavan qualification</small>
            </span>
          </div>
          <div>
            <Icon name="heart" size={26} />
            <span>
              Personally considered<small>Guidance around your questions</small>
            </span>
          </div>
          <div>
            <Icon name="book" size={25} />
            <span>
              A wealth of knowledge
              <small>566 articles to explore and learn</small>
            </span>
          </div>
        </div>
      </section>
      <section className="section" id="consultations">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>FIND YOUR DIRECTION</Eyebrow>
              <h2>
                What brings <em>you here?</em>
              </h2>
              <p>Every question has a story. Start with what’s on your mind.</p>
            </div>
            <Link className="text-link" href="/consultations/">
              Explore all consultations
              <Icon name="arrow-up" size={18} />
            </Link>
          </div>
          <div className="offering-grid">
            {featured.map((item, i) => (
              <OfferingCard key={item.id} item={item} number={i + 1} />
            ))}
          </div>
          <div className="section-footnote">
            <Icon name="compass" size={18} />
            <p>
              Not sure where to begin?{" "}
              <Link href="/contact/">Tell us what’s on your mind.</Link>
            </p>
          </div>
        </div>
      </section>
      <section className="section about-preview">
        <div className="container about-preview-grid">
          <div className="about-image-composition">
            <div className="about-photo">
              <Image
                src={medalImage.src}
                alt={
                  medalImage.alt ||
                  "Acharya Raman Kamra receiving a medal from Shri K. N. Rao, as captioned in the original photograph"
                }
                width={medalImage.width}
                height={medalImage.height}
                sizes="(max-width: 700px) 90vw, 40vw"
              />
            </div>
            <span className="photo-label">
              A JOURNEY ROOTED IN VEDIC TRADITION
            </span>
          </div>
          <div className="about-preview-copy">
            <Eyebrow>MEET YOUR ASTROLOGER</Eyebrow>
            <h2>
              Experience, with
              <br />
              <em>understanding.</em>
            </h2>
            <p className="large-copy">
              Traditional wisdom, shared with care and a personal understanding
              of your questions.
            </p>
            <p>
              Acharya Raman Kamra is a Vedic astrologer based in Gurugram, with
              over 20 years of practice and qualifications from the Institute of
              Astrology at Bharatiya Vidya Bhavan, New Delhi.
            </p>
            <p>
              His approach brings traditional chart interpretation together with
              a personal understanding of the questions you bring.
            </p>
            <Link className="text-link" href="/about/">
              Get to know Acharya Raman
              <Icon name="arrow-up" size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section process-section">
        <div className="container">
          <div className="section-heading centered">
            <Eyebrow>A SIMPLE FIRST STEP</Eyebrow>
            <h2>
              Clarity begins <em>with a conversation.</em>
            </h2>
          </div>
          <Process />
        </div>
      </section>
      <section className="section remedies-preview">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>TRADITIONS WITH MEANING</Eyebrow>
              <h2>
                Explore <em>astrological remedies.</em>
              </h2>
              <p>
                Understand the traditions. Discuss what is appropriate for you.
              </p>
            </div>
            <Link className="text-link" href="/remedies/">
              Discover all remedies
              <Icon name="arrow-up" size={18} />
            </Link>
          </div>
          <div className="remedy-category-grid">
            {remedyTopics.map((topic, i) => (
              <Link
                className={`remedy-category remedy-category-${i}`}
                href={`/remedies/${topic.slug}/`}
                key={topic.slug}
              >
                <span className="remedy-category-symbol">
                  <Icon name={topic.icon} size={46} />
                </span>
                <span className="remedy-category-bottom">
                  <span>
                    <small>EXPLORE THE TRADITION</small>
                    <strong>{topic.title}</strong>
                  </span>
                  <Icon name="arrow-up" size={24} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section learning-section">
        <div className="container learning-grid">
          <div className="learning-art">
            <div className="learning-art-circle">
              <ZodiacWheel />
              <SunMark />
            </div>
            <div className="learning-art-label">
              <Icon name="book" size={17} />
              <span>THE ART OF UNDERSTANDING</span>
            </div>
          </div>
          <div className="learning-copy">
            <Eyebrow>A DEEPER UNDERSTANDING</Eyebrow>
            <h2>
              Let curiosity
              <br />
              <em>be your guide.</em>
            </h2>
            <p>
              Begin your journey into Vedic astrology with Acharya Raman.
              Explore the foundations, learn to read a chart, and understand the
              ideas behind the practice.
            </p>
            <div className="learning-facts">
              <span>
                <Icon name="clock" size={17} />
                Two-month basic course
              </span>
              <span>
                <Icon name="graduation" size={18} />
                Certificate of completion
              </span>
            </div>
            <Link className="button button-outline" href="/learn-astrology/">
              Explore the course
              <Icon name="arrow-up" size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>THE KNOWLEDGE JOURNAL</Eyebrow>
              <h2>
                A little wisdom.
                <br />
                <em>A wider perspective.</em>
              </h2>
              <p>
                Explore the planets, the patterns, and the ideas behind Vedic
                astrology.
              </p>
            </div>
            <Link className="text-link" href="/blog/">
              Visit the journal
              <Icon name="arrow-up" size={18} />
            </Link>
          </div>
          <div className="article-grid">
            {articles.map((item) => (
              <ArticleCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <Eyebrow>A FEW HELPFUL ANSWERS</Eyebrow>
            <h2>
              Before <em>we begin.</em>
            </h2>
            <p>
              A first conversation should feel simple.
              <br />
              Here’s what you might like to know.
            </p>
            <Link className="text-link" href="/contact/">
              Ask us a question
              <Icon name="arrow-up" size={17} />
            </Link>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <Icon name="down" size={18} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
