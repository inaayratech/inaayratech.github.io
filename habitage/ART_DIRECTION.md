# Habitage site: art direction (locked 2026-09-26, revised for the product owner's direction)

**In one line:** modern and calm, magical and quietly interactive. The app's real worlds are the stars; everything around them stays out of the way.

## References, and what we take from each
- **Apple product pages**: confident restraint and one idea per viewport. Sticky scroll-telling, where the media changes under still text. Large, tight, rounded-grotesque headings. We take the Day 1 → Day 30 sticky sequence, the pinned filmstrip and the pacing.
- **Alto's Odyssey site / game**: the landscape carries the emotion and copy is sparse. We take full-bleed worlds with a single quiet line over them.
- **Sky: Children of the Light**: light as the thing you gather and give. We take *light* as the only motif. Progress is shown by soft light, never by badges or numbers shouting.
- **Monument Valley**: generous space and calm pacing. We take air around everything.
- **Award-level WebGL storytelling (Awwwards and FWA 2026)**: the site is something to *do*. We take the live, real 3D isles, which a visitor can wake themselves, loaded only when they ask.

## Palette: calm night, desaturated dusk
| token | value | use |
|---|---|---|
| `--night` | `#0a0d1c` | page ground |
| `--navy` | `#0f1326` | sections, dialog |
| `--slate` | `#1b2034` | raised surfaces |
| `--dusk` | `#b9b3d6` | eyebrows, quiet labels (desaturated lilac) |
| `--rose` | `#cdb0bd` | used sparingly |
| `--warm` | `#eadbc3` | soft lamplight: the ONLY warm accent (lit days, voice lines) |
| `--ink` | `#f3f1ee` | text, primary button |
| `--mist` | `rgba(233,231,242,.68)` | body copy |

Rules:
- There are no saturated purple or gold washes and no candy colours.
- Colour comes from the app's worlds. Renders are shown slightly desaturated (`saturate(.82–.88)`) so they sit calmly in the navy. They return to full colour on hover.
- The primary button is a soft ink-white pill. There are no gradient gold CTAs.

## Type
One family, the app's own: `ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", "Nunito", system-ui, sans-serif`. It is SF Pro Rounded on Apple devices, with Nunito loaded from Google Fonts as the rounded fallback elsewhere. There are no serif display fonts.
- Headings: 600, tracking −0.035 to −0.045em, `text-wrap: balance`. Emphasis is a *quieter* colour, never italic or bold.
- Body: 17–20px, 1.55 line height, mist colour.
- Labels are sentence case at 14px/600 in dusk. There are no all-caps badges.

## Light and material
- Only real renders are used: the 3D chapter worlds and Aurel's isles (captured from the app's own WebGL builds), plus real in-app journey screenshots.
- Glass is a 4.5% white fill, 20px blur and a 1px hairline at 12%. Nothing opaque sits over a scene.
- Light is soft: a large, faint radial glow follows the pointer (desktop) and scroll. A few slow motes drift up through the page. There are no neon edges and no glow stacks.
- Images meet the page through gradient feathering into the navy.

## Motion: subtle, responsive, silent
- The easing is `cubic-bezier(.22,.61,.21,1)` at 1.0–1.6s. Reveals travel 18px and clear a 6px blur. Nothing bounces or pops.
- Parallax is shallow (≤ 12%) and on media only. Text never floats away from where you read it.
- Scroll drives *state*: the day counter, the world cross-fades, the path lighting up, the mist lifting, and the filmstrip gliding.
- The motes canvas holds ≤ 36 particles, is capped at 30fps, and pauses when hidden.
- `prefers-reduced-motion`: no parallax, motes, pointer light, blur-reveals or scrubbed transforms. State still changes and content is immediately visible.

## The scroll story
1. **Arrival**: Aurel on the waking isles at dusk. "Habit is a beautiful journey." / "Hop on — let's sail." App Store link and 7-day trial.
2. **The pledge**: a 30-day journey, at your own pace, in your own words.
3. **Day 1 → Day 30**: sticky. The counter climbs, real chapter worlds cross-fade from a sleeping lagoon to the Cradle of Dawn, and thirty points on a path light one by one.
4. **Living worlds**: ocean, road and space (real in-app scenes), and the Home Road World. Its sky is tinted by the visitor's actual clock.
5. **Aurel**: the companion.
6. **Thirty chapters**: a pinned filmstrip of all 30 worlds.
7. **Aurel's Home**: the mist lifts on scroll (asleep → awake, same camera), then the wonders and the house. *Wake the isles yourself* opens the real 3D world.
8. **Sightings**: the Field Guide.
9. **Together, calmly**: friends, crews of up to 6, watchers, cheers and chat. Widgets and voyage cards.
10. **Pricing**: one glass panel.
11. **Dawn**: the closing line over the Cradle of Dawn, then the footer.
