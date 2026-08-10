/**
 * The sticker set.
 *
 * The reference is Corner's floating-object hero, where the objects are
 * photoreal 3D renders on a photographic sky. Those would fight this page:
 * a glossy raytraced croissant pasted on flat cream paper reads as a
 * sticker someone forgot to delete. So these are drawn instead — cut-outs
 * with enough shading to sit in space, a hairline ink edge so they read as
 * printed, and the page's own grain pass over the top, which is what
 * actually welds them to the paper.
 *
 * Every one of them is either a cinema object, a broadcast one, or a piece
 * of the same late-night furniture the app is for. Nothing generically
 * "fun" — a croissant would be Corner's joke, not ours.
 *
 * All of it is decoration: aria-hidden, pointer-events none, and gone
 * entirely at reduced motion widths where it would crowd the content.
 */

const INK = "oklch(0.165 0.012 60)";

function DiscoBall() {
  return (
    <svg viewBox="0 0 100 116" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="dbBody" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#f4f6f7" />
          <stop offset="42%" stopColor="#b9c3c8" />
          <stop offset="78%" stopColor="#6f7c84" />
          <stop offset="100%" stopColor="#3d474d" />
        </radialGradient>
        <pattern id="dbFacets" width="12.5" height="12.5" patternUnits="userSpaceOnUse">
          <rect width="12.5" height="12.5" fill="none" />
          <path d="M0 0H12.5M0 0V12.5" stroke={INK} strokeOpacity="0.32" strokeWidth="1" />
        </pattern>
        <clipPath id="dbClip">
          <circle cx="50" cy="66" r="46" />
        </clipPath>
      </defs>

      {/* the hanger */}
      <path d="M50 22V6" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="43" y="14" width="14" height="9" rx="2" fill="#9aa5ab" stroke={INK} strokeWidth="2" />

      <circle cx="50" cy="66" r="46" fill="url(#dbBody)" />
      <g clipPath="url(#dbClip)">
        <rect x="0" y="14" width="100" height="104" fill="url(#dbFacets)" />
        {/* a handful of lit mirrors, placed rather than scattered */}
        <rect x="25" y="41" width="11.5" height="11.5" fill="#ffffff" opacity="0.92" />
        <rect x="50" y="29" width="11.5" height="11.5" fill="#ffffff" opacity="0.7" />
        <rect x="37.5" y="54" width="11.5" height="11.5" fill="#ffffff" opacity="0.55" />
        <rect x="62.5" y="66" width="11.5" height="11.5" fill="#dfe7ea" opacity="0.5" />
        <rect x="25" y="79" width="11.5" height="11.5" fill="#2f383d" opacity="0.45" />
        <rect x="62.5" y="91" width="11.5" height="11.5" fill="#2f383d" opacity="0.5" />
      </g>
      <circle cx="50" cy="66" r="46" fill="none" stroke={INK} strokeWidth="2.2" />

      {/* the throw */}
      <path
        d="M96 34l3.5 8 8 3.5-8 3.5-3.5 8-3.5-8-8-3.5 8-3.5z"
        fill="#fff8e6"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Popcorn() {
  return (
    <svg viewBox="0 0 92 100" fill="none" aria-hidden="true">
      {/* the kernels sit behind the box so the rim overlaps them */}
      <g stroke={INK} strokeWidth="2">
        <circle cx="30" cy="27" r="11" fill="#fdf6e3" />
        <circle cx="50" cy="18" r="12" fill="#fffdf6" />
        <circle cx="66" cy="30" r="10" fill="#fdf6e3" />
        <circle cx="41" cy="33" r="9" fill="#fffdf6" />
        <circle cx="58" cy="36" r="8" fill="#f7edd6" />
      </g>
      {/* the box: cinechrony's own object, in the brand's own red */}
      <path d="M18 36h56l-7 60H25z" fill="#c14a2c" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M33.5 36l-3 60M46 36v60M58.5 36l3 60" stroke="#fdf6e3" strokeWidth="7" />
      <path d="M18 36h56l-7 60H25z" fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

function Martini() {
  return (
    <svg viewBox="0 0 88 100" fill="none" aria-hidden="true">
      <path d="M10 16h68L44 54z" fill="#dfeae0" fillOpacity="0.85" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M18 22h52L44 51z" fill="#cfe3c8" />
      <path d="M44 54v32" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M26 90h36" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      {/* the stick and two olives */}
      <path d="M60 8L38 42" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="52" cy="21" r="6" fill="#7e8f4a" stroke={INK} strokeWidth="1.8" />
      <circle cx="52" cy="21" r="2" fill="#c1443a" />
      <circle cx="43" cy="35" r="5.5" fill="#8d9c55" stroke={INK} strokeWidth="1.8" />
    </svg>
  );
}

function FilmReel() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="reelG" cx="34%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#4b555b" />
          <stop offset="100%" stopColor="#1d2427" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#reelG)" stroke={INK} strokeWidth="2.4" />
      <circle cx="50" cy="50" r="11" fill="#e9e2d2" stroke={INK} strokeWidth="2.2" />
      <g fill="#e9e2d2" stroke={INK} strokeWidth="2">
        <circle cx="50" cy="24" r="8.5" />
        <circle cx="72" cy="63" r="8.5" />
        <circle cx="28" cy="63" r="8.5" />
      </g>
      <circle cx="50" cy="50" r="36" fill="none" stroke="#e9e2d2" strokeOpacity="0.28" strokeWidth="1.6" />
    </svg>
  );
}

function Vhs() {
  return (
    <svg viewBox="0 0 108 74" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="102" height="68" rx="4" fill="#232a2d" stroke={INK} strokeWidth="2.4" />
      <rect x="11" y="11" width="86" height="30" rx="2" fill="#e9e2d2" stroke={INK} strokeWidth="2" />
      <g stroke={INK} strokeWidth="2">
        <circle cx="35" cy="26" r="9" fill="#3c464a" />
        <circle cx="73" cy="26" r="9" fill="#3c464a" />
      </g>
      <rect x="11" y="48" width="60" height="15" rx="2" fill="#c14a2c" stroke={INK} strokeWidth="2" />
      <path d="M17 55.5h30" stroke="#f3ece0" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 48v15M90 48v15" stroke="#7d878b" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <path
        d="M30 2c2.5 15.5 12.5 25.5 28 28-15.5 2.5-25.5 12.5-28 28-2.5-15.5-12.5-25.5-28-28C17.5 27.5 27.5 17.5 30 2z"
        fill="#f2b53c"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Butterfly() {
  return (
    <svg viewBox="0 0 96 78" fill="none" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M46 39C34 6 4 6 6 27c1.6 16.8 24 14.8 40 12z" fill="#3f5fc4" />
        <path d="M50 39C62 6 92 6 90 27c-1.6 16.8-24 14.8-40 12z" fill="#3f5fc4" />
        <path d="M46 39C34 72 8 72 12 54c3-13.6 20-16.8 34-15z" fill="#5f7ddb" />
        <path d="M50 39c12 33 38 33 34 15-3-13.6-20-16.8-34-15z" fill="#5f7ddb" />
      </g>
      <path d="M48 24v34" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M48 24l-8-12M48 24l8-12" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Daisy() {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <g fill="#f3ece0" stroke={INK} strokeWidth="2.2">
        <ellipse cx="40" cy="15" rx="11" ry="15" />
        <ellipse cx="40" cy="65" rx="11" ry="15" />
        <ellipse cx="15" cy="40" rx="15" ry="11" />
        <ellipse cx="65" cy="40" rx="15" ry="11" />
        <ellipse cx="22" cy="22" rx="13" ry="10" transform="rotate(-45 22 22)" />
        <ellipse cx="58" cy="58" rx="13" ry="10" transform="rotate(-45 58 58)" />
        <ellipse cx="58" cy="22" rx="10" ry="13" transform="rotate(-45 58 22)" />
        <ellipse cx="22" cy="58" rx="10" ry="13" transform="rotate(-45 22 58)" />
      </g>
      <circle cx="40" cy="40" r="13" fill="#f2b53c" stroke={INK} strokeWidth="2.2" />
    </svg>
  );
}

function Cursor() {
  return (
    <svg viewBox="0 0 46 58" fill="none" aria-hidden="true">
      <path
        d="M6 3l33 25.5-15.5 2.5L32 51l-8 3.5-8.5-20L6 44z"
        fill="#f3ece0"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Ticket() {
  return (
    <svg viewBox="0 0 104 58" fill="none" aria-hidden="true">
      <path
        d="M4 4h96v14a11 11 0 000 22v14H4V40a11 11 0 000-22z"
        fill="#f2b53c"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M70 6v46" stroke={INK} strokeWidth="2" strokeDasharray="5 5" />
      <path d="M16 22h40M16 34h26" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M80 24h12" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}


function Crt() {
  return (
    <svg viewBox="0 0 110 100" fill="none" aria-hidden="true">
      {/* rabbit ears */}
      <path d="M40 20L28 3M62 20L76 3" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="27" cy="3" r="3" fill={INK} />
      <circle cx="77" cy="3" r="3" fill={INK} />
      <rect x="4" y="20" width="102" height="74" rx="8" fill="#d8cdb8" stroke={INK} strokeWidth="2.6" />
      <rect x="13" y="29" width="66" height="56" rx="6" fill="#2b6f7d" stroke={INK} strokeWidth="2.4" />
      {/* scan lines on the tube */}
      <g stroke="#a9d6dd" strokeWidth="1.4" opacity="0.45">
        <path d="M15 39h62M15 47h62M15 55h62M15 63h62M15 71h62M15 79h62" />
      </g>
      <path d="M22 37l26 22-26 12z" fill="#f0e9d8" opacity="0.28" />
      <g stroke={INK} strokeWidth="2.2">
        <circle cx="93" cy="42" r="7" fill="#b9ad95" />
        <circle cx="93" cy="63" r="7" fill="#b9ad95" />
      </g>
      <path d="M88 80h12" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function Glasses3D() {
  return (
    <svg viewBox="0 0 118 52" fill="none" aria-hidden="true">
      <path d="M4 12h110v6a10 10 0 01-10 10H14A10 10 0 014 18z" fill="#e9e2d2" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <rect x="12" y="18" width="40" height="24" rx="4" fill="#c1443a" stroke={INK} strokeWidth="2.4" />
      <rect x="66" y="18" width="40" height="24" rx="4" fill="#2b83a6" stroke={INK} strokeWidth="2.4" />
      <path d="M52 24h14" stroke={INK} strokeWidth="2.6" />
    </svg>
  );
}

function Leader() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#e9e2d2" stroke={INK} strokeWidth="2.6" />
      <circle cx="50" cy="50" r="34" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.45" />
      {/* the sweep and the crosshair */}
      <path d="M50 50V6A44 44 0 0194 50z" fill={INK} fillOpacity="0.1" />
      <path d="M50 4v92M4 50h92" stroke={INK} strokeWidth="1.8" opacity="0.55" />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Space Mono, ui-monospace, monospace"
        fontSize="46"
        fontWeight="700"
        fill={INK}
      >
        3
      </text>
    </svg>
  );
}

const SHAPES = {
  disco: DiscoBall,
  popcorn: Popcorn,
  martini: Martini,
  reel: FilmReel,
  vhs: Vhs,
  sparkle: Sparkle,
  butterfly: Butterfly,
  daisy: Daisy,
  cursor: Cursor,
  ticket: Ticket,
  crt: Crt,
  glasses: Glasses3D,
  leader: Leader,
} as const;

export type StickerKind = keyof typeof SHAPES;

/** one object, positioned by the scene that places it */
export function Sticker({
  kind,
  className = "",
  size = 84,
  rotate = 0,
  delay = 0,
  duration = 9,
}: {
  kind: StickerKind;
  className?: string;
  size?: number;
  rotate?: number;
  /** seconds — staggers the drift so nothing bobs in unison */
  delay?: number;
  duration?: number;
}) {
  const Shape = SHAPES[kind];
  return (
    <span
      className={`sticker ${className}`.trim()}
      aria-hidden="true"
      style={
        {
          "--sz": `${size}px`,
          "--rot": `${rotate}deg`,
          "--delay": `${delay}s`,
          "--dur": `${duration}s`,
        } as React.CSSProperties
      }
    >
      <Shape />
    </span>
  );
}

type Placed = {
  kind: StickerKind;
  /** percentage positions, so the layer scales with its container */
  x: string;
  y: string;
  size?: number;
  rotate?: number;
  delay?: number;
  duration?: number;
  /** dropped on phones, where the same object is clutter rather than charm */
  desktopOnly?: boolean;
};

/* Placed by hand and kept sparse. Corner can fill a whole viewport with
   objects because there is nothing else in it; this page already has a
   calendar doing the shouting, so these sit at the margins and in the
   gaps, and never on top of anything anyone has to read. */
const SCENES: Record<string, Placed[]> = {
  /* Placed against the hero's ACTUAL empty regions, measured off a
     screenshot rather than guessed: the strip above the eyebrow, the
     narrow gutter between the copy and the calendar, and the strip under
     the calendar's caption. The first pass put the disco ball at x:-3%
     and a sparkle at y:-2%, which meant the two loudest objects on the
     page were almost entirely outside it. */
  hero: [
    // hanging from the top edge, which is where a disco ball goes
    { kind: "disco", x: "15%", y: "4%", size: 122, rotate: -5, delay: 0, duration: 11 },
    { kind: "cursor", x: "45.5%", y: "13%", size: 44, rotate: -10, delay: 2.2, duration: 8, desktopOnly: true },
    { kind: "sparkle", x: "43%", y: "56%", size: 38, rotate: 12, delay: 1.4, duration: 7, desktopOnly: true },
    { kind: "popcorn", x: "62%", y: "98%", size: 96, rotate: 7, delay: 0.6, duration: 9.5, desktopOnly: true },
    { kind: "daisy", x: "95%", y: "96%", size: 58, rotate: -12, delay: 1.9, duration: 8.5, desktopOnly: true },
  ],
  poster: [
    { kind: "martini", x: "8%", y: "18%", size: 96, rotate: -9, delay: 0.4, duration: 10 },
    { kind: "butterfly", x: "84%", y: "16%", size: 86, rotate: 10, delay: 1.1, duration: 8.5 },
    { kind: "sparkle", x: "16%", y: "76%", size: 36, rotate: -8, delay: 2, duration: 7.5, desktopOnly: true },
    { kind: "daisy", x: "88%", y: "72%", size: 62, rotate: 14, delay: 0.9, duration: 9, desktopOnly: true },
    { kind: "glasses", x: "50%", y: "92%", size: 108, rotate: -5, delay: 1.7, duration: 9.5, desktopOnly: true },
  ],
  /* the VHS sat at y:74% here, which put a dark object directly behind a
     line of white body copy; behind is not far enough when the contrast
     goes the wrong way, so it drops to the clipped bottom corner instead */
  night: [
    { kind: "vhs", x: "4%", y: "90%", size: 108, rotate: -7, delay: 0.5, duration: 10, desktopOnly: true },
    { kind: "ticket", x: "59%", y: "15%", size: 94, rotate: 9, delay: 1.6, duration: 8, desktopOnly: true },
    { kind: "sparkle", x: "89%", y: "80%", size: 36, rotate: -14, delay: 2.3, duration: 7.5, desktopOnly: true },
    { kind: "crt", x: "93%", y: "24%", size: 92, rotate: -8, delay: 0.9, duration: 10, desktopOnly: true },
  ],
  /* on the ink band an object only earns its place if it reads at a glance:
     the film reel is dark grey on near-black and turned into a smudge, so
     the corner goes to the popcorn box, whose red and cream both pop */
  close: [
    { kind: "disco", x: "9%", y: "34%", size: 96, rotate: 7, delay: 0.3, duration: 10.5, desktopOnly: true },
    { kind: "popcorn", x: "88%", y: "62%", size: 92, rotate: -9, delay: 1.2, duration: 9, desktopOnly: true },
    { kind: "sparkle", x: "80%", y: "20%", size: 36, rotate: 16, delay: 2.4, duration: 7 },
    { kind: "reel", x: "22%", y: "84%", size: 78, rotate: -11, delay: 1.8, duration: 9.5, desktopOnly: true },
  ],
  grab: [
    { kind: "leader", x: "5%", y: "62%", size: 76, rotate: -6, delay: 2, duration: 8.5, desktopOnly: true },
  ],
};

export function Stickers({ scene }: { scene: keyof typeof SCENES }) {
  const placed = SCENES[scene] ?? [];
  return (
    <div className="stickers" aria-hidden="true">
      {placed.map((p, i) => (
        <span
          key={i}
          className={`sticker-slot ${p.desktopOnly ? "sticker-slot--desk" : ""}`.trim()}
          style={{ left: p.x, top: p.y }}
        >
          <Sticker
            kind={p.kind}
            size={p.size}
            rotate={p.rotate}
            delay={p.delay}
            duration={p.duration}
          />
        </span>
      ))}
    </div>
  );
}
