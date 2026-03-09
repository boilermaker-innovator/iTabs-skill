---
name: itabs-widget-builder
description: Build interactive iTabs swipeable card widgets — mobile-first HTML files with contextual "i" buttons. Use this skill whenever the user wants to create an iTabs, a swipeable summary, an embeddable quote estimator widget, a prep guide, an event summary, a video summary card deck, a tradie onboarding widget, or any interactive card-based content display. Trigger on phrases like "build an iTabs", "make a widget", "create a card deck", "swipeable summary", "quote estimator", or any request to package content into an interactive, shareable HTML format. Always use this skill when building for tradies, Perth businesses, or the iTabs platform.
---

# iTabs Widget Builder

Build interactive, mobile-first swipeable card widgets — single self-contained HTML files deployable to GitHub Pages. These are the core output format of the iTabs platform.

## What Is an iTabs Widget

An iTabs widget is a swipeable card deck — like Instagram Stories but for structured content. Each card has:

- A **hero section** (tag, headline, colour theme)
- A **body section** (summary text, optional analogy box)
- **i-buttons** — tappable pills that open a bottom-sheet modal with contextual info

Key properties:

- Single HTML file, zero server dependencies
- Mobile-first (max-width 430px, full viewport height)
- Dark theme by default
- Swipe / tap / keyboard navigation
- Progress bar at top tracks position
- Deployable directly to GitHub Pages

---

## Widget Types

| Type | Use case | Card count |
|------|----------|------------|
| `video-summary` | YouTube / podcast key points | 5–10 |
| `quote-estimator` | Tradie pricing widget with lead capture | 4–8 |
| `prep-guide` | Event / meetup / course preparation | 4–8 |
| `explainer` | Concept breakdown for a topic | 4–8 |
| `profile` | Person / business / product intro | 3–6 |
| `onboarding` | Welcome + setup steps | 4–6 |

---

## Design System (Never Deviate)

### CSS Variables

```css
:root {
  --bg-primary: #0a0a0f;       /* page background */
  --bg-secondary: #12121a;     /* card background */
  --bg-tertiary: #1e1e2e;      /* analogy box, modal bg */
  --text-primary: #ffffff;
  --text-secondary: #9090b0;
  --accent: #7c3aed;           /* purple — progress bar active */
  --accent2: #06b6d4;          /* cyan — secondary accent */
  --i-button: #f59e0b;         /* amber — ALL i-buttons, always */
  --card-radius: 16px;
  --transition: 0.2s ease;
}
```

### Hero Theme Table

Each card gets one hero theme. Use these and only these:

| Theme class | Gradient | Use for |
|-------------|----------|---------|
| `default` | dark slate | Intro / problem cards |
| `purple` | `#7c3aed → #4f46e5` | Core concept / foundational |
| `cyan` | `#0891b2 → #06b6d4` | Mechanics / how it works |
| `amber` | `#d97706 → #f59e0b` | Use cases / benefits |
| `green` | `#059669 → #10b981` | Action / CTA / build cards |
| `red` | `#dc2626 → #ef4444` | Warning / problem / cost |

### Em Highlight Colours

Inside card headlines, one key term per card is wrapped in `<em>`. Em colour matches the card theme:

```css
.hero-purple em { color: #a78bfa; }
.hero-cyan   em { color: #67e8f9; }
.hero-amber  em { color: #fcd34d; }
.hero-green  em { color: #6ee7b7; }
.hero-red    em { color: #fca5a5; }
.hero-default em { color: #cbd5e1; }
```

---

## Card Data Structure

