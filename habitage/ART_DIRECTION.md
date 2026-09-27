# Habitage — website v2 art direction (LOCKED 2026-09-26)

The site is a journey you take. Nothing is a still picture: every section is the
real app, moving — film loops cut from real recordings, live 3D (the isles, Aurel),
or footage that scrubs as you scroll. The page is one evening turning into dawn.

Owner feedback this answers: v1 of the site was "average… a dumpster": low-res
worlds, average transitions, random images, a generic starry background, stills
where video belongs. Owner direction: **modern, calm, magical, silently
interactive**; the app's rounded type; never gamified.

## 1. The living sky (the page background)
- The app's own sky, not generic stars: deep dusk at the top of the page, warming
  through twilight to dawn at the bottom (scroll position drives the gradient).
- Soft aurora ribbons, drifting lanterns, the app's rounded cloud shapes; a few
  slow shooting stars. Low contrast, slow, always behind content.
- Palette (from the app): night navy #0a0d1c → violet #2a1e5e → rose #c07aa0 →
  amber #f3b27a → dawn cream #fff1d8. Accent: warm lamplight #eadbc3.

## 2. Type
- One family: `ui-rounded, "SF Pro Rounded", -apple-system, … "Nunito"`. No serif.
- Big, quiet headlines (600, tight tracking), short lines. Body 17–19px, generous
  line-height. Copy is the app's voice: warm, brief ("Hop on — let's sail.").

## 3. Motion
- No hard cuts. Sections dissolve into each other through the shared sky.
- Scroll SCRUBS time (image sequences, not <video> seeking — smooth on iOS Safari).
- Everything eases (cubic-bezier .22,.8,.2,1), 600–1200ms; nothing pops or flashes.
- `prefers-reduced-motion`: sequences show their key frame, loops pause on a poster.

## 4. Media quality bar
- 3D renders at 2–4K, supersampled (render 2× then downscale). Never upscale.
- Film loops: seamless, H.264 MP4 + VP9/AV1 WebM, poster frame; 1080p max on
  desktop, 720p phone variant; muted, playsinline, loaded only near the viewport.
- Everything fitted to its frame: phone footage inside a real phone frame with
  the right aspect; no awkward crops, no letterboxing, no blurry upscales.
- Recordings: the ad pipeline's CLEAN filter (status-bar clock → 9:41).

## 5. The story (top → bottom)
1. **Night isles (hero)** — slow orbit of Aurel's isles fully radiant at night
   (Star Wheel turning, lanterns, mist). Live 3D where capable, else a 4K loop.
   "Habit is a beautiful journey." · "Hop on — let's sail." · App Store.
2. **Meet Aurel** — live 3D Aurel (the real baked mesh) walks in from the dusk,
   slows, turns to you, his gaze follows the cursor, waves (joy); tap → wonder +
   small bounce; idles with a breathing glow. "This is Aurel. He'll walk every
   journey with you." Waist-up framing, high DPR. Phone fallback: a film of it.
3. **Five journeys** — Ocean, Road, Space, Multiverse of Madness, Hollywood:
   seamless loops from the real 30-day recordings in phone frames, one gliding in
   as the last moves on; each named in one line.
4. **Home** — the owner's Home scene (to be supplied), alive; sky follows the
   visitor's clock.
5. **Day 1 → Day 30** — ONE continuous journey scrubbed by scroll: a real
   recording's days as an image sequence; a day counter and 30 path lights.
6. **Aurel's Home** — the isles at night, hi-res; wonders wake one by one as you
   scroll; "Explore the isles" opens the live 3D.
7. **A few breathtaking worlds** — 5–6 chapter worlds at night (not all 30),
   each a short cinematic camera move, cross-fading.
8. **Sightings** — the discover moments as short video clips from the recordings.
9. **Together** — the owner's crew scene (to be supplied): friends, crews, cheers.
10. **Dawn** — the sky reaches sunrise; Aurel waves goodbye; App Store.

## 6. Performance
- First paint < 200KB on phones; heavy media lazy by section; live 3D modules
  load on approach only; total transferred for a full scroll < ~15MB on phones.

## References
Apple product pages (scroll-scrubbed sequences), thatgamecompany's Sky and
Journey sites, Alto's Odyssey, Monument Valley, Awwwards/FWA scroll-story sites.
