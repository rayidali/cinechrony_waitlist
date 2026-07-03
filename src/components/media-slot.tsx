import { media } from "@/lib/site";
import type { CSSProperties } from "react";

/**
 * A media slot renders the real asset when one is registered in
 * src/lib/site.ts, and a styled placeholder frame (carrying the slot id and
 * a human label) until then. ASSETS.md lists what to capture for each id.
 */
export function MediaSlot({
  id,
  label,
  ratio,
  className = "",
  style,
}: {
  id: keyof typeof media;
  label: string;
  ratio?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const asset = media[id];
  const frameStyle: CSSProperties = { aspectRatio: ratio, ...style };

  if (asset?.src) {
    if (asset.kind === "video") {
      return (
        <div className={`ph ${className}`.trim()} style={frameStyle}>
          <video
            src={asset.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={asset.alt}
          />
        </div>
      );
    }
    return (
      <div className={`ph ${className}`.trim()} style={frameStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.src} alt={asset.alt} loading="lazy" />
      </div>
    );
  }

  const isVideo = asset?.kind === "video";
  return (
    <div
      className={`ph ${isVideo ? "ph--video" : ""} ${className}`.trim()}
      style={frameStyle}
      role="img"
      aria-label={`Coming soon: ${asset?.alt ?? label}`}
    >
      <span className="ph__label">{label}</span>
    </div>
  );
}
