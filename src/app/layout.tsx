import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fraunces, Newsreader, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { site } from "@/lib/site";
import "./globals.css";

// FOUR faces, and the fourth is the reason the page stopped looking flat.
// Bricolage carries display and UI, Space Mono every label, Newsreader the
// remaining prose, and Fraunces is the vintage voice: a variable old-style
// serif with SOFT and WONK axes, drawn specifically to sound like 1900s-70s
// display type. Dialled soft and wonky it does the retro work that no amount
// of colour could, because the thing that reads as "designed in 2026 by a
// template" is uniform type, not uniform colour.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s · cinechrony",
  },
  description: site.description,
  icons: {
    icon: "/brand/cinechrony-logo.png",
    apple: "/brand/cinechrony-logo.png",
  },
  // og/twitter title+description intentionally omitted so Next resolves them
  // from each page's own metadata; canonical "./" resolves per-path
  openGraph: {
    type: "website",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "./",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#211e1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${fraunces.variable} ${newsreader.variable} ${spaceMono.variable}`}
    >
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system">
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Nav />
          {children}
          {/* the lens falloff and the film pass both sit above everything and
              take no input; they are the last thing in the tree so they can
              never end up inside a stacking context that clips them */}
        </ThemeProvider>
      </body>
    </html>
  );
}
