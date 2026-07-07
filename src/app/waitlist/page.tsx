import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { WaitlistForm } from "@/components/waitlist-form";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Drop your email to get the TestFlight invite when the iOS beta opens, plus news the day the full app lands.",
};

export default function WaitlistPage() {
  return (
    <>
    <main id="main">
      <section className="section--tight">
        <div className="wrap wrap--narrow">
          <Reveal>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">The waitlist · est. 2025</span>
              <h1 className="display-2">Get in early.</h1>
              <p className="lead">
                Drop your email and the TestFlight invite lands the moment the beta opens.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="hero-split" style={{ alignItems: "start" }}>
            <Reveal>
              <div className="block-head">
                <div className="rule-eyebrow">
                  <span className="eyebrow">what you&apos;re joining</span>
                </div>
              </div>
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 22 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span className="meta" style={{ color: "var(--accent-text)" }}>
                    01
                  </span>
                  <p className="body" style={{ margin: 0 }}>
                    The TestFlight invite, straight to your inbox when the beta opens.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span className="meta" style={{ color: "var(--accent-text)" }}>
                    02
                  </span>
                  <p className="body" style={{ margin: 0 }}>
                    Early access to new features before anyone else.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span className="meta" style={{ color: "var(--accent-text)" }}>
                    03
                  </span>
                  <p className="body" style={{ margin: 0 }}>
                    A say in what we build next. We read every reply.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="card card--pad-lg">
                <WaitlistForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
