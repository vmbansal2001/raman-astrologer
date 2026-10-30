"use client";
import Link from "next/link";
import { SunMark } from "@/components/icons";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="not-found">
      <SunMark />
      <h1>A brief pause.</h1>
      <p>
        We’re having trouble loading this page. Please try again, or contact the
        practice directly.
      </p>
      <div className="intro-actions">
        <button className="button" onClick={reset}>
          Try again
        </button>
        <Link className="text-link" href="/contact/">
          Contact the practice
        </Link>
      </div>
    </section>
  );
}
