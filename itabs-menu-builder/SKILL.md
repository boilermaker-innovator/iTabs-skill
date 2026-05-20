---
name: itabs-menu-builder
description: 'Build interactive iTabs ordering menus — mobile-first scrollable HTML ordering apps for cafes, restaurants, and events. Use this skill whenever the user wants to: build a menu for a cafe or restaurant, create an event ordering page, build a coffee ordering widget, make a digital menu with a cart, or deploy a menu for a hospitality venue. Trigger on phrases like "build a menu for", "ordering page", "digital menu", "cafe menu", "restaurant menu", "event menu", or any request to create a scrollable menu with cart/ordering functionality. This is different from the iTabs widget builder — menus scroll, card decks swipe.'
---

# iTabs Menu Builder

Build mobile-first scrollable ordering menus — single self-contained HTML files for cafes, restaurants, and events. These are NOT swipeable card decks. They scroll like a real menu app.

## What Is an iTabs Menu

A scrollable ordering app with:
- Sticky header — venue/brand name + Connect button
- Welcome hero banner — headline, logo, powered badge
- Menu sections — categories with item cards
- Cart bar — fixed at bottom, shows count + total + Order button
- Order confirmation — bottom sheet with summary
- Optional: size picker modal, extras chips, loyalty table, sponsor layer

Single HTML file. Zero server dependencies. Mobile-first (max-width 600px). Dark theme.

---

## Two Build Modes

### Mode 1 — Event / Popup Menu (Simple)
**Use for:** one-off events, sponsored coffee bars, popup activations
- Sponsor branding in header and hero
- Drinks or food only, no admin editing
- Order confirmation is show-screen-at-counter (no POS integration)
- Reference build: Morning Startup x Purpose Ventures x Joey Zaza's

### Mode 2 — Venue Deployment (Full)
**Use for:** permanent cafe or restaurant deployment
- Venue branding only
- PIN-protected self-serve editor so owner updates prices/items
- Multi-language toggle (if needed)
- Categories: full food + drinks menu
- Reference build: Firewood Cafe, Willetton

---

## Questions to Ask Before Building

