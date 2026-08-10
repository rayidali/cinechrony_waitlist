import type { Metadata } from "next";
import Link from "next/link";
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
          <div className="wrap">
            <div className="beta-hero">
              <Reveal>
                <span className="label label--red" style={{ marginBottom: 24 }}>
                  testflight · iphone
                </span>
                <h1 className="d1">{beta ? "the beta is open." : "the beta opens soon."}</h1>
                <p className="body" style={{ marginTop: 26 }}>
                  {beta ? (
                    <>
                      Cinechrony runs on TestFlight right now. Two minutes to join, free the whole
                      time we&rsquo;re in beta, and every new build arrives on your phone
                      automatically.
                    </>
                  ) : (
                    <>
                      Cinechrony is coming to TestFlight. Waitlist members get the invite first, on
                      the day it opens, and it&rsquo;s free while we&rsquo;re in beta.
                    </>
                  )}
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

        <section className="band band--deep section">
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">how to join</span>
              </div>
              <h2 className="d2" style={{ marginBottom: 44 }}>
                start to finish in two minutes.
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
                    <p>Download Apple&rsquo;s free TestFlight app from the App Store.</p>
                  </div>
                </div>
                <div className="istep">
                  <div className="istep__ic">
                    <InviteLinkIcon />
                  </div>
                  <div className="istep__t">
                    <span className="n">step 2</span>
                    <h3>tap the link</h3>
                    <p>Tap the invite link above. It opens straight inside TestFlight.</p>
                  </div>
                </div>
                <div className="istep">
                  <div className="istep__ic">
                    <TapInstallIcon />
                  </div>
                  <div className="istep__t">
                    <span className="n">step 3</span>
                    <h3>tap install</h3>
                    <p>Hit Install and cinechrony downloads to your phone.</p>
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
                    <p>Find the popcorn on your home screen and share your first reel.</p>
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
                      TestFlight is Apple&rsquo;s own beta app, and it is the only way to run an
                      unreleased iPhone app. It is the usual stumble, so: install TestFlight first,
                      then tap our link.{" "}
                      <Link href="/waitlist">Join the waitlist</Link> too and we&rsquo;ll tell you
                      the day the App Store version lands.
                    </>
                  ) : (
                    <>
                      The invite comes from us by email.{" "}
                      <Link href="/waitlist">Join the waitlist</Link> and it&rsquo;ll be in your
                      inbox the day the beta opens.
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
