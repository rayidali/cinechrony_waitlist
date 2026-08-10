import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { InstallSteps } from "@/components/install-steps";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Install the web app",
  description:
    "Add cinechrony to your home screen on iPhone or Android. The web app is live and free, with no app store in the way.",
};

export default function InstallPage() {
  return (
    <>
      <main id="main">
        <section className="band band--paper section">
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">the web app · no app store needed</span>
              </div>
              <div className="grab-head">
                <h1 className="d2">
                  add it to your <em>home screen.</em>
                </h1>
                <div>
                  <p className="retro" style={{ maxWidth: "16ch" }}>
                    any browser. own icon. free.
                  </p>
                  <div className="cta-row">
                    <a className="btn btn--accent" href={site.appUrl} target="_blank" rel="noopener">
                      open the web app
                    </a>
                    <Link className="link-quiet" href="/beta">
                      or get the ios beta
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="callout" style={{ marginTop: 44 }}>
                <span className="label">one catch</span>
                <p className="body" style={{ margin: 0 }}>
                  Came here from TikTok or Instagram? Choose &ldquo;open in browser&rdquo; first.
                  In-app browsers cannot install anything.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="band band--rose section">
          <div className="wrap">
            <Reveal delay={60}>
              <InstallSteps />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
