---
name: itabs-menu-builder
description: 'Build interactive iTabs ordering menus - mobile-first scrollable HTML ordering apps for cafes, restaurants, food hall stalls, and events. Use this skill whenever the user wants to: build a menu for a cafe or restaurant, create an event ordering page, build a coffee ordering widget, make a digital menu with a cart, build a menu for a food hall stall or market vendor, or deploy a menu for a hospitality venue. Trigger on phrases like "build a menu for", "ordering page", "digital menu", "cafe menu", "restaurant menu", "event menu", "food hall", "market stall menu", or any request to create a scrollable menu with cart/ordering functionality. This is different from the iTabs widget builder - menus scroll, card decks swipe.'
---

# iTabs Menu Builder

Build mobile-first scrollable ordering menus - single self-contained HTML files for cafes, restaurants, food hall stalls, and events. These are NOT swipeable card decks. They scroll like a real menu app.

## What Is an iTabs Menu

A scrollable ordering app with:
- Sticky header - venue/brand name + Connect button
- Welcome hero banner - headline, logo, powered badge
- Tab nav - usually Coffee / Drinks / Food (3 tabs reads best; more only if needed)
- Menu sections - categories with item cards
- Cart bar - fixed at bottom, shows count + total + Order button
- Order send - SMS pre-order (preferred) or show-screen-at-counter
- Optional: coffee customise popup, size picker, extras chips, loyalty table, sponsor layer, PIN editor

Single HTML file. Zero server dependencies. Mobile-first (max-width 600px). Dark theme.

---

## CRITICAL WORKFLOW - Build Complete, Deploy Once

This is the most important lesson and it overrides convenience.

DO NOT edit a live Val.town val incrementally with a small/cheap model (Townie on Haiku rewrites strings it cannot reliably escape and adds em-dashes by reflex - this silently breaks the page and burns money fast).

INSTEAD:
1. Spec the whole menu first (items, prices, sizes, customise options, order channel).
2. Build the COMPLETE single file on a capable model. Get it perfect.
3. Verify it (see Verify Before Deploy below).
4. Deploy in ONE paste - select all in the val's main.ts, paste, Save. Townie barely involved.

The val is a deploy target, not a workspace. Nothing to incrementally break.

### Verify Before Deploy (every time)
- Zero non-ASCII characters in the whole file (grep for them).
- Exactly ONE outer backtick pair (the `const html = ...` template literal). No backticks anywhere inside.
- Zero `${` interpolation inside the HTML string.
- Syntax-check the inline JS (extract the script, run node --check).
- HTTP 200 only proves the page serves. Real proof is the phone thumb-test + console with zero errors.

---

## Two Build Modes

### Mode 1 - Event / Popup Menu (Simple)
Use for: one-off events, sponsored coffee bars, popup activations
- Sponsor branding in header and hero
- Drinks or food only, no admin editing
- Reference build: Morning Startup x Purpose Ventures x Joey Zaza's

### Mode 2 - Venue Deployment (Full)
Use for: permanent venue deployment - cafes, restaurants, food hall stalls
- Venue branding only, no sponsor layer
- Optional PIN-protected self-serve editor so owner updates prices/items
- Menu data stored in a JS object at top of file - easy to update
- Full food + drinks menu
- Order send: SMS pre-order (preferred) or show-screen-at-counter
- Reference builds: Velvet Espresso (Perth CBD), Firewood Cafe (Willetton), Leaf & Latte Co.

---

## Coffee Customise Popup (CANONICAL - do not reinvent)

This is the dialed-in coffee popup from the Velvet Espresso build. Reuse it exactly. Do not re-style or re-structure it from scratch each time.

Trigger: tap the coffee card (the whole card, or its + button) -> a bottom sheet slides up.

