# Habitage website — real footage

Every file here is cut from the owner's real iPhone screen recordings (1290×2796 HEVC,
`~/Downloads/ScreenRecording_09-09-2026 *_1.MP4`). There is no upscaling anywhere.
Total size is about 38 MB.

**Status bar.** Every frame is cleaned. The ad pipeline's `CLEAN` region (the clock) is
delogo'd, and so are the signal bars, the battery and the screen-recording ring around the
Dynamic Island. A clean iOS bar is then drawn over them: **9:41**, full signal, Wi-Fi,
full battery, and a standard Dynamic Island. The clean bar was checked on all six recordings.
Nothing personal is visible: the frames contain only the app scene, generic habit names
and the in-app chapter lines. Moments where the habit sheet or debug panel is open were
avoided.

**Frame.** Journey loops and the day sequence are the full screen with no bezel, at
1080×2340. That is the recording's aspect (1290:2796 ≈ 0.4614). The site draws the phone
frame and should put these inside a screen with rounded corners. Sightings are native-pixel
4:5 crops (1100×1375) with no scaling.

## 1. Journey loops — `journey-{name}.*`
Each loop is seamless. Its last 0.7–0.8 s dissolves into its first frames with a
smootherstep ease, so the last frame hands off to frame 0 with no jump. The mean
difference between the last and first frame is below 0.8/255. On the Ocean loop, the boat
and the buoy rock on different periods, so their horizon band is **optical-flow morphed**
through the seam instead of cross-faded. Because of this, the boat never shows a double
exposure. The loop windows and seams were chosen by a pose and frame-difference search.

| name | source (recording @ seconds) | length | moment |
|---|---|---|---|
| ocean | `00-57-18_1.MP4` @ 110.72–118.12 | 6.6 s | Day 6 "The horizon is yours to reach." Blue sky, a rainbow, and a whale breaching past the boat |
| road | `01-17-23_1.MP4` @ 170.45–179.25 | 8.0 s | Day 30 "Parked. Forever changed." The cabin at dusk, fireworks and leaping dolphins (the finale) |
| space | `01-20-45_1.MP4` @ 71.05–77.80 | 6.05 s | Day 6 "Even orbits respect momentum." A ringed teal world, a meteor shower and a rocket passing |
| multiverse | `01-29-07_1.MP4` @ 168.70–176.10 | 6.6 s | Day 12 "The void is loud." The black hole, a satellite, rain and the glowing lava wyrm |
| hollywood | `01-37-12_1.MP4` @ 189.25–196.35 | 6.3 s | Day 13 "Where we're going, we don't need roads." The flying time-car at sunset over the 1985 cinema |

Files per loop:
- `.mp4`: H.264 High, 1080×2340, 60 fps, CRF 20, faststart, no audio.
- `.720.mp4`: 720×1560, CRF 21, for phones.
- `.webm`: VP9, 1080 wide, two-pass CRF 31. List it first in `<source>`.
- `.jpg` / `.avif`: the poster, which is frame 0, the same frame the loop returns to.

Sizes: mp4 0.8–1.8 MB, 720p 0.35–0.8 MB, webm 0.55–1.4 MB.

Recommended use: section 3, "Five journeys". Use `<video muted playsinline loop autoplay preload="none">`
with `poster`, and set `src` only when the video comes near the viewport. Serve the 720p
file below about 800 px wide. Under `prefers-reduced-motion`, show the poster only.

## 2. Day 1 → Day 30 scroll sequence — `seq-day/`
- `frame-001.webp` … `frame-072.webp`: 1080×2340, WebP q82 (`-sharp_yuv`), 4.2 MB total.
- `manifest.json` has `count`, `width`, `height`, `aspect` and `aspectRatio`. Its `frames[]`
  gives `{file, day, sourceTime}` for each frame, so the page can drive the day counter
  and the 30 path lights.
- Source: **Multiverse of Madness** (`01-29-07_1.MP4`). It changes most beautifully: every
  day is a new planet and sky (lava world → gold ringed giant → black hole → nebula worlds →
  checkered planet → Earth rising over the Moon on Day 30). The camera and rover stay in
  the same framing, so scrubbing reads as one continuous journey. Ocean and Space were
  considered. Ocean mostly changes sky colour, and Space has long black stretches.
- There are 2–3 frames per day, all 30 days covered. Frames are taken only at calm moments:
  controls visible, no habit sheet, no card, nothing mid-sail, and not within about 2.5 s of a
  "Discovered" pill. The Multiverse day boundaries were OCR'd from the "Day N" title, because
  `days.json` has no Multiverse key.
- Recommended use: section 5. Draw the frames to a canvas as scroll progresses, and
  preload them progressively. Under reduced motion, show the key frames 001 (Day 1) and
  072 (Day 30).

## 3. Sightings — `sighting-{n}.*`
These show the real discover moment: the creature appears, the real tap, the ring, the
**Discovered** pill and its chime, then it settles. Each clip is 4.4–4.9 s, cropped to
4:5 at native 1100×1375, 60 fps. The tap lands about 2.3 s in.

Files per clip:
- `.mp4`: H.264 CRF 19 with AAC audio, the original in-app sound including the chime.
- `.webm`: VP9 with Opus audio.
- `.jpg` / `.avif`: the poster, taken 0.45 s after the tap (pill fully shown).

The audio is kept because the chime is the point of these clips. Autoplay must still be
muted; offer a tap to unmute.

| n | source @ seconds | creature |
|---|---|---|
| 1 | Ocean `00-57-18_1.MP4` @ 64.60–69.40 | Day 3: a seahorse under the boat, in the rain |
| 2 | Road `01-11-43_1.MP4` @ 167.90–172.30 | Day 8: a peacock under the rainbow fans its tail |
| 3 | Space `01-20-45_1.MP4` @ 75.40–80.30 | Day 6: a rocket ship crossing the ringed world |
| 4 | Multiverse `01-29-07_1.MP4` @ 252.40–257.30 | Day 18: a prism crystal creature on the green nebula world |
| 5 | Multiverse `01-29-07_1.MP4` @ 374.30–379.00 | Day 25: the lava wyrm under the checkered planet |
| 6 | Hollywood `01-37-12_1.MP4` @ 194.20–198.90 | Day 13: a lightbulb creature as the time-car flies past |

Recommended use: section 8, "Sightings", as a row or carousel of 4:5 tiles that play on
hover or when in view.
