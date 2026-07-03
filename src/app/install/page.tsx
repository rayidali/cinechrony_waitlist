import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { InstallSteps } from "@/components/install-steps";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Install the web app",
  description:
    "Add Cinechrony to your home screen on iPhone and Android. The web app is live and free, no app store needed.",
};

export default function InstallPage() {
  return (
    <>
    <main id="main">
      <section className="section--tight" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <Reveal>
            <InstallSteps>
              <div style={{ maxWidth: "52ch" }}>
                <div className="eyebrow" style={{ marginBottom: 18 }}>
                  The web app · no app store needed
                </div>
                <h1 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}>
                  Add it to your home screen.
                </h1>
                <p className="lead" style={{ marginTop: 18, maxWidth: "48ch" }}>
                  It works today, and it&apos;s free. Add it once and it opens full screen, just
                  like a native app.
                </p>
              </div>
            </InstallSteps>
          </Reveal>

          <Reveal delay={120}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", marginTop: 32 }}>
              <a className="btn btn--accent" href={site.appUrl} target="_blank" rel="noopener">
                Open the web app
              </a>
              <p className="meta" style={{ margin: 0, maxWidth: "52ch" }}>
                Opened this from TikTok or Instagram? Tap the browser menu, then Open in browser
                first. In-app browsers can&apos;t install.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
    <Footer variant="minimal" />
    </>
  );
}