```javascript
const cards = [
  {
    tag: "01 / INTRO",          // Format: "NN / CATEGORY" — always uppercase
    tagClass: "",               // "" = default, or "tag-purple", "tag-cyan", etc.
    headline: "Nobody Reads Your <em>Wall of Text</em>",  // One <em> per headline
    heroClass: "hero-default",  // matches theme table above
    summary: "2–4 sentences. Conversational, not academic. Plain language.",
    analogy: null,              // or: { title: "Think of it like...", text: "..." }
    iButtons: [
      {
        label: "Why it matters",
        type: "why-it-matters",  // definition | why-it-matters | context | related
        term: "Progressive Disclosure",
        content: "2–4 sentences explaining this concept in plain language."
      }
    ]
  }
  // ... more cards
];
```

### i-Button Types

| Type | When to use |
|------|-------------|
| `definition` | Explaining a term or concept |
| `why-it-matters` | Making the case for relevance |
| `context` | Background / how it fits |
| `related` | Connecting to adjacent ideas |

---

## Full HTML Template (Copy Exact)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>iTabs | [TITLE]</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        :root {
            --bg-primary: #0a0a0f; --bg-secondary: #12121a; --bg-tertiary: #1e1e2e;
            --text-primary: #ffffff; --text-secondary: #9090b0;
            --accent: #7c3aed; --accent2: #06b6d4; --i-button: #f59e0b;
            --card-radius: 16px; --transition: 0.2s ease;
        }
        html, body { height: 100%; overflow: hidden; }
        body { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg-primary); color: var(--text-primary); line-height: 1.5; }
        .container { max-width: 430px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; position: relative; }

        /* Progress bar */
        .progress-container { display: flex; gap: 4px; padding: 12px 16px 8px; position: absolute; top: 0; left: 0; right: 0; z-index: 100; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); }
        .progress-segment { flex: 1; height: 3px; background: rgba(255,255,255,0.2); border-radius: 2px; transition: background var(--transition); }
        .progress-segment.viewed { background: rgba(255,255,255,0.6); }
        .progress-segment.active { background: var(--accent); }

        /* Cards */
        .cards-wrapper { flex: 1; position: relative; overflow: hidden; }
        .card { position: absolute; inset: 0; display: flex; flex-direction: column; opacity: 0; transform: translateX(100%); transition: all 0.3s ease; pointer-events: none; }
        .card.active { opacity: 1; transform: translateX(0); pointer-events: all; }
        .card.prev { opacity: 0; transform: translateX(-100%); }

        /* Hero */
        .card-hero { padding: 52px 20px 20px; min-height: 38%; display: flex; flex-direction: column; justify-content: flex-end; background: var(--bg-secondary); }
        .hero-default { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
        .hero-purple  { background: linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%); }
        .hero-cyan    { background: linear-gradient(135deg, #164e63 0%, #0c4a6e 100%); }
        .hero-amber   { background: linear-gradient(135deg, #78350f 0%, #431407 100%); }
        .hero-green   { background: linear-gradient(135deg, #14532d 0%, #052e16 100%); }
        .hero-red     { background: linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%); }

        .card-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
        .tag-purple { color: #a78bfa; } .tag-cyan { color: #67e8f9; } .tag-amber { color: #fcd34d; } .tag-green { color: #6ee7b7; } .tag-red { color: #fca5a5; }
        .card-headline { font-size: clamp(20px, 5vw, 26px); font-weight: 700; line-height: 1.25; }
        .hero-default em { color: #cbd5e1; font-style: normal; }
        .hero-purple  em { color: #a78bfa; font-style: normal; }
        .hero-cyan    em { color: #67e8f9; font-style: normal; }
        .hero-amber   em { color: #fcd34d; font-style: normal; }
        .hero-green   em { color: #6ee7b7; font-style: normal; }
        .hero-red     em { color: #fca5a5; font-style: normal; }

        /* Body */
        .card-body { flex: 1; background: var(--bg-secondary); padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .card-summary { font-size: 15px; color: var(--text-secondary); line-height: 1.65; }
        .analogy-box { background: var(--bg-tertiary); border-left: 3px solid var(--accent2); border-radius: 8px; padding: 12px 14px; }
        .analogy-title { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent2); margin-bottom: 6px; }
        .analogy-text { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

        /* i-buttons */
        .i-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
        .i-button { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); border-radius: 20px; font-size: 12px; font-weight: 600; color: var(--i-button); cursor: pointer; transition: all var(--transition); -webkit-tap-highlight-color: transparent; }
        .i-button:active { background: rgba(245,158,11,0.25); transform: scale(0.96); }
        .i-dot { width: 16px; height: 16px; background: var(--i-button); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #000; flex-shrink: 0; }

        /* Navigation */
        .nav-area { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px 24px; background: var(--bg-secondary); border-top: 1px solid rgba(255,255,255,0.06); }
        .nav-btn { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: var(--text-primary); font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition); }
        .nav-btn:disabled { opacity: 0.2; cursor: default; }
        .nav-btn:not(:disabled):active { background: rgba(255,255,255,0.15); transform: scale(0.94); }
        .card-counter { font-size: 12px; color: var(--text-secondary); font-weight: 500; }

        /* Modal */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: all; }
        .modal-sheet { width: 100%; max-width: 430px; margin: 0 auto; background: var(--bg-tertiary); border-radius: 20px 20px 0 0; padding: 20px; transform: translateY(100%); transition: transform 0.3s ease; }
        .modal-overlay.active .modal-sheet { transform: translateY(0); }
        .modal-handle { width: 36px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 0 auto 16px; }
        .modal-term { font-size: 17px; font-weight: 700; margin-bottom: 4px; }
        .modal-type { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--i-button); margin-bottom: 12px; }
        .modal-content { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
        .modal-close { margin-top: 20px; width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: none; border-radius: 10px; color: var(--text-primary); font-size: 14px; font-weight: 600; cursor: pointer; }
    </style>
</head>
<body>
<div class="container">
    <div class="progress-container" id="progress"></div>
    <div class="cards-wrapper" id="cardsWrapper"></div>
    <div class="nav-area">
        <button class="nav-btn" id="prevBtn" onclick="navigate(-1)">←</button>
        <span class="card-counter" id="counter">1 / N</span>
        <button class="nav-btn" id="nextBtn" onclick="navigate(1)">→</button>
    </div>
</div>

<div class="modal-overlay" id="modalOverlay" onclick="if(event.target===this)closeModal()">
    <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-term" id="modalTerm"></div>
        <div class="modal-type" id="modalType"></div>
        <div class="modal-content" id="modalContent"></div>
        <button class="modal-close" onclick="closeModal()">Close</button>
    </div>
</div>

<script>
// ⚠️ REPLACE THIS ARRAY WITH YOUR CARD DATA
const cards = [
    {
        tag: "01 / INTRO",
        tagClass: "",
        headline: "Your <em>Headline</em> Here",
        heroClass: "hero-default",
        summary: "Your summary text here. 2–4 sentences, conversational tone.",
        analogy: null,
        iButtons: [
            { label: "Why it matters", type: "why-it-matters", term: "Term", content: "Explanation here." }
        ]
    }
];

let currentCard = 0;
const totalCards = cards.length;
const modalOverlay = document.getElementById('modalOverlay');
const modalTerm = document.getElementById('modalTerm');
const modalType = document.getElementById('modalType');
const modalContent = document.getElementById('modalContent');

function init() {
    const progress = document.getElementById('progress');
    const wrapper = document.getElementById('cardsWrapper');
    cards.forEach((card, i) => {
        const seg = document.createElement('div');
        seg.className = 'progress-segment' + (i === 0 ? ' active' : '');
        progress.appendChild(seg);
        wrapper.appendChild(buildCard(card, i));
    });
    document.getElementById('counter').textContent = `1 / ${totalCards}`;
    document.getElementById('prevBtn').disabled = true;
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'Escape') closeModal();
    });
    // Swipe support
    let startX = 0;
    const cw = document.getElementById('cardsWrapper');
    cw.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    cw.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    });
}

function buildCard(card, index) {
    const el = document.createElement('div');
    el.className = 'card' + (index === 0 ? ' active' : '');
    const analogyHTML = card.analogy ? `<div class="analogy-box"><div class="analogy-title">${card.analogy.title}</div><div class="analogy-text">${card.analogy.text}</div></div>` : '';
    // ⚠️ CRITICAL: i-buttons MUST use data-content with encodeURIComponent
    const iButtonsHTML = card.iButtons.length ? `<div class="i-buttons">${card.iButtons.map(b => `<button class="i-button" data-term="${b.term}" data-type="${b.type}" data-content="${encodeURIComponent(b.content)}"><span class="i-dot">i</span>${b.label}</button>`).join('')}</div>` : '';
    el.innerHTML = `
        <div class="card-hero ${card.heroClass}">
            <div class="card-tag ${card.tagClass}">${card.tag}</div>
            <h2 class="card-headline">${card.headline}</h2>
        </div>
        <div class="card-body">
            <p class="card-summary">${card.summary}</p>
            ${analogyHTML}
            ${iButtonsHTML}
        </div>`;
    // ⚠️ CRITICAL: addEventListener must be used, NOT onclick in HTML
    el.querySelectorAll('.i-button').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            openModal(btn.dataset.term, btn.dataset.type, decodeURIComponent(btn.dataset.content));
        });
    });
    return el;
}

function navigate(direction) {
    const next = currentCard + direction;
    if (next >= 0 && next < totalCards) updateCard(next);
}

function updateCard(index) {
    document.querySelectorAll('.card').forEach((c, i) => {
        c.classList.remove('active', 'prev');
        if (i === index) c.classList.add('active');
        else if (i < index) c.classList.add('prev');
    });
    document.querySelectorAll('.progress-segment').forEach((s, i) => {
        s.classList.remove('active', 'viewed');
        if (i === index) s.classList.add('active');
        else if (i < index) s.classList.add('viewed');
    });
    currentCard = index;
    document.getElementById('counter').textContent = `${index + 1} / ${totalCards}`;
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === totalCards - 1;
}

function openModal(term, type, content) {
    const typeLabels = { 'definition': 'Definition', 'context': 'Context', 'why-it-matters': 'Why It Matters', 'related': 'Related' };
    modalTerm.textContent = term;
    modalType.textContent = typeLabels[type] || type;
    modalContent.textContent = content;
    modalOverlay.classList.add('active');
}

function closeModal() { modalOverlay.classList.remove('active'); }

init();
</script>
</body>
</html>
```

---

## Output Rules

- **Always** produce a single self-contained HTML file
- **Always** save to `/mnt/user-data/outputs/[filename].html`
- **Always** present the file using `present_files`
- Filename format: `itabs-[topic-slug].html` e.g. `itabs-vibe-coding.html`
- First card = "The Problem" or context-setting — never start with jargon
- Last card = actionable next step or CTA

## Content Rules

- Card headlines: 5–10 words, one key term in `<em>`
- Card summaries: 2–4 sentences, conversational not academic
- i-button content: 2–4 sentences, plain language, specific not generic
- Analogy boxes: use when a concept needs a mental model
- Never use lorem ipsum — every word must be real

## Critical Bug Prevention

Two known failure modes to avoid:

1. **i-buttons not working** — Always use `addEventListener` in JS, never `onclick=` in HTML for i-buttons
2. **Content with quotes breaking** — Always use `encodeURIComponent()` on `data-content` and `decodeURIComponent()` when reading it

## Tradie / Quote Estimator Variant

For quote estimator widgets, the final card is a lead capture form using Web3Forms:

- Access key: `99a11c15-5c61-4765-99c5-673adec64b16`
- Leads route to: `responses@itabs.ai`
- Required fields: Name, Phone, Email, brief job description
- Pricing engine order: base → preAdjustments → multipliers → quantity → postAdjustments → extras → minimum → rounding
