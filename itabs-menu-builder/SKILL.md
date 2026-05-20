---
name: itabs-menu-builder
description: 'Build interactive iTabs ordering menus — mobile-first tabbed HTML ordering apps for cafes, restaurants, food hall stalls, and events. Use this skill whenever the user wants to: build a menu for a cafe or restaurant, create an event ordering page, build a coffee ordering widget, make a digital menu with a cart, build a menu for a food hall stall or market vendor, or deploy a menu for a hospitality venue. Trigger on phrases like "build a menu for", "ordering page", "digital menu", "cafe menu", "restaurant menu", "event menu", "food hall", "market stall menu", or any request to create a tabbed menu with cart/ordering functionality. This is different from the iTabs widget builder — menus use category tabs, card decks swipe.'
---

# iTabs Menu Builder

Build mobile-first **tabbed** ordering menus — single self-contained HTML files for cafes, restaurants, food hall stalls, and events. These are NOT swipeable card decks and NOT long scrolling pages. They use a sticky tab bar for instant category switching — tap a tab, see those items immediately.

**Design philosophy: pre-ordering is about saving time. No scrolling. Tabs only.**

## What Is an iTabs Menu

A tabbed ordering app with:
- Sticky header — venue/brand name + Connect button
- Sticky tab bar — one tab per category, directly below header
- Item panel — only the active tab's items shown at any time
- Cart bar — fixed at bottom, shows count + total + Order button
- Order confirmation — bottom sheet with summary
- Optional: size picker modal, extras chips, loyalty table, sponsor layer, PIN editor

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
**Use for:** permanent venue deployment — cafes, restaurants, food hall stalls
- Venue branding only, no sponsor layer
- PIN-protected self-serve editor so owner updates prices/items themselves
- Menu data stored in JS array at top of file — easy for Townie to update
- Categories: full food + drinks menu
- Show-screen-at-counter order flow (same as Mode 1)
- Reference builds: Firewood Cafe Willetton, Lunches Down Under, food hall stalls

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

## PIN-Protected Editor (Mode 2)

The self-serve editor is the key feature that makes this a product, not a service.

### How it works
- Hidden edit button in footer (small, subtle — not obvious to customers)
- Tap edit → PIN prompt appears
- Enter 4-digit PIN → editor mode unlocks
- Owner can update: item names, prices, descriptions, add/remove items
- Save → changes reflect immediately on the live menu
- Wrong PIN → silent fail, stays in customer view

### PIN Editor UI
```
[ Edit Menu ] ← small link in footer, e.g. "itabs · edit"

PIN modal:
  "Owner access"
  [_ _ _ _]  ← 4 digit input
  [Unlock]

Editor panel (slides up after correct PIN):
  For each item:
    [Item name input] [$price input] [Remove ×]
  [+ Add item]
  [Save changes]  [Cancel]
```

### Data Storage
Menu data lives in a JS array at the top of the file. Editor reads and rewrites this array via blob storage (Val.town) or localStorage (standalone HTML).

**Val.town deployment — use blob storage:**
```javascript
// On load: fetch menu from blob
// On save: write updated menu to blob
// Key format: 'menu-[venue-slug]'
```

**Standalone HTML — use localStorage:**
```javascript
// On load: check localStorage for saved menu, fall back to default
const saved = localStorage.getItem('menu-[venue-slug]');
const menuData = saved ? JSON.parse(saved) : defaultMenu;

// On save:
localStorage.setItem('menu-[venue-slug]', JSON.stringify(updatedMenu));
```

### Default PIN
Last 4 digits of venue phone number. Tell the owner this when handing over.

---

## Questions to Ask Before Building

1. **Venue name and suburb?**
2. **Mode?** Event (simple) or permanent venue (full with PIN editor)
3. **Menu items?** Categories + items + prices
4. **Size options?** Coffee = yes (XS/S/M/L). Food = no.
5. **Extras?** Alt milk, syrups, add-ons
6. **Colour theme?** (default amber)
7. **PIN?** Last 4 of phone, or specify

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
  └─ Brand name + subtitle (e.g. "Willetton Food Hall")
  └─ Connect button (opens bottom sheet with links)

