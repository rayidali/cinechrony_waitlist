import Link from "next/link";
import { Cutout } from "@/components/cutouts";
import { Footer } from "@/components/footer";
import { Frame } from "@/components/frame";
import { PosterGrid } from "@/components/poster-grid";
import { Reveal } from "@/components/reveal";
import { Stub } from "@/components/stub";
import { Stickers } from "@/components/stickers";
import { Ticker } from "@/components/ticker";
import { TikTokIcon, InstagramIcon, YouTubeIcon, LinkIcon } from "@/components/icons";
import { media, site } from "@/lib/site";

/**
 * The landing page, cut to the bone.
 *
 * v3 explained itself: seven paragraphs, a three-paragraph founder essay, a
 * body of copy under every headline. The references it was built against do
 * none of that — Corner and Rodeo say four or five words and then show you
 * something. Words are the thing a visitor skips, and every paragraph here
 * was arguing for a product that was sitting right next to it in a
 * screenshot, already making the same case better.
 *
 * So the page went from ~700 words to under 120. What replaced them is not
 * white space, it is pictures: six photographs of people in rooms, which is
 * the argument the essay was trying to make in prose.
 *
 * Two rules survive from v3. Colour is a field with a hard edge, never a
 * glow that bleeds. And the product is shown, never drawn — every
 * screenshot is a real capture of the shipped app.
 */

/* the crew wall. Frame numbers run like a contact sheet, odd numbers with
   an A, because that is how a strip of 35mm is actually numbered. Ten
   frames across two rows: rooftop screenings, a garden projector, a red
   cinema, and the people in front of all of it. */
const CREW = [
  { id: "crew-1", n: "9a" },
  { id: "crew-7", n: "10" },
  { id: "crew-3", n: "10a" },
  { id: "crew-8", n: "11" },
  { id: "crew-5", n: "11a" },
  { id: "crew-2", n: "12" },
  { id: "crew-9", n: "12a" },
  { id: "crew-4", n: "13" },
  { id: "crew-10", n: "13a" },
  { id: "crew-6", n: "14" },
] as const;

