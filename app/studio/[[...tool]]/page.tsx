import Link from "next/link";
import Studio from "@/components/studio";
export const metadata = {
  title: "Content studio | Raman Astrologer",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    return (
      <main className="studio-placeholder">
        <span className="eyebrow">CONTENT STUDIO</span>
        <h1>The editor is ready to connect.</h1>
        <p>
          Connect the Sanity project to load, edit, preview, and publish website
          content from this studio.
        </p>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code>,{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code>, and the server-only preview
          token in your local environment file, then follow the connection guide
          in the project README.
        </p>
        <Link className="button button-outline" href="/">
          Return to the website
        </Link>
      </main>
    );
  return <Studio />;
}
