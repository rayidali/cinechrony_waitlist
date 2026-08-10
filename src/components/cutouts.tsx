import { media, type MediaId } from "@/lib/site";

/**
 * A person, cut out and pasted on the page.
 *
 * The drawn stickers next door are objects at the margins. These are the
 * opposite move: photographs of people, standing IN FRONT of the layout —
 * sitting on the calendar's own rules, leaning past the trim, throwing a
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
export function Cutout({
  id,
  className = "",
  /** rendered height in px; the width follows the silhouette */
  h,
  rotate = 0,
  /** true for the ones above the fold — the rest can wait */
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