The sheet contains, in order:
- SIZE: Small / Medium / Large, spelled out IN FULL. Never use S/M/L abbreviations. (A barista misread "small regular" as a size at Velvet - spelling it out fixed it.) Show each size with its price in the picker.
- SUGAR: tap-the-number chips - 0 / 1 / 2 / 3, with labels none / sugar / sugars. Sugar never changes price.
- MILK: Black (default), Oat, Almond, Soy, Lactose Free. Non-default milks add +$0.70. The DEFAULT milk is SILENT - it must never appear in the order line. Only a non-default milk shows.
- EXTRAS: Extra Shot (+$0.50). Optional Flavoured Syrup - ONLY if the venue actually sells syrups. If yes, syrup opens a SUB-PICKER (Vanilla / Caramel / Hazelnut / Lavender / Chai Spice). The syrup sub-picker must NOT close the customise sheet.
- ADD TO CART button shows the live running total, e.g. "Add to Cart - $6.30".

Order line detail format: "Medium, Oat milk, 2 sugars, extra shot". Size first, then milk (only if non-default), then sugar (only if >0), then extras.

Non-coffee items:
- Sized items (e.g. salads Regular/Large): same size picker, no milk/sugar/extras.
- Simple items (food, soft drinks, juices): plain +/- quantity stepper or a one-tap add. No customise sheet.

---

## SMS Pre-Order Send (CANONICAL - the Velvet pattern)

This is now the preferred order channel. The order fires as a pre-filled text to the venue.

- Build the message from the cart.
- Device-detect the separator: iPhone uses `&body=`, Android uses `?body=`.
  ```javascript
  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var sep = isIOS ? '&body=' : '?body=';
  window.location.href = 'sms:' + PHONE_RAW + sep + encodeURIComponent(msg);
  ```
- PHONE_RAW has no spaces (e.g. "0435266454").
- Message format:
  ```
  Hi [Venue]! Order via iTabs:
  1x Flat White - Medium, Oat milk, 2 sugars, extra shot - $6.30
  Total: $6.30
  Ordered via iTabs - [liveurl]
  ```
- ALWAYS include the source URL line so the venue knows where the order came from.

NEWLINE TRAP (this killed a build): the SMS message is built inside the val's outer template literal. Write newlines in the SOURCE as `\\n` (double backslash). A bare `\n` in the source is interpreted by the val as a real newline and breaks the JS string -> silent SyntaxError -> dead page. So: `lines.join("\\n")` in the source becomes `lines.join("\n")` in the served page. Correct.

URL note: the val's live address is set by the val name/settings in Val.town, NOT by the code. You cannot fix a URL spelling with a code edit - rename the val if the address itself is wrong, and confirm it loads before pointing the message at it.

---

## PIN-Protected Editor (Mode 2, optional)

The self-serve editor lets the owner update prices/items themselves.
- Hidden, subtle edit link in footer (e.g. "edit").
- Tap -> PIN prompt. Default PIN = last 4 digits of venue phone.
- Correct PIN unlocks an editor panel: edit name/price, add/remove items, Save.
- Wrong PIN = silent fail, stays in customer view.
- Storage: blob storage for Val.town (persists across devices); localStorage for standalone HTML (per-device only).
- If the menu uses per-size coffee pricing, the editor must be size-aware (edit each size price), or skip the editor for that build and note it.

---

## Questions to Ask Before Building

1. Venue name and suburb?
2. Mode? Event (simple) or permanent venue (full)
3. Menu items? Categories + items + prices
4. Coffee sizes + real per-size prices? (Do NOT guess - flag placeholders clearly if unknown)
5. Does the venue sell flavoured syrups? (decides the syrup sub-picker)
6. Order channel? SMS pre-order (need the venue mobile) or show-at-counter
7. Colour theme? (default amber)
8. PIN editor? (last 4 of phone, or skip)

