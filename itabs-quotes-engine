---
name: itabs-quotes-engine
description: Build config-driven interactive quote estimator widgets using the iTabs Quotes Engine v1.3. Use this skill when building a tradie quote estimator, pricing widget, or any interactive step-by-step estimator for a Perth trade business. The engine is fully config-driven — you only write the WIDGET_CONFIG object. Never edit the engine code below it.
---

# iTabs Quotes Engine v1.3 — SKILL.md

Build interactive, accordion-style quote estimator widgets for Perth tradies. Config-driven — one JS object controls everything. The engine renders, calculates, and handles lead capture automatically.

Live examples: itabs.ai/fencing.html, itabs.ai/paving.html, itabs.ai/plumbing.html

---

## Architecture

Two sections in the HTML file:

1. **WIDGET_CONFIG** — the only thing you write per client. Controls business details, branding, steps, pricing, lead capture, and sharing.
2. **Engine** — generic JS/CSS that reads the config and renders everything. Never edit this section.

---

## WIDGET_CONFIG Structure

```javascript
const WIDGET_CONFIG = {
  business: { ... },
  branding: { ... },
  header: { ... },
  hubUrl: "index.html",   // back link — set "" to hide
  steps: [ ... ],         // accordion steps — the core
  estimate: { ... },      // estimate display section
  pricing: { ... },       // pricing engine config
  share: { ... },         // share quote functionality
  leadCapture: { ... },   // contact form (only shows if web3formsKey set)
  socialProof: { ... },   // stars/badges (set enabled: false to hide)
  footer: { ... },
};
```

---

## business

```javascript
business: {
  name: "Pete's Fencing Co",
  tagline: "Colorbond, Timber & Pool Fencing",
  phone: "0412 333 444",
  email: "pete@example.com",
  logo: "",              // URL or "" to skip
  website: "",
  location: "Rockingham, Perth WA",
  socials: { facebook: "", instagram: "", google: "" }
}
```

---

## branding

Key fields only — rest are defaults:

```javascript
branding: {
  mode: "dark",
  primaryColor: "#f59e0b",      // amber — iTabs default
  secondaryColor: "#d97706",
  backgroundColor: "#0c1117",
  cardBackground: "#151c25",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  googleFontsUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
  borderRadius: "14px",
}
```

For branded widgets change primaryColor to match the tradie's brand colour.

---

## header

```javascript
header: {
  icon: "🏗️",
  headline: "How much is my fence?",
  subtitle: "Tap through to get a ballpark price. Takes about 60 seconds.",
  badge: "📍 Prices based on Perth, WA — 2025/26",
  disclaimer: "Estimates are approximate. Final pricing confirmed after site inspection.",
}
```

---

## steps — Input Types

Each step is an accordion section. Four input types available:

### 1. select — single choice cards

```javascript
{
  id: "fence_type",
  title: "What type of fence?",
  preview: "Tap to choose",
  input: {
    type: "select",
    columns: 1,          // 1 = full width, 2 = two columns
    autoAdvance: true,   // auto-open next step on selection
    options: [
      {
        value: "colorbond",
        label: "Colorbond",
        icon: "🔩",
        description: "Steel panels. Most popular in Perth.",
        priceHint: "$90–$125/m",
        tags: [
          { text: "Most Popular in WA", highlight: true },
          { text: "10yr warranty" }
        ]
      }
    ]
  },
  hints: [ ... ]   // optional ℹ tabs
}
```

### 2. multi_select — multiple choice (tick multiple)

```javascript
input: {
  type: "multi_select",
  columns: 2,
  skipLabel: true,    // shows "Skip this step" link
  options: [ ... ]    // same structure as select
}
```

State stored as array: `state.answers[stepId] = ["value1", "value2"]`

### 3. slider_group — one or more sliders

```javascript
input: {
  type: "slider_group",
  sliders: [
    {
      id: "length_m",
      label: "Length",
      min: 5, max: 80, step: 5, default: 25,
      unit: "m",
      markers: ["5m", "25m", "50m", "80m"]
    },
    {
      id: "height_m",
      label: "Height",
      min: 1, max: 4, step: 1, default: 3,
      unit: "",
      markers: ["0.9m", "1.2m", "1.8m", "2.1m"],
      valueMap: [
        { value: 1, label: "0.9m",               numericValue: 0.9 },
        { value: 2, label: "1.2m",               numericValue: 1.2 },
        { value: 3, label: "1.8m (standard)",    numericValue: 1.8 },
        { value: 4, label: "2.1m (extra privacy)",numericValue: 2.1 }
      ]
      // valueMap maps slider integer steps to labelled/numeric values
      // omit valueMap for direct numeric sliders
    }
  ]
}
```

### 4. toggle_group — on/off extras

