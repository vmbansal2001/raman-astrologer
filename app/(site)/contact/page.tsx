import { getContentIndex, getSettings } from "@/lib/content";
import { enquiryTypes } from "@/lib/enquiry";
import { whatsappLink } from "@/lib/site";
import { metadataFor, BreadcrumbJsonLd } from "@/lib/seo";
import { PageIntro, Eyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
import { EnquiryForm } from "@/components/enquiry-form";
import { TrackedLink } from "@/components/tracked-link";
type Query = { type?: string; offering?: string };
export const metadata = metadataFor(
  "Contact Acharya Raman Kamra",
  "Request a Vedic astrology consultation, enquire about remedies or courses, or contact Acharya Raman Kamra's Gurugram practice on WhatsApp, phone, or email.",
  "/contact/",
);
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const [entries, settings, query] = await Promise.all([
    getContentIndex(),
    getSettings(),
    searchParams,
  ]);
  const options = [
    ...entries
      .filter((entry) => entry.type !== "article")
      .map(({ id, title, type }) => ({ id, title, type })),
    {
      id: "course-basic",
      title: "Basic Certificate Course in Vedic Astrology",
      type: "course",
    },
    {
      id: "course-advanced",
      title: "Diploma / master-level study enquiry",
      type: "course",
    },
  ];
  const type = enquiryTypes.includes(
    query.type as (typeof enquiryTypes)[number],
  )
    ? (query.type as (typeof enquiryTypes)[number])
    : "consultation";
  const offering =
    options.find(
      (option) => option.id === query.offering && option.type === type,
    )?.id || "";
  const whatsapp = whatsappLink(undefined, undefined, settings.whatsapp);
  const available =
    !!process.env.FORMSPREE_FORM_ID && process.env.ENQUIRIES_ENABLED === "true";
  return (
    <>
      <BreadcrumbJsonLd items={[{ title: "Contact", path: "/contact/" }]} />
      <PageIntro
        eyebrow="A CONVERSATION AWAY"
        title={
          <>
            Let’s begin
            <br />
            <em>with your question.</em>
          </>
        }
        description="A little context is all you need to get started. Enquire about a consultation, a traditional remedy, or learning Vedic astrology."
        breadcrumbs={[{ title: "Contact" }]}
      />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-details">
            <Eyebrow>GET IN TOUCH</Eyebrow>
            <h2>
              We’re here
              <br />
              <em>to listen.</em>
            </h2>
            <TrackedLink
              className="contact-method"
              event="whatsapp_click"
              href={whatsapp}
            >
              <span>
                <Icon name="message" size={19} />
              </span>
              <span>
                <small>Start a WhatsApp conversation</small>
                <strong>{settings.phone}</strong>
                <p>Share the topic you would like to discuss.</p>
              </span>
            </TrackedLink>
            <div className="contact-method">
              <span>
                <Icon name="phone" size={18} />
              </span>
              <span>
                <small>Call the practice</small>
                <TrackedLink
                  event="phone_click"
                  href={`tel:${settings.phone.replaceAll(" ", "")}`}
                >
                  <strong>{settings.phone}</strong>
                </TrackedLink>
                <p>
                  Alternate:{" "}
                  <TrackedLink
                    event="phone_click"
                    href={`tel:${settings.alternatePhone.replaceAll(" ", "")}`}
                  >
                    {settings.alternatePhone}
                  </TrackedLink>
                </p>
              </span>
            </div>
            <TrackedLink
              className="contact-method"
              event="email_click"
              href={`mailto:${settings.email}`}
            >
              <span>
                <Icon name="mail" size={18} />
              </span>
              <span>
                <small>Send an email</small>
                <strong>{settings.email}</strong>
              </span>
            </TrackedLink>
            <div className="contact-method">
              <span>
                <Icon name="pin" size={19} />
              </span>
              <span>
                <small>The practice</small>
                <strong>{settings.city}</strong>
                <p>Contact us to confirm visiting arrangements.</p>
              </span>
            </div>
            <div className="contact-details-note">
              <strong>A personal arrangement</strong>
              <br />
              Current fees, suitability, and appointment arrangements are
              discussed with you before you decide to proceed. You can make an
              initial enquiry without your birth details.
            </div>
          </div>
          <section className="enquiry-card" id="enquiry">
            <EnquiryForm
              options={options}
              initialType={type}
              initialOffering={offering}
              available={available}
              whatsapp={whatsapp}
            />
          </section>
        </div>
      </section>
    </>
  );
}
