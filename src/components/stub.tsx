/**
 * The ticket stub — this site's nostalgic-object motif.
 *
 * The reference boards reach for a skeuomorphic desktop folder as the piece
 * of warm, physical junk that stops a layout feeling like software. For a
 * film app the honest equivalent is a torn ticket, and the app already
 * draws a perforation row in sunday wrapped, so the vocabulary is shared
 * with the product rather than imported from someone else's.
 */
export function Stub({
  title,
  when,
  where,
  going,
  seats = 5,
  filled = 3,
}: {
  title: string;
  when: string;
  where: string;
  going: string;
  seats?: number;
  filled?: number;
}) {
  return (
    <div className="stub">
      <div className="stub__main">
        <span className="label">movie night · admit all</span>
        <h3 className="stub__title">{title}</h3>
        <div className="stub__row">
          <span className="label label--ink">{when}</span>
          <span className="label">{where}</span>
        </div>
        <div className="perf" aria-hidden="true">
          {Array.from({ length: seats }, (_, i) => (
            <span key={i} data-on={i < filled ? "1" : "0"} />
          ))}
        </div>
        <span className="label" style={{ marginTop: 10 }}>
          {going}
        </span>
      </div>
      <div className="stub__tear">
        <span className="label">fri</span>
        <span className="stub__big">8</span>
        <span className="label">pm</span>
      </div>
    </div>
  );
}
