import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { MediaSlot } from "@/components/media-slot";
import { Reveal } from "@/components/reveal";
import { DownloadIcon, InviteLinkIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "iOS beta",
  description: site.testflightUrl
    ? "Join the Cinechrony TestFlight beta on iPhone. It takes about two minutes, and it's free while we're in beta."
    : "The Cinechrony iOS beta opens soon on TestFlight. Join the waitlist and the invite lands in your inbox first.",
};

export default function BetaPage() {
  const betaLive = site.testflightUrl !== null;

  return (
    <>
    <main id="main">
      {/* hero — beta status split */}
      <section className="section">
        <div className="wrap">
          <div className="hero-split">
            <Reveal>
              <div className="eyebrow hero-eyebrow">TestFlight beta · iPhone</div>
              <h1 className="display">{betaLive ? "The beta is open." : "The beta opens soon."}</h1>
              <p className="lead" style={{ marginTop: 24, maxWidth: "42ch" }}>
                {betaLive ? (
                  <>
                    Cinechrony runs on TestFlight right now. It takes about two minutes to join, and
                    it&apos;s free while we&apos;re in beta.
                  </>
                ) : (
                  <>
                    Cinechrony is coming to TestFlight. Waitlist members get the invite first, the
                    day it opens, and it&apos;s free while we&apos;re in beta.
                  </>
                )}
              </p>
              <div className="hero-cta-row">
                {betaLive ? (
                  <a
                    className="btn btn--accent btn--lg"
                    href={site.testflightUrl!}
                    target="_blank"
                    rel="noopener"
                  >
                    Open in TestFlight
                  </a>
                ) : (
                  <Link className="btn btn--accent btn--lg" href="/waitlist">
                    Join the waitlist
                  </Link>
                )}
              </div>
              <p className="meta hero-note">
                {betaLive ? <>You&apos;ll need an iPhone. No iPhone? </> : <>No iPhone? </>}
                <Link href="/install" style={{ textDecoration: "underline" }}>
                  Use the web app
                </Link>
                {betaLive ? <>.</> : <>, it works today.</>}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <MediaSlot
                id="beta-phone"
                label="App screen · beta build"
                ratio="320 / 640"
                style={{ maxWidth: 290, margin: "0 auto", borderRadius: 42 }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="hairline" />

      {/* how to join */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="block-head" style={{ marginBottom: 40 }}>
              <div className="rule-eyebrow">
                <span className="eyebrow">How to join</span>
              </div>
              <h2 className="h2">Start to finish in two minutes.</h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="isteps isteps--4">
              <div className="istep">
                <div className="istep__ic">
                  <DownloadIcon />
                </div>
                <div className="istep__t">
                  <span className="n">Step 1</span>
                  <h3>Get TestFlight</h3>
                  <p>Download Apple&apos;s free TestFlight app from the App Store.</p>
                </div>
              </div>
              <div className="istep">
                <div className="istep__ic">
                  <InviteLinkIcon />
                </div>
                <div className="istep__t">
                  <span className="n">Step 2</span>
                  <h3>Tap our link</h3>
                  <p>Tap the invite link we send. It opens inside TestFlight.</p>
                </div>
              </div>
              <div className="istep">
                <div className="istep__ic">
                  <DownloadIcon />
                </div>
                <div className="istep__t">
                  <span className="n">Step 3</span>
                  <h3>Tap Install</h3>
                  <p>Hit Install and Cinechrony downloads to your phone.</p>
                </div>
              </div>
              <div className="istep">
                <div className="istep__ic">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/cinechrony-logo.png" alt="Cinechrony icon" />
                </div>
                <div className="istep__t">
                  <span className="n">Step 4</span>
                  <h3>You&apos;re in</h3>
                  <p>Find the popcorn on your home screen and start a list.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="callout" style={{ marginTop: 36 }}>
              <span className="meta">Heads up</span>
              <div>
                <p className="body" style={{ margin: 0 }}>
                  {betaLive ? (
                    <>
                      The invite link comes from us. Don&apos;t have one yet?{" "}
                      <Link href="/waitlist" style={{ textDecoration: "underline" }}>
                        Join the waitlist
                      </Link>{" "}
                      and we&apos;ll send it over.
                    </>
                  ) : (
                    <>
                      The invite comes from us by email.{" "}
                      <Link href="/waitlist" style={{ textDecoration: "underline" }}>
                        Join the waitlist
                      </Link>{" "}
                      and it&apos;ll be in your inbox the day the beta opens.
                    </>
                  )}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
    <Footer variant="minimal" />
    </>
  );
}
