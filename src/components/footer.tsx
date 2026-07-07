import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export function Footer({
  variant = "full",
  note,
}: {
  variant?: "full" | "minimal";
  /** replaces the tagline on the right of the minimal footer (legal cross-links) */
  note?: ReactNode;
}) {
  if (variant === "minimal") {
    return (
      <footer className="footer">
        <div className="wrap">
          <div className="footer-bottom footer-bottom--bare">
            <Link className="brand" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/cinechrony-logo.png" alt="" width={28} height={28} style={{ width: 28, height: 28 }} />
              <span className="word">cinechrony</span>
            </Link>
            <span className="meta">{note ?? "The social movie watchlist"}</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link className="brand" href="/" style={{ marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/cinechrony-logo.png" alt="" width={34} height={34} style={{ width: 34, height: 34 }} />
              <span className="word" style={{ fontSize: "1.45rem" }}>
                cinechrony
              </span>
            </Link>
            <p className="lead" style={{ maxWidth: "34ch" }}>
              The social movie watchlist. Beli, but for the films you watch with friends.
            </p>
          </div>
          <div>
            <h3>Product</h3>
            <ul>
              <li>
                <Link href="/#how">How it works</Link>
              </li>
              <li>
                <Link href="/#features">Features</Link>
              </li>
              <li>
                <Link href="/#story">Our story</Link>
              </li>
              <li>
                <a href={site.appUrl} target="_blank" rel="noopener">
                  Try the web app
                </a>
              </li>
              <li>
                <Link href="/install">Add to home screen</Link>
              </li>
              <li>
                <Link href="/beta">iOS beta</Link>
              </li>
              <li>
                <Link href="/waitlist">Join the waitlist</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li>
                <Link href="/support">Support</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="meta">© 2026 Cinechrony</span>
          <span className="meta">The social movie watchlist</span>
        </div>
      </div>
      <div className="footer-ghost" aria-hidden="true">
        cinechrony
      </div>
    </footer>
  );
}
