import { media, type MediaId } from "@/lib/site";

/**
 * A person, cut out and pasted on the page.
 *
 * The drawn stickers next door are objects at the margins. These are the
 * opposite move: photographs of people, standing IN FRONT of the layout, * sitting on the calendar's own rules, leaning past the trim, throwing a
 * shadow onto the paper. That is the difference between a site with
 * pictures on it and a collage, and it is the one thing a rectangular
 * photograph in its own frame can never do, however well it is graded.
 *
 * Placement is by CSS class rather than a scene array, unlike the
 * stickers: a sticker kind appears in four scenes and earns the
 * indirection, while each of these appears exactly once and is positioned
 * against a specific rule of a specific block. `.cut--*` in globals.css is
 * where each one actually lives.
 *
 * Decoration throughout: aria-hidden, empty alt, pointer-events none.
 */
/**
 * One slice of the mural.
 *
 * These are not ten pictures. scripts/paint-mural.py paints ONE landscape
 * running from the top of the page to the bottom of the footer and cuts it
 * into a slice per band, so the bottom row of each is the top row of the
 * next. The order below is the order down the page and it is load-bearing:
 * move a band and its slice no longer joins its neighbours.
 *
 * The file is a CSS background rather than an <img>, and that is not a
 * style preference. Five of the slices need a second version for dark
 * mode, and only a background can be swapped by `[data-theme]`, so the
 * theme toggle is obeyed and exactly one of the pair is ever downloaded.
 * Two <img>s would fetch both and then hide one.
 *
 * It is also why there is no `media` entry and no src here: an empty span
 * is the whole component, and everything true about these sits in
 * globals.css next to the URLs, and scripts/paint-mural.py is the press.
 * Each slice's colours are checked against the ink of its own band before
 * it is written, so a picture nobody could read is a build failure.
 */
export type SceneId =
  | "sky" //     hero: flat blue, almost all sky, the crest at the foot
  | "hedge" //   the marquee strip: a hedgerow, no sky at all
  | "shade" //   the crew wall: deep spruce, three ridges receding
  | "field" //   the grab: the reference itself, and the one car on the page
  | "sunset" //  the poster: the day turns here
  | "meadow" //  what it does: wildflowers, the tallest band on the page
  | "dusk" //    movie night: indigo, a moon that stays round
  | "lake" //    the year: ridges receding, water holding the light
  | "night" //   the close: deepest point of the walk
  | "dawn"; //   the footer: first light, and the walk ends where it began

export function BandScene({ id }: { id: SceneId }) {
  return <span className={`scene scene--${id}`} aria-hidden="true" />;
}

export function Cutout({
  id,
  className = "",
  /** rendered height in px; the width follows the silhouette */
  h,
  rotate = 0,
  /** true for the ones above the fold: the rest can wait */
  eager = false,
}: {
  id: MediaId;
  className?: string;
  h: number;
  rotate?: number;
  eager?: boolean;
}) {
  const shot = media[id];
  if (!shot.src) return null;
  return (
    <span
      className={`cut ${className}`.trim()}
      aria-hidden="true"
      style={{ "--cut-h": `${h}px`, "--cut-rot": `${rotate}deg` } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={shot.src} alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
    </span>
  );
}
