/**
 * A static (non-animated) phone screen, sharing the same demo-phone /
 * demo-screen chrome as the animated hero demo. Used to flank the live
 * PhoneDemo in the hero product stage, and by /beta for the beta screen.
 * Server component: no state, no interaction.
 */

const LIST_FILMS = [
  { name: "Dune: Part Two", yr: "2024", rating: "8.8", tone: "rating--good", hue: "oklch(0.4 0.07 60)" },
  { name: "The Holdovers", yr: "2023", rating: "8.1", tone: "rating--good", hue: "oklch(0.35 0.05 250)" },
  { name: "Past Lives", yr: "2023", rating: "7.4", tone: "rating--mid", hue: "oklch(0.5 0.08 20)" },
  { name: "Anatomy of a Fall", yr: "2023", rating: "6.2", tone: "rating--mid", hue: "oklch(0.3 0.03 90)" },
];

export function PhoneStatic({
  variant,
  className = "",
  tag,
}: {
  variant: "list" | "detail";
  className?: string;
  /** small mono tag rendered in the header, e.g. "TestFlight beta" */
  tag?: string;
}) {
  return (
    <div className={`demo-phone ${className}`.trim()} role="img" aria-hidden="true">
      <div className="demo-screen">
        {variant === "list" ? (
          <>
            <div className="demo-head">
              <span className="t">saturday sleepover</span>
              <span className="demo-avatars">
                <span>RA</span>
                <span>MK</span>
                <span>JT</span>
              </span>
            </div>
            {tag && <span className="meta">{tag}</span>}
            {LIST_FILMS.map((f, i) => (
              <div key={f.name} className="demo-film">
                <span
                  className="poster"
                  style={{ background: `linear-gradient(160deg, ${f.hue}, oklch(0.2 0.02 60))` }}
                />
                <span className="txt">
                  <span className="name">{f.name}</span>
                  {i === 0 ? (
                    <span className="demo-watched">watched</span>
                  ) : (
                    <span className="yr">{f.yr}</span>
                  )}
                </span>
                <span className={`rating ${f.tone}`}>{f.rating}</span>
              </div>
            ))}
            <span className="demo-more">+ 12 more on this list</span>
          </>
        ) : (
          <>
            <div className="demo-head">
              <span className="t">Heat</span>
              <span className="rating rating--good">imdb 8.3</span>
            </div>
            {tag && <span className="meta">{tag}</span>}
            <span
              className="demo-detail__poster"
              style={{ background: "linear-gradient(160deg, oklch(0.38 0.06 250), oklch(0.2 0.02 60))" }}
            />
            <span className="demo-detail__meta">1995 · crime</span>
            <div className="demo-detail__friends">
              <span className="demo-avatars">
                <span>RA</span>
                <span>MK</span>
              </span>
              <span className="meta">2 friends already saved this</span>
            </div>
            <div className="demo-clip">
              <span className="thumb" />
              <span className="txt">
                <span className="l1">tiktok.com/@filmtok…</span>
                <span className="l2">the clip stays attached</span>
              </span>
            </div>
            <span className="demo-detail__save">save to list</span>
          </>
        )}
      </div>
    </div>
  );
}
