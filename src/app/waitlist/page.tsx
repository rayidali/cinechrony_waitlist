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
      <section className="section">
        <div className="wrap">
          <div className="hero-split" style={{ alignItems: "start" }}>
            <Reveal>
              <div className="eyebrow" style={{ marginBottom: 22 }}>
                The waitlist · est. 2025
              </div>
              <h1 className="display">Get in early.</h1>
              <p className="lead" style={{ marginTop: 24, maxWidth: "42ch" }}>
                The iOS app is on its way. Drop your email and you&apos;ll get the TestFlight
                invite the moment the beta opens, plus a nudge when the full app lands.
              </p>

              <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 22 }}>
                <div className="block-head">
                  <div className="rule-eyebrow">
                    <span className="eyebrow">what you&apos;re joining</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span className="meta" style={{ color: "var(--accent)" }}>
                    01
                  </span>
                  <p className="body" style={{ margin: 0 }}>
                    The TestFlight invite, straight to your inbox when the beta opens.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span className="meta" style={{ color: "var(--accent)" }}>
                    02
                  </span>
                  <p className="body" style={{ margin: 0 }}>
                    Early access to new features before anyone else.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                  <span className="meta" style={{ color: "var(--accent)" }}>
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
    <Footer variant="minimal" />
    </>
  );
}
