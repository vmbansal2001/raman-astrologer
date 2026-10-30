import { Suspense } from "react";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSettings } from "@/lib/content";
import { live } from "@/sanity/lib/live";
import { disablePreview } from "@/sanity/lib/actions";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const draft = live ? (await draftMode()).isEnabled : false;
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader settings={settings} />
      <main id="main-content">{children}</main>
      <SiteFooter settings={settings} />
      {process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" && <Analytics />}
      {live && (
        <Suspense>
          <live.SanityLive />
        </Suspense>
      )}
      {draft && (
        <>
          <form action={disablePreview}>
            <button className="preview-exit">Exit preview</button>
          </form>
          <VisualEditing />
        </>
      )}
    </>
  );
}
