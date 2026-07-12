# DevMon Design System — LOCKED

## Direction
Name: **Terminal Collectible** — a dark, monospace-inflected developer-tool surface
crossed with the physical materiality of a premium trading card: foil edge, deep
glow, tactile weight. Pure dark and monochrome — no branded accent hue anywhere
outside the cards themselves. Restrained and confident, not glossy or neon. If you
catch yourself reaching for a floating gradient blob, a glass-blur card with a neon
border, or a centered hero with three icon-cards underneath, stop — that generic
default is exactly what this system rejects.

## Color
Roles, not vibes. Use these exact values — don't warm them up, and don't add a hue
that isn't listed here.

- `--surface-0` (page background): `#0A0A0B` — near-black, never pure `#000`
- `--surface-1` (cards, panels): `#131316`
- `--surface-2` (hover/raised state of surface-1): `#1B1B1F`
- `--border-hairline`: white at 8% opacity — the ONLY border treatment anywhere;
  no solid gray 1px card borders
- `--text-primary`: `#F2F1EE` — warm off-white, never pure `#FFFFFF`
- `--text-secondary`: `#9B9995`
- `--text-tertiary` (timestamps, meta): `#65635D`

There is no accent hue. This is a pure monochrome interface — hierarchy comes from
brightness and weight, not color, the same way Linear, Vercel, and Raycast do their
dark UI:
- Primary buttons: solid `--text-primary` fill, `--surface-0` text — a "reverse"
  button, the brightest thing on the page, not a colored one
- Secondary buttons: `--border-hairline` outline, transparent fill, `--text-primary` text
- Links/interactive text: `--text-secondary` at rest → `--text-primary` on hover —
  brightness is the signal, an underline is optional, a new color is not allowed
- Focus ring: 2px solid `--text-primary`, 2px offset

Rarity-tier colors are the ONLY hue anywhere in the app, and they only ever appear
on/around a card's own glow, badge, and border for that specific card — never as a
page background, a button, or anything outside the card/badge components. One
sentence to hold onto: **the only color in this app is the color of your card.**
- Common: `#8A8F98` (graphite)
- Rare: `#3E6FE0` (deep sapphire — flat tone + glow, never a gradient)
- Epic: `#6C4BA6` (muted amethyst, deliberately desaturated so it never reads as
  "default AI purple" — this is the ONLY place violet appears in the app)
- Legendary: `#E0932E` (amber)
- Mythic: `#B23A48` (oxblood/crimson, not a bright red)

## Typography
- Display/headline: **Fraunces** (Google Fonts, variable, high optical size,
  weight 600–680, tracking -1% to -2% at 48px+). Hero copy, page titles, the big
  stat numbers, and rarity tier names only.
- UI/body: **Geist** (Vercel, free), weights 400/500/600. Everything else.
- Numerals (stat values, rarity score, leaderboard rank, counters): **Geist Mono**
  with `font-variant-numeric: tabular-nums` so digits don't jitter on count-up.
- Load both via `next/font/google` at the layout root and confirm in DevTools that
  computed `font-family` is actually Fraunces/Geist, not a fallback. Hard gate, not
  a suggestion.
- Never fall back to Inter, Roboto, Arial, or system-ui anywhere in the app.

**Type scale — locked sizes, nothing outside this list:**
- Hero (Landing page H1 ONLY): `clamp(3.5rem, 8vw, 7rem)` (56–112px, fluid) —
  Fraunces 640–680, -2% tracking. One instance in the whole app. 2026 award sites
  consistently treat the headline as the primary visual element rather than a
  caption sitting on top of an image — this is DevMon's one deliberate use of that.
- Display (page titles, big stat numbers, rarity tier names): 64px desktop / 40px
  mobile — Fraunces 640–680, -2% tracking
- Section headline: 36px desktop / 28px mobile — Fraunces 600, -1% tracking
- Body: 16px — Geist 400, 1.5 line-height
- Meta/label: 13px — Geist Mono 500, uppercase, +8% tracking

Never ship an in-between size (e.g. a 20–28px "headline"). The jump between tiers
should read as a deliberate decision, not a rounding error.

**Section eyebrow label:** every major section (Landing page sections, Leaderboard
header, Battle result) gets a small uppercase label directly above its headline —
using the Meta/label style above, colored `--text-tertiary`. This is not a new
component or token, just a fixed placement convention that reuses the existing
mono/tabular type to add scannable hierarchy.

**Kinetic scroll type (Landing hero ONLY, nowhere else):** GSAP ScrollTrigger
scrubs the Hero line's font-weight from 640→680 and tracking from -1%→-2% across
the first 100vh of scroll. This is the one "text as a living element" moment in
the app — it does not repeat on Card/Battle/Leaderboard, and it never touches
body copy. One considered kinetic-type moment reads as intentional; type that
moves everywhere reads as a template effect applied by default.

## Spacing, radius, elevation
- Component spacing scale: strict 4px base — 4, 8, 12, 16, 24, 32, 48, 64, 96. No
  arbitrary padding values outside this scale.
- Section-level (macro) spacing: 128px vertical section padding on desktop, 64px
  on mobile — a floor, not a default to shrink from. This is the single biggest
  lever separating "considered" from "cramped and generic" — treat it as
  non-negotiable, distinct from the component scale above.
