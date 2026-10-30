import Link from "next/link";
import { Icon, SunMark } from "@/components/icons";
export default function NotFound() {
  return (
    <main className="not-found">
      <SunMark />
      <span className="eyebrow">A DIFFERENT PATH</span>
      <h1>
        This page has
        <br />
        <em>moved out of view.</em>
      </h1>
      <p>
        The page you’re looking for may have moved. Search for your topic, or
        return to the beginning.
      </p>
      <form className="search-form" action="/search/" role="search">
        <Icon name="search" size={18} />
        <label className="sr-only" htmlFor="not-found-search">
          Search the website
        </label>
        <input
          id="not-found-search"
          name="q"
          placeholder="What were you looking for?"
          type="search"
          maxLength={100}
        />
        <button>Search</button>
      </form>
      <Link className="button button-outline" href="/">
        Return home
        <Icon name="arrow" size={16} />
      </Link>
    </main>
  );
}
