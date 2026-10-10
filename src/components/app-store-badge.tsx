import { site } from "@/lib/site";

/**
 * Apple's "Download on the App Store" badge, the official artwork used
 * unmodified (public/brand/app-store-badge-*.svg, from Apple's marketing
 * toolbox). Apple's rules for it are short and this component is how the
 * site keeps them: never redraw or recolour it, black on a light field and
 * white on a dark one, no smaller than 40px tall, and a clear space of a
 * quarter of its height around it.
 *
 * `tone="auto"` follows the page theme, so it is black on paper and white
 * once the paper goes dark. `tone="light"` is for a field that is dark in
 * both themes, like the aura band, where the black badge would vanish.
 * Both files are in the DOM and CSS shows one, so the right badge is there
 * on first paint whichever theme the visitor lands in.
 */
export function AppStoreBadge({
  tone = "auto",
  size = "lg",
}: {
  tone?: "auto" | "light";
  size?: "lg" | "sm";
}) {
  return (
    <a
      className={`appstore-badge appstore-badge--${tone} appstore-badge--${size}`}
      href={site.appStoreUrl}
      target="_blank"
      rel="noopener"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="appstore-badge__black"
        src="/brand/app-store-badge-black.svg"
        alt="Download on the App Store"
        width={120}
        height={40}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="appstore-badge__white"
        src="/brand/app-store-badge-white.svg"
        alt="Download on the App Store"
        width={120}
        height={40}
      />
    </a>
  );
}
