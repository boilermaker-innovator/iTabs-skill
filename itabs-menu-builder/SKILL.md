---
name: itabs-menu-builder
description: 'Build interactive iTabs ordering menus — mobile-first scrollable HTML ordering apps for cafes, restaurants, food hall stalls, and events. Use this skill whenever the user wants to: build a menu for a cafe or restaurant, create an event ordering page, build a coffee ordering widget, make a digital menu with a cart, build a menu for a food hall stall or market vendor, or deploy a menu for a hospitality venue. Trigger on phrases like "build a menu for", "ordering page", "digital menu", "cafe menu", "restaurant menu", "event menu", "food hall", "market stall menu", or any request to create a scrollable menu with cart/ordering functionality. This is different from the iTabs widget builder — menus scroll, card decks swipe.'
---

# iTabs Menu Builder

Build mobile-first scrollable ordering menus — single self-contained HTML files (or Val.town HTTP vals for Mode 2/3) for cafes, restaurants, food hall stalls, and events. These are NOT swipeable card decks. They scroll like a real menu app.

## What Is an iTabs Menu

A scrollable ordering app with:
- Sticky header — venue/brand name + logo + Connect button
- Welcome hero banner — headline, hero image, powered badge
- Menu sections — categories with item cards (photo, name, desc, qty label, stars, spicy tag, price)
- Cart bar — fixed at bottom, shows count + total + Order button
- Order confirmation — bottom sheet with summary
- Optional: size picker modal, extras chips, loyalty table, sponsor layer, PIN editor with photo uploads

Mobile-first (max-width 600px). Dark theme.

---

## Three Build Modes

### Mode 1 — Event / Popup Menu (Simple)
**Use for:** one-off events, sponsored coffee bars, popup activations
**Output:** single standalone HTML file, no backend
- Sponsor branding in header and hero
- Drinks or food only, no admin editing
- Order confirmation is show-screen-at-counter (no POS integration)
- Reference build: Morning Startup x Purpose Ventures x Joey Zaza's

### Mode 2 — Venue Deployment, basic (localStorage)
**Use for:** quick venue prototype before it's a real pitch
**Output:** single standalone HTML file, localStorage persistence
- Venue branding only, no sponsor layer
- PIN-protected editor — name + price only
- Use this only as a fast first draft to show someone in person; upgrade to Mode 3 before handing over as their real menu

### Mode 3 — Venue Deployment, full (Val.town + blob storage) — DEFAULT for real handoffs
**Use for:** any venue that will actually use this — this is the standard, not an upgrade path
**Output:** Val.town HTTP val (TypeScript), blob storage persistence
**Reference build: Vintage Kitchen** (`itabs-menu-vintage-kitchen`)

This is the locked standard. Every real venue build gets:
- Full field editing per item: name, description, qty label, price, stars (0–3), spicy flag, sold-out toggle
- Photo upload per item, with client-side compression before upload
- Venue logo (header) and hero banner (top of page) upload, same photo pipeline
- PIN-gated save on every write endpoint
- Data persisted via Val.town blob storage, not localStorage

Ask "quick prototype or real handoff?" if unclear — prototype = Mode 2, handoff = Mode 3.

---

## Food Hall Stall Strategy

Each stall gets their own individual menu — one HTML file, one URL, one vendor.

**Why individual not combined:**
- Sales pitch is "here's YOUR menu, live right now" — personal hook
- One yes → they show neighbours → spreads through the hall organically
- Simpler to build, simpler to hand over, simpler to update

**Sales approach:**
- Build a live demo for one stall before approaching them
- Show it on your phone at the counter — no explanation needed
- PIN editor means they can update it themselves — no ongoing dependency on Jon

**Deployment:**
- Each stall gets its own Val.town val or GitHub Pages URL
- URL format: `itabs.ai/[stall-name]` or `[stall-name].itabs.ai` (future)
- For now: Val.town URL shared via QR code printed and taped to counter

---

## Mode 3 Data Model

