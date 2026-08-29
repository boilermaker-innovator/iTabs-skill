---
name: itabs-menu-builder
description: 'Build interactive iTabs ordering menus — mobile-first scrollable HTML ordering apps for cafes, restaurants, food hall stalls, and events. Use this skill whenever the user wants to: build a menu for a cafe or restaurant, create an event ordering page, build a coffee ordering widget, make a digital menu with a cart, build a menu for a food hall stall or market vendor, or deploy a menu for a hospitality venue. Trigger on phrases like "build a menu for", "ordering page", "digital menu", "cafe menu", "restaurant menu", "event menu", "food hall", "market stall menu", or any request to create a scrollable menu with cart/ordering functionality. This is different from the iTabs widget builder — menus scroll, card decks swipe.'
---

# iTabs Menu Builder

Build mobile-first scrollable ordering menus — single self-contained HTML files for cafes, restaurants, food hall stalls, and events. These are NOT swipeable card decks. They scroll like a real menu app.

## THE GOLDEN RULE — clone the master, only touch CONFIG

There is ONE canonical build: the **iTabs Menu Master** (`itabs-menu-master.html`). Every new venue is a clone of that file. The ONLY block you edit per venue is the `CONFIG` object at the top of the script. Everything below `/* ENGINE — no need to touch below here */` stays identical across every venue.

This is what keeps menus consistent. Do not hand-build a menu from scratch and do not re-solve problems the master already solves. If a feature is missing, add it to the master FIRST, then clone.

When building fresh (no master handy), the standards below are mandatory so the result matches a cloned master.

---

## Locked Standards (every menu, no exceptions)

1. **Pill-style category tabs** — sticky, horizontally scrollable, highlight the active section as you scroll (scrollspy).
2. **Popular-first / see-more, size-aware** — each category shows best-sellers up front (`popular: true`), the rest tuck under a "See X more" button. If nothing is flagged, show the first 2 and hide the rest. **Categories with 5 items or fewer always show everything — no collapsing, no button.** The collapse/expand behaviour only kicks in once a category actually runs long (use a `COLLAPSE_THRESHOLD` constant, default 5). Hiding items in a short list adds a tap for no real benefit and risks a customer missing a dish. **Tapping a category pill jumps to that section AND auto-expands it** (reveals the hidden items, button flips to "Show less") — a pill tap means "show me everything here." Scrolling past a category you didn't tap leaves it collapsed, so the default stays tidy.
3. **Photo standard** (see below) — 16:9 hero, 1:1 square item photos, three photo modes, logo fallback. Every photo field (logo, hero, per-item) uses the **input + Upload button** pattern — see "Photo Upload UI" below. Never a click-the-tile-only pattern.
4. **Full self-serve PIN editor** — owner edits items AND venue settings, including their own PIN. Built as **two tabs**, not one long scroll — see "PIN Editor" below.
5. **Table number OR pickup time** on the order sheet. Dine-in venues get an optional table-number field. Order-ahead venues set `pickupTimes` (e.g. `[0,15,30,45]` mins) and get a pickup-time picker instead (ASAP / +15 / +30 / +45, with a computed "ready around HH:MM"). Setting `pickupTimes` swaps table number → pickup and adds the pickup line to the order message. A venue with no delivery option (Uber Eats/DoorDash show Pickup only, or the owner says so directly) is pickup-only — don't offer a table number field, and don't list delivery apps in the Connect sheet; note "Pickup only — no delivery" instead.
6. **Dietary chips + kitchen notes box** on the order form — universal, zero per-venue setup.
7. **Category notes** (optional) — a `note` string on a category renders a small line under the section title (e.g. ramen: "soft-yolk egg, bamboo, black fungus, spring onion"). Use for broth choices, "served on rice", allergen lines.
8. **Receipt-as-Reorder** — email receipt with a pre-filled reorder URL. The core differentiator vs mobi2go. (Needs an email provider wired in the Val.town build — see below.)
9. **PIN brute-force lockout** — 5 failed attempts = 15-minute block (per-IP on Val.town, per-device on standalone).
10. **WhatsApp ordering** — order sent to the venue's WhatsApp with items, total, table/pickup, dietary and notes pre-filled. Counter-only is the fallback.
11. **Version stamp** in the footer — `iTabs Menu v[X] · [slug]` so any live menu is identifiable at a glance.
12. **No purple.** Ever. Not in any theme, asset, or default. Pick the accent from the venue's actual brand where possible (see "Matching Real Brand Colour" below) — don't default to amber just because it's the fallback.
13. **No backtick template literals in the client JS** — so the whole page can be wrapped in a Deno `String.raw\`...\`` template for Val.town without nesting conflicts.
14. **Desktop-safe layout** — the ENTIRE page (header, hero, pill tabs, content, not just the item list) is constrained to `max-width: 600px` and centred. See "Desktop Layout" under Val.town Compatibility — a header/hero that's full-bleed while only the item list is centred is a real, recurring bug.

