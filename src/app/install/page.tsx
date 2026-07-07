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
        <div className="wrap wrap--narrow">
          <Reveal>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">The web app · no app store needed</span>
              <h1 className="display-2">Add it to your home screen.</h1>
              <p className="lead">
                It works today, and it&apos;s free. Add it once and it opens full screen, just
                like a native app.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                marginTop: 32,
              }}
            >
              <a className="btn btn--accent" href={site.appUrl} target="_blank" rel="noopener">
                Open the web app
              </a>
              <p className="meta" style={{ margin: 0, maxWidth: "52ch", textAlign: "center" }}>
                Opened this from TikTok or Instagram? Tap the browser menu, then Open in browser
                first. In-app browsers can&apos;t install.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal delay={120}>
            <InstallSteps />
          </Reveal>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
