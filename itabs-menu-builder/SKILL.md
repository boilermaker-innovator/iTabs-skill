# iTabs Session Log — 21 May 2026

## What We Discussed

- Lunches Down Under menu built yesterday was a single scrolling page
- Jon pointed out scrolling defeats the purpose of pre-ordering (saving time)
- Decision: tabs are the correct default UX for all iTabs menus going forward

## What We Built / Changed

### 1. Updated itabs-menu-builder SKILL.md

Major changes to the skill:

- **Tabs are now the default** — removed all “scrolling” language
- Added **Tab Bar Pattern** with full HTML/CSS/JS code for Townie
- Added **2x2 Size Card Grid** pattern for coffee size picker (from Joey Zaza’s reference)
- Added **Choice Picker Modal** — for free single-step selections (Chips/Salad, Sandwich/Roll/Wrap)
- Added **Two-Step Picker** — for “or” items (filling first, then bread)
- Added **Val.town Deploy** — critical: single main.ts with HTML in template literal, NO file reading
- Added **Global Var Declarations** — all picker state vars must be at top of script or silent failure
- Removed welcome hero banner from Mode 2 venue menus
- No arrow functions enforced in tab code

### 2. Rebuilt Lunches Down Under Menu

- Full rebuild from scratch — 7 tabs: Breakfast, Toasties, Lunch, Baine Marie, Salad Boxes, Sandwiches, Coffee
- All 38 items hardcoded in HTML (no dynamic rendering)
- Dark theme with amber accent (#f5c400)
- Deployed via main.ts template literal approach (Missy built the HTML, Townie handled Val.town structure)

### 3. Choice Pickers Added

- **Baine Marie** — Chips/Salad 2-column picker
- **Sandwiches** — two-step: filling first (Ham/Beef/Salami/Tuna etc), then bread (Sandwich/Roll/Wrap)
- **Salad Boxes** — Add+ button with salad picker (9 options), with Meat items get meat picker first
- **Coffee** — S/M/L size picker (3 cards)

### 4. Key Lesson: Val.town Deployment

The correct structure for Val.town HTTP vals:

- Single main.ts file
- HTML wrapped in template literal (safe as long as HTML has zero backticks)
- Do NOT use Deno.readTextFile or import from file — sandbox doesn’t support it
- Townie kept breaking things by using dynamic JS rendering — hardcoded HTML is more reliable

## What’s Next

- Push updated SKILL.md to GitHub (boilermaker-innovator/iTabs-skill)
- Wire up PIN editor with blob storage so owner can edit menu items live
- Two-step picker for “or” sandwich items needs admin-editable choice lists
- Consider approaching Lunches Down Under with the live demo

## Val URLs

- Live (via proxy): https://fancy-boat-fe43.jgwynne7.workers.dev/?url=https://jgwynne7_4bf3679b–lunches-down-under.web.val.run
- Val: jgwynne7_4bf3679b/lunches-down-under
