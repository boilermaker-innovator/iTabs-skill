---
name: itabs-container-seo
description: 'Build Google-ready iTabs widgets using the container model. Use this skill when building Canning Examiner widgets, cold outreach cards, or any iTabs card where SEO, metadata, and tradie discoverability matter. Works alongside itabs-widget-builder. Apply whenever Jon mentions Google, metadata, ranking, directory, or cold outreach.'
---

# iTabs Container + SEO Skill

Every iTabs widget built for tradie cold outreach must be Google-ready from the first build. This skill defines the container model, metadata standard, and outreach positioning.

---

## The Core Idea

> **"What action does a business card cause? iTabs is there to digitize it."**

> **"Looks like a business card, works like a website."**

> **"I got you found on Google. For free."**

A business card causes: call me, save my number, look at my work, pass me on to a mate.  
iTabs does all four. That's the product.

---

## The Container Model

An iTabs card is a **blank canvas with default slots** — not a fixed 7-card structure.

Cards are flexible. A Canning Examiner tradie with one small ad gets:

| Slot | Content | Status |
|------|---------|--------|
| 1 | Their ad image + name + tagline + service pills | Auto-filled |
| 2 | Work photos gallery | Empty — "Add your work photos here" |
| 3 | About / Story | Empty — "Tell people who you are" |
| 4 | Contact | Auto-filled from phone number |

**Rules:**
- Works perfectly at Slot 1 alone — never feels incomplete
- Empty slots are clearly labelled as optional, easy to delete
- Grows when the tradie is ready — not built for the builder
- Card count matches the content — 1 card is fine, 7 is fine

---

## i-Buttons — Upgrade Path, Not Default

i-buttons are **not included in cold outreach widgets.**

They belong in the editor as an optional add-on once the tradie has claimed their card.

**Cold outreach:** Strip all i-buttons. Keep it dead simple.  
**Claimed card upgrade:** i-buttons explain services in context (e.g. "blocked drains" → "we use CCTV cameras to find the blockage before we dig").

---

## SEO Metadata Standard — ALWAYS INCLUDE

Every iTabs widget must have this in the `<head>`:

```html
<!-- Primary Meta -->
<title>[Business Name] — [Suburb] | iTabs</title>
<meta name="description" content="Looks like a business card, works like a website.">

<!-- Open Graph (WhatsApp, Facebook, iMessage previews) -->
<meta property="og:title" content="[Business Name] — [Suburb]">
<meta property="og:description" content="Looks like a business card, works like a website.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://boilermaker-innovator.github.io/itabs-quotes/[slug].html">
<meta property="og:image" content="[ad image URL or iTabs logo fallback]">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Business Name] — [Suburb]">
<meta name="twitter:description" content="Looks like a business card, works like a website.">

<!-- Structured Data — Local Business -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Business Name]",
  "telephone": "[Phone Number]",
  "areaServed": "[Suburb], Perth, Western Australia",
  "description": "[Trade type] serving [suburb] and surrounding areas."
}
</script>
```

**Why this matters:**
- When tradie shares their card link on WhatsApp — the preview shows their name and the tagline before anyone taps
- Google indexes the card as a local business page
- No website needed — the card IS the website

---

## Slug & URL Standard

Every widget gets a clean URL slug:

| Business | Slug |
|----------|------|
| Brian's Mowing — Canning Vale | `brians-mowing-canning-vale` |
| City Metro Plumbing — Cannington | `city-metro-plumbing-cannington` |
| Graham Carpenter — Armadale | `graham-carpenter-armadale` |

Format: `[first-name-or-brand]-[trade]-[suburb]` — all lowercase, hyphens only.

Full URL: `https://boilermaker-innovator.github.io/itabs-quotes/[slug].html`

---

## Cold Outreach WhatsApp Message

When sending the widget to the tradie:

> *"Hey [Name], I made you a digital business card using your Canning Examiner ad — it's live now. I also got you showing up on Google for free. Tap the link and have a look: [URL]*
>
> *If you want to add your own photos or update anything, you can claim it with your last 4 digits. No cost."*

**Keep it short. Let the card do the talking.**

---

## Canning Examiner Widget Pipeline

Current widgets built — ready for metadata retrofit and outreach:

| Business | Trade | Suburb | Status |
|----------|-------|--------|--------|
| City Metro Plumbing and Gas | Plumbing | Cannington | Built |
| Brian's Mowing | Lawn/Garden | Canning Vale | Built |
| Colins Bricklaying | Bricklaying | Canning area | Built |
| Graham Carpenter and Handyman | Carpentry | Armadale | Built |
| Armadale Mini Loads and Bobcat | Earthworks | Armadale | Built |
| A.L.V Carpentry | Carpentry | Canning area | Built |
| Grand Carpentry | Carpentry | Canning area | Next |

---

## The Platform Play

Every card that ranks in Google for a local tradie search makes the whole platform stronger.

- Brian's Mowing → ranks for "mowing Canning Vale"
- City Metro → ranks for "plumber Cannington"
- Graham → ranks for "handyman Armadale"

Goal: **Get tradies more jobs from their iTabs card than people who spend thousands on websites.**

This isn't competing with Wix or Squarespace. It's a directory that markets itself — one card, one suburb at a time.

---

## Output Checklist

Before delivering any cold outreach widget:

- [ ] Metadata block included (title, description, og, twitter, ld+json)
- [ ] Slug is clean and suburb-specific
- [ ] Card 1 works standalone — looks complete with just the ad image
- [ ] Empty slots are clearly labelled and deletable
- [ ] No i-buttons (save for post-claim upgrade)
- [ ] Contact button auto-filled with real phone number
- [ ] Web3Forms lead form on final card (access key: `99a11c15-5c61-4765-99c5-673adec64b16`)
- [ ] WhatsApp outreach message ready to copy

---

## Made With iTabs

Every card footer includes:

```html
<div class="itabs-footer">Made with <a href="https://itabs.ai">iTabs</a></div>
```

This is the self-spreading loop. Every card is a referral.
