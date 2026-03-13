---
name: itabs-slider
description: Build an iTabs Slider — a mobile-first swipeable card deck with in-page video playback and contextual i-buttons. Use when the user wants to turn any YouTube video, article, or topic into a branded swipeable summary. Triggers on "iTabs Slider", "swipeable cards", "card deck summary", "interactive summary", or any request to package content into a tap-through card format with optional video.
---

# iTabs Slider — Build Specification

A single self-contained HTML file. Mobile-first. Dark. No external dependencies except Google Fonts.

---

## Layout

```
Header (fixed top)
  └── Brand logo + "iTabs Slider" tag + ▶ Video toggle button (mobile only)
  └── Progress bar (2px red line, fills as user advances)

Main (flex, fills remaining height)
  ├── Video Panel (mobile: hidden by default, expands on toggle or Jump tap)
  │     └── YouTube iframe loads on page open — native controls work immediately
  │     └── Transparent touch guard overlay — captures swipes without blocking taps
  └── Cards Section
        ├── Counter row ("Insight X of N · NN%")
        ├── Card Viewport (one card visible at a time, swipeable)
        └── Bottom Nav (← Back | dot indicators | Next →)

Info Sheet (bottom-sheet overlay, triggered by i-buttons)
  └── Slides up from bottom, dark backdrop
```

**Desktop (768px+):** Video panel (55% left) + Cards (45% right), side by side. Video always visible. Toggle button hidden.

**Mobile:** Video hidden by default. Cards get full screen. `▶ Video` button in header reveals/hides the panel (max-height animation, ~35vh).

---

## Visual Design — Non-Negotiable

**Palette**
```css
:root {
  --black:  #000000;
  --dark:   #0c0c0c;      /* card background */
  --dark2:  #141414;      /* sheet background */
  --border: #1f1f1f;
  --bdr2:   #2e2e2e;
  --red:    #e8281a;      /* primary accent */
  --rdim:   rgba(232,40,26,0.10);
  --rbdr:   rgba(232,40,26,0.30);
  --white:  #ffffff;
  --grey:   #888888;      /* body text */
  --grey2:  #555555;      /* muted labels */
  --blue:   #4db8ff;      /* context i-button */
}
```

**Typography** — Inter from Google Fonts (weights 400–900)
- Logo: 18–21px weight 900, letter-spacing -0.03em
- Card headline: `clamp(16px, 4.8vw, 22px)` weight 900, letter-spacing -0.02em
- Eyebrow/labels: 9px weight 800, letter-spacing 0.14em, ALL CAPS
- Body text: 13px, line-height 1.68, colour `--grey`
- Sheet body: 14px, line-height 1.78, colour `--grey`

**Card accent** — 3px red left border strip (::after pseudo-element):
```css
.card::after {
  content: '';
  position: absolute;
  top: 14px; bottom: 14px; left: -1px;
  width: 3px;
  background: var(--red);
  border-radius: 0 2px 2px 0;
}
```

**All interactive elements**: border-radius 2–3px max. Sharp, editorial. No pill shapes except dot indicators.

---

## Branding / Logo

```html
<!-- With brand name -->
<span class="logo-f">BRANDNAME</span>
<span class="logo-dot"></span>   <!-- 5px red circle -->
<span class="logo-fm">FM</span>

<!-- No brand specified — use iTabs default -->
<span class="logo-f">iTABS</span>
```

Logo-dot CSS: `width:5px; height:5px; background:var(--red); border-radius:50%; display:inline-block; margin: 0 1px 4px;`

Always pair with `<span class="tag">iTabs Slider</span>` on the right side of the header.

---

## Video Panel — Key Rules

**Load strategy:** Iframe loads on page open with default embed URL. No placeholder needed — native YouTube play button works immediately.

```html
<div class="video-panel" id="videoPanel">
  <div class="vid-touch-guard" id="touchGuard"></div>
  <iframe id="ytFrame"
    src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>
```

**Touch guard:** Transparent div sits over iframe on mobile, captures swipe gestures so YouTube doesn't steal them. On tap (dx < 10 && dy < 10), hide guard for 300ms so tap passes through to play the video.

```css
.video-panel { position: relative; }
.vid-touch-guard {
  position: absolute; inset: 0; z-index: 10;
  background: transparent;
  display: none;
}
.video-panel.open .vid-touch-guard { display: block; }
```

**Mobile toggle:**
```javascript
let videoOpen = false;

function toggleVideo() {
  videoOpen = !videoOpen;
  document.getElementById('videoPanel').classList.toggle('open', videoOpen);
  document.getElementById('vidToggle').classList.toggle('active', videoOpen);
  document.getElementById('vidToggle').textContent = videoOpen ? 'x Hide' : 'Play Video';
}
```

**Jump to timestamp:** Opens panel if closed, reloads iframe at timestamp. Autoplay works because it's user-initiated.
```javascript
function jumpTo(sec) {
  if (!videoOpen) {
    videoOpen = true;
    document.getElementById('videoPanel').classList.add('open');
    document.getElementById('vidToggle').classList.add('active');
    document.getElementById('vidToggle').textContent = 'x Hide';
  }
  document.getElementById('ytFrame').src =
    `https://www.youtube.com/embed/${VID_ID}?start=${sec}&autoplay=1&rel=0&modestbranding=1`;
}
```

**Seconds calculation:** `sec = (minutes × 60) + seconds`
Example: 13:19 → `(13 × 60) + 19 = 799`

**Desktop CSS override:**
```css
@media (min-width: 768px) {
  .vid-toggle { display: none; }
  .main { flex-direction: row; }
  .video-panel {
    width: 55%; flex-shrink: 0;
    max-height: none !important;
    border-right: 1px solid var(--border);
    transition: none;
  }
  .video-panel iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
}
```

---

## Card Data Structure

```javascript
const VID_ID = "xxxxxxxxxxx"; // YouTube video ID only — not the full URL

