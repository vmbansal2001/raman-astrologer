import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";
import { schemaTypes } from "./sanity/schema";
const contentLocations = defineLocations({
  select: {
    title: "title",
    path: "path",
    slug: "slug.current",
    type: "_type",
    category: "category",
  },
  resolve: (doc) => ({
    locations: [
      {
        title: doc?.title || "Content",
        href:
          doc?.path ||
          (doc?.type === "remedy"
            ? `/remedies/${doc?.category}/${doc?.slug}/`
            : doc?.type === "consultation"
              ? `/consultations/${doc?.slug}/`
              : `/blog/${doc?.slug}/`),
      },
    ],
  }),
});
const singleton = (title: string, href: string) =>
  defineLocations({
    select: { title: "_type" },
    resolve: () => ({ locations: [{ title, href }] }),
  });
export default defineConfig({
  name: "raman-astrologer",
  title: "Raman · The practice",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "unconfigured",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("The practice")
          .items([
            S.listItem()
              .title("Website settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("site-settings"),
              ),
            S.listItem()
              .title("About Acharya Raman")
              .child(
                S.document()
                  .schemaType("practitioner")
                  .documentId("practitioner"),
              ),
            S.documentTypeListItem("credential").title(
              "Qualifications & recognition",
            ),
            S.listItem()
              .title("Astrology course")
              .child(
                S.document().schemaType("course").documentId("course-basic"),
              ),
            S.divider(),
            S.documentTypeListItem("consultation").title("Consultations"),
            S.documentTypeListItem("remedy").title("Traditional remedies"),
            S.documentTypeListItem("article").title("Knowledge journal"),
            S.documentTypeListItem("topic").title("Editorial topics"),
          ]),
    }),
    presentationTool({
      previewUrl: {
        initial: "/",
        previewMode: { enable: "/api/draft-mode/enable/" },
      },
      resolve: {
        locations: {
          article: contentLocations,
          consultation: contentLocations,
          remedy: contentLocations,
          siteSettings: singleton("Homepage", "/"),
          practitioner: singleton("About", "/about/"),
          credential: singleton("Recognition", "/about/#credentials"),
          course: singleton("Learn astrology", "/learn-astrology/"),
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
});
