/**
 * The claim-band film strip: five rated films laid out with a slight
 * alternating rotate and overlap, static (no marquee). Real, IMDb-accurate
 * ratings. Server component.
 */

const FILMS = [
  { name: "Whiplash", yr: "2014", rating: "8.5", tone: "rating--good", hue: "oklch(0.42 0.09 50)" },
  { name: "Heat", yr: "1995", rating: "8.3", tone: "rating--good", hue: "oklch(0.38 0.06 250)" },
  { name: "Parasite", yr: "2019", rating: "8.5", tone: "rating--good", hue: "oklch(0.3 0.03 90)" },
  { name: "The Nice Guys", yr: "2016", rating: "7.3", tone: "rating--mid", hue: "oklch(0.55 0.1 90)" },
  { name: "Arrival", yr: "2016", rating: "7.9", tone: "rating--good", hue: "oklch(0.35 0.05 250)" },
];

export function FilmStrip() {
  return (
    <div className="filmstrip" aria-hidden="true">
      {FILMS.map((f) => (
        <div className="filmstrip__cell" key={f.name}>
          <span
            className="filmstrip__poster"
            style={{ background: `linear-gradient(160deg, ${f.hue}, oklch(0.2 0.02 60))` }}
          />
          <div className="filmstrip__row">
            <span className="filmstrip__name">{f.name}</span>
            <span className={`rating ${f.tone}`}>{f.rating}</span>
          </div>
          <span className="filmstrip__yr">{f.yr}</span>
        </div>
      ))}
    </div>
  );
}
