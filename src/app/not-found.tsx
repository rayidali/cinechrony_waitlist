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
        <section className="band band--paper section--xl">
          <div className="wrap center">
            <span className="label label--red" style={{ marginBottom: 24 }}>
              404 · not on the list
            </span>
            <h1 className="d2">this one never made the cut.</h1>
            <p className="body" style={{ margin: "24px auto 0" }}>
              The page you were after moved, or was never here. It happens.
            </p>
            <div className="cta-row" style={{ justifyContent: "center" }}>
              <Link className="btn btn--accent btn--lg" href="/">
                back to the start
              </Link>
              <Link className="link-quiet" href="/support">
                or tell us what broke
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="minimal" />
    </>
  );
}
