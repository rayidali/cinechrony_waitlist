"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A looping simulation of the hero flow: a reel gets pasted, the AI scans
 * it, and rated films land on a shared list. Runs on design tokens alone so
 * the hero looks finished before any real screen captures exist.
 *
 * The server renders the finished frame (phase 6) with no .demo-live class,
 * so no-JS visitors and crawlers see the complete scene. After hydration the
 * loop adds .demo-live and cycles phases; a pause control below the phone
 * satisfies WCAG 2.2.2, and prefers-reduced-motion never starts the loop.
 *
 * Poster art draws from the shared --pd-* duotone token set (see
 * globals.css) instead of inline gradients.
 */

const FILMS = [
  { name: "Whiplash", yr: "2014 · imdb 8.5", rating: "8.5", tone: "rating--good", pd: "pd-amber-rose" },
  { name: "Heat", yr: "1995 · imdb 8.3", rating: "8.3", tone: "rating--good", pd: "pd-teal-forest" },
  { name: "The Nice Guys", yr: "2016 · imdb 7.3", rating: "7.3", tone: "rating--mid", pd: "pd-rose-amber" },
];

// phase 0: blank · 1: clip appears · 2: scanning · 3-5: films land · 6: saved
const LOOP: Array<{ phase: number; hold: number }> = [
  { phase: 1, hold: 1400 },
  { phase: 2, hold: 1600 },
  { phase: 3, hold: 700 },
  { phase: 4, hold: 700 },
  { phase: 5, hold: 900 },
  { phase: 6, hold: 3200 },
  { phase: 0, hold: 900 },
];

export function PhoneDemo() {
  const [phase, setPhase] = useState(6);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;
    const step = (i: number) => {
      indexRef.current = i;
      setPhase(LOOP[i].phase);
      timerRef.current = setTimeout(() => step((i + 1) % LOOP.length), LOOP[i].hold);
    };
    timerRef.current = setTimeout(() => {
      setLive(true);
      step(indexRef.current);
    }, 600);
    return () => clearTimeout(timerRef.current);
  }, [paused]);

  const on = (p: number) => (phase >= p ? " demo-on" : "");

  return (
    <div>
      <div
        className="demo-phone"
        role="img"
        aria-label="Animated preview: a shared reel becomes three rated films on a shared watchlist"
      >
        <div className={live ? "demo-screen demo-live" : "demo-screen"} aria-hidden="true">
          <div className="demo-head">
            <span className="t">friday night club</span>
            <span className="demo-avatars">
              <span>RA</span>
              <span>MK</span>
              <span>JT</span>
            </span>
          </div>

          <div className={`demo-clip${on(1)}`}>
            <span className="thumb" />
            <span className="txt">
              <span className="l1">tiktok.com/@filmtok…</span>
              <span className="l2">shared by MK</span>
            </span>
          </div>

          <div className={`demo-scan${phase >= 2 && phase < 6 ? " demo-on" : ""}`}>
            <span>{phase < 3 ? "scanning clip" : "3 films found"}</span>
            <span className="bar" />
          </div>

          {FILMS.map((f, i) => (
            <div key={f.name} className={`demo-film${on(3 + i)}`}>
              <span className={`poster ${f.pd}`} />
              <span className="txt">
                <span className="name">{f.name}</span>
                <span className="yr">{f.yr}</span>
              </span>
              <span className={`rating ${f.tone}`}>{f.rating}</span>
            </div>
          ))}

          <div className={`demo-saved${on(6)}`}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            saved to friday night club
          </div>
        </div>
      </div>

      {live && (
        <button
          type="button"
          className="demo-pause"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? "play demo" : "pause demo"}
        </button>
      )}
    </div>
  );
}
