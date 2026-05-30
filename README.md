# BarePlate — Design System

> **Save recipes from anywhere. Clean and simple.**
> No ads, no life stories, no scrolling — just the recipe, saved forever in your personal cookbook.

BarePlate is a clean, minimalist recipe-saving mobile app for casual home cooks. It captures recipes from anywhere — a URL, a TikTok or YouTube video, an Instagram or Facebook post, a camera scan of a cookbook or handwritten heirloom card, or typed from memory — and extracts **just the recipe**. The product never generates recipes; it only extracts and structures human-authored sources. The experience is offline-first, hands-free in the kitchen, and respectful of the user's time.

**Platform:** iOS first, then Android, web, and Mac.
**Typography:** Plus Jakarta Sans throughout.
**Positioning:** Scandinavian-minimalist meets warm, approachable food culture — premium yet practical for a messy kitchen.

---

## Sources

This design system was built from three product documents provided by the client (no codebase or Figma was supplied — the visual system below was authored fresh to the brief):

- `uploads/Product Brief.docx` — complete feature list, monetization, V2 roadmap, the "36 cons addressed."
- `uploads/Features.docx` — screen-by-screen feature spec, navigation, themes.
- `uploads/User Journey.docx` — full flow from first open to done cooking, edge cases.

The brand-personality and design-rule notes in the kickoff brief drove the foundations (Scandinavian minimalism, warm food themes, white background, no dividers, soft corners, Cook Mode readability).

> ⚠️ **No source code or Figma file exists yet.** Everything here is an *original* system designed to the written brief. Treat it as the canonical starting point, not a recreation of an existing build.

---

## The Products

There is **one product** today: the **BarePlate mobile app** (iOS-first). Adjacent surfaces named in the brief but not yet designed: a Chrome extension, an iPad/Mac app, and a web app at the app's URL. The UI kit in `ui_kits/mobile-app/` covers the phone experience, which is the heart of the product.

**Navigation** — a 3-tab bottom bar: **My Recipes · Grocery List · Profile**. There is deliberately *no* Home tab and *no* Settings tab — My Recipes is the landing screen, and all settings live under Profile. A full-width **`+ Add a Recipe`** pill floats above the tab bar on the main screens.

**Key screens:** My Recipes (list), Recipe Detail (Ingredients/Steps tabs), Cook Mode (full-screen, hands-free), Done Cooking, Grocery List (aisle-grouped), Add Recipe sheet, Extraction Loading, Extraction Failure, Profile & Settings, Sign-in prompt, Edit Recipe.

---

## CONTENT FUNDAMENTALS

BarePlate's voice is **warm, calm, trustworthy, and quietly confident**. It talks like a helpful friend who respects your time — never salesy, never cute for its own sake, never anxious.

**Person & address.** Second person, conversational. The app speaks *to you* ("save your first recipe to get started", "you were on step 3"). It refers to your content as *yours* ("your cookbook", "your recipes live here"). First-person plural only for trust/privacy statements where accountability matters ("we process your URL to extract the recipe and do not store it").

**Casing.** Sentence case nearly everywhere — screen titles, body, buttons ("Start Cooking", "Add a Recipe", "Mark as Cooked"). The **only** uppercase is small section labels (ingredient sections like `BASE`, `SAUCE`; grocery aisles like `PRODUCE`, `PANTRY`), set in the theme accent with wide letter-spacing. No ALL-CAPS shouting, no Title Case Everywhere.

**Tone of microcopy.** Reassuring and plain-spoken. Extraction narrates itself honestly and a little warmly: "reading the page… stripping ads… removing story… extracting recipe…". Errors are clear and never blame the user — "This page is behind a paywall — try pasting the recipe text directly." The done-cooking moment is gentle: "Enjoy your meal" with a static sparkles icon — **no confetti**, just a satisfying close.

**Trust language is explicit.** Because trust *is* the product, the app states its limits out loud: "extracted from video — review before cooking", "auto-extracted / video-extracted / manually entered" badges, "Original source always preserved · View Original", "Your recipes are backed up". Sign-in is invited, never demanded: "Sign in to keep them safe across all your devices — free forever" with an always-present "Not now".

**Numbers & units.** Cooked counts read as "4×". Servings as "Serves 6". Timers spelled from the recipe ("Boil for 10 minutes"). Units offer a one-tap Metric/US toggle.

