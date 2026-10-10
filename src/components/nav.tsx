"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

/**
 * A masthead, not a SaaS chrome bar. Flat paper, one hairline underneath,
 * no blur, no floating pill: the wordmark holds the left, small mono links
 * hold the right, and the actual ask lives in the page.
 */
/* One link and one button. "how it works" and "features" came out first,
   because they pointed at anchors two scrolls down a page short enough to
   just scroll; "ios beta" and "install" came out with the App Store release,
   because the button is now the only way to get the app. */
const links = [{ href: "/support", label: "support" }];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="wrap wrap--wide nav-inner">
        <Link className="brand" href="/" onClick={() => setOpen(false)} aria-label="cinechrony home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/cinechrony-logo.png" alt="" width={26} height={26} />
          <span className="word">cinechrony</span>
        </Link>

        <button
          className="nav-burger"
          aria-label="menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 7h18M3 17h18" />}
          </svg>
        </button>

        <nav className={open ? "nav-links open" : "nav-links"} aria-label="site">
          {links.map((l) =>
            l.href === pathname ? null : (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ),
          )}
          <ThemeToggle />
          <a className="btn btn--sm" href={site.appStoreUrl} target="_blank" rel="noopener">
            get the app
          </a>
        </nav>
      </div>
    </header>
  );
}
