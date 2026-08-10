import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { WaitlistForm } from "@/components/waitlist-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join the list",
  description:
    "Drop your email and we'll tell you the day cinechrony lands on the App Store, plus what we shipped along the way.",
};

/* The beta being open changes what this page is for. It used to be the only
   way in; now the TestFlight link is public, so the list is about the App
   Store release and the things worth an email between now and then. Saying
   "join the waitlist for the beta" while the beta is one tap away on the
   nav would be the same untruth from the other direction. */
const PROMISES = [
  ["01", "the day it hits the app store, in your inbox, before we post about it anywhere else."],
  ["02", "what we shipped, occasionally, when it is actually worth an email."],
  ["03", "a say in what comes next. we read every reply, and there are not many of you yet."],
];

export default function WaitlistPage() {
  return (
    <>
      <main id="main">
        <section className="band band--paper section">
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">the list · est. 2026</span>
              </div>
              <h1 className="d2">get in early.</h1>
            </Reveal>

            <div className="hero-split" style={{ marginTop: 44, alignItems: "start" }}>
              <Reveal>
                <p className="body">
                  The iOS beta is already open, so you do not have to wait for that one:{" "}
                  <Link href="/beta">grab it on TestFlight</Link> and you can be scanning a reel in
                  two minutes. This list is for everything after it.
                </p>
                <div className="promises">
                  {PROMISES.map(([n, text]) => (
                    <div className="promise" key={n}>
                      <span className="label label--red">{n}</span>
                      <p className="body">{text}</p>
                    </div>
                  ))}
                </div>
                <p className="label" style={{ marginTop: 26 }}>
                  no schedule, no drip sequence, and one click to leave
                </p>
              </Reveal>

              <Reveal delay={120}>
                <div className="card card--pad-lg">
                  <WaitlistForm />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="band band--ink section--tight">
          <div className="wrap center">
            <Reveal>
              <p className="label" style={{ marginBottom: 18 }}>
                or skip the queue entirely
              </p>
              <div className="cta-row" style={{ justifyContent: "center", marginTop: 0 }}>
                <a className="btn" href={site.appUrl} target="_blank" rel="noopener">
                  open the web app
                </a>
                <Link className="btn btn--accent" href="/beta">
                  get the ios beta
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
