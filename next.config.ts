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
  // The three pre-release pages came out with the App Store release. Their
  // URLs are in old messages, bios and search results, so they land on the
  // home page, whose first screen is the store badge, instead of a 404.
  async redirects() {
    return ["/beta", "/install", "/waitlist"].map((source) => ({
      source,
      destination: "/",
      permanent: true,
    }));
  },
};

export default nextConfig;
