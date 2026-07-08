# cinechrony — marketing site

The marketing website for [Cinechrony](https://www.cinechrony.com), the social movie watchlist. Share a reel or TikTok, the AI pulls out every film with its IMDb rating, and it lands on a watchlist you keep with friends.

Built with Next.js (App Router) and the cinechrony editorial cinema design system: newsprint cream, cinema black, film red, Bricolage Grotesque display type, Manrope body, Space Mono data labels. Light and dark themes.

The 2026-07 polish passes rebuilt the visual layer to indie-startup quality (benchmark: getbluejay.ai), in four rounds: oversized display type + rich CSS app mockups in every media slot (see [ASSETS.md](./ASSETS.md)); cinematic color scenes (warm hero, dark screening room, amber claim band, colored product stages, outlined-type marquee); a narrative hero diorama that reads doomscroll to shared list (reel-card stack, dashed flow with the scan pill, the phone with a friends layer); and a split hero (copy left, diorama right in the first viewport) over six depth layers (projector sun, blurred reel echoes, bokeh, dot-grid texture, ground plane, grain). A full phone pass followed: zero horizontal overflow at 360/390/430, 40px+ tap targets, and legal/support content no longer gated behind scroll-reveal. The top nav carries the full product path: How it works, Features, Install, iOS beta, Waitlist, Support.

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing: animated hero, how it works, features, story, try-it band |
| `/waitlist` | Waitlist signup (stored in Loops) |
| `/install` | Add-to-home-screen guide for iPhone and Android |
| `/beta` | TestFlight beta page, gated on a config flag until the beta opens |
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

- `appUrl` — where every "Try it here" button points. Currently the PWA on Vercel; switch to `https://app.cinechrony.com` when the subdomain split happens.
- `testflightUrl` — paste the TestFlight invite link when the beta opens and `/beta` flips from "opens soon" to the live join flow.
- `waitlist` — the Loops form endpoint. Signups land in the existing Loops audience.
- `media` — the screenshot and video slots. Each slot renders a styled placeholder until you register a file. See [ASSETS.md](./ASSETS.md) for the capture list.

## Domain architecture

- `cinechrony.com` (apex + `www`) serves this site.
- The app moves to `app.cinechrony.com`; a PWA installs whatever origin the user is on, so the `/install` page always sends people to the app origin before installing.
- App Store Connect points at `cinechrony.com/privacy`, `/terms`, and `/support`. Keep those routes stable.

## Deploying

Pushes to `main` deploy via Vercel.
