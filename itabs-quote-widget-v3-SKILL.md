---
name: itabs-quote-widget-v3
description: Build an iTabs quote estimator widget — a mobile-first single HTML file combining a swipeable slider with a floating amber "Get a Quote" button that opens a multi-step accordion price estimator. Use this skill whenever Jon wants to build a tradie quote widget, a fencing estimator, a landscaping quote tool, a painting price calculator, or any trade-specific quote estimator for iTabs. Triggers on: "build a quote widget", "make a quote estimator", "build an iTabs for [trade]", "quote tool", "price estimator", "tradie widget". Always use this skill for any iTabs quote widget build — it contains the full v3 pattern including photo heroes, floating button, live price strip, and Web3Forms lead capture.
---

# iTabs Quote Widget Builder — v3

Builds a single self-contained HTML file: a swipeable iTabs slider + floating amber quote button + accordion multi-step quote estimator with live price display and Web3Forms lead capture.

---

## What Gets Built

**1. The Slider** — 5 swipeable cards educating the prospect on the trade service. Standard iTabs dark theme, progress bar, swipe + keyboard nav.

**2. The Floating Quote Button** — Amber pill button (`💬 Get a Quote`) fixed above the nav bar with pulse animation. Visible on every card. Opens the quote estimator.

**3. The Quote Estimator** — Bottom-sheet modal with multi-step accordion wizard. Live price strip updates as user makes selections. Final step = Web3Forms lead capture.

---

## File Output

- Filename: `itabs-[trade]-quote.html` e.g. `itabs-fencing-quote.html`
- Save to: `/mnt/user-data/outputs/`
- Always present with `present_files`

---

## Design System

### CSS Variables (Never Change)
```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-tertiary: #1e1e2e;
  --text-primary: #ffffff;
  --text-secondary: #9090b0;
  --accent: #7c3aed;
  --accent2: #06b6d4;
  --i-button: #f59e0b;
  --card-radius: 16px;
  --transition: 0.2s ease;
}
```

### Hero Themes
| Class | Gradient | Use for |
|-------|----------|---------|
| `hero-default` | dark slate | Intro / problem |
| `hero-purple` | `#4c1d95 → #1e1b4b` | Types / options |
| `hero-cyan` | `#164e63 → #0c4a6e` | Pricing / how it works |
| `hero-amber` | `#78350f → #431407` | Process / steps |
| `hero-green` | `#14532d → #052e16` | CTA / get started |

### Hero Photos
Each card hero has a real photo behind the gradient overlay.

**For demos** — use Unsplash URLs with `?w=860&q=80&auto=format&fit=crop`

**For paid client builds** — swap with tradie's own job photos hosted on GitHub Pages.

Hero CSS pattern:
```css
.card-hero { position: relative; overflow: hidden; background: #0f172a; }
.card-hero .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.45; }
.card-hero .hero-overlay { position: absolute; inset: 0; }
/* overlay gradient matches hero theme colour */
.hero-default .hero-overlay { background: linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(15,23,42,0.55) 100%); }
```

Hero HTML pattern:
```html
<div class="card-hero hero-default">
  <img class="hero-img" src="[UNSPLASH_URL]" alt="" loading="lazy">
  <div class="hero-overlay"></div>
  <div class="card-tag">TAG</div>
  <h2 class="card-headline">Headline with <em>Key Term</em></h2>
</div>
```

---

## Slider Card Structure

5 cards per widget. Standard pattern:

```javascript
{
  tag: "🏠 01 / INTRO",     // emoji + number + category, always uppercase
  tagClass: "",              // "" | "tag-purple" | "tag-cyan" | "tag-amber" | "tag-green"
  headline: "Headline with <em>Key Term</em>",
  heroClass: "hero-default",
  photo: "https://images.unsplash.com/photo-XXXXX?w=860&q=80&auto=format&fit=crop",
  summary: "2–4 sentences. Conversational. Perth-specific where relevant.",
  analogy: null,             // or { title: "💡 Think of it like...", text: "..." }
  iButtons: [
    { label: "emoji label text", type: "why-it-matters", term: "Term", content: "2–4 sentences plain language." }
  ]
}
```

### Recommended 5-Card Arc
1. **INTRO** — hero-default — Why this trade matters / problem statement
2. **TYPES** — hero-purple — Material / service options overview
3. **PRICING** — hero-cyan — What drives the price
4. **HOW IT WORKS** — hero-amber — How the estimator / process works
5. **GET STARTED** — hero-green — CTA to get a quote

---

## Floating Quote Button

