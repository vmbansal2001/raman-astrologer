import Link from "next/link";
import { curriculum } from "@/lib/course";
import { getSingleton } from "@/lib/content";
import { enquiryLink, origin } from "@/lib/site";
import { metadataFor, JsonLd, BreadcrumbJsonLd } from "@/lib/seo";
import { PageIntro, Eyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
const basicCourse = {
  title: "Basic Certificate Course in Vedic Astrology",
  description:
    "A structured introduction to Vedic astrology, from the foundations to reading a chart, with Acharya Raman Kamra.",
  duration: "Two months",
  eligibility: "Class 10 or equivalent",
  certificate: "Certificate of completion",
  curriculum,
};
export const metadata = metadataFor(
  "Learn Vedic astrology with Acharya Raman",
  "Explore a two-month basic certificate course in Vedic astrology. Read the complete twelve-part curriculum and enquire about admissions with Acharya Raman Kamra.",
  "/learn-astrology/",
);
export default async function LearnAstrology() {
  const course = await getSingleton("course", basicCourse);
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ title: "Learn astrology", path: "/learn-astrology/" }]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: course.title,
          description: course.description,
          url: `${origin}/learn-astrology/`,
          provider: {
            "@type": "Person",
            name: "Acharya Raman Kamra",
            url: `${origin}/about/`,
          },
        }}
      />
      <PageIntro
        eyebrow="LET CURIOSITY LEAD"
        title={
          <>
            A new way
            <br />
            <em>to understand the stars.</em>
          </>
        }
        description="Begin your study of Vedic astrology with Acharya Raman. Build a foundation, explore the ideas, and learn to approach a horoscope with understanding."
        breadcrumbs={[{ title: "Learn astrology" }]}
      >
        <div className="intro-actions">
          <Link
            className="button"
            href={enquiryLink("course", {
              id: "course-basic",
              title: course.title,
            })}
          >
            Enquire about the course
            <Icon name="arrow-up" size={18} />
          </Link>
          <a className="text-link" href="#curriculum">
            Explore the curriculum
            <Icon name="arrow-down" size={16} />
          </a>
        </div>
      </PageIntro>
      <section className="section">
        <div className="container course-overview">
          <div>
            <Eyebrow>START WITH THE FOUNDATIONS</Eyebrow>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>
              The course introduces the language of astrology, the structure of
              a horoscope, and the relationships between planets, signs, and
              houses. Its twelve sections progress from introductory concepts to
              yogas and traditional timing ideas.
            </p>
            <p>
              Graduates of the basic course receive a certificate of completion
              from Acharya Raman’s course. Admission arrangements, the current
              fees, delivery format, and upcoming dates are confirmed personally
              on enquiry.
            </p>
          </div>
          <aside className="course-facts">
            <h3>Your first chapter</h3>
            <dl>
              <div>
                <dt>Course level</dt>
                <dd>Basic / introductory</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{course.duration}</dd>
              </div>
              <div>
                <dt>Eligibility</dt>
                <dd>{course.eligibility}</dd>
              </div>
              <div>
                <dt>Curriculum</dt>
                <dd>12 sections</dd>
              </div>
              <div>
                <dt>On completion</dt>
                <dd>{course.certificate}</dd>
              </div>
              <div>
                <dt>Current fees</dt>
                <dd>Enquire for fees</dd>
              </div>
            </dl>
            <Link
              className="button"
              href={enquiryLink("course", {
                id: "course-basic",
                title: course.title,
              })}
            >
              Start a course enquiry
              <Icon name="arrow-up" size={16} />
            </Link>
          </aside>
        </div>
      </section>
      <section className="section curriculum-section" id="curriculum">
        <div className="container">
          <div className="section-heading">
            <div>
              <Eyebrow>TWELVE STEPS INTO THE TRADITION</Eyebrow>
              <h2>
                What you’ll <em>explore.</em>
              </h2>
              <p>
                The complete basic-course syllabus, presented section by
                section.
              </p>
            </div>
          </div>
          <div className="curriculum-grid">
            {course.curriculum.map((module, i) => (
              <details className="curriculum-item" key={module.title}>
                <summary>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{module.title}</strong>
                  <Icon name="down" size={17} />
                </summary>
                <ul>
                  {module.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="advanced-study">
            <div>
              <Eyebrow>CONTINUE YOUR JOURNEY</Eyebrow>
              <h3>Interested in advanced study?</h3>
              <p>
                The original course material also introduces diploma and
                master-level study. Enquire about the available options,
                eligibility, curriculum, and arrangements.
              </p>
            </div>
            <Link
              className="button button-outline"
              href={enquiryLink("course", {
                id: "course-advanced",
                title: "Advanced astrology study",
              })}
            >
              Ask about advanced study
              <Icon name="arrow-up" size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