```javascript
{
  venueName: "Vintage Kitchen",
  venueSub: "Vintage Bakso & Vintage Donuts · Since 2018",
  venueLogo: { hasImage: false, imageVersion: 0 },
  venueHero: { hasImage: false, imageVersion: 0 },
  sections: [
    {
      title: "Sweet & Savoury Snacks",
      items: [
        {
          id: "pisang-goreng",       // kebab-case, unique
          name: "Pisang Goreng",
          qty: "3 pcs",              // optional serving size label
          desc: "Crispy banana fritters.",
          price: 5.00,
          stars: 0,                  // 0-3, favourite/popularity marker
          spicy: false,
          soldOut: false,
          hasImage: false,
          imageVersion: 0            // bump on every photo change — cache-busts the <img> src
        }
      ]
    }
  ]
}
```

Every item, plus `venueLogo` and `venueHero`, follows the same `hasImage` + `imageVersion` shape. `imageVersion` is what makes `?v=N` cache-busting work on the `<img>` src after a re-upload.

---

## Mode 3 API Routes (Val.town HTTP val)

```
GET  /api/menu              → returns full menu JSON
POST /api/menu               → body: { pin, menu } — saves full menu, PIN-gated
GET  /api/image/:id          → serves photo bytes (item id, or "venue-logo" / "venue-hero")
POST /api/image              → body: { pin, itemId, dataUrl } — uploads a photo, PIN-gated
DELETE /api/image            → body: { pin, itemId } — removes a photo, PIN-gated
```

Backend pattern:
```javascript
import { blob } from "https://esm.town/v/std/blob";

const STORAGE_KEY = "itabs-menu-[venue-slug]";
const EDIT_PIN = "1234"; // last 4 of venue phone unless told otherwise

// Menu: blob.getJSON(STORAGE_KEY) / blob.setJSON(STORAGE_KEY, menu)
// Photos: stored as base64 under "image:" + itemId (or "image:venue-logo" / "image:venue-hero")
// Image GET route decodes base64 → Uint8Array → Response with content-type: image/jpeg
```

Every write route (`POST /api/menu`, `POST /api/image`, `DELETE /api/image`) checks `body.pin !== EDIT_PIN` first and returns 401 on mismatch.

---

## Photo Upload Pattern (client-side)

Always compress before upload — do not send raw phone photos to blob storage.

```javascript
// On file select:
// 1. FileReader → data URL
// 2. Load into an Image(), resize so longest side maxes at 800px
// 3. Draw to canvas, export via canvas.toDataURL('image/jpeg', 0.72)
// 4. POST the compressed data URL to /api/image
```

After a successful upload, bump `imageVersion` and re-render so the `<img src>` cache-busts.

---

## PIN-Protected Editor

The self-serve editor is the key feature that makes this a product, not a service.

### How it works
- Hidden edit button in footer (small, subtle — not obvious to customers)
- Tap edit → PIN prompt appears
- Enter 4-digit PIN → editor mode unlocks
- Owner can edit every field per item (see Data Model above), upload/remove photos, upload venue logo + hero
- Save → changes reflect immediately on the live menu
- Wrong PIN → visible inline error message (NOT alert() — see Known Bugs)

### PIN Editor UI
```
[ Edit Menu ] ← small link in footer, e.g. "itabs · edit"

PIN modal:
  "Owner access"
  [_ _ _ _]  ← 4 digit input
  [Unlock]

Editor panel (slides up after correct PIN):
  Venue Branding section — logo + hero photo upload
  Per item:
    [Photo upload/remove] [Name] [Description] [Qty label] [Price] [Stars] [Spicy ✓] [Sold out ✓]
  [Save changes]  [Close]
```

### Default PIN
Last 4 digits of venue phone number, unless the venue specifies otherwise. Tell the owner this when handing over.

---

## Known Bugs — Avoid These

These three have each cost a rebuild. Never repeat them.

1. **`alert()` for confirmations** — silently blocked by mobile browsers and in-app webviews (e.g. Instagram/Facebook browser). Never use it for PIN errors or save confirmations. Use an inline status element instead (`.save-status` text, colour-coded success/error).
2. **`href="#"` on edit/action triggers** — gets intercepted before the `onclick` fires in some preview/webview contexts. Always use `<button type="button" onclick="...">`, never an anchor tag, for in-page actions.
3. **`capture="environment"` on file inputs** — forces the camera directly instead of offering the OS's normal photo/camera/files picker. Omit the `capture` attribute entirely on `<input type="file" accept="image/*">` so owners can pick from their gallery too.

