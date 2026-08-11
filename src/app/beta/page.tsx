import type { Metadata } from "next";
import Link from "next/link";
import { BandScene } from "@/components/cutouts";
import { Footer } from "@/components/footer";
import { Frame } from "@/components/frame";
import { Reveal } from "@/components/reveal";
import { DownloadIcon, InviteLinkIcon, TapInstallIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "iOS beta",
  description: site.testflightUrl
    ? "The Cinechrony iOS beta is open on TestFlight. It takes about two minutes to join and it's free while we're in beta."
    : "The Cinechrony iOS beta opens soon on TestFlight. Join the waitlist and the invite lands in your inbox first.",
};

export default function BetaPage() {
  const beta = site.testflightUrl;

  return (
    <>
      <main id="main">
        <section className="band band--paper section">
        <BandScene id="sky" />
          <div className="wrap">
            <div className="beta-hero">
              <Reveal>
                <span className="label label--red" style={{ marginBottom: 24 }}>
                  testflight · iphone
                </span>
                <h1 className="d1">
                  {beta ? (
                    <>
                      the beta is <em>open.</em>
                    </>
                  ) : (
                    <>
                      the beta opens <em>soon.</em>
                    </>
                  )}
                </h1>
                <p className="retro" style={{ marginTop: 24, maxWidth: "16ch" }}>
                  {beta ? "two minutes. free." : "waitlist first."}
                </p>
                <div className="cta-row">
                  {beta ? (
                    <a className="btn btn--accent btn--lg" href={beta} target="_blank" rel="noopener">
                      open in testflight
                    </a>
                  ) : (
                    <Link className="btn btn--accent btn--lg" href="/waitlist">
                      join the waitlist
                    </Link>
                  )}
                  <Link className="link-quiet" href="/install">
                    no iphone? use the web app
                  </Link>
                </div>
                <span className="label hero-note">
                  {beta
                    ? "you'll need apple's free testflight app first"
                    : "the invite comes from us, by email"}
                </span>
              </Reveal>

              <Reveal delay={120} className="beta-shot">
                <Frame id="app-diary" caption="the beta build" note="build 23" ratio="4 / 5" offset />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="band band--ochre section">
        <BandScene id="field" />
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">how to join</span>
              </div>
              <h2 className="d2" style={{ marginBottom: 44 }}>
                four taps, <em>start to finish.</em>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <div className="isteps isteps--4">
                <div className="istep">
                  <div className="istep__ic">
                    <DownloadIcon />
                  </div>
                  <div className="istep__t">
                    <span className="n">step 1</span>
                    <h3>get testflight</h3>
                    <p>Apple&rsquo;s free app. This is the bit that catches people out.</p>
                  </div>
                </div>
                <div className="istep">
                  <div className="istep__ic">
                    <InviteLinkIcon />
                  </div>
                  <div className="istep__t">
                    <span className="n">step 2</span>
                    <h3>tap the link</h3>
                    <p>It opens straight inside TestFlight.</p>
                  </div>
                </div>
                <div className="istep">
                  <div className="istep__ic">
                    <TapInstallIcon />
                  </div>
                  <div className="istep__t">
                    <span className="n">step 3</span>
                    <h3>tap install</h3>
                    <p>It downloads like any other app.</p>
                  </div>
                </div>
                <div className="istep">
                  <div className="istep__ic">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/brand/cinechrony-logo.png" alt="" />
                  </div>
                  <div className="istep__t">
                    <span className="n">step 4</span>
                    <h3>you&rsquo;re in</h3>
                    <p>Find the popcorn. Share a reel.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="callout" style={{ marginTop: 34 }}>
                <span className="label">heads up</span>
                <p className="body" style={{ margin: 0 }}>
                  {beta ? (
                    <>
                      TestFlight first, then our link.{" "}
                      <Link href="/waitlist">Join the list</Link> for the App Store release.
                    </>
                  ) : (
                    <>
                      The invite comes by email.{" "}
                      <Link href="/waitlist">Join the list</Link> to get it first.
                    </>
                  )}
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
