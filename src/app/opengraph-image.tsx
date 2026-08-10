import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "cinechrony · keep the films you find scrolling";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The link card is the site in miniature: cream stock, one lowercase line,
   and the diary grid. Real brand faces rather than the runtime's default
   sans, because a shared link is often the first cinechrony anyone sees.
   next.config.ts traces public/fonts into the function bundle. */
const font = (file: string) =>
  readFile(path.join(process.cwd(), "public", "fonts", file));

const PAPER = "#f2efe6";
const INK = "#1b1815";
const RED = "#b64a2e";
const BLUE = "#1e46b8";
const MINT = "#cfe6d3";

/* five rows of seven, the same composition as the hero, trimmed to fit */
const CELLS: (string | null)[] = [
  null, null, INK, null, RED, null, INK,
  INK, null, null, MINT, null, INK, null,
  null, INK, null, null, BLUE, null, MINT,
  MINT, null, INK, null, null, INK, null,
  null, RED, null, INK, null, BLUE, null,
];

export default async function Image() {
  const [display, mono] = await Promise.all([
    font("BricolageGrotesque-ExtraBold.ttf"),
    font("SpaceMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          color: INK,
          fontFamily: "Bricolage",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 58px",
            width: 700,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Mono",
              fontSize: 21,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: RED,
            }}
          >
            cinechrony
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 26,
              fontSize: 70,
              lineHeight: 0.92,
              letterSpacing: -3.4,
            }}
          >
            <span>share the reel.</span>
            <span>keep the film.</span>
          </div>
          <div style={{ display: "flex", width: 132, height: 7, marginTop: 34, background: RED }} />
          <div
            style={{
              display: "flex",
              fontFamily: "Mono",
              fontSize: 21,
              letterSpacing: 2.4,
              textTransform: "uppercase",
              color: "#6e6862",
              marginTop: 30,
            }}
          >
            the films you find while scrolling
          </div>
        </div>

        {/* the diary grid, running off the right edge exactly as it does on
            the page itself */}
        <div style={{ display: "flex", flexWrap: "wrap", width: 500, alignContent: "center" }}>
          {CELLS.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                width: 71,
                height: 71,
                background: c ?? "transparent",
                borderRight: "1px solid rgba(27,24,21,0.28)",
                borderBottom: "1px solid rgba(27,24,21,0.28)",
                borderTop: i < 7 ? "1px solid rgba(27,24,21,0.28)" : "none",
                borderLeft: i % 7 === 0 ? "1px solid rgba(27,24,21,0.28)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display, weight: 800, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
