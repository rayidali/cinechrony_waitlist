import Link from "next/link";
import { Footer } from "@/components/footer";
import { MediaSlot } from "@/components/media-slot";
import { PhoneDemo } from "@/components/phone-demo";
import { PhoneStatic } from "@/components/phone-static";
import { Reveal } from "@/components/reveal";
import { FilmStrip } from "@/components/film-strip";
import { MockupSharedList, MockupRatings, MockupClipAttached } from "@/components/feature-mockups";
import { TikTokIcon, InstagramIcon, YouTubeIcon, LinkIcon } from "@/components/icons";
import { site } from "@/lib/site";

export default function LandingPage() {
  return (
    <>
    <main id="main">
      {/* hero: centered, product-stage */}
      <section className="section section--xl grain">
        <div className="wrap">
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
              <div className="eyebrow hero-eyebrow">The social movie watchlist</div>
              <h1 className="display">
                Doomscroll. Save.
                <br />
                Watch together.
              </h1>
              <p className="lead" style={{ margin: "26px auto 0" }}>
                Cinechrony turns the reels you scroll past into a rated watchlist you share with
                friends.
              </p>
              <div className="hero-cta-row" style={{ justifyContent: "center" }}>
                <a className="btn btn--accent btn--lg" href={site.appUrl} target="_blank" rel="noopener">
                  Try it here
                </a>
                <a className="link-quiet" href="#demo">
                  Watch the demo
                </a>
              </div>
              <p className="meta hero-note">Free web app. Nothing to download.</p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="hero-stage">
              <div className="stage-floor" aria-hidden="true" />
              <PhoneStatic variant="list" className="hero-stage__flank hero-stage__flank--left" />
              <div className="hero-stage__center">
                <PhoneDemo />
              </div>
              <PhoneStatic variant="detail" className="hero-stage__flank hero-stage__flank--right" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* social source strip + demo video */}
      <section className="section--tight scene--paper" id="demo">
        <div className="wrap">
          <Reveal>
            <div className="section-head" style={{ marginBottom: 40 }}>
              <span className="eyebrow">Works with the clips you already share</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="source-row">
              <span className="source source--lg">
                <TikTokIcon />
                TikTok
              </span>
              <span className="source source--lg">
                <InstagramIcon />
                Instagram Reels
              </span>
              <span className="source source--lg">
                <YouTubeIcon />
                YouTube Shorts
              </span>
              <span className="source source--lg">
                <LinkIcon />
                Any link
              </span>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div style={{ marginTop: 56 }}>
              <MediaSlot
                id="demo-hero"
                label="Demo video · a reel becomes a rated watchlist"
                ratio="16 / 9"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* the claim band */}
      <section className="section scene--warm">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">The AI finds every film</span>
              <h2 className="display-2">
                Paste a reel.
                <br />
                Every film falls out.
              </h2>
              <p className="lead">
                Titles, years, and IMDb ratings, pulled straight from the clip.
              </p>
              <div className="claim-pills">
                <span className="pill">IMDb ratings</span>
                <span className="pill">release years</span>
                <span className="pill">the clip stays attached</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <FilmStrip />
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section className="section scene--bone" id="how">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">How it works</span>
              <h2 className="display-2" style={{ textWrap: "balance" }}>
                From the group chat
                <br className="brk-desktop" />
                to movie night.
              </h2>
            </div>
          </Reveal>
          <div className="steps">
            <Reveal className="step" delay={0}>
              <span className="step__num">01</span>
              <h3 className="h3">Share the clip</h3>
              <p className="body">Paste a reel, TikTok, or short. Or share it straight from the app.</p>
              <div className="step-vignette">
                <div className="demo-clip">
                  <span className="thumb" />
                  <span className="txt">
                    <span className="l1">tiktok.com/@filmtok…</span>
                    <span className="l2">shared by MK</span>
                  </span>
                </div>
              </div>
            </Reveal>
            <Reveal className="step" delay={120}>
              <span className="step__num">02</span>
              <h3 className="h3">The AI watches it</h3>
              <p className="body">It identifies every film in the clip and pulls each IMDb rating.</p>
              <div className="step-vignette">
                <span className="meta">3 films found</span>
                <div className="progress-rail">
                  <span className="progress-rail__fill" style={{ width: "100%" }} />
                </div>
              </div>
            </Reveal>
            <Reveal className="step" delay={240}>
              <span className="step__num">03</span>
              <h3 className="h3">Save to a shared list</h3>
              <p className="body">
                Everything lands on a shared list. Your friends see it instantly, and the clip stays
                attached.
              </p>
              <div className="step-vignette">
                <div className="demo-saved">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  saved to friday night club
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="section scene--paper" id="features">
        <div className="wrap">
          <div className="feature">
            <Reveal className="feature__copy">
              <div className="eyebrow">Built for the group chat</div>
              <h2 className="h2">Watchlists you build together.</h2>
              <p className="body" style={{ color: "var(--fg-soft)" }}>
                Add up to ten friends to any list. Everyone adds, everyone sees, so nothing gets lost
                in the group chat.
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                <span className="pill">Up to 10 people</span>
                <span className="pill">Real-time sync</span>
              </div>
            </Reveal>
            <Reveal className="feature__media" delay={120}>
              <MediaSlot id="feature-shared-list" label="App screenshot · shared list with members">
                <MockupSharedList />
              </MediaSlot>
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
              <MediaSlot id="feature-ratings" label="App screenshot · list with rating chips">
                <MockupRatings />
              </MediaSlot>
            </Reveal>
          </div>

          <div className="feature">
            <Reveal className="feature__copy">
              <div className="eyebrow">The clip stays attached</div>
              <h2 className="h2">Remember why you saved it.</h2>
              <p className="body" style={{ color: "var(--fg-soft)" }}>
                The reel that sold you stays with the film. Tap any card and it&apos;s right there.
              </p>
            </Reveal>
            <Reveal className="feature__media" delay={120}>
              <MediaSlot id="feature-clip-attached" label="App screenshot · film card with attached clip">
                <MockupClipAttached />
              </MediaSlot>
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
            <h2 className="display-2">Movies live on social now. Your watchlist doesn&apos;t.</h2>
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
      <section className="band section section--xl grain" id="try">
        <div className="wrap wrap--narrow" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 22 }}>
              Start your first list
            </div>
            <h2 className="display-2">Give it a try.</h2>
            <p className="lead" style={{ margin: "24px auto 0" }}>
              The web app is live and free. The iOS app is on its way.
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