- Corner radius: 6px cap on buttons/inputs/badges, 10px cap on panels/cards in
  general. CardFace may go to 14px (it's mimicking a physical card edge) — nothing
  else exceeds 10px. `rounded-full` pill buttons and `rounded-2xl`/`rounded-3xl`
  are banned outright.
- Elevation — a 2-step named system, nothing else:
  - `--elevation-1`: 1px inset highlight (white, 4% opacity) + 8px soft shadow at
    20% opacity black. CardFace and raised panels only.
  - `--elevation-2`: modals/overlays only — 24px blur at 30% opacity.
  - No stacking multiple `shadow-lg`/`shadow-xl`/`shadow-2xl`. No shadow on flat
    list rows, nav bars, or buttons at rest.
- Borders default to none, or `--border-hairline`. Never a default solid gray 1px
  card border.

## Motion
- Entrance easing: `cubic-bezier(0.16, 1, 0.3, 1)` — a confident decelerate curve,
  not linear and not the CSS default `ease`.
- Gesture/spring interactions (tilt, drag, magnetic buttons): spring physics,
  stiffness ≈ 300, damping ≈ 30 — distinct from the entrance curve above.
- Sibling stagger: any group entrance (stat bars, card grids, leaderboard rows) —
  60–80ms delay per item, capped at 5 staggered items. Beyond 5, switch to one
  grouped fade instead of dragging the stagger out.
- Duration: 150–300ms hover/press, 400–600ms entrances, up to 900ms only for the
  rarity-reveal sequence on the Card page.
- Banned: bounce/elastic easing as a default, the identical fade-in applied to
  every element with zero variation, instant/snap state changes with no transition.

## Imagery
Any screenshot, mock, or illustrative image inside a given section keeps one
consistent aspect ratio for that section/context — don't mix arbitrary crop ratios
side by side. Mixed ratios read as a stock-photo grab bag; one ratio per context
reads as art-directed.

## Texture
This is the single highest-leverage fix for "looks AI-generated": a flat color
field with zero grain is exactly what a generated layout produces, because
nothing physical ever touched it. Apply one static, fixed-position SVG noise
layer at the root, above `--surface-0`, everywhere in the app:
- `feTurbulence` baseFrequency 0.65–0.9, `mix-blend-mode: overlay`, 3% opacity
- Baked once as a static asset (inline SVG or data-URI) — never regenerated on
  scroll or resize, and never animated. It's texture, not an effect.
- This is the ONLY departure from pure flat color in the system. It sits under
  everything else in this file, not instead of it.

## Performance budget
2026 award-tier sites are consistently fast, not just animated — this is treated
as a design decision, not an engineering afterthought:
- LCP < 1.8s, TBT < 200ms, CLS = 0 on the Landing page, checked in Lighthouse
  before any phase is marked done
- 60fps sustained during every scroll animation — if GSAP/motion drops frames on
  a mid-tier device, cut the effect rather than ship it janky
- A slow "cinematic" animation reads as amateur, not premium; a fast, precise one
  reads as crafted. When in doubt, cut duration before cutting frame rate.

## Navigation
DevMon is a 4-page conversion-simple app (Landing, Card, Battle, Leaderboard), not
an experience-led portfolio. Keep navigation conventional and always-visible — no
radial menus, hidden drawers, or puzzle-to-explore patterns. Experimental
navigation is a valid 2026 award-circuit trend, but it's a fit for storytelling
sites, not a utility app where users need the leaderboard in one click.

## Banned patterns — hard fail, redo if you produce any of these
- Purple-to-blue or purple-to-cyan gradient anywhere outside the Epic rarity glow
- Default gray 1px border + `shadow-lg` on every card
- Neon glow card borders on a dark background
- Heavy `backdrop-blur` glassmorphism stacked with a glowing border
- Floating abstract 3D blobs or gradient orbs behind the hero
- Generic plastic 3D illustrations or stock photography
- A single centered icon-in-a-circle above every section heading
- Three identical feature cards in a row as the default section layout
- Nested cards inside cards
- Gradient text used as a substitute for real typographic hierarchy
- A "trusted by" logo strip or generic checkmark-circle bullet icons
- Emoji used as UI icons (the existing CLASS_EMOJIS brand content on cards is exempt)
- Any single branded hue (gold, blue, whatever) used as a global accent on buttons,
  links, or nav — hierarchy is brightness/weight only; hue is reserved for rarity
- A custom cursor with more than two visual states, or without spring/lerp
  smoothing — if it lags, snaps, or double-renders with the native cursor, cut it
- Pure `#000000`/`#FFFFFF` anywhere, an unstyled default link blue, or any token
  that looks scraped off a page rather than chosen — if a value doesn't trace back
  to this file, it doesn't ship
- Per-section rainbow/"dopamine" color shifts — this system has one hue family
  (rarity) and it's reserved for cards, full stop
- Kinetic/scroll-linked type anywhere outside the single Landing Hero instance
  defined in Typography
- Animated grain, noise that regenerates per-frame, or any texture effect beyond
  the single static overlay defined in Texture
- Radial menus, hidden drawers, or other exploratory navigation patterns — this
  is a utility app, not an experience-led portfolio
