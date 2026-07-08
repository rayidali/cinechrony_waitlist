import Link from "next/link";
import { Footer } from "@/components/footer";
import { MediaSlot } from "@/components/media-slot";
import { PhoneDemo } from "@/components/phone-demo";
import { ReelCard } from "@/components/reel-card";
import { Reveal } from "@/components/reveal";
import { FilmStrip } from "@/components/film-strip";
import { MockupSharedList, MockupRatings, MockupClipAttached } from "@/components/feature-mockups";
import { TikTokIcon, InstagramIcon, YouTubeIcon, LinkIcon } from "@/components/icons";
import { site } from "@/lib/site";

const MARQUEE_TITLES = [
  "whiplash",
  "heat",
  "parasite",
  "arrival",
  "the nice guys",
  "dune",
  "past lives",
  "knives out",
];

function MarqueeGroup() {
  return (
    <span className="marquee__group">
      {MARQUEE_TITLES.map((title) => (
        <span className="marquee__item" key={title}>
          {title}
          <span className="marquee__dot">·</span>
        </span>
      ))}
    </span>
  );
}

export default function LandingPage() {
  return (
    <>
    <main id="main">
      {/* hero: lobby daylight (projector beams, glow orbs) behind a single
          composed diorama -- the doomscroll, the AI catching it, the shared
          list with friends -- read left to right as one sentence */}
      <section className="section section--xl grain hero">
        <div className="hero-atmo" aria-hidden="true">
          <span className="hero-beam hero-beam--amber" />
          <span className="hero-beam hero-beam--red" />
          <span className="hero-orb hero-orb--amber floaty floaty--d1" />
          <span className="hero-orb hero-orb--red floaty floaty--d2" />
        </div>
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
            {/* the diorama: a single sentence, left to right --
                doomscroll -> the AI catches it -> a shared list with friends */}
            <div className="hero-diorama">
              <span className="stage-floor" aria-hidden="true" />

              {/* 1a: the doomscroll (STORY 1 source) */}
              <div className="diorama-reels" aria-hidden="true">
                <ReelCard handle="@moviebro" pd="pd-rose-amber" className="reel-card--back reel-card--back-b" />
                <ReelCard handle="@cinemaclips" pd="pd-teal-forest" className="reel-card--back reel-card--back-a" />
                <ReelCard handle="@filmtok" pd="pd-dusk-crimson" className="reel-card--front" />
                <span className="diorama-heart floaty floaty--d2">♡</span>
              </div>

              {/* 1b: the catch -- the AI step made visible */}
              <div className="diorama-flow" aria-hidden="true">
                <svg
                  className="diorama-flow__svg"
                  viewBox="0 0 220 160"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <defs>
                    <marker
                      id="hero-flow-arrowhead"
                      viewBox="0 0 10 10"
                      refX="7"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M0 0L10 5L0 10z" fill="var(--fg)" fillOpacity="0.35" />
                    </marker>
                  </defs>
                  <path
                    d="M4 128C64 46 148 40 214 80"
                    stroke="var(--fg)"
                    strokeOpacity="0.35"
                    strokeWidth="2"
                    strokeDasharray="5 7"
                    strokeLinecap="round"
                    markerEnd="url(#hero-flow-arrowhead)"
                  />
                </svg>
                <span className="diorama-flow__mobile-line" />
                <div className="scan-pill">
                  <div className="demo-scan demo-on">
                    <span>3 films found</span>
                    <span className="bar" />
                  </div>
                </div>
              </div>

              {/* 1c: the shared list (STORY 2) */}
              <div className="diorama-phone">
                <div className="hero-stage__center">
                  <PhoneDemo />
                </div>
                <div className="diorama-friends" aria-hidden="true">
                  <span className="friend-chip friend-chip--ra">RA</span>
                  <span className="friend-chip friend-chip--mk">MK</span>
                  <span className="friend-chip friend-chip--jt">JT</span>
                  <span className="friend-tick friend-tick--ra" />
                  <span className="friend-tick friend-tick--mk" />
                  <span className="friend-tick friend-tick--jt" />
                  <span className="friend-stamp friend-stamp--mk">mk added heat</span>
                  <span className="friend-stamp friend-stamp--jt">jt · worth it</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* screening room: source strip + demo video go full-bleed dark */}
      <section className="section--tight scene--screening grain" id="demo">
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
            {/* "one reel -> five rated films": a compact ReelCard + a dashed
                arrow lead into the existing strip. Kept here (not inside
                FilmStrip) so film-strip.tsx stays untouched -- the strip's
                own claim-strip wrapper just becomes a flex sibling. */}
            <div className="claim-row">
              <div className="claim-lead" aria-hidden="true">
                <ReelCard handle="@filmtok" pd="pd-dusk-crimson" compact />
                <span className="claim-arrow">
                  <svg
                    className="claim-arrow__svg"
                    viewBox="0 0 60 24"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 12h44"
                      stroke="var(--fg)"
                      strokeOpacity="0.35"
                      strokeWidth="2"
                      strokeDasharray="5 6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40 5l12 7-12 7"
                      stroke="var(--fg)"
                      strokeOpacity="0.35"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="claim-fill">
                <FilmStrip />
              </div>
            </div>
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
                From the group chat{" "}
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
              <div className="step-glow step-glow--blush">
                <div className="step-vignette">
                  <div className="demo-clip">
                    <span className="thumb" />
                    <span className="txt">
                      <span className="l1">tiktok.com/@filmtok…</span>
                      <span className="l2">shared by MK</span>
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal className="step" delay={120}>
              <span className="step__num">02</span>
              <h3 className="h3">The AI watches it</h3>
              <p className="body">It identifies every film in the clip and pulls each IMDb rating.</p>
              <div className="step-glow step-glow--amber">
                <div className="step-vignette">
                  <span className="meta">3 films found</span>
                  <div className="progress-rail">
                    <span className="progress-rail__fill" style={{ width: "100%" }} />
                  </div>
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
              <div className="step-glow step-glow--sagefield">
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
            <Reveal className="feature__media stage stage--blush" delay={120}>
              <span className="stage-stamp stage-stamp--1" aria-hidden="true">up to 10 friends</span>
              <MediaSlot
                id="feature-shared-list"
                label="App screenshot · shared list with members"
                className="stage-tilt--1"
              >
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
            <Reveal className="feature__media stage stage--sagefield" delay={120}>
              <span className="stage-stamp stage-stamp--2" aria-hidden="true">8.1 worth it</span>
              <MediaSlot
                id="feature-ratings"
                label="App screenshot · list with rating chips"
                className="stage-tilt--2"
              >
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
            <Reveal className="feature__media stage stage--dusk" delay={120}>
              <span className="stage-stamp stage-stamp--3" aria-hidden="true">the clip stays attached</span>
              <MediaSlot
                id="feature-clip-attached"
                label="App screenshot · film card with attached clip"
                className="stage-tilt--3"
              >
                <MockupClipAttached />
              </MediaSlot>
            </Reveal>
          </div>
        </div>
      </section>

      {/* our story */}
      <section className="story-section" id="story">
        <span className="story-orb" aria-hidden="true" />
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
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            <MarqueeGroup />
            <MarqueeGroup />
          </div>
        </div>
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
