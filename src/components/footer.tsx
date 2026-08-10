import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

/**
 * The colophon. Small mono headings, lowercase links, and the wordmark
 * knocked out in outline at the bottom of the sheet — the one place the
 * site is allowed to be purely graphic, because there is nothing left to
 * read by the time you reach it.
 */
export function Footer({
  variant = "full",
  note,
}: {
  variant?: "full" | "minimal";
  note?: ReactNode;
}) {
  if (variant === "minimal") {
    return (
      <footer className="footer band band--paper">
        <div className="wrap">
          <div className="footer-bottom" style={{ borderTop: 0, paddingTop: 0 }}>
            <Link className="brand" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/cinechrony-logo.png" alt="" width={24} height={24} />
              <span className="word" style={{ fontSize: "1.05rem" }}>
                cinechrony
              </span>
            </Link>
            <span className="label">{note ?? "keep the films you find scrolling"}</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer band band--paper">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="brand" href="/" style={{ marginBottom: 18 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/cinechrony-logo.png" alt="" width={30} height={30} />
              <span className="word" style={{ fontSize: "1.3rem" }}>
                cinechrony
              </span>
            </Link>
            <p className="body" style={{ maxWidth: "30ch", marginTop: 14, color: "var(--fg-soft)" }}>
              You find films while scrolling. This is where they stop disappearing.
            </p>
          </div>
          <div>
            <h3>the product</h3>
            <ul>
              <li>
                <Link href="/#how">how it works</Link>
              </li>
              <li>
                <Link href="/#features">what it does</Link>
              </li>
              <li>
                <Link href="/#story">why we built it</Link>
              </li>
              <li>
                <Link href="/beta">ios beta</Link>
              </li>
              <li>
                <Link href="/install">add to home screen</Link>
              </li>
              <li>
                <a href={site.appUrl} target="_blank" rel="noopener">
                  open the web app
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>the small print</h3>
            <ul>
              <li>
                <Link href="/support">support</Link>
              </li>
              <li>
                <Link href="/waitlist">waitlist</Link>
              </li>
              <li>
                <Link href="/privacy">privacy</Link>
              </li>
              <li>
                <Link href="/terms">terms</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="label">© 2026 cinechrony</span>
          <span className="label">made for the group chat</span>
        </div>
      </div>
      <div className="footer-ghost ghost" aria-hidden="true">
        cinechrony
      </div>
    </footer>
  );
}