```css
.float-quote-btn {
  position: fixed; bottom: 76px; right: 14px; z-index: 150;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #000; font-size: 13px; font-weight: 700;
  padding: 12px 18px; border-radius: 50px; border: none;
  box-shadow: 0 4px 20px rgba(245,158,11,0.45);
  animation: pulse-btn 2.5s ease-in-out infinite;
}
@keyframes pulse-btn {
  0%, 100% { box-shadow: 0 4px 20px rgba(245,158,11,0.45); }
  50%       { box-shadow: 0 4px 28px rgba(245,158,11,0.75); }
}
```

**Note:** Uses `position: fixed` so it's always visible regardless of which card is showing. On desktop (>430px) it sits outside the slider — this is acceptable, mobile is the primary target.

---

## Quote Estimator — Step Structure

Standard 7-step flow. Customise steps and pricing for each trade.

| Step key | Title | Component |
|----------|-------|-----------|
| `type` | Service/Material Type | 2x2 option grid |
| `length` / `area` / `rooms` | Quantity | Number input + presets |
| `height` / `size` / `scope` | Scale/Grade | Row option list with badge |
| `gates` / `doors` / `extras1` | Add-ons 1 | 2x2 option grid |
| `extras` | Extras checklist | Toggle list with per-item pricing |
| `estimate` | Price Reveal | Amber price card + summary box |
| `contact` | Lead Capture | Name / Phone / Email / Suburb |

### Live Price Strip
Always visible at top of estimator. Updates on every selection.

```html
<div class="quote-price-strip">
  <div class="qps-left">
    <div class="qps-label">Estimated Price</div>
    <div class="qps-note">supply &amp; install · Perth rates</div>
  </div>
  <div class="qps-price" id="livePriceDisplay">—</div>
</div>
```

### Pricing Engine
```javascript
// Base rate per unit (lineal metre, sqm, room etc)
const BASE_RATES = { option1: 87, option2: 72, ... };
// Multipliers (height, size grade etc)
const SCALE_MULT = { 'small': 0.88, 'standard': 1.0, 'large': 1.18 };
// Per-unit add-ons
const EXTRAS_COST = { extra1: 16, extra2: 22 };

function calcPrice() {
  const base    = BASE_RATES[qd.type];
  const mult    = SCALE_MULT[qd.scale];
  const qty     = parseInt(qd.quantity) || 0;
  const addons  = parseInt(qd.addons) || 0;
  const extPerU = qd.extras.reduce((a, e) => a + (EXTRAS_COST[e] || 0), 0);
  const low     = Math.round(((base * mult) + extPerU) * qty + addons * ADDON_UNIT_COST);
  return { low, high: Math.round(low * 1.15) };
}
```

Always show `low–high` range (15% spread). Never show a single flat number.

---

## Web3Forms Lead Capture

Final step contact form. Always use these constants:

```javascript
access_key: '99a11c15-5c61-4765-99c5-673adec64b16'
// Routes to: responses@itabs.ai
```

Required fields: **Name, Phone, Email** (Suburb optional).

Submit payload always includes:
- `subject`: `"[Trade] Quote — [Name] · [Suburb]"`
- `message`: Full job summary (type, qty, scale, extras, estimate range)

On success → replace quote body with success state (🎉 icon + confirmation message).

---

## i-Button Rules

- Always use `addEventListener` in JS — never `onclick=` in HTML
- Always `encodeURIComponent(b.content)` on data attribute, `decodeURIComponent()` when reading
- Amber colour always: `var(--i-button)` = `#f59e0b`
- 2–4 sentences per i-button, plain language, Perth-specific where relevant

---

## Trade Pricing Reference

Seed rates for common Perth trades (supply + install):

| Trade | Unit | Base rate | Scale range |
|-------|------|-----------|-------------|
| Colorbond fencing | per lin. metre | $87 | $70–$120 |
| Timber fencing | per lin. metre | $72 | $60–$95 |
| Aluminium slat | per lin. metre | $115 | $95–$160 |
| Pool / glass fencing | per lin. metre | $185 | $150–$250 |
| Lawn / turf | per sqm | $28 | $22–$45 |
| Exterior painting | per sqm | $18 | $14–$28 |
| Roof restoration | per sqm | $22 | $18–$35 |
| Plumbing (bathroom) | per fixture | $320 | $250–$500 |

---

## Upsell Note (for client builds)

When building for a paying tradie ($290):
- Replace Unsplash photo URLs with their own job photos hosted on GitHub Pages
- Update pricing to match their actual rates
- Update business name, suburb, contact details in success message
- Register a new Web3Forms key for their email address

---

## Output Checklist

- [ ] Single self-contained HTML file, no external dependencies except Google Fonts + Unsplash
- [ ] 5 slider cards with photos, i-buttons, correct hero themes
- [ ] Floating amber quote button visible on all cards
- [ ] 7-step estimator with live price strip
- [ ] Web3Forms lead capture on final step
- [ ] Success state on submit
- [ ] Saved to `/mnt/user-data/outputs/itabs-[trade]-quote.html`
- [ ] Presented with `present_files`
