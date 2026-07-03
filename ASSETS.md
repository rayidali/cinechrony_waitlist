# Asset capture list

Every screenshot and video the site wants, in priority order. Each slot renders a styled placeholder until its file exists. To wire one up: drop the file in `public/media/`, then set its `src` in the `media` map in `src/lib/site.ts` (for example `src: "/media/demo-hero.mp4"`).

General notes for all captures:

- Capture in the app's light theme on the newsprint-cream background so the frames blend with the site. A second dark-theme set is a bonus, not required.
- Use realistic list names and films (the site's animated demo uses "friday night club" with Whiplash, Heat, and The Nice Guys; consistency is nice but not required).
- No notification banners, low-battery indicators, or personal info in frame.

## 1. demo-hero (video, highest priority)

- Slot: the 16:9 frame in the "Works with the clips you already share" section on the landing page.
- Content: the full hero flow in one continuous take, about 30 to 45 seconds. Share a TikTok or reel to Cinechrony, show the AI scan running, show the films appearing with IMDb ratings, end on the shared list with the clip attached to a film card.
- Format: MP4 (H.264), 1920x1080 or a clean 16:9 screen recording composited onto a simple background. It autoplays muted and loops, so it must read clearly without sound. Keep it under ~8 MB if possible.

## 2. feature-shared-list (image)

- Slot: first feature row, "Watchlists you build together."
- Content: a shared list open in the app with 2 or 3 member avatars visible and a healthy list of films.
- Format: PNG or WebP app screenshot, ideally in a device frame or clean crop, landscape-friendly (the frame is 4:3).

## 3. feature-ratings (image)

- Slot: second feature row, "Never save a dud."
- Content: a list where the rating chips are prominent, ideally with a spread of green/amber ratings visible.
- Format: same as above, 4:3 frame.

## 4. feature-clip-attached (image)

- Slot: third feature row, "Remember why you saved it."
- Content: a film card open with the original reel/clip visible on it.
- Format: same as above, 4:3 frame.

## 5. beta-phone (image)

- Slot: the phone frame on `/beta`.
- Content: any handsome screen of the iOS beta build (home or a list). Portrait.
- Format: PNG or WebP, roughly 320x640 aspect (an iPhone screenshot works as-is).

## Later (when links exist)

- TestFlight invite URL: set `testflightUrl` in `src/lib/site.ts` and `/beta` flips to the live join flow.
- App Store badge + link: add to the try-it band and footer when the full release ships.
