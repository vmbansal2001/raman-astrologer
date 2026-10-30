import Image from "next/image";
import Link from "next/link";
import { getCollection, getSingleton } from "@/lib/content";
import { practitioner, type Credential } from "@/lib/profile";
import { metadataFor, BreadcrumbJsonLd } from "@/lib/seo";
import { PageIntro, Eyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
import { CredentialCard } from "@/components/credential-card";
import { Video } from "@/components/video";
export const metadata = metadataFor(
  "About Acharya Raman Kamra",
  "Meet Acharya Raman Kamra, a Vedic astrologer in Gurugram with over 20 years of practice. Explore his background, qualifications, and documented recognition.",
  "/about/",
);
export default async function About() {
  const [profile, gallery] = await Promise.all([
    getSingleton("practitioner", practitioner),
    getCollection<Credential>("credential"),
  ]);
  return (
    <>
      <BreadcrumbJsonLd items={[{ title: "About", path: "/about/" }]} />
      <PageIntro
        eyebrow="THE PERSON BEHIND THE PRACTICE"
        title={
          <>
            Rooted in tradition.
            <br />
            <em>Present for your questions.</em>
          </>
        }
        description="Meet Acharya Raman Kamra. A journey of learning, a commitment to practice, and over two decades of Vedic astrology."
        breadcrumbs={[{ title: "About" }]}
      />
      <section className="section">
        <div className="container about-main">
          <div className="about-main-portrait">
            <Image
              src={profile.photo.src}
              alt={profile.name}
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="(max-width: 760px) 90vw, 40vw"
              priority
            />
          </div>
          <div className="about-main-copy">
            <Eyebrow>{profile.name}</Eyebrow>
            <h2>{profile.heading}</h2>
            {profile.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link className="text-link" href="/contact/">
              Begin a conversation
              <Icon name="arrow-up" size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section credentials-section" id="credentials">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>QUALIFICATIONS & RECOGNITION</Eyebrow>
              <h2>
                A journey <em>documented.</em>
              </h2>
              <p>
                Original certificates and photographs from the practice’s story.
              </p>
            </div>
          </div>
          <div className="credentials-grid">
            {gallery.map((credential) => (
              <CredentialCard credential={credential} key={credential.id} />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 850 }}>
          <Eyebrow>FROM THE PRACTICE</Eyebrow>
          <h2 style={{ marginBottom: 25 }}>
            A personal <em>introduction.</em>
          </h2>
          <Video
            url="https://video.wordpress.com/embed/GorbkLtS"
            title="An introduction to Acharya Raman"
          />
        </div>
      </section>
    </>
  );
}
