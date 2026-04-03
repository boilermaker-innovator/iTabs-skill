# iThoughts SKILL.md

**Version:** 0.2 — 3 April 2026
**Author:** Jon Gwynne / Missy (iTabs AI Coach)
**Status:** Working prototype live on GitHub Pages

-----

## CRITICAL — HOW TO USE THIS SKILL

**DO NOT rebuild from scratch.** The iThoughts files already exist and are live on GitHub.

When asked to build or modify an iThoughts page:

1. Fetch the raw file from GitHub (URLs below)
1. Read it fully
1. Make only the requested modifications
1. Output the complete modified file

This ensures every version inherits the correct design, components, and AI prompts.

-----

## RAW FILE URLS — ALWAYS FETCH THESE FIRST

### Prototype / Demo App

```
https://raw.githubusercontent.com/boilermaker-innovator/Brothers-idea/main/index.html
```

Live at: https://boilermaker-innovator.github.io/Brothers-idea/

### Homepage

```
https://raw.githubusercontent.com/boilermaker-innovator/Brothers-idea/main/ithoughts-home.html
```

### When to fetch which file:

- Building a new iThoughts topic page → fetch prototype file, swap seed cards
- Modifying the homepage → fetch homepage file
- Adding a new feature → fetch prototype file, add feature
- Creating a SKILL.md iThoughts page → fetch prototype file, customise

-----

## MAKE.COM WEBHOOK — USE THIS EXACTLY

```
https://hook.eu2.make.com/vjk9xakasvj6buvmrx8beaeukvwfqd54
```

This is the proxy that connects the page to the Anthropic API. Never change this URL unless Jon explicitly provides a new one. Always use model `claude-sonnet-4-20250514`.

### CRITICAL — WEBHOOK PAYLOAD FORMAT

The Make.com HTTP module expects the FULL Anthropic API format. Always send:

```javascript
body: JSON.stringify({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1000,
  messages: [{ role: 'user', content: prompt }]
})
```

**NEVER send just `{ prompt }` — this will always fail:**

```javascript
// WRONG — breaks every time
body: JSON.stringify({ prompt })
```

The Make HTTP module maps `{{1.model}}`, `{{1.max_tokens}}` and `{{1.messages[1].content}}` — these fields must be present in the payload or the scenario errors.

-----

## WHAT THE PROTOTYPE CONTAINS

The prototype is a single HTML file with everything inline. Here is what it does:

**Header:**

- iThoughts logo (Playfair Display serif, accent blue on “Thoughts”)
- Thought counter pill showing total pills dropped
- Beta badge

**New Card Button:**

- Full width dashed button at top
- Opens bottom sheet modal with Heading + Blurb fields
- AI polishes into a card via Make webhook
- New card inserts below the button

**Seed Cards (3 pre-loaded):**

- 🧱 Bricks of Knowledge — with 3 pre-loaded example pills
- 🧭 Humans in Control of AI — with 1 pre-loaded pill
- ⚙️ How it Works — empty, first card visitors interact with

Each card has:

- Tag + title + body text
- ITHOUGHTS DROPPED label
- Pills container (pre-seeded or empty with italic placeholder)
- ＋ Drop a thought button → opens input bottom sheet
- ↻ Refresh button → calls Make webhook → AI synthesises new cards

**Synthesised Card Slider:**

- Appears below each card after Refresh
- Horizontal swipeable slider with ‹ › nav and dot indicators
- Cards accumulate — existing cards preserved on re-refresh
- Each synthesised card has:
  - ✦ AI SYNTHESISED badge
  - Title (Playfair Display, max 5 words)
  - Teaser line (one punchy sentence)
  - Analogy box (dark bg, blue left border, “Think of it like…” label)
  - 2 amber i-buttons with keyword labels
  - Each i-button opens a bottom sheet detail modal FROM INSIDE THE CARD FRAME

**Bottom Sheet Modals:**

- Input sheet — for dropping thoughts
- Detail sheet — for i-button content, slides from card frame NOT screen bottom
- Create card sheet — heading + blurb → AI card

-----

## WHAT THE HOMEPAGE CONTAINS

The homepage is the front door / marketing page. It contains:

**Hero Card:**

- Starfield gradient hero (dark blue/purple, animated stars)
- 4 pre-seeded pills visible immediately
- ＋ Drop your first iThought button
- Pre-built 3-card slider (hardcoded, not generated):
  - Bricks Become Buildings
  - Readers Are Co-Builders
  - Human First Always
- Each hardcoded card has analogy box + amber ⓘ i-button
- i-buttons open FULL SCREEN bottom sheet (not card frame)

**6 Category Buttons (2x3 grid):**

|Category |Emoji|Colour |Explore Link                                         |
|---------|-----|-------|-----------------------------------------------------|
|Fitness  |🏃    |#10b981|prototype demo                                       |
|Medical  |🧬    |#5b8dee|prototype demo                                       |
|Business |💼    |#f59e0b|prototype demo                                       |
|Education|🎓    |#c4b5fd|prototype demo                                       |
|Personal |🌱    |#fca5a5|prototype demo                                       |
|Trades   |🛠️    |#67e8f9|https://boilermaker-innovator.github.io/itabs-quotes/|

Each category button opens a popup bottom sheet with:

- Category tag + title + description
- 4 pre-seeded topic pills
- ＋ Drop a thought button
- Explore → button (links to relevant page)

-----

## DESIGN SYSTEM — DO NOT CHANGE THESE

### CSS Variables

