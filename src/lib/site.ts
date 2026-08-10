/**
 * Single source of truth for every external URL and launch flag.
 * Flip these as infrastructure lands; no page code needs to change.
 */

export const site = {
  name: "cinechrony",
  title: "cinechrony · keep the films you find scrolling",
  description:
    "You find films while scrolling. Share the reel and cinechrony pulls out every film in it, keeps it, and puts it on a list you share with friends.",
  url: "https://www.cinechrony.com",

  // The live product. Currently the PWA on Vercel; switch to
  // https://app.cinechrony.com once the subdomain split happens.
  appUrl: "https://movienight-kappa.vercel.app",

  supportEmail: "support@cinechrony.com",

  // The public TestFlight link. Live since 2026-07-21, capped at 150.
  // This sat null for nineteen days while the beta was open and empty,
  // so /beta told every visitor it had not started yet.
  testflightUrl: "https://testflight.apple.com/join/CRPFhKen" as string | null,

  // Loops newsletter form. Signups land in the existing Loops audience.
  waitlist: {
    endpoint:
      "https://app.loops.so/api/newsletter-form/cmk1swus4060d0i0fl3b686aj",
    mailingList: "cmk23xm1l0ugo0i1pfwfi2y8l",
  },

  legalUpdated: "02.07.26",
} as const;

/**
 * Media slots. Every screenshot, photograph or video the site wants lives
 * here with a stable id. While `src` is null the site renders a designed
 * placeholder carrying the slot id; drop the file in /public/media, set
 * src, done. ASSETS.md documents what to capture for each slot.
 *
 * The five app-* slots are REAL — they are the same captures that went to
 * App Store Connect, so the site shows the shipped product rather than a
 * drawing of it. What is still open is photography and the demo film.
 */
export type MediaAsset = {
  src: string | null;
  kind: "image" | "video";
  alt: string;
};

export const media = {
  /* ---- real product captures (live) ---- */
  "app-grab": {
    src: "/media/app-grab.webp",
    kind: "image",
    alt: "The scan result: five films pulled out of one reel, each with its IMDb rating and a strong-match tag",
  },
  "app-diary": {
    src: "/media/app-diary.webp",
    kind: "image",
    alt: "The diary: a month calendar filling in with film posters on the days you watched",
  },
  "app-list": {
    src: "/media/app-list.webp",
    kind: "image",
    alt: "A shared list with a movie night planned at the top",
  },
  "app-film": {
    src: "/media/app-film.webp",
    kind: "image",
    alt: "A film open in the drawer, with the clip that found it still attached",
  },
  "app-year": {
    src: "/media/app-year.webp",
    kind: "image",
    alt: "The year grid: every day of the year, filling in as you watch",
  },

  /* ---- the demo film (owner capture, see ASSETS.md) ---- */
  "demo-hero": {
    src: null,
    kind: "video",
    alt: "Screen capture: a reel becomes a saved, rated list in forty seconds",
  },

  /* ---- photography ----------------------------------------------------
     Six squares in the hero calendar's film cells, six portraits in the
     crew wall, one wide still behind the friday poster. Every one of them
     is pushed through ONE film curve (lifted blacks, warm highlights,
     cool shadows, 0.9 saturation) by scripts/grade-photos.py, and that
     pass is what stops thirteen photographs by thirteen photographers
     reading as a stock library. Swap any file and re-run the script; a
     photograph dropped in ungraded will stick out immediately.

     These are placeholders in the sense that matters: they are the right
     photographs of the wrong people. Real cinechrony nights, shot on a
     real camera, beat them on every axis including the legal one. */
  "grid-1": { src: "/media/grid-1.webp", kind: "image", alt: "" },
  "grid-2": { src: "/media/grid-2.webp", kind: "image", alt: "" },
  "grid-3": { src: "/media/grid-3.webp", kind: "image", alt: "" },
  "grid-4": { src: "/media/grid-4.webp", kind: "image", alt: "" },
  "grid-5": { src: "/media/grid-5.webp", kind: "image", alt: "" },
  "grid-6": { src: "/media/grid-6.webp", kind: "image", alt: "" },

  /* ---- the crew wall: the band that replaced 180 words of essay ---- */
  "crew-1": { src: "/media/crew-1.webp", kind: "image", alt: "A group of friends outside at golden hour, shot on film" },
  "crew-2": { src: "/media/crew-2.webp", kind: "image", alt: "Friends piled together for a flash photo" },
  "crew-3": { src: "/media/crew-3.webp", kind: "image", alt: "Three friends pulling faces at a disposable camera" },
  "crew-4": { src: "/media/crew-4.webp", kind: "image", alt: "Two people holding each other, watching the sun go down" },
  "crew-5": { src: "/media/crew-5.webp", kind: "image", alt: "A room full of people at a small gig" },
  "crew-6": { src: "/media/crew-6.webp", kind: "image", alt: "Two friends in sunglasses, grainy film frame" },

  /* ---- the full-bleed photograph behind the friday poster ---- */
  "poster-still": {
    src: "/media/poster-still.webp",
    kind: "image",
    alt: "",
  },
} satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof media;
