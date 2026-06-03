---
name: itabs-quote-estimator
description: Create interactive iTabs quote estimators for trades and services. Use when someone wants to build an interactive pricing widget with contextual education (i-buttons), progressive disclosure, and customer self-service quoting. Works for any trade — fencing, painting, electrical, plumbing, landscaping, paving, and more.
---

# iTabs Quote Estimator

Build interactive, mobile-first quote estimators that educate customers while they choose. Each option includes contextual i-buttons that explain WHY things cost what they cost.

## Core Concept: Progressive Disclosure

iTabs uses layered information delivery:
- **Layer 1 — The Option**: What the customer sees and selects
- **Layer 2 — The i-Button**: Tap to reveal context, definitions, reasoning
- **Layer 3 — The Detail**: Deep explanations for those who want them

The customer chooses their own depth. Experts skip through. Beginners tap every button. Same tool, different experience.

## Architecture

Each estimator is a **single HTML file** with zero dependencies:
- No frameworks (no React, no Vue, no Angular)
- No build tools (no npm, no webpack)
- No external APIs
- Works in any browser, any device, any hosting

Powered by a WIDGET_CONFIG JavaScript object that defines sections, options, pricing rules, and i-button educational content.

## WIDGET_CONFIG Schema

\`\`\`javascript
const WIDGET_CONFIG = {
  business: {
    name: "Business Name",
    phone: "0400 000 000",
    email: "info@business.com.au",
    website: "https://business.com.au",
    primaryColor: "#3b82f6",
    accentColor: "#f59e0b"
  },
  estimator: {
    title: "Fencing Quote Estimator",
    subtitle: "Get a ballpark estimate in 60 seconds",
    disclaimer: "Indicative pricing only. Final quote may vary.",
    sections: [
      {
        id: "material",
        title: "Choose Your Material",
        type: "single-select",
        options: [
          {
            id: "colorbond",
            label: "Colorbond Steel",
            description: "Durable, low maintenance",
            pricePerUnit: 95,
            unit: "per metre",
            iButton: {
              term: "Why Colorbond?",
              type: "why-it-matters",
              content: "Colorbond handles coastal salt air without rusting, needs zero painting, and comes in 22 colours. Higher upfront cost but lower lifetime cost than timber."
            }
          }
        ]
      },
      {
        id: "length",
        title: "Fence Length",
        type: "slider",
        min: 5,
        max: 100,
        step: 1,
        defaultValue: 20,
        unit: "metres",
        iButton: {
          term: "How to Measure",
          type: "definition",
          content: "Measure along the boundary line. Include gate openings. If unsure, use Google Maps measure tool."
        }
      }
    ]
  }
};
\`\`\`

## i-Button Content Types

| Type | When to Use | Example |
|------|-------------|---------|
| definition | Explaining a term or concept | "H4 Treatment: A preservative process..." |
| context | Regulations, local conditions | "WA's Dividing Fences Act 1961..." |
| why-it-matters | Why this choice affects price/quality | "Coastal-rated materials prevent..." |
| related | Links, further resources | "Learn more at council website..." |

Every option should have at least one i-button. The educational content is what differentiates iTabs from a basic calculator.

## Pricing Logic

- **Base price**: pricePerUnit x quantity
- **Multipliers**: height, access difficulty, soil type
- **Add-ons**: gates, posts, removal of old fence
- **GST**: Always include, always show separately

Display both total and per-unit breakdown so customers can compare quotes.

## Output Requirements

- Single self-contained HTML file
- Mobile-first responsive (max-width: 430px centered)
- Dark mode default
- Running total visible at all times
- Share/copy quote summary button
- Business contact details and CTA
- All CSS and JS inline (only external: Google Fonts)

## Generating for a New Trade

1. Identify the key decision points — What does the customer choose?
2. Research pricing for your region
3. Write i-button content — explain WHY, not just WHAT
4. Structure the config following the schema above
5. Test with real scenarios

The educational content is what makes iTabs different. Invest time here.

## Philosophy

- Information meets people where they are
- Customers learn while they choose
- Trust is built through transparency
- The tool should work for the least technical user
- Open source: copy it, improve it, share it

Built by a Perth boilermaker using AI. No CS degree required.

Learn more: https://itabs.ai
GitHub: https://github.com/boilermaker-innovator