const DATA = [
  {
    topic: "Category Label",                    // eyebrow — ALL CAPS
    hl: "Punchy Headline <em>Key Phrase</em>", // <em> renders red, no italic
    body: "2–3 sentence summary. Clear, informative, no filler.",
    ts: "0:00",                                 // display string e.g. "13:19"
    sec: 0,                                     // integer seconds e.g. 799
    btns: [
      { t: "definition",     term: "Term Name",      txt: "Explanation..." },
      { t: "context",        term: "Context Label",  txt: "Background..."  },
      { t: "why-it-matters", term: "Why It Matters", txt: "Because..."     }
    ]
  }
  // 6–12 cards typical
];
```

**Headline rule:** Wrap only the punchy/surprising phrase in `<em>`. Usually the second half. Never the whole headline.

**Body rule:** Smart, curious reader. No padding sentences.

**i-button types and colours:**
| type | label colour | badge bg |
|------|-------------|----------|
| `definition` | `#f0f0f0` near-white | white badge, black text |
| `context` | `#4db8ff` blue | blue badge, black text |
| `why-it-matters` | `#e8281a` red | red badge, white text |

2–3 i-buttons per card. Never more than 3.

**Apostrophe safety** — always escape single quotes in JS template literals:
```javascript
function esc(s) { return (s || '').replace(/'/g, "\\'").replace(/\n/g, ' '); }
// Usage: onclick="openX('${b.t}','${esc(b.term)}','${esc(b.txt)}')"
```

---

## Card Animation — Horizontal Slide

```css
.cw {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 10px 14px;
  opacity: 0; transform: translateX(40px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}
.cw.active { opacity: 1; transform: translateX(0); pointer-events: all; }
.cw.out    { opacity: 0; transform: translateX(-40px); }
.cw.out.back { transform: translateX(40px); }
```

```javascript
let cur = 0, anim = false;

function go(d) { goTo(cur + d, d); }

function goTo(idx, d) {
  d = d || 1;
  if (anim || idx < 0 || idx >= DATA.length || idx === cur) return;
  anim = true;
  const outEl = document.getElementById('cw' + cur);
  outEl.classList.add('out');
  if (d < 0) outEl.classList.add('back');
  setTimeout(() => {
    outEl.classList.remove('active', 'out', 'back');
    cur = idx;
    const inEl = document.getElementById('cw' + cur);
    inEl.style.transform = d > 0 ? 'translateX(40px)' : 'translateX(-40px)';
    inEl.style.opacity = '0';
    inEl.classList.add('active');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      inEl.style.transform = '';
      inEl.style.opacity = '';
    }));
    ui();
    anim = false;
  }, 265);
}
```

---

## Navigation

- **Bottom nav**: ← Back (left) | dot indicators (centre) | Next → (right)
- **Dots**: 4px circles, `--bdr2` inactive; active = 14px wide pill, `--red`
- **Prev disabled** on card 0, **Next disabled** on last card
- **Swipe** (card viewport + touch guard): `Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40` → navigate. Left = next, right = prev.
- **Keyboard**: ArrowRight/Down = next, ArrowLeft/Up = prev. Esc = close info sheet.

---

## Info Sheet

```javascript
function openX(type, term, txt) {
  document.getElementById('st').textContent = type.replace(/-/g,' ').toUpperCase();
  document.getElementById('st').className = 'sh-type ' + type;
  document.getElementById('sm').textContent = term;
  document.getElementById('sb').textContent = txt;
  document.getElementById('ov').classList.add('open');
}
function closeX() { document.getElementById('ov').classList.remove('open'); }
function maybeX(e) { if (e.target === document.getElementById('ov')) closeX(); }
```

Sheet: `max-height: 70vh`, `overflow-y: auto`, `border-radius: 14px 14px 0 0`, red 2px top border. Slides up from `translateY(20px)` to `translateY(0)` on `.open`.

---

## GitHub Pages Deployment

- File MUST be named `index.html` — GitHub Pages requires this
- Upload to repo root alongside `og-image.png` if applicable
- Live at: `https://[username].github.io/[repo-name]/`
- OG image size: 1200×630px. Test at cards-dev.twitter.com/validator

---

## Output Checklist

- [ ] Single `index.html`, fully self-contained
- [ ] Inter loaded from Google Fonts only
- [ ] YouTube VIDEO_ID extracted correctly (not full URL)
- [ ] All timestamps converted to seconds (min × 60 + sec)
- [ ] All i-button values escaped with `esc()` function
- [ ] iframe loads on page open (no placeholder)
- [ ] Touch guard present, wired to swipe + tap-through
- [ ] Video panel `max-height: 0` mobile, `none !important` desktop
- [ ] Horizontal card animation with directional back/forward classes
- [ ] Progress bar reaches 100% on final card
- [ ] Prev/Next buttons disabled at ends
- [ ] Info sheet closes on Esc and backdrop tap (`maybeX` pattern)
- [ ] File saved to `/mnt/user-data/outputs/[slug]-itabs-slider.html`
