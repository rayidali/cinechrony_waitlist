import type { Metadata } from "next";
import Link from "next/link";
import { BandScene } from "@/components/cutouts";
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
        <BandScene id="sky" />
          <div className="wrap">
            <div className="marker">
              <span className="label">support</span>
            </div>
            <div className="grab-head">
              <h1 className="d2">
                need a <em>hand?</em>
              </h1>
              <p className="retro" style={{ maxWidth: "18ch" }}>
                a real person. usually the same day.
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

        {/* The FAQ is the one place on the site copy was NOT cut hard. An
            answer that stops short of answering is worse than no FAQ, and
            this is also what an App Store reviewer reads. Trimmed, not
            gutted: every one of these still resolves the question. */}
        <section className="band band--mint section">
        <BandScene id="meadow" />
          <div className="wrap wrap--narrow">
            <div className="marker">
              <span className="label">frequently asked</span>
            </div>
            <h2 className="d3" style={{ marginBottom: 34 }}>
              the <em>short</em> version.
            </h2>

            <div className="faq">
              <details open>
                <summary>what is cinechrony?</summary>
                <p>
                  A place to keep the films you find while scrolling. Share a clip, it pulls out
                  every film in it with the ratings, and puts them on a list you share with friends.
                </p>
              </details>
              <details>
                <summary>is it free?</summary>
                <p>Yes. Web now, the iOS beta throughout, and free to download on the App Store.</p>
              </details>
              <details>
                <summary>can i get it on my iphone?</summary>
                <p>
                  Yes, today, on TestFlight. <Link href="/beta">Here is how</Link>. You need
                  Apple&rsquo;s free TestFlight app first, which is the bit that catches people out.
                </p>
              </details>
              <details>
                <summary>how does the scanning work?</summary>
                <p>
                  It watches the whole clip, audio and on-screen text as well as footage, then
                  matches each film to a real record. When it is not sure, it says so rather than
                  guessing.
                </p>
              </details>
              <details>
                <summary>do my friends need the app?</summary>
                <p>
                  For a shared list, yes. For a movie night, no: guests RSVP from the link and get a
                  calendar invite rather than a signup form.
                </p>
              </details>
              <details>
                <summary>how do i delete my account or my data?</summary>
                <p>
                  Settings in the app. It is immediate and cannot be undone, and the{" "}
                  <Link href="/privacy">privacy policy</Link> has the detail.
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
