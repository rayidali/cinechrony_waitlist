"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades content up on first scroll into view. Pure progressive enhancement:
 * the CSS class only hides content once JS has mounted the observer, and
 * prefers-reduced-motion disables it entirely in globals.css.
 *
 * Two safety nets keep this from ever leaving real content permanently
 * invisible: (1) threshold 0 fires on the first pixel of overlap instead of
 * requiring a percentage of the target's own area to be on-screen -- for a
 * tall single block (a full legal document, a long FAQ list) a percentage
 * threshold can be mathematically unreachable within one viewport, which is
 * exactly what left /privacy, /terms and /support blank at phone widths;
 * (2) a fixed timeout forces the reveal regardless of the observer, which
 * covers any capture/crawler path that resizes the viewport instead of
 * scrolling it (no new IntersectionObserver tick fires in time).
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "span";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    el.classList.add("reveal");
    const reveal = () => {
      el.classList.add("is-visible");
      io.disconnect();
      clearTimeout(fallback);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    const fallback = setTimeout(reveal, 2000);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