Validate any Val.town TypeScript template literal by resolving it with Node before delivery, and run `node --check` on the extracted client-side JS.

---

## Questions to Ask Before Building

1. **Venue name and suburb?**
2. **Mode?** Quick prototype (Mode 2) or real handoff (Mode 3, default)
3. **Menu items?** Categories + items + prices (+ descriptions, qty labels, photos if available)
4. **Size options?** Coffee = yes (XS/S/M/L). Food = no.
5. **Extras?** Alt milk, syrups, add-ons
6. **Colour theme?** (default amber)
7. **PIN?** Last 4 of phone, or specify
8. **Val handle / venue slug?** for Mode 3 storage keys

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
  --accent: #f5c400;        /* amber — default, swap per brand */
  --accent-dark: #0d0d0d;
  --border: rgba(255,255,255,0.1);
}
```

### Colour Themes by Venue Type
| Theme | Accent colour | Use for |
|-------|--------------|---------|
| Amber (default) | #f5c400 | Coffee, general cafe, food halls |
| Purple-Pink gradient | #8b5cf6 → #ec4899 | Startup events, creative venues |
| Green | #22c55e | Health food, vegan, salads |
| Red | #ef4444 | Pizza, burgers, casual dining |
| Teal | #06b6d4 | Modern restaurants, seafood, Asian |
| Orange | #f97316 | BBQ, Mexican, bold street food |

---

## Page Structure

```
STICKY HEADER
  └─ Logo (if uploaded) + Brand name + subtitle
  └─ Connect button (opens bottom sheet with links)

WELCOME BANNER
  └─ Hero image (if uploaded)
  └─ Headline + subtitle
  └─ Badges (e.g. Halal) + "Powered by iTabs" badge

CONTAINER (max-width: 600px, centered)
  └─ SECTION: Category name
      └─ ITEM CARDs — photo, name, stars, spicy tag, qty label, description, price (repeat per category)
  └─ SECTION: Extras (optional)
      └─ Chip toggles
  └─ SECTION: Loyalty (optional)
      └─ Points table rows
  └─ SECTION: External link button (optional)
  └─ FOOTER: "Powered by iTabs · itabs.ai · edit" (edit link for Mode 2/3)

CART BAR (fixed bottom, hidden until items added)
  └─ Item count + total + Order button

OVERLAYS
  └─ Connect bottom sheet
  └─ Size picker modal (if sizes needed)
  └─ Order confirmation bottom sheet
  └─ Order placed popup
  └─ PIN modal (Mode 2/3 only)
  └─ Editor panel with photo upload (Mode 2/3 only)
```

---

## Item Card Pattern

```html
<div class="drink-card">
  <img class="drink-thumb" src="/api/image/pad-thai?v=1" alt="">
  <div class="drink-info">
    <div class="drink-name">Pad Thai <span class="stars">★★</span></div>
    <div class="drink-desc">Rice noodles, egg, bean sprouts, peanuts</div>
    <div class="drink-price">$16.00</div>
  </div>
  <div class="quantity-selector">
    <button class="qty-btn" onclick="decrement('pad-thai')">−</button>
    <div class="qty-display" id="qty-pad-thai">0</div>
    <button class="qty-btn" onclick="increment('pad-thai')">+</button>
  </div>
</div>
```

Note: item `id` is kebab-case and unique — used for cart keys, image routes, and editor field targeting.

---

## Size Picker Modal

Used when items have size variants (coffee only — food menus skip this).

```javascript
const sizes = {
  'XS': { oz: 4,  price: 4.00 },
  'S':  { oz: 6,  price: 4.50 },
  'M':  { oz: 12, price: 5.50 },
  'L':  { oz: 16, price: 6.00 }
};
```

- smallSizesOnly: true = show XS/S only (Piccolo, Espresso)
- Modal closes after selection

---

## Extras Chips

Toggleable add-ons. Selected state: accent colour fill.

```html
<div class="extra-chip" onclick="toggleExtra(this, 'Alt Milk', 0.70)">
  + Alt Milk $0.70
