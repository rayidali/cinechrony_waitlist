import type { CSSProperties, ReactNode } from "react";
import { media, type MediaAsset, type MediaId } from "@/lib/site";

/**
 * A frame is a printed plate: a hard 1.5px rule, no radius, no soft shadow,
 * and a mono caption underneath the way a photograph is captioned in print.
 *
 * v2 presented every screenshot as a tilted card floating on a coloured
 * glow. That is the move that made the page read as a pitch deck. A plate
 * with a caption reads as a magazine, and it also tells the truth: this is
 * a photograph of the product, not the product.
 *
 * A slot with no file yet renders a hatched empty plate carrying its own id
 * rather than pretending. ASSETS.md says what to capture.
 */
export function Frame({
  id,
  caption,
  note,
  ratio,
  focus,
  offset = false,
  className = "",
  style,
  children,
}: {
  id: MediaId;
  /** the mono line under the plate, left side */
  caption?: string;
  /** the mono line under the plate, right side */
  note?: string;
  /** aspect-ratio for the plate, e.g. "16 / 9" */
  ratio?: string;
  /**
   * object-position for a cropped plate. A phone capture is 1:2.2, so
   * printing it whole next to a paragraph leaves half a column of dead
   * paper; a magazine crops to the part that carries the point instead.
   */
  focus?: string;
  /** adds the hard printed offset behind the plate */
  offset?: boolean;
  className?: string;
  style?: CSSProperties;
  /** drawn over the plate — the play mark on the demo film, for instance */
  children?: ReactNode;
}) {
  // widened deliberately: `satisfies` keeps each slot's `kind` as a literal,
  // which makes TS narrow `kind` away once `src` is known non-null
  const asset: MediaAsset = media[id];
  const plateStyle: CSSProperties = {
    aspectRatio: ratio,
    ...(focus ? ({ "--plate-focus": focus } as CSSProperties) : null),
    ...style,
  };

  return (
    <figure className={`frame ${offset ? "frame--offset" : ""} ${className}`.trim()}>
      <div className="frame__plate" style={plateStyle}>
        {asset.src && asset.kind === "video" ? (
          <video
            src={asset.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={asset.alt}
          />
        ) : asset.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.src} alt={asset.alt} loading="lazy" />
        ) : (
          <div className="frame__empty">
            <span className="label">{caption ?? id}</span>
            <span className="label" style={{ opacity: 0.55 }}>
              awaiting capture · {id}
            </span>
          </div>
        )}
        {children}
      </div>
      {(caption || note) && (
        <figcaption className="frame__cap">
          {caption ? <span className="label">{caption}</span> : <span />}
          {note ? <span className="label">{note}</span> : null}
        </figcaption>
      )}
    </figure>
  );
}
