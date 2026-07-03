import Link from "next/link";
import { Footer } from "@/components/footer";
import { MediaSlot } from "@/components/media-slot";
import { PhoneDemo } from "@/components/phone-demo";
import { Reveal } from "@/components/reveal";
import { TikTokIcon, InstagramIcon, YouTubeIcon, LinkIcon } from "@/components/icons";
import { site } from "@/lib/site";

export default function LandingPage() {
  return (
    <>
    <main id="main">
      {/* hero — editorial split */}
      <section className="section">
        <div className="wrap">
          <div className="hero-split">
            <Reveal>
              <div className="eyebrow hero-eyebrow">The social movie watchlist</div>
              <h1 className="display">
                Doomscroll. Save. <span className="mark">Watch together.</span>
              </h1>
              <p className="lead" style={{ marginTop: 26, maxWidth: "44ch" }}>
                Most of us find our next movie on social, then lose it. Cinechrony turns any reel
                into an organized watchlist: rated, and shared with the friends whose taste you
                actually trust.
              </p>
              <div className="hero-cta-row">
                <a className="btn btn--accent btn--lg" href={site.appUrl} target="_blank" rel="noopener">
                  Try it here
                </a>
                <a className="btn btn--ghost btn--lg" href="#demo">
                  Watch the demo
                </a>
              </div>
              <p className="meta hero-note">Free web app. Nothing to download.</p>
            </Reveal>
            <Reveal delay={150}>
              <div className="hero-phone">
                <PhoneDemo />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="hairline" />

      {/* social source strip */}
      <section className="section--tight" id="demo">
        <div className="wrap">
          <Reveal>
            <div className="block-head" style={{ marginBottom: 40 }}>
              <div className="rule-eyebrow">
                <span className="eyebrow">Works with the clips you already share</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap" }}>
              <span className="source">
                <TikTokIcon />
                TikTok
              </span>
              <span className="source">
                <InstagramIcon />
                Instagram Reels
              </span>
              <span className="source">
                <YouTubeIcon />
                YouTube Shorts
              </span>
              <span className="source">
                <LinkIcon />
                Any link you paste
              </span>
              <span className="pill" style={{ marginLeft: "auto" }}>
                IMDb ratings attached
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ marginTop: 48 }}>
              <MediaSlot
                id="demo-hero"
                label="Demo video · a reel becomes a rated watchlist"
                ratio="16 / 9"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="hairline" />

      {/* how it works */}
      <section className="section" id="how">
        <div className="wrap">
          <Reveal>
            <div className="block-head">
              <div className="rule-eyebrow">
                <span className="eyebrow">How it works</span>
              </div>
              <h2 className="h2" style={{ maxWidth: "22ch" }}>
                From a clip in the group chat to a list you&apos;ll actually finish.
              </h2>
            </div>
          </Reveal>
          <div className="steps">
            <Reveal className="step" delay={0}>
              <span className="step__num">01</span>
              <h3 className="h3">Share the clip</h3>
              <p className="body">Paste a reel, TikTok, or short. Or share it straight from the app.</p>
            </Reveal>
            <Reveal className="step" delay={120}>
              <span className="step__num">02</span>
              <h3 className="h3">The AI watches it</h3>
              <p className="body">It identifies every film in the clip and pulls each IMDb rating.</p>
            </Reveal>
            <Reveal className="step" delay={240}>
              <span className="step__num">03</span>
              <h3 className="h3">Save to a shared list</h3>
              <p className="body">
                Everything lands on a shared list. Your friends see it instantly, and the clip stays
                attached.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <hr className="hairline" />

      {/* features */}
      <section className="section" id="features">
        <div className="wrap">
          <div className="feature">
            <Reveal className="feature__copy">
              <div className="eyebrow">Built for the group chat</div>
              <h2 className="h2">
                Watchlists you build <span className="mark">together.</span>
              </h2>
              <p className="body" style={{ color: "var(--fg-soft)" }}>
                Add up to ten friends to any list. Everyone adds, everyone sees. No more digging
                through the group chat for that one film someone swore was good.
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                <span className="pill">Up to 10 people</span>
                <span className="pill">Real-time sync</span>
              </div>
            </Reveal>
            <Reveal className="feature__media" delay={120}>
              <MediaSlot id="feature-shared-list" label="App screenshot · shared list with members" />
            </Reveal>
          </div>

          <div className="feature feature--flip">
            <Reveal className="feature__copy">
              <div className="eyebrow">Rated before you save</div>
              <h2 className="h2">Never save a dud.</h2>
              <p className="body" style={{ color: "var(--fg-soft)" }}>
                Every film arrives with its rating, so you know what&apos;s worth your evening before
                it ever hits the list.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                <span className="rating rating--good">8.1</span>
                <span className="rating rating--good">7.6</span>
                <span className="rating rating--mid">6.4</span>
                <span className="rating rating--bad">4.9</span>
              </div>
            </Reveal>
            <Reveal className="feature__media" delay={120}>
              <MediaSlot id="feature-ratings" label="App screenshot · list with rating chips" />
            </Reveal>
          </div>

          <div className="feature">
            <Reveal className="feature__copy">
              <div className="eyebrow">The clip stays attached</div>
              <h2 className="h2">Remember why you saved it.</h2>
              <p className="body" style={{ color: "var(--fg-soft)" }}>
                The reel that sold you stays with the film. Tap any card and it&apos;s right there.
                The context never gets lost.
              </p>
            </Reveal>
            <Reveal className="feature__media" delay={120}>
              <MediaSlot id="feature-clip-attached" label="App screenshot · film card with attached clip" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* our story */}
      <section className="story-section" id="story">
        <div className="wrap story-grid">
          <Reveal className="story-lead">
            <div className="eyebrow" style={{ marginBottom: 24 }}>
              Why we built Cinechrony
            </div>
            <h2 className="display">Movies live on social now. Your watchlist doesn&apos;t.</h2>
          </Reveal>
          <Reveal className="story-body" delay={120}>
            <p className="story__p">
              Most people discover their next film on social media: a reel, a TikTok, a screen
              recording from a friend. Then you scroll past, and it&apos;s gone.
            </p>
            <p className="story__pull">
              There&apos;s Beli for restaurants. There&apos;s never really been one for the movies
              you watch with friends.
            </p>
            <p className="story__p">
              Letterboxd is a diary built for critics, not for the group chat. Cinechrony closes the
              gap between finding a film on social and finally having somewhere to keep it, together.
            </p>
            <p className="story__sign">The Cinechrony team</p>
          </Reveal>
        </div>
      </section>

      {/* try-it band */}
      <section className="band section" id="try">
        <div className="wrap wrap--narrow" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 22 }}>
              Start your first list
            </div>
            <h2 className="display">Give it a try.</h2>
            <p className="lead" style={{ margin: "24px auto 0", maxWidth: "44ch" }}>
              The web app is live and free. Open it, paste a clip, add a friend. The iOS app is on
              its way.
            </p>
            <div className="hero-cta-row" style={{ justifyContent: "center" }}>
              <a className="btn btn--accent btn--lg" href={site.appUrl} target="_blank" rel="noopener">
                Try it here
              </a>
              <Link className="btn btn--lg btn--outline-cream" href="/install">
                Add to home screen
              </Link>
            </div>
            <p className="meta" style={{ marginTop: 20 }}>
              Want a heads-up when the iOS app ships?{" "}
              <Link href="/waitlist" style={{ textDecoration: "underline" }}>
                Join the waitlist
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
