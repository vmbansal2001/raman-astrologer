"use client";
import { useState } from "react";
import { Icon } from "./icons";

export function Video({
  url,
  title = "A perspective from Acharya Raman",
}: {
  url: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);
  if (url.startsWith("https://video.wordpress.com/embed/GorbkLtS")) {
    if (playing)
      return (
        <video
          className="video-embed"
          controls
          autoPlay
          playsInline
          preload="metadata"
          poster="/videos/introduction-poster.jpg"
          aria-label={title}
        >
          <source src="/videos/introduction.mp4" type="video/mp4" />
          Your browser does not support this video.{" "}
          <a href="/videos/introduction.mp4">
            Open the original introduction video.
          </a>
        </video>
      );
    return (
      <button
        className="video-facade"
        onClick={() => setPlaying(true)}
        aria-label={`Play video: ${title}`}
      >
        <span>
          <Icon name="play" size={24} />
        </span>
        <strong>{title}</strong>
        <small>Play video · 38 seconds</small>
      </button>
    );
  }
  let src = "";
  try {
    const parsed = new URL(url);
    if (
      [
        "www.youtube.com",
        "youtube.com",
        "youtu.be",
        "www.youtube-nocookie.com",
      ].includes(parsed.hostname)
    ) {
      const id =
        parsed.hostname === "youtu.be"
          ? parsed.pathname.slice(1)
          : parsed.searchParams.get("v") ||
            parsed.pathname.split("/").filter(Boolean).pop();
      if (/^[a-zA-Z0-9_-]{11}$/.test(id || ""))
        src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    } else if (
      parsed.hostname === "video.wordpress.com" &&
      /^\/embed\/[a-zA-Z0-9]+$/.test(parsed.pathname)
    )
      src = `${parsed.origin}${parsed.pathname}?autoplay=1`;
  } catch {
    return null;
  }
  if (!src) return null;
  if (playing)
    return (
      <iframe
        className="video-embed"
        title={title}
        src={src}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  return (
    <button
      className="video-facade"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
    >
      <span>
        <Icon name="play" size={24} />
      </span>
      <strong>{title}</strong>
      <small>Play video</small>
    </button>
  );
}
