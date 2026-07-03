import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { site } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
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
      className={`${bricolage.variable} ${manrope.variable} ${spaceMono.variable}`}
    >
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system">
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
