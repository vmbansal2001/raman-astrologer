import { metadataFor } from "@/lib/seo";
import { PageIntro } from "@/components/ui";
export const metadata = metadataFor(
  "Service information and terms",
  "Information about enquiries, personal consultation arrangements, educational content, courses, and traditional remedies.",
  "/terms/",
);
export default function Terms() {
  return (
    <>
      <PageIntro
        eyebrow="BEFORE WE BEGIN"
        title={
          <>
            A clear understanding
            <br />
            <em>of the practice.</em>
          </>
        }
        description="Helpful information about the website and enquiries to Acharya Raman Kamra's practice."
        breadcrumbs={[{ title: "Terms" }]}
      />
      <section className="section">
        <div className="container legal-layout">
          <h2>Enquiries and arrangements</h2>
          <p>
            The website lets you explore the practice and make enquiries.
            Sending a form, calling, or starting a WhatsApp conversation does
            not itself confirm an appointment, admission, purchase, or payment.
            Suitability, availability, current fees, inclusions, and
            arrangements are confirmed personally before you proceed.
          </p>
          <h2>Astrological interpretations</h2>
          <p>
            The website discusses Vedic astrology and traditional spiritual
            practices. Interpretations depend on context and are not guarantees
            of future events or outcomes. Your decisions remain your own.
          </p>
          <h2>Professional care and advice</h2>
          <p>
            Articles and consultations do not replace qualified medical,
            mental-health, legal, or financial advice. Continue appropriate
            professional care for concerns in those areas. Traditional remedies
            should not be treated as diagnoses or cures.
          </p>
          <h2>Courses and remedies</h2>
          <p>
            Course information describes the published basic curriculum. Current
            dates, format, eligibility, fees, and advanced-study options are
            confirmed on enquiry. The basic course’s completion certificate is
            issued through Acharya Raman’s course.
          </p>
          <p>
            Remedy descriptions explain traditional associations and practices.
            Availability, variants, ritual materials, inclusions, delivery, and
            related arrangements must be confirmed with the practice before
            proceeding.
          </p>
          <h2>Educational content</h2>
          <p>
            The journal includes original articles from the practice’s archive.
            Traditional interpretations and terminology are presented for study
            in their cultural context. An article’s publication date is retained
            separately from any subsequent editorial review.
          </p>
          <h2>External services</h2>
          <p>
            External video, social, email, and messaging services operate under
            their own terms. Contact the practice if a page or reference
            requires clarification.
          </p>
        </div>
      </section>
    </>
  );
}
