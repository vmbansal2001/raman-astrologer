"use client";
import { useRef } from "react";
import Image from "next/image";
import type { Credential } from "@/lib/profile";
import { Icon } from "./icons";
export function CredentialCard({ credential }: { credential: Credential }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <article className="credential">
      <div className="credential-image">
        <Image
          src={credential.image.src}
          alt={credential.image.alt}
          width={credential.image.width}
          height={credential.image.height}
          sizes="(max-width: 760px) 90vw, 45vw"
        />
      </div>
      <div className="credential-content">
        <span className="eyebrow">{credential.eyebrow}</span>
        <h3>{credential.title}</h3>
        <p>{credential.description}</p>
        <button
          onClick={() => dialog.current?.showModal()}
          aria-label={`View full image: ${credential.title}`}
        >
          View original image
          <Icon name="arrow-up" size={15} />
        </button>
      </div>
      <dialog
        className="lightbox"
        ref={dialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        aria-label={credential.title}
      >
        <button
          className="icon-button"
          aria-label="Close image"
          onClick={() => dialog.current?.close()}
        >
          <Icon name="close" size={24} />
        </button>
        <Image
          src={credential.image.src}
          alt={credential.image.alt}
          width={credential.image.width}
          height={credential.image.height}
          sizes="95vw"
        />
        <p>{credential.description}</p>
      </dialog>
    </article>
  );
}
