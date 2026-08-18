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
2. **Popular-first / see-more** — each category shows best-sellers up front (`popular: true`), the rest tuck under a "See X more" button. If nothing is flagged, show the first 2 and hide the rest.
3. **Photo standard** (see below) — 16:9 hero, 1:1 square item photos, three photo modes, logo fallback.
4. **Full self-serve PIN editor** — owner edits items AND venue settings, including their own PIN.
5. **Table number field** on the order sheet (optional).
6. **Dietary chips + kitchen notes box** on the order form — universal, zero per-venue setup.
7. **Receipt-as-Reorder** — email receipt with a pre-filled reorder URL. The core differentiator vs mobi2go. (Wired live in the Val.town production build.)
8. **PIN brute-force lockout** — 5 failed attempts = 15-minute block.
9. **WhatsApp ordering** — order sent to the venue's WhatsApp with items, total, table, dietary and notes pre-filled. Counter-only is the fallback.
10. **Version stamp** in the footer — `iTabs Menu v[X] · [slug]` so any live menu is identifiable at a glance.
11. **No purple.** Ever. Not in any theme, asset, or default.
12. **No backtick template literals in JS** — Val.town compatibility (see below).

---

## Photo Standard

The photo slot is a product-tier lever, controlled by `CONFIG.photoMode`:

- **`"photos"`** — full/paid look. Real per-item photos (1:1 square, center-cropped, rounded). A missing item photo falls back to the venue **logo**, then to a branded name tile. Never a broken gap.
- **`"logo"`** — free-tier look. Every item shows the venue logo on a clean light tile. Branded, tidy, zero photography. A venue goes live in minutes.
- **`"off"`** — text-only menu, no image column.

**Hero** is a locked 16:9 banner: hero image → logo badge (if no hero image) → venue initial. Name + tagline overlaid on a gradient.

**Logo tiles** sit on a light (`#f4f4f4`) background with `object-fit: contain` so dark/coloured logos read. Note: a pure-white logo will disappear on white — those venues supply a coloured version or use a hero image instead.

Uploaded photos and logos are auto-resized (photos max 500px, logo max 400px) and compressed before storage to keep it fast and small.

---

## Order Form (locked layout)

Order sheet, top to bottom:
- Order summary + total
- **Table number** (optional)
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

---

## PIN Editor — owner self-serve

Subtle "edit" link in the footer → PIN modal → editor. Wrong PIN fails silently. 5 fails = 15-min lockout (per-IP on Val.town, per-device on standalone).

The editor has TWO parts:

### Venue settings panel (top)
- Venue name, tagline
- Phone, WhatsApp (intl format, e.g. 61412…), Email
- Map link, Website
- Brand colour (colour picker, "no purple" hint)
- **Orders go to**: WhatsApp / Counter only
- **Logo** upload + **Item images** mode (Photos / Logo only / None)
- **Change PIN** (new + confirm, must be 4 digits and match)

### Per-item editing
For every item: tap photo tile to upload/change, edit name + description + price, toggle **★ Popular**, toggle **Sold out**, optional dietary tags, Remove. Plus **+ Add item** per category.

**Sold out** keeps the item on the menu but greys it out with a "Sold out" badge and removes the + button — no delete/re-add.

---

## Deployment modes

### Standalone HTML (demo / proof / handing over a file)
- Single self-contained file. Editor saves to `localStorage`.
- Keys: `itabs-menu-[slug]` (items), `itabs-settings-[slug]` (settings), `itabs-lock-[slug]` (PIN lockout).
- Good for showing a live demo on your phone before approaching a venue.

### Val.town production (the real deployment)
- Same front end, but the editor reads/writes **blob storage** so edits and orders are shared across everyone.
- WhatsApp send fires live; receipt email + reorder URL are wired for real.
- Every production menu carries a `/setup` page from day one (growth ladder: free menu → vendor-connected Square → paid pickup).
- Full `handle/valName` format always, e.g. `jgwynne7_4bf3679b/zensaki`.
- Secrets via `Deno.env.get()`.
- File structure for grown-up venues: `main.ts` + `app.js` + `seed.ts` + `public/` + blob storage.

---

## CONFIG block (the only thing you edit per venue)

```javascript
var CONFIG = {
  venue:   "Venue Name",
  tagline: "Fresh, fast, made to order",
  slug:    "venue-name",        // storage key + reorder URL
  accent:  "#f5c400",           // brand colour — NEVER purple
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
  categories: [
    { name: "Mains", items: [
      { name: "Signature Bowl", desc: "…", price: 16.00, photo: "", popular: true, tags: ["GF"] },
      { name: "Katsu Curry",    desc: "…", price: 17.50, photo: "", soldOut: true }
    ]}
  ]
};
```

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
| Amber (default) | #f5c400 | Coffee, general cafe, food halls |
| Green | #22c55e | Health food, vegan, salads |
| Red | #ef4444 | Pizza, burgers, casual dining |
| Teal | #06b6d4 | Modern restaurants, seafood, Asian |
| Orange | #f97316 | BBQ, Mexican, bold street food |

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

---

## Output Rules

- Build the front end in chat, QA before Jon sees it, deliver as downloadable file(s) via `present_files`.
- Single self-contained HTML unless it's a multi-file Val.town venue.
- Save to `/mnt/user-data/outputs/itabs-menu-[slug].html`.
- Always QA before delivery: zero backticks in JS, JS syntax check, cart show/hide works.
- Mobile-first: max-width 600px, centred on desktop, dark theme.
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

---

## Reference build

`itabs-menu-master.html` — the canonical master. Allendale Square cluster (Zensaki, Lunches Down Under, Urban Kitchen) are the first showcase venues, all on Photos mode even though free (proof phase — make them gorgeous).

## Missy Routing Template

```
Build an iTabs menu for [Venue Name] in [Suburb].
Clone the master; set CONFIG only.
Accent: [colour, never purple]
Photo mode: [photos / logo / off]
Order method: [whatsapp / counter]  WhatsApp: [intl number]
PIN: [4 digits or "last 4 of phone"]
Categories and items:
  [Category]: [item — desc — $price — popular? — tags?]
```