```css
--bg: #080810
--surface: #0f0f18
--card: #141420
--card2: #1a1a28
--border: #22223a
--accent: #5b8dee       /* Blue — pill dots, links, focus */
--accent2: #7c6de8      /* Purple — gradients */
--gold: #f59e0b         /* Amber — i-buttons */
--green: #10b981        /* Green — synthesised cards, refresh */
--text: #eeeef8
--soft: #8888aa
--muted: #44445a
--pill-bg: #1a2040
--pill-border: #2a3a6a
```

### Fonts

- **Playfair Display** — card titles, modal titles, logo
- **DM Sans** — all body text, buttons, labels, pills

### Max width: 420px centred on desktop, full width on mobile

### Key measurements

- Card border-radius: 20-22px
- Pill border-radius: 20px (full pill shape)
- Button border-radius: 10-12px
- Analogy box: left border 3px solid accent, dark bg, rounded

-----

## AI PROMPTS — USE EXACTLY AS WRITTEN

### 1. Synthesise iThoughts → New Cards (Refresh button)

```
You are an iThoughts AI synthesiser. Read the iThoughts below and synthesise 2 NEW card ideas.

Original card: "${cardTitle}"

iThoughts:
${numbered list of thoughts}

Rules:
- title: max 5 words, punchy, no fluff
- teaser: ONE short sentence, plain language
- analogy_title: short label like "Think of it like..." or "The pattern is..."
- analogy: one punchy analogy or real-world comparison, 1-2 sentences
- ibuttons: array of exactly 2 objects, each with:
  - keyword: 1-2 words (e.g. "the science", "the pattern", "the fix")
  - detail: 2 sentences max on that specific angle

Respond ONLY with valid JSON — no markdown, no backticks:
{"cards": [
  {
    "title": "Short title",
    "teaser": "One punchy line.",
    "analogy_title": "Think of it like...",
    "analogy": "Analogy here.",
    "ibuttons": [
      {"keyword": "the science", "detail": "Detail here."},
      {"keyword": "the fix", "detail": "Detail here."}
    ]
  },
  { ...second card same format... }
]}
```

### 2. Create Card from Heading + Blurb (+ New Card button)

```
You are an iTabs card writer. Turn the user's rough idea into a polished card.

Heading: "${heading}"
Blurb: "${blurb}"

Rules:
- title: punchy, max 6 words, keep the user's intent
- body: 2 sentences max, plain language, no fluff
- tag: one emoji + 2 words describing the topic

Respond ONLY with valid JSON — no markdown, no backticks:
{"title": "Card title", "body": "Card body.", "tag": "💡 Topic Name"}
```

-----

## HOW TO BUILD A NEW ITHOUGHTS TOPIC PAGE

When Jon says “build me an iThoughts page about [TOPIC]”:

1. Fetch the prototype file from the raw GitHub URL above
1. Change the 3 seed cards to match the topic:
- Keep the same HTML structure
- Update tag, title, body, and pre-loaded pills for each card
1. Update the page title tag to match the topic
1. Keep ALL JS, CSS, and the Make webhook URL unchanged
1. Output the complete file ready to deploy

**Example seed cards for Fitness:**

```
Card 1: 🏃 Training Observations
"Athletes lose micro-insights during training that coaches never hear."
Pills: "Left hip tightens at 15km", "Best runs follow 8 hours sleep"

Card 2: 💪 Mental Performance
"The mental wall hits before the physical one."
Pills: "I run better in the morning"

Card 3: ⚙️ How to Use
"Drop what you notice. Refresh when you have enough bricks."
Pills: empty
```

-----

## THINGS THAT WERE TRIED AND REVERTED

- **3 i-buttons per card** — reverted, too wide on desktop, not enough value on mobile. Max 2.
- **Source pills on synthesised cards** — reverted, was pulling wrong pills from wrong card
- **Detail sheet from screen bottom on prototype** — on prototype, detail opens FROM CARD FRAME. On homepage, opens from screen bottom. Keep this distinction.
- **Full-width layout** — reverted to max-width 420px. Looks bad on desktop when wide.
- **Opus model** — always use `claude-sonnet-4-20250514` not Opus, Sonnet is faster and cheaper

-----

## KNOWN ISSUES — DO NOT REGRESS THESE

|Issue                             |Status     |Notes                                      |
|----------------------------------|-----------|-------------------------------------------|
|Thoughts reset on page refresh    |⚠️ Known    |localStorage fix in progress               |
|Make latency 4-7 seconds          |⚠️ Known    |Cloudflare Worker would fix this           |
|Swipe gestures on prototype slider|⚠️ Partial  |Touch events on homepage but not prototype |
|Photo upload                      |🔲 Not built|Tap hero → camera/library → fills card hero|
|SKILL.md generator button         |🔲 Not built|Prototype reads itself and outputs SKILL.md|

-----

## ITHOUGHTS PHILOSOPHY — BUILD WITH THIS IN MIND

> *“The human always drops the first brick. AI never leads. The deck grows itself.”*

Every design decision should reinforce this. The human is always the author. The AI is the synthesiser.

When building iThoughts pages, always ask:

- Does this make it easier to drop a raw thought? ✅
- Does this make the AI feel like it’s in charge? ❌
- Does the output feel like it came from the human’s thinking? ✅
- Does it require login, setup, or friction to start? ❌

-----

## SESSION ORIGIN

iThoughts was born on 2 April 2026. Jon had a fleeting thought driving to Sundowner Drinks. By midnight Perth time, a working prototype was live on GitHub Pages. That is iThoughts proving itself before it launched.

-----

*Skill maintained by Missy — iTabs AI Coach*
*Last updated: 3 April 2026*
