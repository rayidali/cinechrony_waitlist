import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description: `Questions about cinechrony? Email ${site.supportEmail} and a real person will get back to you, usually within a day. The FAQ covers the quick ones.`,
};

// Prefer breaking at the "@" and before the TLD over letting the browser
// pick an arbitrary mid-word point (overflow-wrap:anywhere was splitting
// "cinechrony" itself, e.g. "cinechr / ony.com").
const [emailLocal, emailDomain = ""] = site.supportEmail.split("@");
const tldIndex = emailDomain.lastIndexOf(".");
const emailDomainName = tldIndex >= 0 ? emailDomain.slice(0, tldIndex) : emailDomain;
const emailTld = tldIndex >= 0 ? emailDomain.slice(tldIndex) : "";

export default function SupportPage() {
  return (
    <>
      <main id="main">
        {/* Support content is never gated behind a scroll-triggered reveal:
            the FAQ and the contact card must render for every visitor,
            crawler and screen reader on first paint. */}
        <section className="band band--paper section">
          <div className="wrap">
            <div className="marker">
              <span className="label">support</span>
            </div>
            <div className="grab-head">
              <h1 className="d2">need a hand?</h1>
              <p className="body">
                A real person, a real inbox, usually the same day. If something is broken, tell us
                what you were doing when it broke and we will go and look.
              </p>
            </div>

            <div className="card card--pad-lg support-card">
              <div>
                <span className="label" style={{ marginBottom: 10 }}>
                  write to us
                </span>
                <a href={`mailto:${site.supportEmail}`} className="h2 break-anywhere support-email">
                  {emailLocal}@<wbr />
                  {emailDomainName}
                  <wbr />
                  {emailTld}
                </a>
              </div>
              <a className="btn btn--accent" href={`mailto:${site.supportEmail}`}>
                send an email
              </a>
            </div>
          </div>
        </section>

        <section className="band band--deep section">
          <div className="wrap wrap--narrow">
            <div className="marker">
              <span className="label">frequently asked</span>
            </div>
            <h2 className="d3" style={{ marginBottom: 34 }}>
              the short version.
            </h2>

            <div className="faq">
              <details open>
                <summary>what is cinechrony?</summary>
                <p>
                  A place to keep the films you find while scrolling. Share a reel or a TikTok and
                  it pulls out every film in the clip with its IMDb rating, keeps it without making
                  you file it anywhere, and puts it on a list you can share with friends.
                </p>
              </details>
              <details>
                <summary>is it free?</summary>
                <p>
                  Yes. The web app is free right now, the iOS beta is free the whole time it is a
                  beta, and the App Store version will be free to download.
                </p>
              </details>
              <details>
                <summary>can i get it on my iphone?</summary>
                <p>
                  Yes, today. The beta is open on TestFlight:{" "}
                  <Link href="/beta">here is how to join</Link>. It takes about two minutes and you
                  need Apple&rsquo;s free TestFlight app first, which is the bit that catches most
                  people out. The App Store release comes after the beta.
                </p>
              </details>
              <details>
                <summary>how does the scanning work?</summary>
                <p>
                  You share a clip. It watches the whole thing, the audio and the on-screen text as
                  well as the footage, then matches each film to a real record so the year and the
                  rating come with it. When it is not sure, it says so instead of guessing. The
                  original clip stays attached to every film it found.
                </p>
              </details>
              <details>
                <summary>do my friends need the app?</summary>
                <p>
                  For a shared list, yes. For a movie night, no: a guest can RSVP from the link
                  without an account, and they get a calendar invite rather than a signup form.
                </p>
              </details>
              <details>
                <summary>how do i delete my account or my data?</summary>
                <p>
                  From Settings in the app. Deletion is immediate and cannot be undone. If you would
                  rather email, write to us from the address on the account and we will handle it.
                  The <Link href="/privacy">privacy policy</Link> has the detail.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
