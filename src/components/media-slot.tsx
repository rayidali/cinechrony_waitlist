import { media } from "@/lib/site";
import type { CSSProperties, ReactNode } from "react";

/**
 * A media slot renders the real asset when one is registered in
 * src/lib/site.ts. Until then it renders a placeholder: a bespoke rich
 * mockup passed as `children` (feature rows), or, for a video slot with no
 * children, the built-in "screening room" frame (the demo video slot). A
 * bare fallback label pill covers any slot with neither. ASSETS.md lists
 * what to capture for each id.
 */
export function MediaSlot({
  id,
  label,
  ratio,
  className = "",
  style,
  children,
}: {
  id: keyof typeof media;
  label: string;
  ratio?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
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

  if (children) {
    return (
      <div
        className={`ph ${className}`.trim()}
        style={frameStyle}
        role="img"
        aria-label={`Coming soon: ${asset?.alt ?? label}`}
      >
        {children}
      </div>
    );
  }

  if (asset?.kind === "video") {
    return (
      <div
        className={`ph ph--screening grain ${className}`.trim()}
        style={frameStyle}
        role="img"
        aria-label={`Coming soon: ${asset?.alt ?? label}`}
      >
        <span className="screening-play" aria-hidden="true" />
        <span className="screening-caption">
          <span className="l1">demo film · 40 seconds</span>
          <span className="l2">the full flow, one take</span>
        </span>
        <span className="screening-rail" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      className={`ph ${className}`.trim()}
      style={frameStyle}
      role="img"
      aria-label={`Coming soon: ${asset?.alt ?? label}`}
    >
      <span className="ph__label">{label}</span>
    </div>
  );
}
