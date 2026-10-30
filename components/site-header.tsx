"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation as defaultNavigation, site } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { Icon, SunMark } from "./icons";

export function SiteHeader({ settings = site }: { settings?: SiteSettings }) {
  const navigation = settings.navigation?.length
    ? settings.navigation
    : defaultNavigation;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const links = panel.current?.querySelectorAll<HTMLAnchorElement>("a");
        const last = links?.[links.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          toggle.current?.focus();
        }
        if (event.shiftKey && document.activeElement === toggle.current) {
          event.preventDefault();
          last?.focus();
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [open]);
  return (
    <>
      <div className="announcement">
        <div className="container announcement-inner">
          <span>Rooted in tradition. Guided by understanding.</span>
          <a href={`tel:${settings.phone.replaceAll(" ", "")}`}>
            <Icon name="phone" size={12} />
            {settings.phone}
            <span className="announcement-place">· {settings.city}</span>
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            className="brand"
            href="/"
            aria-label="Raman Astrologer home"
            onClick={() => setOpen(false)}
          >
            <SunMark />
            <span>
              <strong>RAMAN</strong>
              <span className="brand-subtitle">VEDIC ASTROLOGER</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  pathname.startsWith(item.href.replace(/\/$/, ""))
                    ? "page"
                    : undefined
                }
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <Link
            className="button button-small header-cta"
            href="/contact/?type=consultation#enquiry"
          >
            Request a consultation
            <Icon name="arrow-up" size={15} />
          </Link>
          <button
            ref={toggle}
            className="mobile-menu-toggle icon-button"
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} size={24} />
          </button>
        </div>
        {open && (
          <div ref={panel} id="mobile-navigation" className="mobile-navigation">
            <nav className="container" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                  <Icon name="arrow-up" size={18} />
                </Link>
              ))}
              <Link
                className="button"
                href="/contact/?type=consultation#enquiry"
                onClick={() => setOpen(false)}
              >
                Request a consultation
                <Icon name="arrow" />
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
