/**
 * The claim-band film strip: five rated films laid out with a slight
 * alternating rotate and overlap, static (no marquee). Real, IMDb-accurate
 * ratings. Poster art draws from the shared --pd-* duotone token set (see
 * globals.css) instead of inline gradients. Server component.
 */

const FILMS = [
  { name: "Whiplash", yr: "2014", rating: "8.5", tone: "rating--good", pd: "pd-amber-rose" },
  { name: "Heat", yr: "1995", rating: "8.3", tone: "rating--good", pd: "pd-teal-forest" },
  { name: "Parasite", yr: "2019", rating: "8.5", tone: "rating--good", pd: "pd-forest-teal" },
  { name: "The Nice Guys", yr: "2016", rating: "7.3", tone: "rating--mid", pd: "pd-rose-amber" },
  { name: "Arrival", yr: "2016", rating: "7.9", tone: "rating--good", pd: "pd-dusk-crimson" },
];

export function FilmStrip() {
  return (
    <div className="claim-strip">
      <div className="claim-glyphs" aria-hidden="true">
        <span className="claim-glyph claim-glyph--1">8.5</span>
        <span className="claim-glyph claim-glyph--2">7.9</span>
        <span className="claim-glyph claim-glyph--3">8.3</span>
      </div>
      <div className="filmstrip" aria-hidden="true">
        {FILMS.map((f) => (
          <div className="filmstrip__cell" key={f.name}>
            <span className={`filmstrip__poster ${f.pd}`} />
            <div className="filmstrip__row">
              <span className="filmstrip__name">{f.name}</span>
              <span className={`rating ${f.tone}`}>{f.rating}</span>
            </div>
            <span className="filmstrip__yr">{f.yr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
