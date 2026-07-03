import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: `Questions about Cinechrony? Email ${site.supportEmail} and a real person will get back to you, usually within a day. Or check the FAQ for quick answers.`,
};

export default function SupportPage() {
  return (
    <>
    <main id="main">
      <section className="section">
        <div className="wrap wrap--narrow">
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 22 }}>
              Support
            </div>
            <h1 className="display">Need a hand?</h1>
            <p className="lead" style={{ marginTop: 24, maxWidth: "46ch" }}>
              A real person, a real inbox. Email us and you&apos;ll usually hear back within a day.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div
              className="card card--pad-lg"
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div className="meta" style={{ marginBottom: 8 }}>
                  Write to us
                </div>
                <a href={`mailto:${site.supportEmail}`} className="h2 break-anywhere">
                  {site.supportEmail}
                </a>
              </div>
              <a className="btn btn--accent" href={`mailto:${site.supportEmail}`}>
                Send an email
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="hairline" />

      <section className="section">
        <div className="wrap wrap--narrow">
          <Reveal>
            <div className="block-head" style={{ marginBottom: 24 }}>
              <div className="rule-eyebrow">
                <span className="eyebrow">Frequently asked</span>
              </div>
              <h2 className="h2">The short version.</h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="faq">
              <details open>
                <summary>What is Cinechrony?</summary>
                <p>
                  A social movie watchlist app. Share a reel or TikTok, and our AI pulls out every
                  film in it with IMDb ratings, then saves them to a list you and your friends keep
                  together.
                </p>
              </details>
              <details>
                <summary>Is it free?</summary>
                <p>
                  Yes. The web app is free to use right now, and the iOS app will be free to
                  download when it lands on the App Store.
                </p>
              </details>
              <details>
                <summary>When&apos;s the iOS app out?</summary>
                <p>
                  The iOS app is in the works and the beta will open on TestFlight soon. Join the{" "}
                  <Link href="/waitlist">waitlist</Link> and we&apos;ll send the invite the day it
                  opens. Until then, the web app works on any phone.
                </p>
              </details>
              <details>
                <summary>How does the reel scanning work?</summary>
                <p>
                  You paste a clip. The AI watches it and finds every film, then matches each one to
                  IMDb so the rating comes too. The original clip stays on each card.
                </p>
              </details>
              <details>
                <summary>Can I use it before the app ships?</summary>
                <p>
                  Yes. The web app works today. Head to the{" "}
                  <Link href="/install">install page</Link> and add it to your home screen. It opens
                  full screen, just like a native app.
                </p>
              </details>
              <details>
                <summary>How do I delete my account or data?</summary>
                <p>
                  You can permanently delete your account from Settings in the app. Deletion is
                  immediate and cannot be undone. Prefer email? Write to us from the address on your
                  account and we&apos;ll handle it. The{" "}
                  <Link href="/privacy">privacy policy</Link> has the detail.
                </p>
              </details>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
    <Footer variant="minimal" />
    </>
  );
}
