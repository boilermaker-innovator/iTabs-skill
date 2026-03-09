# itabs-skills

Executable SKILL.md files for the iTabs platform — custom, Anthropic-compatible skills for building, distributing, and marketing iTabs widgets.

Built by [@boilermaker-innovator](https://github.com/boilermaker-innovator) | Platform: [itabs.ai](https://itabs.ai)

---

## What Is This Repo?

Each folder contains a `SKILL.md` — a structured instruction file that tells Claude exactly how to execute a specific task. Paste the raw URL of any SKILL.md into a Claude chat and Claude will follow it immediately.

Skills are organised into three tiers:

| Tier | Description |
|------|-------------|
| 🟠 Custom | Jon's iTabs-specific skills, built from Gmail logs |
| 🔵 Anthropic | Official skills from [anthropics/skills](https://github.com/anthropics/skills) |
| 🟢 Community | Third-party skills adopted for the iTabs workflow |

---

## Skills Index

### 🟠 Build — Creating iTabs Widgets

| # | Skill | Folder | Status |
|---|-------|--------|--------|
| 01 | iTabs Widget Builder | `itabs-widget-builder/` | ✅ Ready |
| 02 | iTabs Video Summary | `itabs-video-summary/` | ✅ Ready |
| 03 | iTabs Quote Estimator (Tradie) | `itabs-quote-estimator/` | 🔲 Planned |
| 04 | iTabs Prep Guide Builder | `itabs-prep-guide/` | 🔲 Planned |
| 05 | iTabs Onboarding Widget | `itabs-onboarding/` | 🔲 Planned |

### 🟠 Ship — Getting Widgets Live

| # | Skill | Folder | Status |
|---|-------|--------|--------|
| 06 | GitHub Pages Publisher | `github-pages-publisher/` | 🔲 Planned |
| 07 | GitHub Pages Auditor | `github-pages-auditor/` | 🔲 Planned |
| 08 | Demo Site Builder | `demo-site-builder/` | 🔲 Planned |
| 09 | Email-to-Site Pipeline | `email-to-site-pipeline/` | 🔲 Planned |

### 🟠 Sell — Outreach & Lead Generation

| # | Skill | Folder | Status |
|---|-------|--------|--------|
| 10 | LinkedIn Post Writer | `linkedin-post-writer/` | 🔲 Planned |
| 11 | iTabs Demo-to-Post | `itabs-demo-to-post/` | 🔲 Planned |
| 12 | Cold Outreach Message Generator | `cold-outreach-generator/` | 🔲 Planned |
| 13 | X/Twitter Thread Builder | `twitter-thread-builder/` | 🔲 Planned |
| 14 | Lead Follow-Up Email | `lead-followup-email/` | 🔲 Planned |
| 15 | Proposal Generator | `proposal-generator/` | 🔲 Planned |
| 16 | Competitor Research (Perth Tradies) | `competitor-research/` | 🔲 Planned |

### 🟠 Operate — Day-to-Day Workflow

| # | Skill | Folder | Status |
|---|-------|--------|--------|
| 17 | Session Log (Summary Trigger) | `session-log/` | ✅ Active (in-chat) |
| 18 | Daily Brief | `daily-brief/` | 🔲 Planned |
| 19 | Shutdown / Work Planner | `shutdown-planner/` | 🔲 Planned |
| 20 | Invoice Generator | `invoice-generator/` | 🔲 Planned |
| 21 | Skills Librarian | `skills-librarian/` | 🔲 Next to build |

### 🔵 Anthropic Official (Adopted)

| Skill | Source |
|-------|--------|
| docx | [anthropics/skills/docx](https://github.com/anthropics/skills/tree/main/docx) |
| pdf | [anthropics/skills/pdf](https://github.com/anthropics/skills/tree/main/pdf) |
| pptx | [anthropics/skills/pptx](https://github.com/anthropics/skills/tree/main/pptx) |
| xlsx | [anthropics/skills/xlsx](https://github.com/anthropics/skills/tree/main/xlsx) |
| frontend-design | [anthropics/skills/frontend-design](https://github.com/anthropics/skills/tree/main/frontend-design) |

---

## How to Use a Skill

**Option 1 — Paste the raw URL into any Claude chat:**
```
Please follow this skill: https://raw.githubusercontent.com/boilermaker-innovator/itabs-skills/main/itabs-widget-builder/SKILL.md
```

**Option 2 — Add this README to Claude Project Knowledge** so Claude knows the full index and can fetch any skill on demand.

**Option 3 — Claude Code:** Skills are auto-loaded from the `/mnt/skills/` directory if placed there.

---

## Priority Build Order

1. `skills-librarian` — mines Gmail logs, keeps this index current automatically
2. `linkedin-post-writer` — biggest content gap, highest immediate payoff
3. `github-pages-publisher` — automates the ship step
4. `cold-outreach-generator` — turns demo URLs into outreach messages

---

## Contribute

If you build a skill that works well for trades, construction, or small business operators in Australia, PRs are welcome.

---

*Last updated: 9 Mar 2026*
