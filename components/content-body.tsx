import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Video } from "./video";

export function bodyHeadings(body: PortableTextBlock[]) {
  return body
    .filter(
      (block) =>
        block._type === "block" &&
        ["h2", "h3", "h4"].includes(block.style || ""),
    )
    .map((block) => ({
      id: `section-${block._key}`,
      text: block.children.map((child) => child.text || "").join(""),
    }));
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={`section-${value._key}`}>{children}</h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={`section-${value._key}`}>{children}</h3>
    ),
    h4: ({ children, value }) => (
      <h4 id={`section-${value._key}`}>{children}</h4>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href as string;
      if (!href || !/^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i.test(href))
        return <>{children}</>;
      if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
      return (
        <a
          href={href}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    contentImage: ({ value }) => {
      const src = (value.image?.asset?.url || value.url) as string;
      if (!src || !/^(\/media\/|https:\/\/cdn\.sanity\.io\/)/.test(src))
        return null;
      return (
        <figure className="content-figure">
          <Image
            src={src}
            alt={value.alt || "Astrology illustration"}
            width={Number(value.width) || 1000}
            height={Number(value.height) || 750}
            sizes="(max-width: 760px) 90vw, 700px"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
    contentTable: ({ value }) => (
      <div className="content-table">
        <table>
          <tbody>
            {(value.rows || []).map(
              (row: { _key: string; cells: string[] }) => (
                <tr key={row._key}>
                  {row.cells.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    ),
    video: ({ value }) => <Video url={value.url} title={value.title} />,
  },
};

export function ContentBody({ body }: { body: PortableTextBlock[] }) {
  return (
    <div className="article-prose">
      <PortableText value={body} components={components} />
    </div>
  );
}
