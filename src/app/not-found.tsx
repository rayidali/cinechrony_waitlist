import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
    <main id="main">
      <section className="section">
        <div className="wrap wrap--narrow" style={{ textAlign: "center" }}>
          <div className="eyebrow hero-eyebrow">404 · not on the list</div>
          <h1 className="display">This one&apos;s not in the archive.</h1>
          <p className="body" style={{ marginTop: 24, color: "var(--fg-soft)" }}>
            The page you&apos;re after moved, or never made the cut.
          </p>
          <div className="hero-cta-row" style={{ justifyContent: "center" }}>
            <Link className="btn btn--accent btn--lg" href="/">
              Back to the homepage
            </Link>
            <Link className="btn btn--ghost btn--lg" href="/support">
              Get support
            </Link>
          </div>
        </div>
      </section>
    </main>
    <Footer variant="minimal" />
    </>
  );
}