---

## Photo Standard

The photo slot is a product-tier lever, controlled by `CONFIG.photoMode`:

- **`"photos"`** — full/paid look. Real per-item photos (1:1 square, center-cropped, rounded). A missing item photo falls back to the venue **logo**, then to a branded name tile. Never a broken gap.
- **`"logo"`** — free-tier look. Every item shows the venue logo on a clean light tile. Branded, tidy, zero photography. A venue goes live in minutes.
- **`"off"`** — text-only menu, no image column.

**Hero** is a locked 16:9 banner: hero image → logo badge (if no hero image) → venue initial. Name + tagline overlaid on a gradient.

**Logo tiles** sit on a light (`#f4f4f4`) background with `object-fit: contain` so dark/coloured logos read. Note: a pure-white logo will disappear on white — those venues supply a coloured version or use a hero image instead.

Uploaded photos and logos are auto-resized (photos max 500px, logo max 400px, hero max 1200px) and compressed before storage to keep it fast and small.

### Photo Upload UI (locked pattern)

Every photo field — logo, hero, per-item — gets the SAME UI, no exceptions:

```html
<div class="photo-field-row">
  <input class="field-input" placeholder="https://... direct image link" value="">
  <label class="upload-btn-label">Upload
    <input type="file" accept="image/*" style="display:none;">
  </label>
</div>
<img class="editor-photo-preview" style="display:none;">
```

A text input for a direct URL, PLUS a separate "Upload" button (a `<label>` wrapping a hidden `<input type="file">`) — never a click-the-tile-only pattern. Owners expect to be able to paste a URL as well as upload a photo from their phone.

On file select: `FileReader` → `Image` → canvas resize (max dimension per field: 500px item / 400px logo / 1200px hero) → `canvas.toDataURL('image/jpeg', 0.72–0.75)` → write the resulting data URL straight into the text input's `.value` and update the small preview thumbnail. Typing/pasting a URL directly should also update the live preview via `oninput`. Never upload raw files — always resize client-side first, or blob/localStorage bloats.

---

## Order Form (locked layout)

Order sheet, top to bottom:
- Order summary + total
- **Table number** (optional, dine-in) OR **Pickup time picker** (order-ahead / pickup-only venues — see Locked Standard 5)
- **Name**
- **Email** (receipt + 1-tap reorder)
- **Dietary** — tappable chips: Gluten free · Vegetarian · Vegan · Dairy free · Nut allergy. Optional, universal, no venue setup.
- **Notes for the kitchen** — free-text box for anything ("no onion", "sauce on the side", allergy detail).
- Place order / Keep browsing

Dietary selections and notes fold into the order message. Per-item dietary tags exist in the code but are dormant by default — a venue can opt into tagged dishes, but nobody is forced to.

