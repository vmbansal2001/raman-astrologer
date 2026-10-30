import { metadataFor } from "@/lib/seo";
import { PageIntro } from "@/components/ui";
import { getSettings } from "@/lib/content";
export const metadata = metadataFor(
  "Privacy notice",
  "How Raman Astrologer handles information provided through enquiries and contact channels.",
  "/privacy/",
);
export default async function Privacy() {
  const settings = await getSettings();
  return (
    <>
      <PageIntro
        eyebrow="YOUR INFORMATION"
        title={
          <>
            A thoughtful approach
            <br />
            <em>to your privacy.</em>
          </>
        }
        description="How information is handled when you explore the website or contact the practice."
        breadcrumbs={[{ title: "Privacy" }]}
      />
      <section className="section">
        <div className="container legal-layout">
          <h2>Information you choose to share</h2>
          <p>
            An enquiry may include your name, preferred contact method, phone
            number or email, and your question. Birth date, birth time, and
            birthplace are optional at the initial enquiry stage. Course
            enquiries may also include educational qualifications.
          </p>
          <h2>Why this information is used</h2>
          <p>
            Your details are used to respond to your question and discuss
            suitability, current fees, and arrangements. Sending an enquiry does
            not subscribe you to a newsletter.
          </p>
          <h2>Enquiry and contact services</h2>
          <p>
            When enabled, the online form uses Formspree to receive and store
            submissions and send notifications to the practice. Details are
            handled by that service and by the practice’s email provider. The
            form clearly indicates when it is unavailable.
          </p>
          <p>
            Choosing WhatsApp, telephone, email, or an external social link
            takes you to the relevant service. That provider’s privacy practices
            apply to information you share there. WhatsApp links on this website
            contain only a general greeting or the public offering name and page
            address.
          </p>
          <h2>Content and optional measurement</h2>
          <p>
            Public website content is served by the website host and, when
            connected, Sanity. Optional website measurement records page visits
            and actions such as contact clicks and successful enquiries. Message
            contents and birth details are not sent to those analytics events.
          </p>
          <p>
            Videos load from their external provider when you choose to play
            them. Those providers may receive information about your connection
            when the player loads.
          </p>
          <h2>Access and your choices</h2>
          <p>
            You can enquire by your preferred contact method and provide birth
            details later. To ask about information you have shared, request a
            correction, or request deletion, contact{" "}
            <a href={`mailto:${settings.email}`}>{settings.email}</a>. Retention
            and any necessary service records can be discussed directly with the
            practice.
          </p>
        </div>
      </section>
    </>
  );
}