export default function LandingPage() {
  const beta = site.testflightUrl;
  const still = media["poster-still"].src;

  return (
    <>
      <main id="main">
        {/* ---------------- hero: the diary, at poster scale ---------------- */}
        {/* cut-band: on one column the camcorder leans past the right trim,
            and a figure hanging off the SIDE would otherwise widen the page
            by its own overhang — 32px of horizontal scroll on a phone, which
            reads as a broken layout rather than as a bleed */}
        <section className="band band--paper hero cut-band">
          <Stickers scene="hero" />
          <div className="hero-shell">
            <div className="hero-layout">
              <Reveal className="hero-copy">
                <span className="label label--red" style={{ marginBottom: 26 }}>
                  est. 2026 · iphone + web
                </span>
                <h1 className="d1">
                  share the reel.
                  <br />
                  keep the <em>film.</em>
                </h1>
                <p className="hero-sub">your group chat&rsquo;s watchlist, finally in one place.</p>
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
                <span className="label hero-note">free · testflight, then the app store</span>
              </Reveal>

              <Reveal delay={120} className="hero-grid-col">
                <PosterGrid />
                {/* Pasted ON the calendar, not printed under it. A wide
                    photograph in its own frame sat here first and was a
                    picture NEXT TO the design however it was cropped; a
                    figure with the background lifted out stands in front
                    of the grid, breaks its left rule, and throws a shadow
                    on the paper. Same photography, opposite relationship
                    to the page. */}
                <Cutout id="cut-camcorder" className="cut--camcorder" h={360} rotate={-3} eager />
                <Cutout id="cut-popcorn" className="cut--popcorn" h={150} rotate={10} eager />
              </Reveal>
            </div>
          </div>
        </section>

        {/* the marquee, built as one: chasing bulbs above and below the
            running titles, and a house board set into the left */}
        <section className="band band--marigold marquee-band">
          <span className="bulbs bulbs--top" aria-hidden="true" />
          <span className="now-showing">now showing</span>
          <Ticker />
          <span className="bulbs bulbs--bottom" aria-hidden="true" />
        </section>

        {/* ---------------- reel 01 · the crew wall ----------------
            Where the founder essay used to be. Six photographs make the
            same argument in about a second, and without asking anyone to
            read three paragraphs about how films are better with people. */}
        <section className="band band--rust section" id="story">
          <span className="rays" aria-hidden="true" />
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">reel 01 · the point</span>
              </div>
              <div className="crew-head">
                <p className="retro">
                  the film was never the hard part.
                  <br />
                  <em>keeping hold of it was.</em>
                </p>
                <p className="story__sign">rayid · cinechrony</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div className="crew-strip">
              {CREW.map(({ id, n }) => {
                const shot = media[id];
                if (!shot.src) return null;
                return (
                  <figure className="crew-shot" key={id}>
                    <div className="crew-shot__plate">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={shot.src} alt={shot.alt} loading="lazy" />
                    </div>
                    <figcaption className="crew-shot__n">{n}</figcaption>
                  </figure>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* ---------------- reel 02 · the grab ---------------- */}
        <section className="band band--ochre section cut-band" id="how">
          <Stickers scene="grab" />
          {/* Sitting on the seam. The stickers next door are clipped by the
              band edge so they read as pasted onto ONE sheet; these are
              deliberately not, because a photograph taped across two sheets
              is the older and better collage move — and it is the only
              thing on the page that treats the bands as physical. */}
          <Cutout id="cut-legs" className="cut--legs" h={158} rotate={3} />
          <Cutout id="cut-camera" className="cut--camera" h={230} rotate={-8} />
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">reel 02 · the grab</span>
              </div>
              <h2 className="d2">
                one reel in.
                <br />
                every film <em>out.</em>
              </h2>
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
                  <p className="label">from any share sheet</p>
                </div>
                <div className="beat">
                  <span className="num">02</span>
                  <h3 className="h3">it watches</h3>
                  <p className="label">audio, text, footage</p>
                </div>
                <div className="beat">
                  <span className="num">03</span>
                  <h3 className="h3">it stays</h3>
                  <p className="label">no list required</p>
                </div>
              </div>
            </Reveal>

            {/* Everything that sat under the three beats is gone: the
                "keep it now, file it whenever" aside (beat 03 says it in
                three words), the empty demo plate, and now the scan
                capture too — the owner is shooting something better for
                this spot. What is left is a headline, four sources and
                three beats, and it reads faster without any of it.
                `app-grab` stays registered in `media` and ASSETS.md names
                this as the open slot. */}
          </div>
        </section>

        {/* ---------------- the poster ---------------- */}
        <section className="band band--red section--xl poster-band">
          {still ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="poster-band__still" src={still} alt="" loading="lazy" />
          ) : null}
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
            </Reveal>
          </div>
        </section>

        {/* ---------------- reel 03 · what it does ---------------- */}
        <section className="band band--rose section" id="features">
          <div className="wrap">
            <Reveal>
              <div className="marker">
                <span className="label">reel 03 · what it does</span>
              </div>
            </Reveal>

            <div className="rows">
              <Reveal className="row">
                <div className="row__copy">
                  <span className="row__idx">the diary</span>
                  <h2 className="d3">
                    it fills in as you <em>watch</em>.
                  </h2>
                  <div className="chips">
                    <span className="pill">no points</span>
                    <span className="pill">no streaks</span>
                  </div>
                </div>
                <div className="row__media">
                  <Frame id="app-diary" caption="the diary" note="august" ratio="4 / 5" offset />
                </div>
              </Reveal>

              <Reveal className="row row--flip">
                <div className="row__copy">
                  <span className="row__idx">shared lists</span>
                  <h2 className="d3">
                    one list. <em>everyone adds.</em>
                  </h2>
                  <div className="chips">
                    <span className="pill">up to 10 people</span>
                    <span className="pill">live</span>
                  </div>
                </div>
                <div className="row__media">
                  {/* focus, not the default `center top`: the top of this
                      capture is the list header, and a row headlined "one
                      list, everyone adds" needs the FILMS in frame */}
                  <Frame
                    id="app-list"
                    caption="date night"
                    note="five films in"
                    ratio="4 / 5"
                    focus="center 34%"
                    offset
                  />
                </div>
              </Reveal>

              <Reveal className="row">
                <div className="row__copy">
                  <span className="row__idx">the clip</span>
                  <h2 className="d3">
                    the clip <em>comes with it.</em>
                  </h2>
                  <div className="chips">
                    <span className="pill">imdb rating</span>
                    <span className="pill">where to watch</span>
                  </div>
                </div>
                <div className="row__media">
                  <Frame
                    id="app-film"
                    caption="the clip that did it"
                    note="still attached"
                    ratio="4 / 5"
                    focus="center 46%"
                    offset
                  />
                  {/* the VHS on-screen display came off: it was pale cyan
                      pinned to the plate's top-left, which on the re-shot
                      capture is white app chrome — invisible. And the
                      capture now contains a real play button on a real
                      clip, so a fake one over the top of it was competing
                      with the thing it was pretending to be. */}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- movie night ---------------- */}
        <section className="band band--blue section cut-band">
          <Stickers scene="night" />
          <Cutout id="cut-bench" className="cut--bench" h={206} rotate={-1} />
          <div className="wrap">
            <div className="night">
              <Reveal className="night__copy">
                <span className="label" style={{ marginBottom: 22 }}>
                  reel 04 · movie night
                </span>
                <h2 className="d2">
                  pick a night. <em>everyone knows.</em>
                </h2>
                <div className="chips" style={{ marginTop: 24 }}>
                  <span className="pill">guests need no account</span>
                  <span className="pill">one reminder</span>
                </div>
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
                  <span className="label">reel 05 · the year</span>
                </div>
                <h2 className="d2">
                  a year you can <em>look at.</em>
                </h2>
              </Reveal>
              <Reveal delay={120} className="year__shot">
                <Frame
                  id="app-year"
                  caption="the year grid"
                  note="one read, no scan"
                  ratio="4 / 5"
                  focus="center 62%"
                  offset
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- the close ---------------- */}
        <section className="band band--aura section--xl" id="try">
          <Stickers scene="close" />
          <span className="seats" aria-hidden="true" />
          <div className="wrap center">
            <Reveal>
              <span className="label" style={{ marginBottom: 26 }}>
                start with one reel
              </span>
              <h2 className="d2">
                stop losing the <em>film.</em>
              </h2>
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
                iphone · testflight app needed first
              </span>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
