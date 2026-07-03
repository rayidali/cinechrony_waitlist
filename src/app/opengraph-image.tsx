import { ImageResponse } from "next/og";

export const alt = "cinechrony · the social movie watchlist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chipStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 22px",
  borderRadius: 12,
  fontSize: 34,
  fontWeight: 700,
} as const;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#f5f2e9",
          color: "#2b2723",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#8a8378",
          }}
        >
          THE SOCIAL MOVIE WATCHLIST
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 140,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            color: "#2b2723",
          }}
        >
          cinechrony
        </div>
        <div
          style={{
            display: "flex",
            width: 180,
            height: 6,
            marginTop: 28,
            background: "#c65b41",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 56,
          }}
        >
          <div style={{ ...chipStyle, background: "#4a7d5f", color: "#ffffff" }}>8.5</div>
          <div style={{ ...chipStyle, background: "#4a7d5f", color: "#ffffff" }}>8.3</div>
          <div style={{ ...chipStyle, background: "#d9a13d", color: "#2b2723" }}>7.3</div>
          <div
            style={{
              display: "flex",
              marginLeft: 12,
              fontSize: 30,
              color: "#8a8378",
            }}
          >
            IMDb ratings on every film
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