</div>
```

Extras are global (whole order), not per-item — simpler UX.

---

## Cart Bar

Hidden until at least 1 item added.

```javascript
function updateCart() {
  // recalculate from scratch — never increment manually
  // if totalItems > 0: cartBar.classList.add('active')
  // else: cartBar.classList.remove('active')
}
```

---

## Order Confirmation Flow

1. Tap "Order →" → bottom sheet slides up with summary
2. "Pay at the counter and show this screen"
3. CTA button → triggers confirmation popup
4. Popup: "Order Placed ✅" + done button

For sponsored events: CTA button links to sponsor site.
For venue deployments: CTA button just closes and resets cart.

---

## Sponsor / Event Layer (Mode 1 only)

- Header: "Sponsor x Venue"
- Hero: "Coffee is on [Sponsor] ☕"
- Confirmation CTA: "Thanks [Sponsor]!" → sponsor URL
- Keep "Powered by iTabs" badge

---

## Val.town Compatibility — Critical

NO backtick template literals in client-side JS embedded inside the HTML string. Ever.

```javascript
// WRONG
el.innerHTML = `<div class="${item.name}">`;

// CORRECT
el.innerHTML = '<div class="' + item.name + '">';

// WRONG
document.getElementById('total').textContent = `$${total.toFixed(2)}`;

// CORRECT
document.getElementById('total').textContent = '$' + total.toFixed(2);
```

The outer HTML string in the `.ts` file itself is a backtick template literal (that's fine and expected) — the rule is no backticks *inside* the JS that runs in the browser, since nested template literals inside a template literal break.

---

## Output Rules

- **Mode 1/2**: single self-contained HTML file → `/mnt/user-data/outputs/itabs-menu-[slug].html`
- **Mode 3**: Val.town `.ts` HTTP val → also save a `.ts.txt` copy (Jon works on mobile; iOS can mishandle `.ts` extensions)
- Present with `present_files`
- No backtick template literals inside embedded client-side JS
- Mobile-first: max-width 600px, centred on desktop
- Always include "Powered by iTabs · itabs.ai" in footer
- Cart bar shows/hides correctly — test this
- For Mode 3: validate the resolved template literal with Node and `node --check` the extracted client JS before delivery

---

## Lessons Learned

### Layout
- Cart bar: `position: fixed; bottom: 0` — `display: none` default, `display: flex` when active
- Bottom sheets: `transform: translateY(100%)` → `translateY(0)` — not display none
- Modals: `opacity: 0 + scale(0.95)` → `opacity: 1 + scale(1)`
- Container: `padding-bottom: 120px` so content clears cart bar

### Cart Logic
- `cart = {}` keyed by item id — simplest state that works
- Size stored per item: `cart['flat-white'] = { qty: 1, size: 'M' }`
- Extras global, not per-item
- Always recalculate total from scratch in updateCart()

### Item IDs
- Use kebab-case ids set at build time, not derived from names at runtime — avoids space/special-character breakage
- Always: `'qty-' + item.id`

### Images
- Wrap logos in white bg div if logo is dark-on-transparent
- Mode 3: compress client-side (max 800px, JPEG 0.72) before upload — never send raw phone photos
- Mode 1/2 without backend: direct image URLs only — no redirects

### Val.town Deploy
- Paste `.ts` directly as an HTTP val (not a plain HTML val, once photo upload/blob storage is involved)
- Same URL every time after first deploy
- Test on phone immediately — mobile behaviour differs from desktop preview, especially file input and alert() blocking

### PIN Editor
- Keep edit link subtle in footer — customers shouldn't see it obviously
- Show a visible inline error on wrong PIN — never alert()
- Mode 2 (no backend): localStorage. Mode 3 (real handoff): blob storage — always

---

## Missy Routing Template

```
Build an iTabs menu for [Venue Name] in [Suburb].
Mode: [1 event / 2 quick prototype / 3 full Val.town handoff — default 3]
Sponsor: [Sponsor name or none]
PIN: [4 digits or "last 4 of phone"]
Categories and items:
  [Category]: [item: $price, item: $price]
  [Category]: [item: $price, item: $price]
Sizes: [yes — coffee / no]
Extras: [list or none]
Colour theme: [amber / purple / green / red / teal / orange]
External link: [URL or none]
Val handle / slug: [for Mode 3]
```