**Emoji:** none. The brand never uses emoji. Personality comes from spacing, warmth of color, and gentle word choice — not decoration.

**Specific examples**
- Empty cookbook: *"Your cookbook is empty — save your first recipe to get started."*
- Home subtitle (always visible): *"Save recipes from anywhere. Clean and simple."*
- Add sheet hint: *"or share directly from Safari, YouTube, TikTok, and more."*
- Cook-mode resume: *"Welcome back — you were on step 3."*
- Privacy: *"We process your URL to extract the recipe and do not store it."*
- Milestone chip: *"3rd time cooking this."*

---

## VISUAL FOUNDATIONS

The whole system is built on **negative space and warmth**. Calm, spacious, premium — but unfussy enough to use with greasy hands.

**Color.** The **background is sacred**: pure white `#FFFFFF` in light mode, near-black warm `#131210` in dark mode — *never* tinted by a theme. All personality comes from a single accent that touches **only buttons, icons, active states, borders, and section labels**. There are four food-inspired themes, each a distinct color *family* (not shades of one hue): **Saffron** (warm golden/amber — default), **Sage** (muted green → forest), **Terracotta** (blush/clay → deep rust), **Ocean** (pale blue → navy). Each theme exposes `--accent` (the bright color for fills/icons), `--accent-deep` (a darker version for accent *text* on white, for contrast), `--accent-soft` (a faint wash for chips and selected rows), and `--accent-line` (an accent-tinted hairline). Dark mode is **independent** of theme — any theme can combine with dark, and the soft washes deepen so they read on near-black. Neutrals are subtly *warm* grays, never cold/blue. **Semantics follow the theme too:** the cook-mode timer (`--timer` = accent), its wash (`--timer-bg` = accent-soft), and success marks (`--success` = accent-deep) all recolor with the active theme. The **only** fixed semantics are **danger** (`--danger` / `--danger-bg`, always the same warm red so destructive actions are unmistakable) and the **background** itself.

**Typography.** Plus Jakarta Sans, full weight range. Headings 600–700 with a slight negative letter-spacing for the display sizes; body 400 at a relaxed 1.55 line-height. The type scale runs 12 → 34px, plus a dedicated **26px Cook-Mode size** for arm's-length readability. Generous size jumps and lots of leading create the spacious feel. Section labels are the one tracked-out uppercase moment (12px, 700, `0.08em`, accent color).

**Spacing & layout.** 4pt base scale. Screen edges pad to 24px. Sections breathe with 32–72px gaps. **No dividers between list items** — recipes, ingredients, steps, and grocery items are separated by *whitespace alone*, never hairlines. Fixed elements: the bottom tab bar, and the floating `+ Add a Recipe` pill pinned just above it (Recipe Detail pins a `Start Cooking` CTA in the same spot). Content is single-column and left-aligned; meta (amounts, times, cooked counts) right-aligns on its row.

**Backgrounds.** Flat. No gradients, no repeating patterns, no textures, no illustration wallpaper. The only "imagery" is the **recipe photo** (auto-grabbed from the source on save, user-replaceable), shown as a rounded header band on Recipe Detail and as a thumbnail-free, text-first card in the list. When a recipe has no photo, a calm **bowl icon placeholder** stands in. Photography, when present, should feel **warm and natural** — real kitchen light, not cold studio styling.

**Corners.** Soft and minimal — 10–14px on cards and inputs, up to 20px on photo headers and bottom sheets, full pills (`999px`) for the Add button, chips, and toggles. Never sharp, never aggressively round.

**Cards.** Cards are quiet: warm-gray surface (`--surface`) *or* simply whitespace on white, a whisper-soft shadow (`--shadow-md`, `0 2px 12px rgba(28,26,23,0.06)`), 14px radius, no border. On the main list, recipe rows are nearly borderless — they read as text blocks with comfortable padding, not boxed cards.

**Borders & shadows.** Hairlines are rare and warm (`--border #ECE9E4`), reserved for inputs and the occasional structural edge — never between list items. Shadows are soft, warm-tinted, and low-contrast; there are four steps from `--shadow-sm` to `--shadow-lg` (sheets/modals), plus a slightly stronger `--shadow-pill` for the floating Add button. No inner shadows, no glow.

