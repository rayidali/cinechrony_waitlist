import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // the OG card reads the brand TTFs off disk at render time, so they have
  // to be traced into the function bundle or the card silently falls back
  // to the runtime's default sans in production and nowhere else
  outputFileTracingIncludes: {
    "/opengraph-image": ["./public/fonts/**"],
  },
};

export default nextConfig;
