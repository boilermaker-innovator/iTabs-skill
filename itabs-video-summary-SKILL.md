---
name: itabs-video-summary
description: Create interactive iTabs video summaries from YouTube videos. Use when the user wants to transform a YouTube video into an Instagram-style swipeable summary with interactive "i" buttons for contextual information. Triggers on requests like "create an iTabs for this video", "make a video summary", "iTabs this YouTube link", or any request to create interactive video content displays.
---

# iTabs Video Summary

Transform YouTube videos into interactive, mobile-first swipeable card decks with contextual i-buttons. The Punters Politics minister video is the gold standard design reference.

## Workflow

1. **Get the video URL** from the user
2. **Ask user to paste** the YouTube description and transcript (YouTube → "..." → Show transcript → Select all → Copy)
3. **Analyse content** — identify 5-7 key points with timestamps
4. **Generate iTabs HTML** using the design standard below
5. **Output** single HTML file to `/mnt/user-data/outputs/`
6. **Deploy to Val.town** as an HTTP val — one val per creator channel, query param per video (`?video=slug`)

## Content Analysis

Break the video into **key insight cards**. For each card, extract:

- **Headline**: Punchy, 5-8 words max, specific not generic
- **Summary**: 2-3 sentences, conversational, no jargon
- **Timestamp**: Link back to that moment in the video (seconds for deep link)
- **i-buttons**: 1-2 per card (definitions, context, why-it-matters)

## i-Button Types

| Type | When to use |
|------|-------------|
| `definition` | Technical terms, jargon, acronyms |
| `context` | People, companies, organisations |
| `why-it-matters` | Significance, impact, what it means for the viewer |

## Design Standard (Punters Politics v1 — locked June 2026)

### Layout
- Max width 430px, centred, dark surround on desktop
- Progress bar at top (segments, one per card)
- Header: circular channel avatar image + channel name + video title
- Card: thumbnail (mqdefault.jpg, full width, 16:9) → headline → summary → i-buttons → nav row
- Nav row inside card: ‹ prev button | YouTube button (opens new tab) | next › button
- Footer outside card: Patreon/sponsor link + "Made with iTabs"
- **Navigation is circular** — last card loops to first, first card loops to last

### Critical fixes (must apply to every build)
- **No invisible nav zones** — use explicit ← → buttons only, never left/right tap zones that conflict with i-buttons
- **i-buttons z-index: 60**, card-body z-index: 60 — always above any nav elements
- **No YouTube iframe/embed** — Val.town CSP blocks it. Use `window.open(url, '_blank')` only
- **Thumbnail**: always use `mqdefault.jpg` not `maxresdefault.jpg` (maxres often fails)
- **No play button overlay on thumbnail** — static image only, no click handler on thumb

### Metadata (include in every build)
```html
<meta property="og:title" content="VIDEO TITLE — CHANNEL NAME">
<meta property="og:description" content="Punchy 1-2 sentence hook for social sharing">
<meta property="og:image" content="https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg">
<meta property="og:url" content="LIVE_VAL_URL">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="VIDEO TITLE — CHANNEL NAME">
<meta name="twitter:description" content="Same punchy hook">
<meta name="twitter:image" content="https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg">
```

### Channel avatar
- Use the creator's actual YouTube profile image URL as a circular `<img>` tag
- Get it from: youtube.com/@channelname → right click profile pic → copy image URL

### Val.town deployment
- One val per creator: `punters-politics`, `creator-name` etc
- Each video is a query param: `?video=minister-gas`, `?video=next-video`
- Val type must be HTTP (not HTML) to get a live URL
- Custom subdomain via Val.town Settings if needed

## CARD DATA Structure

```javascript
const CARDS = [
  {
    headline: "Punchy Headline Here",
    summary: "2-3 sentence conversational summary of this key point.",
    timestamp: "0:36",
    ts: 36, // seconds for YouTube deep link
    iButtons: [
      {type: "definition", term: "TERM", content: "2-3 sentence explanation."},
      {type: "why-it-matters", content: "Why this matters to the viewer."}
    ]
  }
  // 5-7 cards total
];
```

## Sharing Strategy

- Share the val.run URL on X tagging the creator
- "Made with iTabs" in footer does the brand work quietly
- OG tags ensure proper preview card on X/WhatsApp
- The iTabs IS the product — people swipe the cards, YouTube opens in new tab if they want more
- Creator page accumulates all iTabs for that channel over time
