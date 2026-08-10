import Link from "next/link";
import { Footer } from "@/components/footer";
import { Frame } from "@/components/frame";
import { PosterGrid } from "@/components/poster-grid";
import { Reveal } from "@/components/reveal";
import { Stub } from "@/components/stub";
import { Stickers } from "@/components/stickers";
import { Ticker } from "@/components/ticker";
import { TikTokIcon, InstagramIcon, YouTubeIcon, LinkIcon } from "@/components/icons";
import { site } from "@/lib/site";

/**
 * The landing page, composed as a printed sheet.
 *
 * Two rules run through all of it. First, colour is a flat field with a hard
 * edge, never an ambient glow: each band is one solid stock, grained like a
 * press run, and it ends where the next one starts. Second, the product is
 * shown, never drawn. Every screenshot here is a real capture of the shipped
 * app, the same set that went to App Store Connect.
 */
export default function LandingPage() {
  const beta = site.testflightUrl;

  return (
    <>
      <main id="main">
        {/* ---------------- hero: the diary, at poster scale ---------------- */}
        <section className="band band--paper hero">
          <Stickers scene="hero" />
          <div className="hero-shell">
            <div className="hero-layout">
              <Reveal className="hero-copy">
                <span className="label label--red" style={{ marginBottom: 26 }}>
                  est. 2026 · iphone and web
                </span>
                <h1 className="d1">
                  share the reel.
                  <br />
                  keep the film.
                </h1>
                <p className="hero-sub">
                  you find films while scrolling. this is where they stop disappearing.
                </p>
                <div className="cta-row">
                  {beta ? (
                    <a className="btn btn--accent btn--lg" href={beta} target="_blank" rel="noopener">
                      get the ios beta
                    </a>
                  ) : (
                    <Link className="btn btn--accent btn--lg" href="/waitlist">
                      join the waitlist
                    </Link>
                  )}
                  <a className="link-quiet" href={site.appUrl} target="_blank" rel="noopener">
                    or open it in a browser
                  </a>
                </div>
                <span className="label hero-note">
                  free while we&rsquo;re in beta · testflight, then the app store
                </span>
              </Reveal>

              <Reveal delay={120} className="hero-grid-col">
                <PosterGrid />
              </Reveal>
            </div>
          </div>
        </section>

        {/* the marquee, as a cinema marquee: flat, mono, edge to edge */}
        <section className="band band--ink">
          <Ticker />
        </section>

        {/* ---------------- 01 · the grab ---------------- */}
        <section className="band band--paper section" id="how">
          <Stickers scene="grab" />
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">01 · the grab</span>
              </div>
              <div className="grab-head">
                <h2 className="d2">
                  one reel in.
                  <br />
                  every film out.
                </h2>
                <p className="body">
                  Send a clip the way you&rsquo;d send it to a friend. Cinechrony watches the whole
                  thing, reads the audio and the on-screen text as well as the footage, and comes
                  back with every film it actually found. Titles, years, IMDb ratings, and an honest
                  note when it is not certain.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="sources">
                <span className="source">
                  <TikTokIcon /> tiktok
                </span>
                <span className="source">
                  <InstagramIcon /> instagram reels
                </span>
                <span className="source">
                  <YouTubeIcon /> youtube shorts
                </span>
                <span className="source">
                  <LinkIcon /> any link
                </span>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="beats">
                <div className="beat">
                  <span className="num">01</span>
                  <h3 className="h3">share it</h3>
                  <p className="body">
                    From the share sheet, or paste the link. Nothing to set up first.
                  </p>
                </div>
                <div className="beat">
                  <span className="num">02</span>
                  <h3 className="h3">it watches</h3>
                  <p className="body">
                    Every film in the clip, matched to a real record so the rating comes with it.
                  </p>
                </div>
                <div className="beat">
                  <span className="num">03</span>
                  <h3 className="h3">it stays</h3>
                  <p className="body">
                    Kept without being filed. Put it on a list later, or never.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="grab-proof">
                <Frame
                  id="app-grab"
                  caption="five films, one reel"
                  note="real capture · august 2026"
                  ratio="4 / 5"
                  className="grab-proof__shot"
                  offset
                />
                <div className="grab-proof__aside">
                  <span className="stamp stamp--red">no list required</span>
                  <p className="body">
                    A first-time user sharing a reel used to be stopped and asked to name a list at
                    the exact moment the app first did something useful. It isn&rsquo;t any more.
                    Keep it now, file it whenever.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <Frame
                id="demo-hero"
                ratio="16 / 9"
                caption="the demo film · forty seconds, one take"
                note="sound off"
                className="demo-film"
              >
                <span className="demo-film__play" aria-hidden="true">
                  <span className="play" />
                </span>
              </Frame>
            </Reveal>
          </div>
        </section>

        {/* ---------------- the poster ---------------- */}
        <section className="band band--red section--xl poster-band">
          <Stickers scene="poster" />
          <div className="wrap center">
            <Reveal>
              <span className="label" style={{ marginBottom: 30 }}>
                found on a tuesday
              </span>
              <p className="poster-line">
                and it&rsquo;s still there
                <br />
                <em>on friday.</em>
              </p>
              <span className="label" style={{ marginTop: 34 }}>
                the whole product, in one sentence
              </span>
            </Reveal>
          </div>
        </section>

        {/* ---------------- 02 · what it does ---------------- */}
        <section className="band band--paper section" id="features">
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">02 · what it does</span>
              </div>
            </Reveal>

            <div className="rows">
              <Reveal className="row">
                <div className="row__copy">
                  <span className="row__idx">the diary</span>
                  <h2 className="d3">it fills in as you watch.</h2>
                  <p className="body">
                    A real month, not a feed. A poster lands on the day you watched something, a
                    tint on the days you grabbed one, a red dot on the nights you had people round.
                    Three marks, three meanings, nothing blended into a score.
                  </p>
                  <div className="chips">
                    <span className="pill">no points</span>
                    <span className="pill">no streak shaming</span>
                  </div>
                </div>
                <div className="row__media">
                  <Frame id="app-diary" caption="the diary" note="august" ratio="4 / 5" offset />
                </div>
              </Reveal>

              <Reveal className="row row--flip">
                <div className="row__copy">
                  <span className="row__idx">shared lists</span>
                  <h2 className="d3">a list your friends can add to.</h2>
                  <p className="body">
                    Up to ten people on a list, everyone adding, everyone seeing it the moment it
                    lands. The thing that dies in a group chat is a link nobody saved. This is where
                    it goes instead.
                  </p>
                  <div className="chips">
                    <span className="pill">up to 10 people</span>
                    <span className="pill">live</span>
                  </div>
                </div>
                <div className="row__media">
                  <Frame id="app-list" caption="a shared list" note="with a night planned" ratio="4 / 5" offset />
                </div>
              </Reveal>

              <Reveal className="row">
                <div className="row__copy">
                  <span className="row__idx">the clip</span>
                  <h2 className="d3">you remember why you saved it.</h2>
                  <p className="body">
                    The reel that sold you stays attached to the film. Six weeks later, when the
                    title on its own means nothing, the clip is still there to remind you.
                  </p>
                  <div className="chips">
                    <span className="pill">imdb rating</span>
                    <span className="pill">where to watch</span>
                  </div>
                </div>
                <div className="row__media">
                  <Frame id="app-film" caption="a film, opened" note="clip attached" ratio="4 / 5" offset />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- movie night ---------------- */}
        <section className="band band--blue section">
          <Stickers scene="night" />
          <div className="wrap">
            <div className="night">
              <Reveal className="night__copy">
                <span className="label" style={{ marginBottom: 22 }}>
                  03 · movie night
                </span>
                <h2 className="d2">pick a night. everyone knows.</h2>
                <p className="body" style={{ marginTop: 20 }}>
                  A film on a shared list becomes a plan: one film, one time, up to nine other
                  people, one reminder that actually arrives. Guests do not need an account, and
                  the morning after it asks how it went, which is the only way a watchlist ever
                  becomes a record.
                </p>
              </Reveal>
              <Reveal delay={120} className="night__stub">
                <Stub
                  title="past lives"
                  when="fri 14.08"
                  where="mine, the big telly"
                  going="three going, two thinking"
                  seats={5}
                  filled={3}
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- the year ---------------- */}
        <section className="band band--forest section">
          <div className="wrap">
            <div className="year">
              <Reveal className="year__copy">
                <div className="marker">
                  <span className="label">04 · the year</span>
                </div>
                <h2 className="d2">a year you can look at.</h2>
                <p className="body" style={{ marginTop: 20 }}>
                  Every day of the year, filling in behind you. It is a mirror rather than a
                  scoreboard, so there is nothing to game and nothing to lose. The streak is
                  measured in weeks, because a film is two hours and a daily streak on a hobby is a
                  punishment schedule.
                </p>
                <p className="label" style={{ marginTop: 26, maxWidth: "34ch", lineHeight: 1.7 }}>
                  the grid at the top of this page is the same grid. we did not draw it for the
                  website.
                </p>
              </Reveal>
              <Reveal delay={120} className="year__shot">
                <Frame id="app-year" caption="the year grid" note="one read, no scan" ratio="4 / 5" focus="center 62%" offset />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- the story ---------------- */}
        <section className="band band--paper section" id="story">
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">05 · why</span>
              </div>
            </Reveal>
            <div className="story">
              <Reveal>
                <h2 className="d2">films live on social now. the place you keep them didn&rsquo;t.</h2>
                <div className="story__orb orb" aria-hidden="true" />
              </Reveal>
              <Reveal delay={120}>
                <p className="story__p">
                  Almost everyone finds their next film the same way now. A reel at eleven at night,
                  a TikTok someone sends to the group chat, a screen recording with no title on it.
                  You think, that one. Then you keep scrolling, and by morning it is gone.
                </p>
                <p className="story__pull">
                  The film was never the hard part. Keeping hold of it was.
                </p>
                <p className="story__p">
                  So cinechrony starts where the loss happens: at the share sheet, thirty seconds
                  after you saw it, before you have decided anything. It keeps the film without
                  asking you to file it, keeps the clip so you remember why, and puts the whole
                  thing somewhere your friends can reach. Then, on a Friday, it is still there.
                </p>
                <p className="story__sign">rayid · cinechrony</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- the close ---------------- */}
        <section className="band band--aura section--xl" id="try">
          <Stickers scene="close" />
          <div className="wrap center">
            <Reveal>
              <span className="label" style={{ marginBottom: 26 }}>
                start with one reel
              </span>
              <h2 className="d2">stop losing the film.</h2>
              <p className="lead" style={{ marginTop: 24, marginInline: "auto" }}>
                The iOS beta is open on TestFlight, and the web app works right now in any browser.
                Both are free.
              </p>
              <div className="cta-row" style={{ justifyContent: "center" }}>
                {beta ? (
                  <a className="btn btn--accent btn--lg" href={beta} target="_blank" rel="noopener">
                    get the ios beta
                  </a>
                ) : (
                  <Link className="btn btn--accent btn--lg" href="/waitlist">
                    join the waitlist
                  </Link>
                )}
                <a className="btn btn--lg" href={site.appUrl} target="_blank" rel="noopener">
                  open the web app
                </a>
              </div>
              <span className="label" style={{ marginTop: 22 }}>
                iphone · you&rsquo;ll need apple&rsquo;s testflight app first, it takes two minutes
              </span>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
