"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes } from "react";

export function TrackedLink({
  event,
  offering,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  offering?: string;
}) {
  return (
    <a
      {...props}
      onClick={() => {
        if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true")
          track(event, offering ? { offering } : undefined);
      }}
    >
      {children}
    </a>
  );
}
