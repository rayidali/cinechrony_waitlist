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
 * The five app-* slots are REAL. They are the same captures that went to
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
  /* Re-shot 2026-08-10. The old app-list was cropped to the header, so the
     row headlined "one list, everyone adds" sat above a picture with no
     films in it; and the old app-film was captioned "clip attached" and
     contained no clip, because NO film on the demo account had a
     socialLink: the block had never rendered on that account and could
     not have. Both fixed at the source (scripts/dress-demo-for-site.tmp.ts)
     rather than by re-cropping a shot of the wrong thing. */
  "app-list": {
    src: "/media/app-list.webp",
    kind: "image",
    alt: "A shared list called date night: a movie night pinned at the top and five film posters below it",
  },
  "app-film": {
    src: "/media/app-film.webp",
    kind: "image",
    alt: "A film open in the drawer, showing the clip that found it with play and open-in-Instagram buttons",
  },
  "app-year": {
    src: "/media/app-year.webp",
    kind: "image",
    alt: "The year grid: every day of the year, filling in as you watch",
  },

  /* The `demo-hero` video slot was removed with the plate that held it.
     A 16:9 black rectangle captioned AWAITING CAPTURE is a placeholder
     advertising its own absence, and it sat on the one screen that has to
     feel finished. If the film gets shot, the slot and the film frame come
     back together. Both are one commit away in the history. */

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
  "grid-7": { src: "/media/grid-7.webp", kind: "image", alt: "" },
  "grid-8": { src: "/media/grid-8.webp", kind: "image", alt: "" },
  "grid-9": { src: "/media/grid-9.webp", kind: "image", alt: "" },
  "grid-10": { src: "/media/grid-10.webp", kind: "image", alt: "" },
  "grid-11": { src: "/media/grid-11.webp", kind: "image", alt: "" },

  /* ---- the crew wall: the band that replaced 180 words of essay ---- */
  "crew-1": { src: "/media/crew-1.webp", kind: "image", alt: "A group of friends outside at golden hour, shot on film" },
  "crew-2": { src: "/media/crew-2.webp", kind: "image", alt: "Friends piled together for a flash photo" },
  "crew-3": { src: "/media/crew-3.webp", kind: "image", alt: "Three friends pulling faces at a disposable camera" },
  "crew-4": { src: "/media/crew-4.webp", kind: "image", alt: "Two people holding each other, watching the sun go down" },
  "crew-5": { src: "/media/crew-5.webp", kind: "image", alt: "A room full of people at a small gig" },
  "crew-6": { src: "/media/crew-6.webp", kind: "image", alt: "Two friends in sunglasses, grainy film frame" },
  "crew-7": { src: "/media/crew-7.webp", kind: "image", alt: "An open-air cinema filling up at blue hour" },
  "crew-8": { src: "/media/crew-8.webp", kind: "image", alt: "Two people watching a projector in a garden under string lights" },
  "crew-9": { src: "/media/crew-9.webp", kind: "image", alt: "Two friends posing for a flash photo indoors" },
  "crew-10": { src: "/media/crew-10.webp", kind: "image", alt: "Two friends at night, one shooting back at the camera" },

  /* THE MURAL IS NOT REGISTERED HERE, and that is deliberate. It is one
     painted landscape running the whole page, cut into a slice per band,
     it carries no meaning (empty alt, aria-hidden), and five of its
     slices need a second file for dark mode. A CSS background handles all
     three: `[data-theme="dark"]` swaps the file so a manual theme toggle
     is obeyed, and only the one file the reader can actually see is ever
     downloaded. An <img> pair would fetch both. The slices live in
     globals.css under THE MURAL, and scripts/paint-mural.py paints them.

     `poster-still` below is still registered and is no longer on the
     page: the mural is the picture on that band now, and a photograph
     multiplied over a painted sunset is mud. Benched, like crew-4/5/9. */

  /* ---- the cutouts -----------------------------------------------------
     People lifted out of their photographs and pasted ON the layout: they
     sit on the calendar's rules, lean past the trim, and cast a shadow on
     the paper. A rectangle of photograph is a picture NEXT TO a design; a
     figure with no background is part of it, which is the whole reason the
     wide strip that used to sit under the calendar never worked no matter
     how it was cropped or graded.

     Made in two steps, both in scripts/: cutout.swift lifts the figure with
     Vision's subject segmentation, make-cutouts.py grades it through the
     same film curve as every other photograph here and gives it the white
     die-cut trim. Alt text is empty on all of them and the layer is
     aria-hidden. They are decoration, and a screen reader reading out six
     descriptions of strangers before the headline would be worse than
     silence. */
  "cut-camcorder": {
    src: "/media/cut-camcorder.webp",
    kind: "image",
    alt: "",
  },
  "cut-legs": { src: "/media/cut-legs.webp", kind: "image", alt: "" },
  "cut-popcorn": { src: "/media/cut-popcorn.webp", kind: "image", alt: "" },
  "cut-camera": { src: "/media/cut-camera.webp", kind: "image", alt: "" },
  "cut-bench": { src: "/media/cut-bench.webp", kind: "image", alt: "" },

  /* ---- the full-bleed photograph behind the friday poster ---- */
  "poster-still": {
    src: "/media/poster-still.webp",
    kind: "image",
    alt: "",
  },
} satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof media;