If a price is unknown, use a clearly-flagged placeholder and tell the user to confirm the real number with the venue. Never invent a venue's prices silently.

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
  --accent: #f5c400;        /* amber - default, swap per brand */
  --accent-dark: #0d0d0d;
  --border: rgba(255,255,255,0.1);
}
```

### Colour Themes by Venue Type
| Theme | Accent | Use for |
|-------|--------|---------|
| Amber (default) | #f5c400 | Coffee, general cafe, food halls |
| Purple-Pink | #8b5cf6 -> #ec4899 | Startup events, creative venues |
| Green | #22c55e | Health food, vegan, salads |
| Red | #ef4444 | Pizza, burgers, casual dining |
| Teal | #06b6d4 | Modern restaurants, seafood, Asian |
| Orange | #f97316 | BBQ, Mexican, bold street food |

---

## Page Structure

```
STICKY HEADER  -> brand + Connect button
WELCOME BANNER -> headline + subtitle + powered-by badge
TAB NAV        -> Coffee / Drinks / Food (sticky)
CONTAINER (max-width 600px, centered)
  SECTION: Category heading
    ITEM CARDs (coffee = tap to customise; simple = +/- stepper)
  FOOTER: "Powered by iTabs - itabs.ai" (+ edit link for Mode 2)
CART BAR (fixed bottom, hidden until items added)
OVERLAYS
  Customise sheet (coffee/salad)
  Connect sheet
  Order sheet (summary + Send Order by Text)
  PIN modal + Editor (Mode 2 only)
```

---

## Val.town Compatibility - CRITICAL

Plain ASCII ONLY inside the val. A single em-dash, smart quote, curly apostrophe, or emoji = silent SyntaxError that kills the entire page. One uncaught JS error halts the whole script, so a single bad character disables unrelated features too.

NO backtick template literals inside the JS (the only backtick is the outer `const html = ...`).
```javascript
// WRONG
el.innerHTML = `<div class="${item.name}">`;
document.getElementById('total').textContent = `$${total.toFixed(2)}`;
// CORRECT
el.innerHTML = '<div class="' + item.name + '">';
document.getElementById('total').textContent = '$' + total.toFixed(2);
```

Newlines in strings: write `\\n` in the source (see SMS Newline Trap above).

Deploy: paste the finished file into the val's main.ts, Save. Same URL every time after first deploy. Test on a real phone immediately.

---

## Lessons Learned

### Process
- Build complete on a capable model, verify, deploy in one paste. Do not edit a live val incrementally with Haiku-Townie.
- Watch the Townie usage meter. A $10 plan can hit $70+ in one looping session. Cap it.
- When reusing a known-good component (the coffee popup, the SMS send), reuse it exactly - do not re-style from scratch and cause a regression.

### Coffee popup
- Sizes spelled out: Small/Medium/Large, never S/M/L.
- Default milk is silent in the order. Only non-default milks show.
- Syrup is a sub-picker, only when the venue sells syrups, and it must not close the customise sheet.

### Val.town
- ASCII only. Em-dashes/smart quotes/emoji = dead page.
- One outer backtick pair, no inner backticks, no `${`.
- `\\n` in source for newlines.
- The live URL is set by val name/settings, not code.

### Layout
- Cart bar: fixed bottom, hidden (display none) until >0 items.
- Bottom sheets: transform translateY(110%) -> translateY(0).
- Container padding-bottom ~120px so content clears the cart bar.
- Item IDs: replace spaces with non-space chars (`name.replace(/[^a-zA-Z0-9]/g,'_')`).

### Cart
- Recalculate total from scratch in updateCart() - never increment manually.
- Coffee/customised lines keyed by a signature (name + size + sugar + milk + shot) so identical configs stack and different ones split.

---

## Output Rules

- Single self-contained file. For Val.town, output a complete main.ts (the function wrapper + the HTML in one outer template literal).
- Verify before delivering (non-ASCII, backticks, interpolation, JS syntax).
- Deliver as a downloadable file, never paste inline.
- Always include "Powered by iTabs - itabs.ai" in the footer.
- Mobile-first: max-width 600px, centred on desktop.

---

## Missy Routing Template

```
Build an iTabs menu for [Venue Name] in [Suburb].
Mode: [Simple event / Full venue]
PIN: [4 digits or skip]
Order channel: [SMS to NUMBER / show-at-counter]
Syrups: [yes - list / no]
Categories and items:
  [Category]: [item: $price, ...]
Coffee sizes: [Small/Medium/Large with real prices, or flag placeholders]
Extras: [list or none]
Colour theme: [amber / green / red / teal / orange / purple]
Live URL (for the SMS source line): [valname.val.run]
```