```javascript
input: {
  type: "toggle_group",
  toggles: [
    { id: "gate",      label: "Pedestrian gate", icon: "🚪", costLabel: "+$350–$600" },
    { id: "drivegate", label: "Driveway gate",   icon: "🚗", costLabel: "+$800–$1,500" },
    { id: "removal",   label: "Old fence removal",icon: "🗑️", costLabel: "+$15–$30/m" },
    { id: "slope",     label: "Sloping block",   icon: "⛰️", costLabel: "+10–20%" },
  ]
}
```

---

## hints — ℹ tabs inside each step

Hints appear as tabs alongside the input tab. Three hint types:

### comparison_table

```javascript
{
  tabLabel: "Compare",
  type: "comparison_table",
  headers: ["Type", "Cost", "Maintenance", "Life"],
  rows: [
    ["Colorbond", "$90–$125/m", "Almost none", "20+ yrs"],
    ["Timber",    "$120–$200/m","Paint every 3–5 yrs", "10–20 yrs"],
  ]
}
```

### mixed — key_point and tip blocks

```javascript
{
  tabLabel: "Tips",
  type: "mixed",
  content: [
    {
      type: "key_point",
      label: "📏 How to measure",
      text: "Walk the fence line with your phone's step counter..."
    },
    {
      type: "tip",
      icon: "🌊",
      title: "Near the coast?",
      text: "Within 1km of the ocean? Go Colorbond or aluminium."
    }
  ]
}
```

### warnings — conditional alerts

Attach to a step, show/hide based on current state:

```javascript
warnings: [
  {
    condition: "answers.fence_type === 'timber' && answers.conditions === 'coastal'",
    icon: "⚠️",
    title: "Timber in coastal areas",
    text: "Salt air degrades timber faster. Consider Colorbond."
  }
]
```

---

## pricing — The Calculation Engine

Calculation order: **base → preAdjustments → multipliers → quantity → postAdjustments → extras → minimum → rounding**

```javascript
pricing: {
  unit: "metre",
  unitLabel: "per metre",
  basePriceStep: "fence_type",    // which step.id holds the primary selection
  basePrices: {
    colorbond:  { low: 90,  high: 125 },
    timber:     { low: 120, high: 200 },
    aluminium:  { low: 180, high: 300 },
    pool:       { low: 200, high: 600 },
  },
  quantitySource: "length_m",     // slider id to multiply base price by

  multipliers: [
    {
      source: "height_m",         // slider id
      type: "value_map",
      values: { 0.9: 0.65, 1.2: 0.8, 1.8: 1.0, 2.1: 1.15 }
      // key = numeric slider value, value = multiplier
    },
    {
      source: "conditions",       // select id
      type: "select_map",
      values: { easy: 1.0, moderate: 1.1, hard: 1.2, unknown: 1.05 }
    }
  ],

  preAdjustments: [
    // Additive $/unit adjustments BEFORE quantity multiplication
    {
      source: "fence_type",
      type: "additive",
      values: { pool: 50, _default: 0 }  // _default is fallback
    }
  ],

  postAdjustments: [
    // Additive $ adjustments AFTER quantity multiplication
  ],

  extras: [
    // Toggle-driven add-ons
    { id: "gate",      type: "fixed",      low: 350,  high: 600,  breakdownLabel: "Pedestrian gate" },
    { id: "drivegate", type: "fixed",      low: 800,  high: 1500, breakdownLabel: "Driveway gate" },
    { id: "removal",   type: "per_unit",   lowPerUnit: 15, highPerUnit: 30, breakdownLabel: "Old fence removal" },
    { id: "slope",     type: "percentage", lowPercent: 10, highPercent: 20, breakdownLabel: "Sloping block" },
    { id: "plinth",    type: "per_unit",   lowPerUnit: 15, highPerUnit: 25, breakdownLabel: "Plinths" },
  ],

  showBreakdown: true,
  roundTo: 0,          // round to nearest N (e.g. 50 → $4,950, 0 = no rounding)
  minimumPrice: 500,   // floor price regardless of inputs
}
```

### Extra types

| Type | Calculation | Use for |
|------|-------------|---------|
| `fixed` | flat add-on | gates, items with set price |
| `per_unit` | lowPerUnit × quantity | removal, plinths, lattice (per metre) |
| `percentage` | % of running total | slope surcharge, coastal premium |

---

## estimate

```javascript
estimate: {
  title: "Your ballpark price",
  preview: "Based on your selections",
  note: "Supply & install • incl. GST • Perth metro",
  hints: [
    {
      type: "key_point",
      label: "How accurate is this?",
      text: "This is a rough guide based on average Perth pricing in 2025..."
    },
    {
      type: "tip",
      icon: "💡",
      title: "Neighbour splitting costs?",
      text: "In WA, neighbours generally split the cost of a dividing fence 50/50..."
    }
  ]
}
```

---

## share

```javascript
share: {
  enabled: true,
  header: "🏗️ Fencing Estimate — Perth",
  methods: ["copy", "whatsapp", "sms", "email"]
}
```

