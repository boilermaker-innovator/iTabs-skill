# iTabs Skills Library

Executable SKILL.md files for the iTabs platform — and a master index of every useful skill Claude can fetch on demand.

Built by [@boilermaker-innovator](https://github.com/boilermaker-innovator) | Platform: [itabs.ai](https://itabs.ai)

---

## How Claude Uses This Index

This README lives in Claude Project Knowledge. When you ask Claude to do something, it checks here for the right skill, then fetches the raw URL and executes it automatically — on any device, including mobile.

**Fetch pattern:**
```
https://raw.githubusercontent.com/[owner]/[repo]/main/[path]/SKILL.md
```

---

## 🟠 Jon's Custom Skills

### Build — Creating iTabs Widgets

| # | Skill | When to use | Raw URL |
|---|-------|-------------|---------|
| 01 | iTabs Widget Builder | Build any iTabs swipeable card widget | `https://raw.githubusercontent.com/boilermaker-innovator/iTabs-skill/main/itabs-widget-builder/SKILL.md` |
| 02 | iTabs Video Summary | Turn a YouTube video into an iTabs card deck | `https://raw.githubusercontent.com/boilermaker-innovator/iTabs-skill/main/itabs-video-summary/SKILL.md` |
| 03 | Quote Estimator (Tradie) | Build a tradie pricing widget with lead capture | 🔲 Planned |
| 04 | Prep Guide Builder | Build an event/meetup prep guide | 🔲 Planned |
| 05 | Onboarding Widget | Build a welcome + setup steps widget | 🔲 Planned |

### Ship — Getting Widgets Live

| # | Skill | When to use | Raw URL |
|---|-------|-------------|---------|
| 06 | GitHub Pages Publisher | Push HTML files to GitHub Pages via API | 🔲 Planned |
| 07 | Email-to-Site Pipeline | Auto-generate tradie sites from inbound emails | 🔲 Planned |
| 08 | Demo Site Builder | Build a cold outreach demo site for a tradie | 🔲 Planned |

### Sell — Outreach & Lead Generation

| # | Skill | When to use | Raw URL |
|---|-------|-------------|---------|
| 09 | LinkedIn Post Writer | Write a LinkedIn post about iTabs or a build | 🔲 Planned |
| 10 | Cold Outreach Generator | Turn a demo URL into an outreach message | 🔲 Planned |
| 11 | Proposal Generator | Build a client proposal doc | 🔲 Planned |
| 12 | Lead Follow-Up Email | Write a follow-up after a tradie shows interest | 🔲 Planned |
| 13 | Demo-to-Post | Turn a widget demo into social content | 🔲 Planned |

### Operate — Day-to-Day Workflow

| # | Skill | When to use | Raw URL |
|---|-------|-------------|---------|
| 14 | Gmail & Google Calendar MCP | Get session logs, check leads, check calendar | `https://raw.githubusercontent.com/boilermaker-innovator/iTabs-skill/main/gmail-gcal-mcp/SKILL.md` |
| 15 | Skills Librarian | Mine Gmail logs → update this index automatically | 🔲 Next to build |
| 16 | Daily Brief | Morning summary: leads, GitHub activity, calendar | 🔲 Planned |
| 17 | Invoice Generator | Generate a tradie invoice | 🔲 Planned |
| 18 | Shutdown/Work Planner | Plan a mining shutdown roster or work schedule | 🔲 Planned |

---

## 🔵 Anthropic Official Skills

> Note: These skills live under `skills/skills/` in the Anthropic repo.

### Document Creation

| Skill | When to use | Raw URL |
|-------|-------------|---------|
| docx | Create or edit Word documents | `https://raw.githubusercontent.com/anthropics/skills/main/skills/docx/SKILL.md` |
| pdf | Create, read, merge or fill PDF files | `https://raw.githubusercontent.com/anthropics/skills/main/skills/pdf/SKILL.md` |
| pptx | Create or edit PowerPoint presentations | `https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md` |
| xlsx | Create or edit Excel spreadsheets | `https://raw.githubusercontent.com/anthropics/skills/main/skills/xlsx/SKILL.md` |

### Design & Frontend

| Skill | When to use | Raw URL |
|-------|-------------|---------|
| frontend-design | Build polished, production-grade web UIs | `https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md` |
| algorithmic-art | Generate creative computational art | `https://raw.githubusercontent.com/anthropics/skills/main/skills/algorithmic-art/SKILL.md` |
| canvas-design | Design graphics and visual assets | `https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/SKILL.md` |

### Development & Technical

| Skill | When to use | Raw URL |
|-------|-------------|---------|
| mcp-builder | Build an MCP server for tool integration | `https://raw.githubusercontent.com/anthropics/skills/main/skills/mcp-builder/SKILL.md` |
| webapp-testing | Test web apps end to end | `https://raw.githubusercontent.com/anthropics/skills/main/skills/webapp-testing/SKILL.md` |
| web-artifacts-builder | Build interactive web artifacts | `https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md` |
| skill-creator | Create, test and improve SKILL.md files | `https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md` |

### Enterprise & Communication

| Skill | When to use | Raw URL |
|-------|-------------|---------|
| internal-comms | Write internal communications and announcements | `https://raw.githubusercontent.com/anthropics/skills/main/skills/internal-comms/SKILL.md` |
| brand-guidelines | Apply brand guidelines to content | `https://raw.githubusercontent.com/anthropics/skills/main/skills/brand-guidelines/SKILL.md` |
| doc-coauthoring | Collaboratively write and edit documents | `https://raw.githubusercontent.com/anthropics/skills/main/skills/doc-coauthoring/SKILL.md` |

### Creative

| Skill | When to use | Raw URL |
|-------|-------------|---------|
| theme-factory | Generate cohesive visual themes and colour palettes | `https://raw.githubusercontent.com/anthropics/skills/main/skills/theme-factory/SKILL.md` |
| slack-gif-creator | Create animated GIFs for Slack | `https://raw.githubusercontent.com/anthropics/skills/main/skills/slack-gif-creator/SKILL.md` |

---

## 🟢 Community Skills Worth Adding

| Skill | What it does | Source |
|-------|-------------|--------|
| Notion integration | Work with Notion pages and databases | [Notion Skills for Claude](https://www.notion.so/notiondevs/Notion-Skills-for-Claude-28da4445d27180c7af1df7d8615723d0) |

---

## Priority Build Order (Jon's Next Skills)

1. `skills-librarian` — mines Gmail logs, keeps this index current automatically
2. `linkedin-post-writer` — biggest content gap right now
3. `github-pages-publisher` — automates the ship step in the email-to-site pipeline
4. `cold-outreach-generator` — turns demo URLs into messages

---

## Notes for Claude

- Always fetch the raw URL — never link to the GitHub browse page
- If a skill is marked 🔲 Planned, tell Jon it doesn't exist yet and offer to build it
- This index covers multiple projects — skills are shared across all of Jon's work
- Jon's timezone is Australia/Perth (AWST, UTC+8)
- Jon's email: jgwynne7@gmail.com | iTabs leads: responses@itabs.ai

---

*Last updated: 10 Mar 2026*
