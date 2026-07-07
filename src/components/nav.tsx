"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/install", label: "Install" },
  { href: "/beta", label: "iOS beta" },
  { href: "/waitlist", label: "Waitlist" },
  { href: "/support", label: "Support" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link
          className="brand"
          href="/"
          onClick={() => setOpen(false)}
          aria-label="cinechrony home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/cinechrony-logo.png" alt="" width={30} height={30} />
          <span className="word">cinechrony</span>
        </Link>
        <button
          className="nav-burger"
          aria-label="menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
        <nav className={open ? "nav-links open" : "nav-links"} aria-label="site">
          {links.map((l) => {
            // hide the self-referencing link, matching the mockups
            if (l.href === pathname) return null;
            return (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle />
          <a
            className="btn btn--sm nav-cta"
            href={site.appUrl}
            target="_blank"
            rel="noopener"
          >
            Open the app
          </a>
        </nav>
      </div>
    </header>
  );
}
