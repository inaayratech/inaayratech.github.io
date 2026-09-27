# media/worlds — 3D world films for the Habitage site

These are rendered from the real app worlds in `HabitageFlutter/docs/home` (Aurel's isles) and `HabitageFlutter/docs/chapters/preview/NN.html` (chapter worlds).
- **Timing is deterministic.** `requestAnimationFrame` and `performance.now` are replaced, so each captured frame advances exactly 1/30 s.
- **Supersampled.** Every frame is rendered at 2× the output size in headed Chrome on the GPU, then Lanczos-downscaled.
- **No UI.** Every HTML overlay is hidden (`body > *:not(#app)`) and the isles' tags are off.
- **One patch, applied in the browser only.** Playwright rewrites the camera line as the page is served: it removes the handheld wobble on the isles and adds a direct camera override for the chapters. No source file was changed.

Total size: about 121 MB, including `_tools`.

## Encodes (the same for every film)
| suffix | what |
|---|---|
| `.mp4` | H.264 High, yuv420p, faststart, no audio. Hero at CRF 22, worlds at CRF 24 (see size note). |
| `-720.mp4` | 1280×720 (or 720×1280 for 9:16), H.264 CRF 21 for the hero and CRF 24 for the worlds. |
| `.webm` | VP9 CRF 35 (hero 16:9), 33 (hero 9:16) and 38 (worlds), with `b:v 0`. |
| `.jpg` / `.avif` | Poster = frame 0 (the loop start), full resolution. |

All films run at 30 fps. The 16:9 films are 2560×1440 and the 9:16 films are 1080×1920.

## 1. `hero-isles-night*` — seamless loop, 12.0 s (360 frames)
- **Scene.** Hour 23. All 35 wonders are at stage 3 (radiant), so the Star Wheel, carousel, lighthouse beam, lanterns and mist glow are all running. Aurel is hidden.
- **Camera (16:9).** A slow elliptical drift around the archipelago's centre (-1, 2.4, -5.5): the angle swings ±0.30 rad, the radius is 27.5±2 and the height is 6.6±1.3. Every term is periodic in 12 s, so the camera path returns exactly to where it started.
- **Camera (9:16).** Its own composition: higher and closer (radius 20±1.6, height 14±1), looking down the chain of isles toward the Star Wheel.
- **Seam.** The wonder mechanisms turn at unrelated speeds, so 13.5 s were rendered and the first 1.5 s were crossfaded (smoothstep) with the matching frames at 12–13.5 s, where the camera is identical.
  - Measured: the difference between frame 359 and frame 0 is the same as between any two neighbouring frames (mean ≈2.9/255).
  - Side effect: during the first 1.5 s the balloon swings show a faint double image.

## 2. `seq-isles-wake/` — scroll-scrub sequence, 85 frames
- **Format.** `0000.webp`–`0084.webp`, 1920×1080, WebP q82, about 80 KB each, 6.7 MB in total. `manifest.json` has the frame count, pattern, key frame (84, fully radiant, for reduced motion) and the wave frames.
- **What happens.**
  - It opens at hour 23 with every wonder at stage 0 and the outer isles in mist.
  - The wonders then wake in 5 waves, ordered by distance from the home isle and 3 s apart. Each wave steps through stages 1, 2 and 3, 0.35 s apart, pushed with `HW.quietNext('wakes')`.
  - Each isle's mist lifts on camera once the glow passes its threshold.
- **One continuous take.** The camera sinks and drifts in from high and wide (radius 36, height 15) down to the hero angle (radius 27.5, height 6.6). The move is smoothstep-eased over 19.8 s of simulation, and each frame is 7 sim frames (0.233 s).

## 3. `world-*` — chapter worlds, 7.0 s each (210 frames), steps(10) fully lit
All 30 worlds were captured awake, both from the arrival view and from a vista; see `_tools/contact-*.jpg`. I picked six that together run from dusk, through night, to dawn, so they line up with the page's evening-to-dawn sky:

| file | chapter | why | move (camera pos → pos, look target) |
|---|---|---|---|
| `world-lantern-lagoon` | 01 Lantern Lagoon | violet dusk, moon, willows, lilies, glowing gold door | high dolly-in: (3,9,26)→(-1,5.5,13), look (-2,1,-6)→(-3,1.5,-12) |
| `world-moth-mangroves` | 18 Moth Mangroves | bioluminescent teal water, lantern boardwalk, moths | descending dolly: (-3,6.5,24)→(-2,5,14), look (0.5,1,-6)→(0.5,1.2,-7) |
| `world-aurora-ice` | 16 Aurora Ice | aurora curtains, pastel-lit pines, glowing cracked ice, frozen falls | low glide over the ice: (-1,5.5,19)→(2,3.6,9), look (3,3,-15)→(5,3.8,-20) |
| `world-orrery-summit` | 20 Orrery Summit | golden orrery rings and planets against a starry violet night | arc and descend: (-4,7,24)→(-7,3,22), look (0,4.5,-6)→(1,5.5,-5) |
| `world-lighthouse-causeway` | 26 Lighthouse Causeway | afterglow horizon, electric-blue tide pools, beam sweeping | dolly along the causeway: (2,8,34)→(3,5.5,22), look (0,2.5,-25)→(1,3,-30) |
| `world-cradle-of-dawn` | 30 Cradle of Dawn | sunrise over a gold cloud sea: the story's dawn ending | crane up: (0,3.2,50)→(0,11,44), look (0,3.5,-10)→(0,1.5,-10) |

- **Easing.** Each move is 75% cosine-eased and 25% linear, so it never comes to a full stop.
- **9:16 variants.** They use the same path with the portrait field of view (58°).
- **What's in the frame.** Aurel stands at the arrival point and shows up small in 01, 16, 26 and 30. The silver door is kept out of the lens: each path was checked against its position.
- **Runners-up.** 21 Drifting Isles (too close to the hero isles), 13 Geode Hollow (black sky clashes with the palette), 02 Glowcap Grove, 29 Stair of Last Stars, 22 Wisteria Cloister.

## Rebuild
The scripts are in `_tools/`:
- `lib.cjs`: time control and launch.
- `hero.cjs`, `wake.cjs`: the isles.
- `ch_move.cjs` with `moves.json`: the chapter moves.
- `compose.py`: downscaling and the loop crossfade.
- `encode.sh`: the encodes (the size pass later re-encoded worlds at CRF 24 / VP9 38).

They need the static servers running: `docs/` on :8765 and `docs/chapters` on :8813.

## Timing
Rendering is fast on an M1 Max GPU in headed Chrome:
- Hero: about 0.15 s per 5120×2880 frame, so about 1 min per aspect.
- Wake sequence: about 11 s.
- The six worlds in both aspects: about 2 min.

Downscaling and encoding took about 20 min in total, most of it VP9.
