# cinechrony — marketing site

The marketing website for [cinechrony](https://www.cinechrony.com). You
find films while scrolling; this is where they stop disappearing.

Next.js (App Router), no UI framework, one hand-written stylesheet.

## The design system — printed poster (v3, 2026-08)

**One rule decides everything: colour is a flat field, never a glow.**

v2 built atmosphere out of ambient light — bokeh, a projector sun, radial
step-glows, gradient "scenes" melting into each other, tilted mockups
floating on coloured washes. That is the thing that reads as generated
rather than designed: soft light everywhere and no structure anywhere. v3
inverts it:

- **Hard edges.** Bands are solid stock and stop where the next one starts.
  Radius is 0 on everything except buttons, which stay pills because the
  app's are.
- **A visible armature.** Hairline rules, a real grid, mono captions under
  plates the way a photograph is captioned in print.
- **Grain, not glow.** One fine layer over the page, one coarse layer on
  every saturated field, so colour reads as a press run.
- **Type carries the page.** Display lines are always lowercase, which is
  the app's own rule.
- **The product is shown, never drawn.** Every screenshot is a real capture
  of the shipped app, the same set that went to App Store Connect.

**Faces are the app's three, and only those three:** Bricolage Grotesque
for display and UI, Newsreader for prose, Space Mono for labels. Manrope is
gone; it was here in v2 and nowhere in the product.

**The hero is the signature.** It is a real month — seven columns, date
numerals, film cells, and the film-red dot that means a movie night. Not a
borrowed layout: it is the app's own diary screen at poster scale, which is
why it can hold the first viewport with no explanation. It is composed to
look finished with no photography at all (the film cells are solid poster
inks) and turns photographic the moment files land in `media`. See
[ASSETS.md](./ASSETS.md).

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing: the diary hero, the grab, the poster, what it does, movie night, the year, the story, the close |
| `/beta` | TestFlight join flow (live) |
| `/install` | Add-to-home-screen guide for iPhone and Android |
| `/waitlist` | The list, now aimed at the App Store release (Loops) |
| `/support` | Support email and FAQ (App Store support URL) |
| `/privacy` | Canonical privacy policy (App Store privacy URL) |
| `/terms` | Canonical terms of service |

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Configuration

Everything that changes at launch lives in one file: `src/lib/site.ts`.

- `appUrl` — where every "open the web app" button points. Currently the
  PWA on Vercel; switch to `https://app.cinechrony.com` after the subdomain
  split.
- `testflightUrl` — the public TestFlight link. **Live.** It sat `null` for
  nineteen days while the beta was open and empty, so `/beta` spent that
  whole time telling visitors the beta had not started. If you ever set it
  back to `null`, `/beta` and the hero fall back to the waitlist on their
  own.
- `waitlist` — the Loops form endpoint.
- `media` — every screenshot, photograph and video slot. Five are real; the
  rest render designed placeholders until a file exists.

## Domain architecture

- `cinechrony.com` (apex + `www`) serves this site.
- The app moves to `app.cinechrony.com`. A PWA installs whatever origin
  you are on, so `/install` always sends people to the app origin first.
- App Store Connect points at `cinechrony.com/privacy`, `/terms` and
  `/support`. Keep those routes stable.

## Deploying

Pushes to `main` deploy via Vercel.
