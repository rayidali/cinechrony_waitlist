/**
 * A stylized social-video card at rest: a duotone gradient fill, a top bar
 * (avatar dot + mono handle), a centered translucent play triangle, a
 * skeleton caption (fake text), and -- unless `compact` -- a right-edge
 * action rail (heart / reply / bookmark). Built entirely from the shared
 * --pd-* duotone tokens, so it reads as "a reel at rest" wherever it's
 * fanned or scaled. Always decorative: the component marks its own root
 * aria-hidden so every caller gets that for free. Server component: no
 * state, no interaction. See globals.css `.reel-card*`.
 */

function HeartGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 20.2 4.6 13a5 5 0 0 1 7.4-6.6 5 5 0 0 1 7.4 6.6z" />
    </svg>
  );
}

function BubbleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function BookmarkGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.2L5 21V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function ReelCard({
  handle,
  pd,
  compact = false,
  className = "",
}: {
  /** mono handle rendered in the top bar, e.g. "@filmtok" */
  handle: string;
  /** one of the shared --pd-* duotone classes (see globals.css) */
  pd: string;
  /** hides the right-edge action rail -- used by the claim-band lead card */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`reel-card ${pd} ${compact ? "reel-card--compact" : ""} ${className}`.trim()} aria-hidden="true">
      <div className="reel-card__top">
        <span className="reel-card__avatar" />
        <span className="reel-card__handle">{handle}</span>
      </div>

      <span className="reel-card__play">
        <span className="reel-card__play-tri" />
      </span>

      <div className="reel-card__caption">
        <span className="reel-card__cap-bar reel-card__cap-bar--1" />
        <span className="reel-card__cap-bar reel-card__cap-bar--2" />
      </div>

      {!compact && (
        <div className="reel-card__rail">
          <span className="reel-card__rail-icon">
            <HeartGlyph />
          </span>
          <span className="reel-card__rail-icon">
            <BubbleGlyph />
          </span>
          <span className="reel-card__rail-icon">
            <BookmarkGlyph />
          </span>
        </div>
      )}
    </div>
  );
}
