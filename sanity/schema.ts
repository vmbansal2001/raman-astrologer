import { defineArrayMember, defineField, defineType } from "sanity";
import { articleTopics, consultationTopics, remedyTopics } from "@/lib/site";

const imageFields = [
  defineField({
    name: "image",
    title: "Upload or choose an image",
    type: "image",
    options: { hotspot: true },
  }),
  defineField({
    name: "src",
    title: "Imported image",
    type: "string",
    readOnly: true,
  }),
  defineField({
    name: "alt",
    title: "Describe the image",
    type: "string",
    description:
      "Describe the meaningful content for someone who cannot see it.",
  }),
  defineField({
    name: "url",
    title: "Original source image address",
    type: "url",
    hidden: true,
    readOnly: true,
  }),
  defineField({ name: "width", type: "number", hidden: true }),
  defineField({ name: "height", type: "number", hidden: true }),
];
const imageData = defineType({
  name: "imageData",
  title: "Image",
  type: "object",
  fields: imageFields,
});
const contentImage = defineType({
  name: "contentImage",
  title: "Image with caption",
  type: "object",
  fields: [
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "url",
      title: "Imported image address",
      type: "string",
      readOnly: true,
      hidden: ({ parent }) => !parent?.url,
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "width", type: "number", hidden: true }),
    defineField({ name: "height", type: "number", hidden: true }),
  ],
  preview: { select: { title: "alt", subtitle: "caption", media: "image" } },
});
const video = defineType({
  name: "video",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "YouTube or VideoPress address",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
  ],
  preview: { select: { title: "title", subtitle: "url" } },
});
const contentTable = defineType({
  name: "contentTable",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "tableRow",
          fields: [
            defineField({
              name: "cells",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare: ({ cells }) => ({
              title: cells?.join(" · ") || "Table row",
            }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Content table" }) },
});
const body = defineField({
  name: "body",
  title: "Main content",
  type: "array",
  validation: (rule) => rule.required().min(1),
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Section heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Small heading", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "Address",
                type: "string",
                validation: (rule) =>
                  rule
                    .required()
                    .custom(
                      (value) =>
                        /^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i.test(
                          typeof value === "string" ? value : "",
                        ) ||
                        "Use a website address or a path beginning with /.",
                    ),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "contentImage" }),
    defineArrayMember({ type: "contentTable" }),
    defineArrayMember({ type: "video" }),
  ],
});

function contentType(
  name: "article" | "consultation" | "remedy",
  title: string,
) {
  const topics =
    name === "article"
      ? articleTopics
      : name === "consultation"
        ? consultationTopics
        : remedyTopics;
  return defineType({
    name,
    title,
    type: "document",
    fields: [
      defineField({
        name: "title",
        type: "string",
        validation: (rule) => rule.required().max(150),
      }),
      defineField({
        name: "slug",
        type: "slug",
        options: { source: "title", maxLength: 120 },
        description:
          "Generate when creating a page. Keep an existing published address unchanged.",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "excerpt",
        title: "Introduction / search description",
        type: "text",
        rows: 3,
        validation: (rule) => rule.required().max(250),
      }),
      defineField({
        name: "category",
        title: "Topic",
        type: "string",
        options: {
          list: topics.map((topic) => ({
            title: topic.title,
            value: topic.slug,
          })),
        },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "image",
        title: "Featured image",
        type: "imageData",
      }),
      body,
      ...(name === "consultation"
        ? [
            defineField({
              name: "questions",
              title: "Questions this consultation addresses",
              type: "array",
              of: [{ type: "string" }],
            }),
          ]
        : []),
      ...(name === "remedy"
        ? [
            defineField({
              name: "variants",
              title: "Size options",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "remedyVariant",
                  fields: [
                    { name: "label", type: "string", title: "Size / variant" },
                  ],
                },
              ],
            }),
          ]
        : []),
      defineField({
        name: "tags",
        title: "Search aliases and tags",
        type: "array",
        of: [{ type: "string" }],
        options: { layout: "tags" },
      }),
      defineField({
        name: "publishedAt",
        title: "Original publication date",
        type: "datetime",
        initialValue: () => new Date().toISOString(),
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "updatedAt",
        title: "Substantive editorial update",
        type: "datetime",
        description:
          "Only update when the content has actually been reviewed or changed.",
      }),
      defineField({
        name: "sensitive",
        title: "Show professional-advice context",
        type: "boolean",
        description:
          "Use for health, financial, legal, or similarly sensitive traditional interpretations.",
        initialValue: false,
      }),
      defineField({
        name: "planet",
        type: "string",
        options: {
          list: [
            "sun",
            "moon",
            "mars",
            "mercury",
            "jupiter",
            "venus",
            "saturn",
            "rahu",
            "ketu",
          ],
        },
      }),
      defineField({
        name: "sign",
        title: "Zodiac sign",
        type: "string",
        options: {
          list: [
            "aries",
            "taurus",
            "gemini",
            "cancer",
            "leo",
            "virgo",
            "libra",
            "scorpio",
            "sagittarius",
            "capricorn",
            "aquarius",
            "pisces",
          ],
        },
      }),
      defineField({
        name: "house",
        type: "number",
        validation: (rule) => rule.integer().min(1).max(12),
      }),
      defineField({
        name: "reviewStatus",
        title: "Editorial review",
        type: "string",
        options: {
          list: [
            { title: "Needs review", value: "pending" },
            { title: "Reviewed", value: "reviewed" },
          ],
        },
        initialValue: "pending",
      }),
      defineField({
        name: "id",
        title: "Content identifier",
        type: "string",
        hidden: true,
      }),
      defineField({
        name: "path",
        title: "Preserved public address",
        type: "string",
        readOnly: true,
        hidden: ({ document }) => !document?.path,
      }),
      defineField({
        name: "legacyId",
        title: "Original WordPress ID",
        type: "number",
        readOnly: true,
        hidden: ({ document }) => !document?.legacyId,
      }),
      defineField({
        name: "legacyPath",
        title: "Original WordPress address",
        type: "string",
        readOnly: true,
        hidden: ({ document }) => !document?.legacyPath,
      }),
    ],
    preview: {
      select: { title: "title", subtitle: "category", media: "image.image" },
    },
  });
}

