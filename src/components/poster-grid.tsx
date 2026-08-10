import { media, type MediaId } from "@/lib/site";

/**
 * The hero grid — the site's signature, and the one piece of art direction
 * everything else hangs off.
 *
 * It is a real month: seven columns, date numerals, faint numerals for the
 * days either side, film cells where something happened, and the film-red
 * dot that means a movie night. That is not a borrowed layout, it is the
 * app's own home screen at poster scale, which is why it can carry the
 * first viewport without a single line of explanation.
 *
 * COMPLETE WITHOUT PHOTOGRAPHY, BETTER WITH IT. Every photo cell declares a
 * `fill` alongside its `img`. Until a file is registered in `media`, the
 * cell renders as a solid poster ink — a composition choice, not a hole.
 * Drop six squares into /public/media and the same grid turns photographic
 * with no layout change.
 */

type Fill = "ink" | "red" | "blue" | "dusk" | "sage" | "amber" | "tint";

type Cell = {
  /** the date numeral */
  d: number;
  /** a day from the month either side — printed faint, like the app does */
  mute?: boolean;
  /** flat poster ink; also the fallback when `img` has no file yet */
  fill?: Fill;
  /** a photograph, when one exists */
  img?: MediaId;
  /** a film title, set small in mono along the bottom of a filled cell */
  title?: string;
  /** the movie-night mark: the only channel that means anything on a future day */
  dot?: boolean;
};

/* Composed by hand, not scattered: the filled cells drift diagonally from
   the top right down to the bottom left so the eye crosses the whole plate,
   and the ink cells are spaced to act as anchors rather than clumps.
   FIVE VALUES, NOT SEVEN. The first cut used every poster ink at once and
   the grid turned into a swatch card; ink carries the weight, mint is the
   app's own "grabbed" tint, and red, blue and amber are each allowed to
   appear a couple of times. Photography, when it lands, is the variety. */
const MONTH: Cell[] = [
  // leading days from the previous month
  { d: 28, mute: true }, { d: 29, mute: true }, { d: 30, mute: true },
  { d: 1 }, { d: 2, img: "grid-1", fill: "ink", title: "past lives" }, { d: 3 }, { d: 4, fill: "ink" },

  { d: 5, fill: "ink" }, { d: 6, dot: true }, { d: 7 }, { d: 8, img: "grid-2", fill: "red", title: "heat" },
  { d: 9 }, { d: 10, fill: "tint" }, { d: 11 },

  { d: 12 }, { d: 13, img: "grid-3", fill: "ink" }, { d: 14 }, { d: 15 },
  { d: 16, fill: "ink" }, { d: 17, fill: "tint" }, { d: 18, fill: "amber", title: "arrival" },

  { d: 19, fill: "blue" }, { d: 20 }, { d: 21, img: "grid-4", fill: "ink", title: "whiplash" },
  { d: 22 }, { d: 23, dot: true }, { d: 24, fill: "ink" }, { d: 25 },

  { d: 26, fill: "tint" }, { d: 27, fill: "ink" }, { d: 28 }, { d: 29, img: "grid-5", fill: "red" },
  { d: 30 }, { d: 31, img: "grid-6", fill: "blue", title: "parasite" }, { d: 1, mute: true },
];

const DAYS = ["m", "t", "w", "t", "f", "s", "s"];

export function PosterGrid() {
  return (
    <div className="pgrid-wrap">
      <div className="pgrid-days" aria-hidden="true">
        {DAYS.map((d, i) => (
          <span key={i} className={i > 4 ? "is-weekend" : undefined}>
            {d}
          </span>
        ))}
      </div>

      <div className="pgrid" role="img" aria-label="A month in the cinechrony diary: film posters on the days you watched, a red dot on the days you had people round.">
        {MONTH.map((c, i) => {
          const file = c.img ? media[c.img]?.src : null;
          const fill = file ? "img" : c.fill;
          return (
            <div
              key={i}
              className={[
                "pcell",
                fill ? `pcell--${fill}` : "",
                c.mute ? "pcell--mute" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {file && c.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file} alt="" loading="eager" />
              ) : null}
              <span className="pcell__n">{c.d}</span>
              {c.title ? <span className="pcell__t">{c.title}</span> : null}
              {c.dot ? <span className="pcell__dot" /> : null}
            </div>
          );
        })}
      </div>

      <div className="pgrid-cap">
        <span className="label">august &rsquo;26 · seven films, fourteen hours</span>
        <span className="label pgrid-legend">
          <i className="k k--film" /> watched
          <i className="k k--tint" /> grabbed
          <i className="k k--dot" /> movie night
        </span>
      </div>
    </div>
  );
}
