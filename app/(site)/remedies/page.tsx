import Link from "next/link";
import { getContentIndex } from "@/lib/content";
import { remedyTopics } from "@/lib/site";
import { metadataFor } from "@/lib/seo";
import { PageIntro, OfferingCard, Eyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
export const metadata = metadataFor(
  "Traditional astrological remedies",
  "Explore pujas, gemstones, rudrakshas and yantras. Understand the traditions and enquire about suitability and current arrangements with Acharya Raman.",
  "/remedies/",
);
export default async function Remedies() {
  const entries = (await getContentIndex()).filter(
    (entry) => entry.type === "remedy",
  );
  return (
    <>
      <PageIntro
        eyebrow="TRADITIONS WITH MEANING"
        title={
          <>
            A thoughtful approach
            <br />
            <em>to traditional remedies.</em>
          </>
        }
        description="Explore the significance of pujas, gemstones, rudrakshas, and yantras. Begin with understanding, then discuss what may be appropriate for your circumstances."
        breadcrumbs={[{ title: "Remedies" }]}
      />
      <section className="section">
        <div className="container">
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
                    <small>
                      {
                        entries.filter((entry) => entry.category === topic.slug)
                          .length
                      }{" "}
                      OFFERINGS TO EXPLORE
                    </small>
                    <strong>{topic.title}</strong>
                  </span>
                  <Icon name="arrow-up" />
                </span>
              </Link>
            ))}
          </div>
          <div
            className="editorial-note"
            style={{ marginTop: 30, marginBottom: 0 }}
          >
            Remedies are part of traditional spiritual practice. Suitability,
            current fees, inclusions, and any fulfilment arrangements are
            discussed personally before you proceed.
          </div>
        </div>
      </section>
      {remedyTopics.map((topic) => (
        <section className="section related-section" key={topic.slug}>
          <div className="container">
            <div className="section-heading">
              <div>
                <Eyebrow>{topic.title}</Eyebrow>
                <h2>
                  Explore <em>{topic.title.toLowerCase()}.</em>
                </h2>
                <p>{topic.description}</p>
              </div>
              <Link className="text-link" href={`/remedies/${topic.slug}/`}>
                View the complete collection
                <Icon name="arrow-up" size={17} />
              </Link>
            </div>
            <div className="offering-grid">
              {entries
                .filter((entry) => entry.category === topic.slug)
                .slice(0, 3)
                .map((item) => (
                  <OfferingCard item={item} key={item.id} />
                ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
