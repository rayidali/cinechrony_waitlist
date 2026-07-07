/**
 * Bespoke rich mockups rendered as MediaSlot placeholder children on the
 * three feature rows. Pure CSS/JSX on design tokens, in the same spirit as
 * the demo-film / demo-clip patterns used in the hero. Server components:
 * static, no interaction.
 */

export function MockupSharedList() {
  return (
    <div className="fm-card">
      <div className="fm-head">
        <span className="t">friday night club</span>
        <span className="demo-avatars">
          <span>RA</span>
          <span>MK</span>
          <span>JT</span>
        </span>
      </div>
      <span className="fm-meta">4 films · updated just now</span>

      <div className="fm-row fm-row--new">
        <span
          className="poster"
          style={{ background: "linear-gradient(160deg, oklch(0.42 0.09 50), oklch(0.2 0.02 60))" }}
        />
        <span className="txt">
          <span className="name">Whiplash</span>
          <span className="added">added by MK</span>
        </span>
        <span className="rating rating--good">8.5</span>
      </div>
      <div className="fm-row">
        <span
          className="poster"
          style={{ background: "linear-gradient(160deg, oklch(0.38 0.06 250), oklch(0.2 0.02 60))" }}
        />
        <span className="txt">
          <span className="name">Heat</span>
          <span className="added">added by RA</span>
        </span>
        <span className="rating rating--good">8.3</span>
      </div>
      <div className="fm-row">
        <span
          className="poster"
          style={{ background: "linear-gradient(160deg, oklch(0.55 0.1 90), oklch(0.2 0.02 60))" }}
        />
        <span className="txt">
          <span className="name">The Nice Guys</span>
          <span className="added">added by JT</span>
        </span>
        <span className="rating rating--mid">7.3</span>
      </div>
    </div>
  );
}

/* deliberately a different roster from FilmStrip / MockupSharedList /
   MockupClipAttached (Whiplash, Heat, Parasite, The Nice Guys, Arrival) so
   the same title never carries two different ratings on one page scroll. */
const RATING_FILMS = [
  { name: "Everything Everywhere", tone: "rating--good", rating: "7.8" },
  { name: "Knives Out", tone: "rating--good", rating: "7.9" },
  { name: "Barbie", tone: "rating--mid", rating: "6.8" },
  { name: "Morbius", tone: "rating--bad", rating: "5.2" },
];

export function MockupRatings() {
  return (
    <div className="fm-card">
      <div className="fm-head">
        <span className="t">ready to watch</span>
      </div>
      {RATING_FILMS.map((f) => (
        <div className="fm-row" key={f.name}>
          <span className="txt">
            <span className="name">{f.name}</span>
          </span>
          <span className={`rating ${f.tone}`}>{f.rating}</span>
        </div>
      ))}
      <div className="fm-legend">
        <span>worth it</span>
        <span>maybe</span>
        <span>skip</span>
      </div>
    </div>
  );
}

export function MockupClipAttached() {
  return (
    <div className="fm-card fm-detail">
      <span
        className="fm-detail__poster"
        style={{ background: "linear-gradient(160deg, oklch(0.55 0.1 90), oklch(0.2 0.02 60))" }}
      />
      <div className="fm-detail__title">
        <span className="t">The Nice Guys · 2016</span>
        <span className="rating rating--mid">7.3</span>
      </div>
      <div className="demo-clip">
        <span className="thumb" />
        <span className="txt">
          <span className="l1">tiktok.com/@filmtok…</span>
          <span className="l2">shared by JT</span>
        </span>
      </div>
      <span className="fm-detail__link">watch the clip</span>
    </div>
  );
}