Share generates a plain-text summary of all selections + estimate range. User's preferred method is remembered via localStorage.

---

## leadCapture

**Only renders if `web3formsKey` is set.** Leave empty for generic public estimators (like itabs.ai). Set it for branded tradie widgets.

```javascript
leadCapture: {
  enabled: true,
  title: "Want a fencing company to contact you?",
  preview: "Free quotes, no obligation",
  heading: "We've got your specs.",
  subheading: "Leave your details and we'll get back to you with an actual quote.",
  showSummary: true,     // shows selections summary above the form
  fields: [
    { id: "name",    label: "Your name",      type: "text",     placeholder: "e.g. Dave",        required: true },
    { id: "contact", label: "Phone or email", type: "text",     placeholder: "e.g. 0412 345 678", required: true },
    { id: "suburb",  label: "Suburb",         type: "text",     placeholder: "e.g. Joondalup",    required: false },
    { id: "notes",   label: "Anything else?", type: "textarea", placeholder: "",                  required: false },
  ],
  submitText: "📩 Send My Quote Request",
  submitNote: "No spam. Just your quote.",
  successMessage: "Quote request sent! ✅",
  successSubtext: "We'll be in touch within 24 hours with a proper price.",
  delivery: {
    method: "web3forms",
    web3formsKey: "99a11c15-5c61-4765-99c5-673adec64b16",  // iTabs key for branded widgets
    notifyEmail: "responses@itabs.ai",
    emailSubject: "New Fence Enquiry",
  }
}
```

The form submission sends: all field values + selections summary + estimate range to the notifyEmail.

---

## socialProof

```javascript
socialProof: {
  enabled: false,    // set true to show
  rating: 4.9,
  reviewCount: 127,
  badges: ["Licensed & Insured", "Perth Local", "Free Quotes"],
}
```

---

## Trade Templates — Perth Pricing Reference

### Fencing
```
basePrices: { colorbond: {low:90, high:125}, timber: {low:120, high:200}, aluminium: {low:180, high:300}, pool: {low:200, high:600} }
quantitySource: length_m
height multipliers: { 0.9: 0.65, 1.2: 0.8, 1.8: 1.0, 2.1: 1.15 }
```

### Paving
```
basePrices: { brick: {low:85, high:140}, concrete: {low:65, high:110}, natural_stone: {low:150, high:280}, exposed_agg: {low:90, high:150} }
quantitySource: area_m2 (slider)
```

### Landscaping
```
basePrices: { turf_only: {low:25, high:45}, turf_retic: {low:45, high:75}, full_landscape: {low:80, high:150} }
quantitySource: area_m2
```

### Electrical
```
basePrices: { lighting: {low:120, high:220}, powerpoints: {low:180, high:320}, switchboard: {low:800, high:2500}, rewire: {low:4000, high:12000} }
type: fixed (not per metre) — set quantitySource to a quantity slider
```

### Plumbing
```
basePrices: { tap_repair: {low:120, high:200}, toilet: {low:200, high:450}, hot_water: {low:800, high:2200}, drain: {low:150, high:400} }
Has urgency multiplier: { standard: 1.0, urgent: 1.35, emergency: 1.75 }
```

### Painting (per room)
```
basePrices: { small_room: {low:300, high:500}, medium_room: {low:450, high:750}, large_room: {low:600, high:1000} }
quantitySource: room_count (slider, min:1, max:10)
paint quality multiplier: { budget: 0.85, standard: 1.0, premium: 1.2 }
```

---

## Output Rules

- Always produce a single self-contained HTML file
- WIDGET_CONFIG goes in the first `<script>` block, before the engine
- Never edit anything in the engine section (marked "Do not edit per client")
- Filename: `itabs-[trade]-[business-slug].html` e.g. `itabs-fencing-petes.html`
- Save to `/mnt/user-data/outputs/` and present with `present_files`

## Content Rules

- All copy should be Perth-specific and local-aware (suburb, coastal conditions, council requirements, BAL zones)
- priceHint values on options must reflect 2025/26 Perth metro rates
- Comparison table rows should cover all options in that step
- Tips should reference Perth-specific info (AS 1926 pool fencing, Dividing Fences Act 1961, limestone soil, coastal Colorbond)
- minimumPrice should be set to realistic tradie call-out floor (usually $300–$800 depending on trade)

## Critical Notes

- **leadCapture only renders if `web3formsKey` is non-empty** — leave blank for generic estimators, set for branded tradie widgets
- **slider valueMap** maps integer slider positions to labelled/numeric pairs — required when slider labels don't match numeric values (e.g. height steps)
- **extra type `percentage`** calculates against the running total AFTER base × quantity — order in extras array matters
- **autoAdvance: true** on select steps creates a smooth guided flow — use on steps 1–3, optional on later steps
- **warnings** use `eval()` on the condition string — keep conditions simple and reference `answers.stepId` and `state.toggles.id`
