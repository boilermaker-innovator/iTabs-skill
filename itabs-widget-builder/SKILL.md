---
name: itabs-widget-builder
description: 'Build interactive iTabs swipeable card widgets — mobile-first HTML files with contextual i-buttons. Use this skill whenever the user wants to create an iTabs, a swipeable summary, an embeddable quote estimator widget, a prep guide, an event summary, a video summary card deck, a tradie onboarding widget, or any interactive card-based content display. Trigger on phrases like build an iTabs, make a widget, create a card deck, swipeable summary, quote estimator, or any request to package content into an interactive shareable HTML format. Always use this skill when building for tradies, Perth businesses, or the iTabs platform.'
iTabs Widget Builder
Build interactive, mobile-first swipeable card widgets — single self-contained HTML files for testing in Val.town or delivery to tradies. These are the core output format of the iTabs platform.
What Is an iTabs Widget
An iTabs widget is a swipeable card deck — like Instagram Stories but for a tradie's business. Each card has:
A business header bar — name, location, and a persistent Contact button (always visible)
A hero section — tag, headline, colour theme, optional photo background
A body section — summary text, optional analogy box, i-buttons
A contact sheet — slides up from Contact button: Call, WhatsApp, Email, Save Contact
Key properties:
Single HTML file, zero server dependencies
Mobile-first (max-width 430px, full viewport height)
Dark theme by default
Swipe / tap / keyboard navigation
Progress bar at top tracks position
7 cards standard for tradie widgets
Val.town compatible — NO backtick template literals anywhere in JS
---
⚠️ Val.town Compatibility — Critical Rule
Val.town parses the entire HTML file as TypeScript/Deno. Any backtick template literals in the JavaScript will cause a parse error.
NEVER use backticks in JS. ALWAYS use string concatenation.
```javascript
// WRONG — breaks Val.town
document.getElementById('counter').textContent = `${index + 1} / ${totalCards}`;

// CORRECT
document.getElementById('counter').textContent = (index + 1) + ' / ' + totalCards;

// WRONG
el.innerHTML = `<div class="${card.heroClass}">`;

// CORRECT
el.innerHTML = '<div class="' + card.heroClass + '">';
```
This applies to every string in the script block — no exceptions.
---
Widget Types
Type	Use case	Card count
`tradie-profile`	Tradie business card — who they are, what they do, contact	7
`video-summary`	YouTube / podcast key points	5–10
`quote-estimator`	Tradie pricing widget with lead capture	4–8
`prep-guide`	Event / meetup / course preparation	4–8
`explainer`	Concept breakdown for a topic	4–8
`substack`	Blog post / article summary card deck	4–6
---
Tradie Widget Structure (7 cards)
Card	Tag	Content
1	WHO WE ARE	Business intro, years experience, location
2	WHAT WE DO	Core service / specialty
3	OUR WORK	Photos i-button, results, before/after
4	WHY CHOOSE US	Differentiators — licensed, insured, guarantee
5	HOW IT WORKS	Simple 3-step process
6	PRICING	Honest pricing, no call out fee, free quote etc
7	GET IN TOUCH	Lead form (Web3Forms) + contact buttons
---
Design System (Never Deviate)
CSS Variables
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
Hero Theme Table
Theme class	Use for
`hero-default`	Intro / problem cards
`hero-purple`	Core concept / foundational
`hero-cyan`	Mechanics / plumbing / water trades
`hero-amber`	Use cases / benefits / construction
`hero-green`	Action / CTA / lawn / garden trades
`hero-red`	Warning / problem / urgency
Em Highlight Rule
One `<em>` per headline only. Em colour matches the hero theme. `font-style: normal` always.
---
Business Header Bar
Every tradie widget has a fixed header bar above the progress bar with the business name, location, and a Contact pill button. The Contact button opens the contact sheet.
```html
<div class="biz-header">
  <div class="biz-info">
    <div class="biz-name">City Metro Plumbing</div>
    <div class="biz-location">Perth Metro</div>
  </div>
  <button class="contact-pill" id="contactBtn">💬 Contact</button>
</div>
```
```css
.biz-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: var(--bg-secondary); border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; z-index: 90; }
.biz-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
.biz-location { font-size: 11px; color: var(--text-secondary); margin-top: 1px; }
.contact-pill { padding: 7px 14px; background: var(--accent); border: none; border-radius: 99px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; }
```
---
Contact Sheet
Slides up from the bottom when Contact button is tapped. Four actions: Call, WhatsApp, Email, Save Contact.
Save Contact generates a `.vcf` vCard download — tradie stays in phone contacts forever.
```html
<div class="contact-overlay" id="contactOverlay" onclick="if(event.target===this)closeContact()">
  <div class="contact-sheet">
    <div class="modal-handle"></div>
    <div class="contact-name">City Metro Plumbing & Gas</div>
    <div class="contact-actions">
      <a href="tel:0433350646" class="contact-action">
        <span class="ca-icon">📞</span>
        <span class="ca-label">Call</span>
        <span class="ca-detail">0433 350 646</span>
      </a>
      <a href="https://wa.me/61433350646" class="contact-action">
        <span class="ca-icon">💬</span>
        <span class="ca-label">WhatsApp</span>
        <span class="ca-detail">Message us</span>
      </a>
      <a href="mailto:info@citymetroplumbing.com.au" class="contact-action">
        <span class="ca-icon">✉️</span>
        <span class="ca-label">Email</span>
        <span class="ca-detail">info@citymetroplumbing.com.au</span>
      </a>
      <button onclick="saveContact()" class="contact-action">
        <span class="ca-icon">💾</span>
        <span class="ca-label">Save Contact</span>
        <span class="ca-detail">Add to phone</span>
      </button>
    </div>
  </div>
</div>
```
```css
.contact-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 300; display: flex; align-items: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
.contact-overlay.active { opacity: 1; pointer-events: all; }
.contact-sheet { width: 100%; max-width: 430px; margin: 0 auto; background: var(--bg-tertiary); border-radius: 20px 20px 0 0; padding: 20px; transform: translateY(100%); transition: transform 0.3s ease; }
.contact-overlay.active .contact-sheet { transform: translateY(0); }
.contact-name { font-size: 16px; font-weight: 700; margin-bottom: 16px; text-align: center; }
.contact-actions { display: flex; flex-direction: column; gap: 8px; }
.contact-action { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: rgba(255,255,255,0.06); border: none; border-radius: 12px; color: var(--text-primary); text-decoration: none; cursor: pointer; width: 100%; text-align: left; }
.ca-icon { font-size: 20px; width: 28px; text-align: center; }
.ca-label { font-size: 14px; font-weight: 600; flex: 1; }
.ca-detail { font-size: 12px; color: var(--text-secondary); }
```
```javascript
function saveContact() {
  var vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:City Metro Plumbing & Gas\nTEL:0433350646\nEMAIL:info@citymetroplumbing.com.au\nURL:https://citymetroplumbingandgas.com.au\nEND:VCARD';
  var blob = new Blob([vcard], { type: 'text/vcard' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'CityMetroPlumbing.vcf';
  a.click();
  URL.revokeObjectURL(url);
}
function openContact() { document.getElementById('contactOverlay').classList.add('active'); }
function closeContact() { document.getElementById('contactOverlay').classList.remove('active'); }
```
---
Photo Hero Support
Cards can have a real photo as hero background instead of a gradient. Add `photoUrl`, `photoSize`, `photoPos` to the card object.
```javascript
{
  tag: "01 / OUR WORK",
  photoUrl: "https://i.imgur.com/abc123.jpg",
  photoSize: "cover",
  photoPos: "center center",
  headline: "Quality Work <em>Every Time</em>",
  ...
}
```
In `buildCard`, apply the photo if present:
```javascript
if (card.photoUrl) {
  heroEl.style.backgroundImage = 'url(' + card.photoUrl + ')';
  heroEl.style.backgroundSize = card.photoSize || 'cover';
  heroEl.style.backgroundPosition = card.photoPos || 'center center';
}
```
Photo URL tips:
Imgur: upload → right-click image → copy image address ✅
Dropbox: share link → change `dl=0` to `dl=1` ✅
Google Photos: does NOT work as direct URL ❌
Own website: right-click photo → copy image address ✅
---
Card Data Structure
```javascript
const cards = [
  {
    tag: "01 / WHO WE ARE",
    tagClass: "tag-cyan",
    headline: "Your <em>Trusted Local</em> Plumbers",
    heroClass: "hero-cyan",
    photoUrl: null,
    summary: "2-4 sentences. Conversational, not academic. Plain language. Sound like a real tradie.",
    analogy: null,
    iButtons: [
      {
        label: "Licensed & insured",
        type: "context",
        term: "Fully Licensed",
        content: "2-4 sentences explaining in plain language."
      }
    ]
  }
];
```
---
What NOT to Do
Never add CSS animations or transitions beyond what's in the template
Never change the font family
Never add a visible edit button or admin link on the public widget
Never use backtick template literals anywhere in the script block
Never use `onclick=` on nav buttons or i-buttons — always `addEventListener`
Never skip `encodeURIComponent` on i-button content
Never use Google Photos URLs — they don't work as direct image sources
Never make the contact button float — it lives in the header bar, always
Never put more than one `<em>` in a headline
Never use lorem ipsum — every word must be real business content
---
Full HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>iTabs | [BUSINESS NAME]</title>
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

        .biz-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: var(--bg-secondary); border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; z-index: 90; }
        .biz-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
        .biz-location { font-size: 11px; color: var(--text-secondary); margin-top: 1px; }
        .contact-pill { padding: 7px 14px; background: var(--accent); border: none; border-radius: 99px; color: #fff; font-size: 12px; font-weight: 700; cursor: pointer; }

        .progress-container { display: flex; gap: 4px; padding: 8px 16px 6px; background: var(--bg-primary); }
        .progress-segment { flex: 1; height: 3px; background: rgba(255,255,255,0.2); border-radius: 2px; transition: background var(--transition); }
        .progress-segment.viewed { background: rgba(255,255,255,0.6); }
        .progress-segment.active { background: var(--accent); }

        .cards-wrapper { flex: 1; position: relative; overflow: hidden; }
        .card { position: absolute; inset: 0; display: flex; flex-direction: column; opacity: 0; transform: translateX(100%); transition: all 0.3s ease; pointer-events: none; }
        .card.active { opacity: 1; transform: translateX(0); pointer-events: all; }
        .card.prev { opacity: 0; transform: translateX(-100%); }

        .card-hero { padding: 20px 20px 20px; min-height: 36%; display: flex; flex-direction: column; justify-content: flex-end; background: var(--bg-secondary); }
        .hero-default { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
        .hero-purple  { background: linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%); }
        .hero-cyan    { background: linear-gradient(135deg, #164e63 0%, #0c4a6e 100%); }
        .hero-amber   { background: linear-gradient(135deg, #78350f 0%, #431407 100%); }
        .hero-green   { background: linear-gradient(135deg, #14532d 0%, #052e16 100%); }
        .hero-red     { background: linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%); }

        .card-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; }
        .tag-cyan { color: #67e8f9; } .tag-amber { color: #fcd34d; } .tag-green { color: #6ee7b7; } .tag-red { color: #fca5a5; } .tag-purple { color: #a78bfa; }
        .card-headline { font-size: clamp(20px, 5vw, 26px); font-weight: 700; line-height: 1.25; }
        .hero-default em { color: #cbd5e1; font-style: normal; } .hero-purple em { color: #a78bfa; font-style: normal; }
        .hero-cyan em { color: #67e8f9; font-style: normal; } .hero-amber em { color: #fcd34d; font-style: normal; }
        .hero-green em { color: #6ee7b7; font-style: normal; } .hero-red em { color: #fca5a5; font-style: normal; }

        .card-body { flex: 1; background: var(--bg-secondary); padding: 16px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; border-top: 1px solid rgba(255,255,255,0.06); }
        .card-summary { font-size: 15px; color: var(--text-secondary); line-height: 1.65; }
        .analogy-box { background: var(--bg-tertiary); border-left: 3px solid var(--accent2); border-radius: 8px; padding: 12px 14px; }
        .analogy-title { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent2); margin-bottom: 6px; }
        .analogy-text { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

        .i-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
        .i-button { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); border-radius: 20px; font-size: 12px; font-weight: 600; color: var(--i-button); cursor: pointer; }
        .i-dot { width: 16px; height: 16px; background: var(--i-button); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #000; flex-shrink: 0; }

        .nav-area { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px 20px; background: var(--bg-secondary); border-top: 1px solid rgba(255,255,255,0.06); }
        .nav-btn { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: var(--text-primary); font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .nav-btn:disabled { opacity: 0.2; cursor: default; }
        .card-counter { font-size: 12px; color: var(--text-secondary); font-weight: 500; }

        .itabs-footer { text-align: center; font-size: 10px; color: rgba(255,255,255,0.15); padding-bottom: 4px; background: var(--bg-secondary); letter-spacing: 0.1em; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
        .modal-overlay.active { opacity: 1; pointer-events: all; }
        .modal-sheet { width: 100%; max-width: 430px; margin: 0 auto; background: var(--bg-tertiary); border-radius: 20px 20px 0 0; padding: 20px; transform: translateY(100%); transition: transform 0.3s ease; }
        .modal-overlay.active .modal-sheet { transform: translateY(0); }
        .modal-handle { width: 36px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 0 auto 16px; }
        .modal-term { font-size: 17px; font-weight: 700; margin-bottom: 4px; }
        .modal-type { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--i-button); margin-bottom: 12px; }
        .modal-content { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
        .modal-close { margin-top: 20px; width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: none; border-radius: 10px; color: var(--text-primary); font-size: 14px; font-weight: 600; cursor: pointer; }

        .contact-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 300; display: flex; align-items: flex-end; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }
        .contact-overlay.active { opacity: 1; pointer-events: all; }
        .contact-sheet { width: 100%; max-width: 430px; margin: 0 auto; background: var(--bg-tertiary); border-radius: 20px 20px 0 0; padding: 20px; transform: translateY(100%); transition: transform 0.3s ease; }
        .contact-overlay.active .contact-sheet { transform: translateY(0); }
        .contact-biz-name { font-size: 16px; font-weight: 700; margin-bottom: 16px; text-align: center; }
        .contact-actions { display: flex; flex-direction: column; gap: 8px; }
        .contact-action { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: rgba(255,255,255,0.06); border: none; border-radius: 12px; color: var(--text-primary); text-decoration: none; cursor: pointer; width: 100%; text-align: left; }
        .ca-icon { font-size: 20px; width: 28px; text-align: center; }
        .ca-label { font-size: 14px; font-weight: 600; flex: 1; }
        .ca-detail { font-size: 12px; color: var(--text-secondary); }
    </style>
</head>
<body>
<div class="container">
    <div class="biz-header">
        <div class="biz-info">
            <div class="biz-name">[BUSINESS NAME]</div>
            <div class="biz-location">[SUBURB / AREA]</div>
        </div>
        <button class="contact-pill" id="contactBtn">💬 Contact</button>
    </div>
    <div class="progress-container" id="progress"></div>
    <div class="cards-wrapper" id="cardsWrapper"></div>
    <div class="nav-area">
        <button class="nav-btn" id="prevBtn">←</button>
        <span class="card-counter" id="counter">1 / 7</span>
        <button class="nav-btn" id="nextBtn">→</button>
    </div>
    <div class="itabs-footer">ITABS</div>
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

<div class="contact-overlay" id="contactOverlay" onclick="if(event.target===this)closeContact()">
    <div class="contact-sheet">
        <div class="modal-handle"></div>
        <div class="contact-biz-name">[BUSINESS NAME]</div>
        <div class="contact-actions">
            <a href="tel:[PHONE]" class="contact-action">
                <span class="ca-icon">📞</span>
                <span class="ca-label">Call</span>
                <span class="ca-detail">[PHONE DISPLAY]</span>
            </a>
            <a href="https://wa.me/61[PHONE_NO_ZERO]" class="contact-action">
                <span class="ca-icon">💬</span>
                <span class="ca-label">WhatsApp</span>
                <span class="ca-detail">Message us</span>
            </a>
            <a href="mailto:[EMAIL]" class="contact-action">
                <span class="ca-icon">✉️</span>
                <span class="ca-label">Email</span>
                <span class="ca-detail">[EMAIL]</span>
            </a>
            <button onclick="saveContact()" class="contact-action">
                <span class="ca-icon">💾</span>
                <span class="ca-label">Save Contact</span>
                <span class="ca-detail">Add to phone</span>
            </button>
        </div>
    </div>
</div>

<script>
var bizName = '[BUSINESS NAME]';
var bizPhone = '[PHONE]';
var bizEmail = '[EMAIL]';
var bizWebsite = '[WEBSITE]';

var cards = [
    {
        tag: '01 / WHO WE ARE',
        tagClass: 'tag-cyan',
        headline: 'Your <em>Trusted Local</em> Trade',
        heroClass: 'hero-cyan',
        photoUrl: null,
        summary: '2-4 sentences. Who they are, where they work, how long. Conversational, real.',
        analogy: null,
        iButtons: [
            { label: 'Licensed & insured', type: 'context', term: 'Fully Licensed', content: 'What their licence covers and why that matters to the customer.' }
        ]
    }
];

var currentCard = 0;
var totalCards = cards.length;
var modalOverlay = document.getElementById('modalOverlay');
var modalTerm = document.getElementById('modalTerm');
var modalType = document.getElementById('modalType');
var modalContent = document.getElementById('modalContent');

document.getElementById('contactBtn').addEventListener('click', function() { openContact(); });
document.getElementById('prevBtn').addEventListener('click', function() { navigate(-1); });
document.getElementById('nextBtn').addEventListener('click', function() { navigate(1); });

function init() {
    var progress = document.getElementById('progress');
    var wrapper = document.getElementById('cardsWrapper');
    for (var i = 0; i < cards.length; i++) {
        var seg = document.createElement('div');
        seg.className = 'progress-segment' + (i === 0 ? ' active' : '');
        progress.appendChild(seg);
        wrapper.appendChild(buildCard(cards[i], i));
    }
    document.getElementById('counter').textContent = '1 / ' + totalCards;
    document.getElementById('prevBtn').disabled = true;
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'Escape') { closeModal(); closeContact(); }
    });
    var startX = 0;
    var cw = document.getElementById('cardsWrapper');
    cw.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    cw.addEventListener('touchend', function(e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    });
}

function buildCard(card, index) {
    var el = document.createElement('div');
    el.className = 'card' + (index === 0 ? ' active' : '');
    var heroEl = document.createElement('div');
    heroEl.className = 'card-hero ' + card.heroClass;
    if (card.photoUrl) {
        heroEl.style.backgroundImage = 'url(' + card.photoUrl + ')';
        heroEl.style.backgroundSize = card.photoSize || 'cover';
        heroEl.style.backgroundPosition = card.photoPos || 'center center';
    }
    heroEl.innerHTML = '<div class="card-tag ' + card.tagClass + '">' + card.tag + '</div><h2 class="card-headline">' + card.headline + '</h2>';
    var bodyEl = document.createElement('div');
    bodyEl.className = 'card-body';
    var html = '<p class="card-summary">' + card.summary + '</p>';
    if (card.analogy) {
        html += '<div class="analogy-box"><div class="analogy-title">' + card.analogy.title + '</div><div class="analogy-text">' + card.analogy.text + '</div></div>';
    }
    if (card.iButtons && card.iButtons.length) {
        html += '<div class="i-buttons">';
        for (var j = 0; j < card.iButtons.length; j++) {
            var b = card.iButtons[j];
            html += '<button class="i-button" data-term="' + b.term + '" data-type="' + b.type + '" data-content="' + encodeURIComponent(b.content) + '"><span class="i-dot">i</span>' + b.label + '</button>';
        }
        html += '</div>';
    }
    bodyEl.innerHTML = html;
    el.appendChild(heroEl);
    el.appendChild(bodyEl);
    el.querySelectorAll('.i-button').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            openModal(btn.dataset.term, btn.dataset.type, decodeURIComponent(btn.dataset.content));
        });
    });
    return el;
}

function navigate(direction) {
    var next = currentCard + direction;
    if (next >= 0 && next < totalCards) updateCard(next);
}

function updateCard(index) {
    document.querySelectorAll('.card').forEach(function(c, i) {
        c.classList.remove('active', 'prev');
        if (i === index) c.classList.add('active');
        else if (i < index) c.classList.add('prev');
    });
    document.querySelectorAll('.progress-segment').forEach(function(s, i) {
        s.classList.remove('active', 'viewed');
        if (i === index) s.classList.add('active');
        else if (i < index) s.classList.add('viewed');
    });
    currentCard = index;
    document.getElementById('counter').textContent = (index + 1) + ' / ' + totalCards;
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === totalCards - 1;
}

function openModal(term, type, content) {
    var typeLabels = { 'definition': 'Definition', 'context': 'Context', 'why-it-matters': 'Why It Matters', 'related': 'Related' };
    modalTerm.textContent = term;
    modalType.textContent = typeLabels[type] || type;
    modalContent.textContent = content;
    modalOverlay.classList.add('active');
}

function closeModal() { modalOverlay.classList.remove('active'); }
function openContact() { document.getElementById('contactOverlay').classList.add('active'); }
function closeContact() { document.getElementById('contactOverlay').classList.remove('active'); }

function saveContact() {
    var vcard = 'BEGIN:VCARD\nVERSION:3.0\nFN:' + bizName + '\nTEL:' + bizPhone + '\nEMAIL:' + bizEmail + '\nURL:' + bizWebsite + '\nEND:VCARD';
    var blob = new Blob([vcard], { type: 'text/vcard' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = bizName.replace(/\s+/g, '') + '.vcf';
    a.click();
    URL.revokeObjectURL(url);
}

init();
</script>
</body>
</html>
```
---
Output Rules
Always produce a single self-contained HTML file
Save to `/mnt/user-data/outputs/itabs-[slug].html`
Present with `present_files`
No backtick template literals anywhere in the script block
Always use `addEventListener` — never `onclick=` on nav or i-buttons
Always `encodeURIComponent` on i-button content
Tradie Lead Form (Card 7)
Last card gets a Web3Forms lead capture form:
Access key: `99a11c15-5c61-4765-99c5-673adec64b16`
Leads route to: `responses@itabs.ai`
Required fields: Name, Phone, Service needed
Optional: Email, Job details
