/**
 * Single source of truth for every external URL and launch flag.
 * Flip these as infrastructure lands; no page code needs to change.
 */

export const site = {
  name: "cinechrony",
  title: "cinechrony · the social movie watchlist",
  description:
    "Share a reel or TikTok. The AI pulls out every film with its IMDb rating and saves it to a watchlist you keep with friends.",
  url: "https://www.cinechrony.com",

  // The live product. Currently the PWA on Vercel; switch to
  // https://app.cinechrony.com once the subdomain split happens.
  appUrl: "https://movienight-kappa.vercel.app",

  supportEmail: "support@cinechrony.com",

  // Paste the TestFlight invite URL here when the beta opens.
  // While null, /beta shows the "opening soon" state and pushes to the waitlist.
  testflightUrl: null as string | null,

  // Loops newsletter form. Signups land in the existing Loops audience.
  waitlist: {
    endpoint:
      "https://app.loops.so/api/newsletter-form/cmk1swus4060d0i0fl3b686aj",
    mailingList: "cmk23xm1l0ugo0i1pfwfi2y8l",
  },

  legalUpdated: "02.07.26",
} as const;

/**
 * Media slots. Every screenshot or video the site wants lives here with a
 * stable id. While src is null the site renders a styled placeholder frame
 * carrying the slot id; drop the file in /public/media, set src, done.
 * ASSETS.md documents what to capture for each slot.
 */
export type MediaAsset = {
  src: string | null;
  kind: "image" | "video";
  alt: string;
};

export const media = {
  "demo-hero": {
    src: null,
    kind: "video",
    alt: "Screen capture: a reel becomes a rated watchlist in forty seconds",
  },
  "feature-shared-list": {
    src: null,
    kind: "image",
    alt: "App screenshot: a shared watchlist with member avatars",
  },
  "feature-ratings": {
    src: null,
    kind: "image",
    alt: "App screenshot: a list with rating chips on every film",
  },
  "feature-clip-attached": {
    src: null,
    kind: "image",
    alt: "App screenshot: a film card with the original clip attached",
  },
  "beta-phone": {
    src: null,
    kind: "image",
    alt: "App screenshot: the beta build running on an iPhone",
  },
} satisfies Record<string, MediaAsset>;
