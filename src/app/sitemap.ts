import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-02");

  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/waitlist", priority: 0.8 },
    { path: "/install", priority: 0.8 },
    { path: "/beta", priority: 0.5 },
    { path: "/support", priority: 0.5 },
    { path: "/privacy", priority: 0.5 },
    { path: "/terms", priority: 0.5 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified,
    priority,
  }));
}
