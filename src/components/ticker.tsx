/**
 * The marquee, flattened. v2's version was outlined display type on a
 * gradient band; this one is a cinema marquee — mono, small, rule-bounded,
 * a film-red bead between titles. It runs edge to edge because a band that
 * respects the page gutter is not a band.
 *
 * The track holds the group twice and translates by exactly -50%, so the
 * loop is seamless whatever the group's measured width.
 */
const TITLES = [
  "whiplash",
  "past lives",
  "heat",
  "parasite",
  "arrival",
  "the nice guys",
  "dune",
  "knives out",
  "everything everywhere",
  "aftersun",
];

function Group() {
  return (
    <span className="ticker__group" aria-hidden="true">
      {TITLES.map((t) => (
        <span className="ticker__item" key={t}>
          {t}
        </span>
      ))}
    </span>
  );
}

export function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker__track">
        <Group />
        <Group />
      </div>
    </div>
  );
}