### Order message format (WhatsApp / receipt)
```
Order from [name] for [Venue]:
2x Signature Bowl - $32.00
1x Miso Soup - $5.00
Total: $37.00 | Table 12
Dietary: Gluten free
Notes: no coriander please
```

Pickup-mode venues replace the table line with `Pickup: ASAP (ready ~12:45 PM)` (or +15/+30/+45), computed from the current time plus the selected offset.

---

## PIN Editor — owner self-serve

Subtle "edit" link in the footer → PIN modal → editor. Wrong PIN fails silently. 5 fails = 15-min lockout (per-IP on Val.town, per-device on standalone).

**The editor is built as TWO TABS inside the sheet, not one long scroll.** Past ~15 fields a single scrolling form gets unwieldy — owners lose track of where venue settings end and menu items begin. Use two subtab buttons at the top of the editor sheet that toggle two panels:

```html
<div class="editor-subtabs">
  <button class="editor-subtab active" onclick="showEditorPanel('venue')">Venue &amp; Hero</button>
  <button class="editor-subtab" onclick="showEditorPanel('items')">Menu Items</button>
</div>
<div id="editorPanelVenue">...venue settings + PIN change...</div>
<div id="editorPanelItems" style="display:none;">...per-item editor...</div>
```

`showEditorPanel(panel)` toggles `display` on the two panels and `.active` on the two buttons. Reset to the Venue tab every time the editor opens.

### Venue & Hero tab (top)
- Venue name, tagline
- Phone, WhatsApp (intl format, e.g. 61412…), Email
- Map link, Website
- Brand colour (colour picker, "no purple" hint — see "Matching Real Brand Colour" below)
- **Orders go to**: WhatsApp / Counter only
- **Logo** and **Hero banner** — each using the Photo Upload UI pattern above
- **Item images** mode (Photos / Logo only / None)
- **Change PIN** (new + confirm, must be 4 digits and match)

### Menu Items tab
For every item: the Photo Upload UI (input + Upload button + preview), name + description + price, toggle **★ Popular**, toggle **Sold out**, optional dietary tags, Remove. Plus **+ Add item** per category.

**Sold out** keeps the item on the menu but greys it out with a "Sold out" badge and removes the + button — no delete/re-add.

---

## Matching Real Brand Colour

When a venue already has a public brand (website, Instagram, Uber Eats banner, physical signage), don't default to amber — match their actual colour. Pull it from whatever's visible (hero photo, logo, packaging) and pick the closest locked-palette-safe hex (never purple). Also grab any real contact details visible in the same source (phone, email) — they're a straight upgrade over placeholder defaults.

**Colour picker gotcha:** the browser's native `<input type="color">` picker doesn't always expose a hex field — Chrome sometimes shows only R/G/B number boxes. When walking an owner through setting a brand colour, give BOTH the hex and the R/G/B equivalents (e.g. `#f97316` → R 249, G 115, B 22) since you can't predict which their browser shows.

---

## Deployment modes

### Standalone HTML (demo / proof / handing over a file)
- Single self-contained file. Editor saves to `localStorage`.
- Keys: `itabs-menu-[slug]` (items), `itabs-settings-[slug]` (settings), `itabs-lock-[slug]` (PIN lockout).
- Good for showing a live demo on your phone before approaching a venue.

### Val.town production (the real deployment)
The production build is a **paste-ready Deno HTTP val**. Wrap the HTML in a Deno `String.raw\`...\`` template (client JS has zero backticks, so this is safe) and serve it, with blob-backed edit/save routes. No env vars or secrets needed — Val.town blob is built in.