const siteSettings = defineType({
  name: "siteSettings",
  title: "Website settings",
  type: "document",
  fields: [
    defineField({
      name: "navigation",
      title: "Main navigation",
      type: "array",
      of: [
        {
          type: "object",
          name: "navigationLink",
          fields: [
            {
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "href",
              title: "Page path",
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .custom(
                    (value) =>
                      (typeof value === "string" && /^\/(?!\/)/.test(value)) ||
                      "Use a page path beginning with /.",
                  ),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "Homepage search title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "Homepage search description",
      type: "text",
      rows: 3,
    }),
    ...["name", "email", "phone", "alternatePhone", "whatsapp", "city"].map(
      (name) =>
        defineField({
          name,
          type: "string",
          title: (
            {
              name: "Practitioner name",
              email: "Contact email",
              phone: "Main phone",
              alternatePhone: "Alternate phone",
              whatsapp: "WhatsApp number (digits, including country code)",
              city: "City and country",
            } as Record<string, string>
          )[name],
          validation: (rule) => rule.required(),
        }),
    ),
    defineField({
      name: "heroTitle",
      title: "Homepage heading",
      type: "text",
      rows: 2,
      description: "Use a new line between the two heading lines.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Homepage introduction",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
});
const practitioner = defineType({
  name: "practitioner",
  title: "About the practitioner",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "photo", type: "imageData" }),
    defineField({
      name: "biography",
      title: "Biography paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
    }),
  ],
});
const credential = defineType({
  name: "credential",
  title: "Qualifications & recognition",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "eyebrow", title: "Small label", type: "string" }),
    defineField({
      name: "description",
      title: "Evidence-based caption",
      type: "text",
      rows: 4,
    }),
    defineField({ name: "image", type: "imageData" }),
    defineField({ name: "order", title: "Display order", type: "number" }),
    defineField({ name: "id", type: "string", hidden: true }),
  ],
});
const course = defineType({
  name: "course",
  title: "Basic astrology course",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    ...["duration", "eligibility", "certificate"].map((name) =>
      defineField({ name, type: "string" }),
    ),
    defineField({
      name: "curriculum",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "curriculumSection",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({
              name: "topics",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        }),
      ],
    }),
  ],
});
const topic = defineType({
  name: "topic",
  title: "Editorial topic",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "aliases", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "icon", type: "string", hidden: true, readOnly: true }),
  ],
});
export const schemaTypes = [
  imageData,
  contentImage,
  contentTable,
  video,
  siteSettings,
  practitioner,
  credential,
  course,
  topic,
  contentType("article", "Journal articles"),
  contentType("consultation", "Consultations"),
  contentType("remedy", "Traditional remedies"),
];