STICKY TAB BAR (directly below header, scrollable if many tabs)
  └─ One tab per category — tap to switch, active tab highlighted with accent colour
  └─ Only one category panel visible at a time

ACTIVE CATEGORY PANEL
  └─ ITEM CARDs for the selected tab only
  └─ SECTION: Extras (optional, shown on relevant tab or always-visible)

FOOTER: "Powered by iTabs · itabs.ai · edit" (edit link for Mode 2)

CART BAR (fixed bottom, hidden until items added)
  └─ Item count + total + Order button

OVERLAYS
  └─ Connect bottom sheet
  └─ Size picker modal (if sizes needed)
  └─ Order confirmation bottom sheet
  └─ Order placed popup
  └─ PIN modal (Mode 2 only)
  └─ Editor panel (Mode 2 only)
```

**Note: No welcome hero banner in Mode 2 venue menus — go straight to tabs. Hero is for event/sponsored builds only.**

---

## Tab Bar Pattern

```html
<div class="tab-bar">
  <button class="tab active" onclick="showTab('mains', this)">Mains</button>
  <button class="tab" onclick="showTab('sides', this)">Sides</button>
  <button class="tab" onclick="showTab('drinks', this)">Drinks</button>
</div>

<div class="tab-panel" id="panel-mains"> ... items ... </div>
<div class="tab-panel" id="panel-sides" style="display:none"> ... items ... </div>
<div class="tab-panel" id="panel-drinks" style="display:none"> ... items ... </div>
```

```css
.tab-bar {
  display: flex;
  overflow-x: auto;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 56px; /* height of header */
  z-index: 90;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.tab-bar::-webkit-scrollbar { display: none; }

.tab {
  flex-shrink: 0;
  padding: 12px 20px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
```

```javascript
function showTab(tabId, el) {
  var panels = document.querySelectorAll('.tab-panel');
  for (var i = 0; i < panels.length; i++) {
    panels[i].style.display = 'none';
  }
  var tabs = document.querySelectorAll('.tab');
  for (var j = 0; j < tabs.length; j++) {
    tabs[j].classList.remove('active');
  }
  document.getElementById('panel-' + tabId).style.display = 'block';
  el.classList.add('active');
}
```

**No arrow functions — named functions only (Val.town requirement).**

---

## Item Card Pattern

```html
<div class="drink-card">
  <div class="drink-info">
    <div class="drink-name">Pad Thai</div>
    <div class="drink-desc">Rice noodles, egg, bean sprouts, peanuts</div>
    <div class="drink-price">$16.00</div>
  </div>
  <div class="quantity-selector">
    <button class="qty-btn" onclick="decrement('Pad Thai')">−</button>
    <div class="qty-display" id="qty-Pad-Thai">0</div>
    <button class="qty-btn" onclick="increment('Pad Thai')">+</button>
  </div>
</div>
```

Note: spaces in item names → replace with hyphens in IDs.

---

## Size Picker Modal

Used when items have size variants (coffee only — food menus skip this).

**Visual pattern: 2x2 grid of tappable size cards. Each card shows size label, oz, and price in accent colour. Dark card background, rounded corners, border. Tapping a card adds the item to cart at that price and closes the modal.**

Reference build: Morning Startup x Joey Zaza's event menu.

```javascript
var sizes = {
  'XS': { oz: 4,  price: 4.00 },
  'S':  { oz: 6,  price: 4.50 },
  'M':  { oz: 12, price: 5.50 },
  'L':  { oz: 16, price: 6.00 }
};
```

```html
<!-- Size picker modal -->
<div class="modal-overlay" id="size-modal" onclick="closeSizeModal()">
  <div class="size-modal" onclick="event.stopPropagation()">
    <h2 class="size-modal-title" id="size-modal-item-name"></h2>
    <div class="size-grid">
      <div class="size-card" onclick="selectSize('XS')">
        <div class="size-label">XS</div>
        <div class="size-oz">4oz</div>
        <div class="size-price">$4.00</div>
      </div>
      <div class="size-card" onclick="selectSize('S')">
        <div class="size-label">S</div>
        <div class="size-oz">6oz</div>
        <div class="size-price">$4.50</div>
      </div>
      <div class="size-card" onclick="selectSize('M')">
        <div class="size-label">M</div>
        <div class="size-oz">12oz</div>
        <div class="size-price">$5.50</div>
      </div>
      <div class="size-card" onclick="selectSize('L')">
        <div class="size-label">L</div>
        <div class="size-oz">16oz</div>
        <div class="size-price">$6.00</div>
      </div>
    </div>
    <button class="cancel-btn" onclick="closeSizeModal()">Cancel</button>
  </div>
</div>
```

```css
.size-modal {
  background: var(--bg-sheet);
  border-radius: 16px;
  padding: 28px 20px;
  width: 90%;
  max-width: 420px;
  text-align: center;
}
.size-modal-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
}
.size-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.size-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 12px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.size-card:active { border-color: var(--accent); }
.size-label { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.size-oz { font-size: 13px; color: var(--text-muted); margin: 4px 0; }
.size-price { font-size: 16px; font-weight: 600; color: var(--accent); }
.cancel-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 15px;
  cursor: pointer;
  padding: 8px 20px;
}
```

**Rules:**
- Piccolo and Espresso: show XS/S only (smallSizesOnly flag)
- Modal title = item name (set dynamically before opening)
- Tapping a size card: adds item to cart at that price, closes modal
- Cancel button closes without adding
- No arrow functions — named functions only

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
- Hero banner: "Coffee is on [Sponsor] ☕" (Mode 1 only — hero still appropriate for one-off events)
- Confirmation CTA: "Thanks [Sponsor]!" → sponsor URL
- Keep "Powered by iTabs" badge

---

## Val.town Compatibility — Critical

NO backtick template literals in JS. Ever.

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

---

## Output Rules

- Single self-contained HTML file
- Save to `/mnt/user-data/outputs/itabs-menu-[slug].html`
- Present with `present_files`
- No backtick template literals anywhere in JS
- No arrow functions — named functions only
- Mobile-first: max-width 600px, centred on desktop
- Always include "Powered by iTabs · itabs.ai" in footer
- Cart bar shows/hides correctly — test this
- First tab selected and panel visible on load

---

## Lessons Learned

### Layout
- Tab bar: `position: sticky; top: 56px` (sits just below 56px header)
- Cart bar: `position: fixed; bottom: 0` — `display: none` default, `display: flex` when active
- Bottom sheets: `transform: translateY(100%)` → `translateY(0)` — not display none
- Modals: `opacity: 0 + scale(0.95)` → `opacity: 1 + scale(1)`
- Container: `padding-bottom: 120px` so content clears cart bar

### Tab Logic
- Hide all panels first, then show selected — never toggle visibility
- Active tab gets accent colour border-bottom — remove from all others first
- If many categories, tab bar should scroll horizontally (overflow-x: auto)
- First tab must be active and its panel visible on page load

### Cart Logic
- `cart = {}` keyed by item name — simplest state that works
- Size stored per item: `cart['Flat White'] = { qty: 1, size: 'M' }`
- Extras global, not per-item
- Always recalculate total from scratch in updateCart()

### Item IDs
- Spaces in item names break element IDs
- Always: `'qty-' + item.name.replace(/\s+/g, '-')`

### Images
- Wrap logos in white bg div if logo is dark-on-transparent
- Direct image URLs only — no redirects

### Val.town Deploy
- Paste HTML directly into index.html (HTML val type)
- Same URL every time after first deploy
- Test on phone immediately — mobile behaviour differs from desktop preview

### PIN Editor
- Keep edit link subtle in footer — customers shouldn't see it obviously
- Silent fail on wrong PIN — don't tell them it's wrong, just don't unlock
- localStorage works for standalone HTML; blob storage for Val.town

---

## Missy Routing Template

```
Build an iTabs menu for [Venue Name] in [Suburb].
Mode: [Simple event / Full venue with PIN editor]
Sponsor: [Sponsor name or none]
PIN: [4 digits or "last 4 of phone"]
Categories and items:
  [Category]: [item: $price, item: $price]
  [Category]: [item: $price, item: $price]
Sizes: [yes — coffee / no]
Extras: [list or none]
Colour theme: [amber / purple / green / red / teal / orange]
External link: [URL or none]
```