**Transparency & blur.** Used only for **scrims** — the dimmed recipe list behind a bottom sheet (`rgba(0,0,0,0.35)`), and the tab bar **fading to near-invisible** in Cook Mode. Optional subtle backdrop-blur on the pinned bottom CTA bar so content scrolls softly beneath it. No frosted-glass everywhere.

**Animation.** Calm and physical, never bouncy or flashy. Bottom sheets **slide up** with an ease-out curve (~280ms). Tab and screen transitions are gentle **fades/slides** (~200ms). Extraction shows a quiet spinner + progress bar with steps lighting up. The done-cooking moment is **warm and subtle — explicitly no confetti**. Standard easing: `cubic-bezier(0.22, 0.61, 0.36, 1)` (ease-out). Durations: 150ms micro, 200ms transitions, 280ms sheets.

**Hover / press states.** This is touch-first, so **press** matters most: pressed rows/buttons shift to `--surface-2` (a slightly deeper warm gray) and filled accent buttons darken ~8%; a subtle `scale(0.98)` on tap for buttons and cards. Haptic feedback fires on step advance and timer completion. On web/desktop surfaces, hover is a gentle background wash (`--accent-soft`) or a small opacity lift — never a hard color flip.

**Iconography vibe.** Thin, rounded line icons (see ICONOGRAPHY). They carry the accent color when active, otherwise sit in `--fg2`. Stroke weight stays light to match the airy type.

---

## ICONOGRAPHY

BarePlate uses a **single, consistent line-icon family**: thin (≈1.75px) strokes, rounded caps and joins, no fills. This matches the airy typography and Scandinavian restraint. Icons are **monochrome**, taking `--fg2` at rest, `--fg1` for primary actions, and the theme `--accent` when active/selected. The destructive trash icon may take `--danger`.

**Source.** Since no codebase shipped, the system standardizes on **[Lucide](https://lucide.dev)** — an open-source line set whose 1.5–2px rounded-stroke style is an exact match for the brand. It is linked from CDN (`lucide@latest`) and used across the UI kit; no icons are hand-drawn. If the team later builds a native icon font, it should preserve Lucide's stroke weight and rounded terminals.

**Key glyphs in use** (Lucide names):
- Tabs: `book-open` / `notebook` (My Recipes), `shopping-basket` (Grocery), `user` (Profile)
- Actions: `plus` (Add), `search`, `folder` (Collections), `pencil` (Edit), `share` / `share-2`, `arrow-left` (Back), `arrow-up` (tap-to-top), `x` (close/cancel)
- Recipe meta: `chef-hat` (cooked count), `clock` (cook time), `star` (rating), `wifi-off` → represented as an "Offline" flag, `info` (Review explainer)
- Cook mode: `mic` (AI voice), `timer` (themed), `play`, `pause`, `chevron-left` / `chevron-right`
- States: `utensils-crossed` / a bowl mark (empty/placeholder), `sparkles` (Done Cooking — static), `camera` (scan / swap photo), `check` (grocery check-off)
- Settings: `palette` (theme), `moon` (dark mode), `cloud` (backup), `shield` (privacy), `globe` (language), `scale` (units)

**Emoji:** never. **Unicode chars as icons:** never (the `×` close and `–`/`+` scaler use real icon glyphs or styled type, not arbitrary symbols). **App icon:** TBD — being designed separately; `assets/app-icon.svg` is only a rough placeholder, not the final mark.

---

## Files in this system

| File | What it is |
|---|---|
| `README.md` | This document — context, content & visual foundations, iconography, manifest. |
| `colors_and_type.css` | All design tokens: color (4 themes + light/dark), type scale, spacing, radii, shadows, semantic type classes. **Import this first.** |
| `SKILL.md` | Agent Skill entry point for using this system in Claude Code. |
| `assets/` | App icon, bowl placeholder mark, and any brand imagery. |
| `preview/` | Small HTML specimen cards that populate the Design System tab. |
| `ui_kits/mobile-app/` | High-fidelity, clickable recreation of the BarePlate phone app (JSX components + `index.html`). See its own README. |

**UI kits**
- `ui_kits/mobile-app/` — the iOS-first BarePlate app: My Recipes, Recipe Detail, Cook Mode, Grocery List, Add Recipe, Profile, and supporting states.
