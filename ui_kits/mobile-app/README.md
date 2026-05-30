# BarePlate — Mobile App UI Kit

A high-fidelity, clickable recreation of the **BarePlate iOS app** (iPhone). It mocks the real product surfaces with cosmetic-only components — not production logic — so screens can be recombined for new designs.

## Run it
Open `index.html`. It mounts a scaled iPhone frame. Everything is fake but interactive:

- **My Recipes** — tap a recipe to open detail; tap **+ Add a Recipe** to open the add sheet.
- **Add a Recipe** → paste a URL + **Go** → **Extraction Loading** auto-runs → opens the recipe + a gentle **Sign-in** prompt. (Type a paywalled domain like `cooking.nytimes.com` to see the **Extraction Failure** branch.)
- **Recipe Detail** — serving scaler (live-rescales amounts), Metric/US toggle, Ingredients/Steps tabs, **Start Cooking**.
- **Cook Mode** — progress dots, inline ingredients, themed timer block, Back/Next (swipe also advances) → **Done Cooking** → **Mark as Cooked**.
- **Grocery List** — aisle-grouped, tap to check off (strikethrough + fade).
- **Profile** — 4 theme dots + dark-mode toggle (both persist and recolor the whole app live).

## Files
| File | Contents |
|---|---|
| `index.html` | Loads React + Babel + Lucide, mounts the app, scales the phone to fit. |
| `kit.css` | All kit styles; `@import`s the root `colors_and_type.css` tokens. |
| `data.jsx` | Sample recipes, grocery list, theme list. |
| `ui.jsx` | Primitives: `Icon` (Lucide SVG), `PhoneFrame`, `StatusBar`, `TabBar`, `PinnedCTA`, `NavBar`, `IconButton`, `Stars`, `Sheet`. |
| `RecipeScreens.jsx` | `MyRecipes`, `RecipeDetail`, `IngredientsTab`, `StepsTab`, `BowlMark`. |
| `CookScreens.jsx` | `CookMode`, `DoneCooking`. |
| `OtherScreens.jsx` | `GroceryList`, `Profile`, `Toggle`, `AddRecipeSheet`, `ExtractionLoading`, `ExtractionFailure`, `SignInSheet`, `CollectionsSheet`. |
| `App.jsx` | Navigation state machine + theme/mode persistence. |

## Conventions worth copying
- **Icons** render as real React SVG from Lucide's icon data (`window.lucide.icons`) — never DOM-mutated. Thin 1.75–2px rounded strokes, `currentColor`.
- **Themes** are driven by `data-theme` / `data-mode` on the phone root; only accent tokens change, the background never does.
- **No dividers** between list items anywhere — whitespace only.
- **Timers follow the active theme** (`--timer` = accent); only danger and the white background are fixed.

## Known simplifications
- Recipe photos use Unsplash demo URLs (warm food shots) with a bowl-icon placeholder fallback. Two recipes carry photos; the rest show the placeholder header.
- Search, Collections detail, Edit Recipe, camera scan, and AI voice are stubbed (buttons present, no deep flow).
- Timers display a static countdown; the play button is cosmetic.