1. **Venue name?** (and sponsor name if event)
2. **Menu items?** List categories + items + prices
3. **Size options?** (coffee needs XS/S/M/L — food usually no)
4. **Extras/modifiers?** (alt milk, syrups, etc.)
5. **Simple or Full?** (event one-off vs permanent venue deployment)
6. **Colour theme?** (default is amber #f5c400 — can customise)

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
| Amber (default) | #f5c400 | Coffee, general cafe |
| Purple-Pink gradient | #8b5cf6 → #ec4899 | Startup events, creative venues |
| Green | #22c55e | Health food, vegan cafes |
| Red | #ef4444 | Pizza, burgers, casual dining |
| Teal | #06b6d4 | Modern restaurants, seafood |

---

## Page Structure

```
STICKY HEADER
  └─ Brand name + subtitle
  └─ Connect button (opens bottom sheet with links)

WELCOME BANNER
  └─ Headline + subtitle
  └─ Logo image (optional)
  └─ "Powered by iTabs" badge

CONTAINER (max-width: 600px, centered)
  └─ SECTION: Category name
      └─ Sub-heading (optional, e.g. "Hot Drinks")
      └─ ITEM CARDs (repeat)
  └─ SECTION: Extras (optional)
      └─ Chip toggles
  └─ SECTION: Loyalty (optional)
      └─ Points table rows
  └─ SECTION: External link button (optional)
  └─ FOOTER: "Powered by iTabs · itabs.ai"

CART BAR (fixed bottom, hidden until items added)
  └─ Item count + total + Order button

OVERLAYS
  └─ Connect bottom sheet
  └─ Size picker modal (if sizes needed)
  └─ Order confirmation bottom sheet
  └─ Order placed popup
```

---

## Item Card Pattern

```html
<div class="drink-card">
  <div class="drink-info">
    <div class="drink-name">Flat White</div>
    <div class="drink-price">from $5.50</div>
  </div>
  <div class="quantity-selector">
    <button class="qty-btn" onclick="decrementDrink('Flat White')">−</button>
    <div class="qty-display" id="qty-Flat White">0</div>
    <button class="qty-btn" onclick="openSizeModal('Flat White', false)">+</button>
  </div>
</div>
```

If no size picker needed, replace openSizeModal with addDrink directly.

---

## Size Picker Modal

Used when items have size variants (coffee: XS/S/M/L).

```javascript
const sizes = {
  'XS': { oz: 4,  price: 4.00 },
  'S':  { oz: 6,  price: 4.50 },
  'M':  { oz: 12, price: 5.50 },
  'L':  { oz: 16, price: 6.00 }
};
```

- Tapping + on a drink opens the modal
- User picks size → item added to cart
- smallSizesOnly flag: true = show XS/S only (for Piccolo, Espresso)
- Modal closes after selection

---

## Extras Chips

Toggleable add-ons. Click selects/deselects. Selected state: accent colour fill.

```html
<div class="extra-chip" onclick="toggleExtra(this, 'Alt Milk', 0.70)">
  + Alt Milk $0.70
</div>
```

Extras price adds to cart total when selected.

---

## Cart Bar

Hidden until at least 1 item added. Shows:
- Item count (e.g. "2 items")
- Running total (e.g. "$11.00")
- Order → button → opens order confirmation bottom sheet

```javascript
function updateCart() {
  // count items, sum prices
  // if totalItems > 0: show cart bar
  // else: hide cart bar
}
```

---

## Order Confirmation Flow

1. User taps "Order →" in cart bar
2. Bottom sheet slides up with order summary (items + sizes + total)
3. "Pay at the counter and show this screen" note
4. CTA button (e.g. "Thanks Purpose Ventures!") → triggers popup
5. Popup: "Order Placed ✅" + message + optional external link button

---

## Sponsor / Event Layer (Mode 1 only)

When a sponsor is paying (e.g. "Coffee is on Purpose Ventures"):
- Header: "Sponsor x Venue" naming
- Hero headline: "Coffee is on [Sponsor] ☕"
- Confirmation CTA: "Thanks [Sponsor]!" button → links to sponsor site
- Popup message references sponsor
- Keep "Powered by iTabs" badge in hero

---

## Val.town Compatibility — Critical

Val.town parses HTML files as TypeScript/Deno. **NO backtick template literals in JS. Ever.**

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

Also avoid arrow functions in older-style val contexts — use named functions where possible.

---

## Loyalty Section (optional)

Simple points table — no logic needed, display only.

```html
<div class="loyalty-row">
  <span>Free 12oz coffee</span>
  <span style="color: var(--accent);">60 pts</span>
</div>
```

---

## External Menu Button (optional)

When venue has a full external menu:
```html
<button class="menu-button" onclick="window.open('https://venue.com.au', '_blank')">
  🥪 View the full menu
</button>
```

---

## Connect Bottom Sheet

Every menu has a Connect button in the header. Opens a bottom sheet with 2–3 links:
- Visit venue website
- Full menu (if external)
- Social media (optional)

---

## Output Rules

- Single self-contained HTML file
- Save to `/mnt/user-data/outputs/itabs-menu-[slug].html`
- Present with `present_files`
- No backtick template literals anywhere in JS
- Mobile-first: max-width 600px, centred on desktop
- Always include "Powered by iTabs · itabs.ai" in footer
- Always test cart bar shows/hides correctly

---

## Lessons Learned

### Layout
- Cart bar must be `position: fixed; bottom: 0` — `display: none` by default, `display: flex` when active
- Bottom sheets use `transform: translateY(100%)` → `translateY(0)` — NOT display none (prevents transition)
- Modal cards use `opacity: 0 + scale(0.95)` → `opacity: 1 + scale(1)` for smooth entry
- Container needs `padding-bottom: 120px` so content isn't hidden behind cart bar

### Cart Logic
- Use an object `cart = {}` keyed by item name — simplest state that works
- Size is stored per item: `cart['Flat White'] = { qty: 1, size: 'M' }`
- Extras are global (apply to whole order), not per-item — simpler UX
- Always recalculate total from scratch in updateCart() — never increment manually

### Images
- Logo images: wrap in white background div if logo is dark-on-transparent
- External image URLs must be direct (not redirect URLs)
- Morning Startup logo needed white bg wrapper — lesson: always check logo on dark bg

### Naming
- Use `id="qty-${drinkName}"` pattern but WITHOUT backticks: `'qty-' + drink.name`
- Spaces in drink names cause issues in IDs — replace spaces: `drink.name.replace(/\s+/g, '-')`

### Val.town Deploy
- Paste HTML directly into index.html val (HTML val type)
- Same URL every time — no new link needed after update
- Test on phone immediately after deploy — cart bar behaviour differs on mobile vs desktop preview

---

## Missy Routing Template

```
Build an iTabs menu for [Venue Name] in [Suburb].
Mode: [Simple event / Full venue]
Sponsor: [Sponsor name or none]
Categories: [list]
Items: [name: price, name: price ...]
Sizes: [yes — coffee / no]
Extras: [list or none]
Loyalty: [yes / no]
Colour theme: [amber / purple / green / red / teal]
External link: [URL or none]
```