- **Blob storage** via `import { blob } from "https://esm.town/v/std/blob"`. One state key `itabs-menu-[slug]` holds `{ settings, categories }`. Lock keys `itabs-lock-[slug]-[ip]`.
- **Editor is rewired server-side** (vs the standalone's localStorage):
  - `loadMenu()` reads injected `SERVER_DATA`, replaced into a `__ITABS_DATA__` placeholder with `JSON.stringify` at GET time. The injected settings have `pin` stripped — the PIN is never shipped to the client.
  - `checkPin()` → `POST /unlock` — server validates against the blob PIN (or `DEFAULT_PIN` before first save), with per-IP brute-force lockout.
  - `saveEditor()` → `POST /save` — PIN-checked write to blob. Client keeps the entered PIN in an in-memory `sessionPin` var (never persisted) to reuse across the session; server returns a new pin value only if the owner changed it.
- **First-load behaviour**: until the first staff Save, the menu serves from the seed data baked into the file; the first Save writes it to blob and it's shared from then on.
- **Receipt-as-Reorder email** is the one piece still needing an email provider (e.g. `std/email` or Resend) wired into `/save` or a dedicated route — the confirmation UI already promises it. Flag this per venue.
- Every production menu should carry a `/setup` page (growth ladder: free menu → vendor-connected Square → paid pickup).
- Full `handle/valName` format always, e.g. `jgwynne7_4bf3679b/zensaki`.
- **Deploy**: paste into the val, Save, open the HTTP URL. Test the editor with the PIN to confirm the blob layer works.

### Val.town Multi-File Production Builds (files over ~80K chars)

Val.town caps individual file size around 80,000 characters. A single-file `main.ts` with the full HTML template embedded breaks past that once the engine grows (photo upload, two-tab editor, pickup picker, etc. easily push a template past 90-100K). Split into a small project instead:

- `seed.ts` — exports `SEED` (starting settings + categories, the fallback until first Save)
- `Templatepart1.ts` — exports `HTML_PART1`: `<head>`, CSS, body markup, the `CONFIG` script, and the `__ITABS_DATA__` placeholder script. Wrapped in `String.raw\`...\``.
- `Templatepart2.ts` — exports `HTML_PART2`: the engine script (rendering, cart, editor, photo upload) + closing tags. Same wrapper.
- `main.ts` — imports all three (`./seed.ts`, `./Templatepart1.ts`, `./Templatepart2.ts`), builds `HTML_TEMPLATE = HTML_PART1 + HTML_PART2`, handles routing (`/`, `/unlock`, `/save`).

Split point: right before the `<!-- ENGINE -->` comment keeps part1 (~60-65K) and part2 (~30-35K) both comfortably under the cap, with room for a venue's edits to grow before it needs re-splitting.

**Critical — filenames must match exactly what Val.town actually creates.** When a file is added through the val's own UI, it can auto-transform the name you typed (stripping hyphens, capitalising: `template-part1.ts` → `Templatepart1.ts`). Always confirm the real filename showing in the val's sidebar before writing the `import` path in `main.ts` — a mismatch throws `Module not found` at request time (not at save time), and the fix is just correcting the import path to match, not rebuilding anything.

## Deploying to Val.town (give these steps to Jon every time files are delivered)

The build is fully self-contained — no build step, no env vars, no secrets. Blob storage is built into Val.town. Steps for Jon:

**Single-file build:**
1. Open the `main.ts` file, select all, copy.
2. In Val.town, open the venue's val (must be an **HTTP val**).
3. Select all, delete, paste the new `main.ts`. Save.

**Multi-file build:**
1. Open (or create) the venue's val. Confirm it's an HTTP val with `main.ts` as the entry.
2. For each companion file (`seed.ts`, `Templatepart1.ts`, `Templatepart2.ts`), add a file with that exact name via the val's file panel, then paste its content in. Note the actual filename Val.town shows in the sidebar.
3. Paste `main.ts` last, double-checking its `import` lines match the actual filenames from step 2.
4. Save — Val.town auto-deploys on save.
5. Open the val's HTTP endpoint URL — the menu loads.

Notes to include either way:
- **PIN starts at the seed value** (e.g. Zensaki `2016`); change it in-app via Venue & Hero → Change PIN. New PIN is stored in blob, server-side only.
- **No env vars or secrets to set** — blob is automatic.
- **Test the blob layer**: on the live URL, open the editor with the PIN, change a price, Save; refresh on a *different* device — the change should persist. If it resets, the blob wiring needs a look.
- **First load** serves the seed menu baked into the file until the first staff Save writes to blob.
- Colour and content changes made through the live editor (brand colour, phone, photos, prices) only affect what's in blob — they do NOT update `seed.ts`. If you want the seed to reflect a change for future redeploys, update `seed.ts` separately and redeliver it.

---

## CONFIG block (the only thing you edit per venue)

```javascript
var CONFIG = {
  venue:   "Venue Name",
  tagline: "Fresh, fast, made to order",
  slug:    "venue-name",        // storage key + reorder URL
  accent:  "#f5c400",           // brand colour — match the venue's real brand where known, NEVER purple
  accentInk:"#0d0d0d",
  phone:   "0400 000 000",
  whatsapp:"61400000000",       // intl, no +. Empty = no WhatsApp.
  email:   "orders@venue.com",
  mapUrl:  "https://maps.google.com",
  siteUrl: "https://itabs.ai",
  pin:     "0000",              // default = last 4 of phone
  heroImg: "",                  // 16:9 image. Empty = logo/initial fallback.
  logo:    "",                  // logo for free-tier + photo fallback
  orderMethod: "whatsapp",      // "whatsapp" | "counter"
  photoMode: "photos",          // "photos" | "logo" | "off"
  pickupOnly: false,            // true = no delivery, hide delivery links, "Pickup only" hero badge
  pickupTimes: [0,15,30,45],    // OPTIONAL. Set for order-ahead / pickup-only (pickup picker, mins). Omit for dine-in (table number).
  categories: [
    { name: "Mains", note: "optional line under the section title", items: [
      { name: "Signature Bowl", desc: "…", price: 16.00, photo: "", popular: true, tags: ["GF"] },
      { name: "Katsu Curry",    desc: "…", price: 17.50, photo: "", soldOut: true }
    ]}
  ]
};
```

Category fields: `name`, `items`, `note` (optional line under the title).
Item fields: `name`, `desc`, `price`, `photo` (URL/data, optional), `popular` (optional), `soldOut` (optional), `tags` (optional array: V/VG/GF/DF/N/S).

---

## Design System

### CSS Variables
```css
:root {
  --bg-main: #0d0d0d;
  --bg-card: #161616;
  --bg-sheet: #1a1a1a;
  --text-primary: #ffffff;
  --text-muted: #888888;
  --accent: #f5c400;        /* amber default — swap per brand, never purple */
  --accent-ink: #0d0d0d;    /* text that sits on accent */
  --border: rgba(255,255,255,0.1);
}
```

### Colour Themes by Venue Type (NO PURPLE)
| Theme | Accent | Use for |
|-------|--------|---------|
| Amber (default) | #f5c400 | Coffee, general cafe, food halls — only when no real brand colour is known |
| Green | #22c55e | Health food, vegan, salads |
| Red | #ef4444 | Pizza, burgers, casual dining |
| Teal | #06b6d4 | Modern restaurants, seafood, Asian |
| Orange | #f97316 | BBQ, Mexican, bold street food, hawker food |

Prefer the venue's actual brand colour (see "Matching Real Brand Colour") over this default table whenever it's known.

---

## Val.town Compatibility — Critical

NO backtick template literals in JS. Ever. Use string concatenation.

```javascript
// WRONG
el.innerHTML = `<div class="${item.name}">`;
document.getElementById('total').textContent = `$${total.toFixed(2)}`;

// CORRECT
el.innerHTML = '<div class="' + item.name + '">';
document.getElementById('total').textContent = '$' + total.toFixed(2);
```

Item element IDs: spaces break IDs — always `'qty-' + name.replace(/[^a-zA-Z0-9]/g, '-')`.

### Desktop Layout

Constraining only the menu-item container to `max-width: 600px` while leaving `header`, `.hero`, and the pill tabs as direct `body` children makes THEM stretch full browser width on desktop, while only the item list sits centred — this reads as "the header is huge and the content is squeezed into the middle." It's invisible on a phone (viewport is already under 600px) and only shows up once someone opens the val on a laptop.

Fix: put `max-width: 600px; margin: 0 auto;` on `body` itself (so header/hero/pill-tabs are constrained too), plus a `background` on `html` so no white bleeds around the centred column on wide screens. `.container`'s own `max-width` becomes redundant but harmless.

---

## Output Rules

- Build the front end in chat, QA before Jon sees it, deliver as downloadable file(s) via `present_files`.
- Single self-contained HTML unless it's a multi-file Val.town venue.
- Save to `/mnt/user-data/outputs/itabs-menu-[slug].html` (standalone) or the multi-file set for Val.town.
- Always QA before delivery: zero backticks in JS, JS syntax check (extract and run through a parser), cart show/hide works.
- Mobile-first: max-width 600px, centred on desktop, dark theme — verify the WHOLE page is constrained, not just the content container.
- Footer: "Powered by iTabs · itabs.ai" + version stamp.

---

## Lessons Learned

- Cart bar: `position: fixed; bottom: 0`; `display: none` default, `display: flex` when active.
- Bottom sheets: `translateY(100%)` → `translateY(0)`, not display none.
- Container `padding-bottom: 120px` so content clears the cart bar.
- `cart = {}` keyed by item name. Always recalculate total from scratch in `updateCart()`.
- Editor: read all inputs into the working copy (`syncEditor()`) BEFORE any re-render, or typed-but-unsaved text is lost.
- Photo/logo uploads: resize via canvas before storing, or localStorage/blob bloats.
- Wrong PIN fails silently — don't confirm it's wrong beyond the attempts-remaining count.
- Test on a phone immediately — mobile behaviour differs from desktop preview.
- Test on desktop too — the full-page max-width bug above only shows there.
- A venue whose delivery apps only offer Pickup (check the dining-mode tab on their Uber Eats/DoorDash page) is pickup-only — set `pickupOnly: true` and `pickupTimes`, drop delivery links from Connect.
- When a venue already has public branding, pull the real accent colour, phone, and email from it instead of shipping placeholders — it's a fast, free upgrade the owner will notice immediately.

---

## Reference build

`itabs-menu-master.html` — the canonical standalone master (localStorage). Clone → set CONFIG → wrap in `main.ts` (or the multi-file split) for production.

**Zensaki** (Allendale Square) is the first venue built to this standard: real menu (Ramen/Udon/Curry/Donburi/Fried Rice/Bento/Sides), pickup times `[0,15,30,45]`, `photoMode: "off"` (text-only until dishes are shot), WhatsApp `61892263034`, PIN `2016`. Production `main.ts` is blob-backed. Lunches Down Under and Urban Kitchen retrofit next. Allendale cluster runs Photos mode once photographed (proof phase — make them gorgeous).

**Chicken Rice Corner** (Allendale Square) is the first venue built with the multi-file split (`seed.ts` + `Templatepart1.ts` + `Templatepart2.ts` + `main.ts`), the two-tab editor, and the input+Upload photo pattern — real menu pulled from Uber Eats, `pickupOnly: true`, brand colour matched to their actual orange (`#f97316`) from their own site/socials.

## Missy Routing Template

```
Build an iTabs menu for [Venue Name] in [Suburb].
Clone the master; set CONFIG only.
Accent: [colour — match real brand if known, else pick from table, never purple]
Photo mode: [photos / logo / off]
Order method: [whatsapp / counter]  WhatsApp: [intl number]
Pickup only: [yes / no]  Pickup times: [e.g. 0,15,30,45 or omit for table service]
PIN: [4 digits or "last 4 of phone"]
Categories and items:
  [Category]: [item — desc — $price — popular? — tags?]
```
