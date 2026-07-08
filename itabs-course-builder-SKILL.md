---
name: itabs-course-builder
description: Turn a YouTube video into a course that makes the learner DO the thing — applied to their own project — instead of just watching. Use whenever the user wants to build a course from a video, turn a video into a learning course, make a course with exercises, create an apply-it course, or learn a skill from a video by doing rather than watching. Triggers on "build a course from this video", "turn this into a course", "make me a course", "course with exercises", "teach me this from the video". Different from itabs-video-summary: a summary is cards you READ; a course is cards you WORK THROUGH, coached one exercise at a time, ending in an iTabs of what you discovered.
---

# iTabs Course-Builder

Turn a video into a course that makes you **do** the thing — on your own project — and hand back an iTabs of what you discovered.

## Why this exists (don't skip)

Watching a how-to video feels like learning. It isn't. People watch, nod, and keep almost nothing — **because there's no process that makes them do anything with what they watched.** This skill *is* that process. The video brings the framework; the learner brings their project; the exercises force the two together.

## The one rule that makes it work

**Every exercise applies the video's framework to the LEARNER'S OWN PROJECT.**

The learner is running this inside an AI chat that already knows their project. Use that. Don't teach in the abstract — pull each principle from the video straight onto the thing they're actually building. That's the whole moat. A generic quiz is worthless; "now do this step on YOUR product" is the entire value.

## Workflow

1. **Get the transcript.** The user pastes it in (YouTube → ⋯ → Show transcript → copy). *Do not* fetch it with tools — pasting is the v1 rule.
2. **Extract the framework.** Read the transcript and pull out the 5–9 key steps or principles the video actually teaches. These become the spine.
3. **Build the teach deck.** One card per key step (see *Output decks* below). Punchy headline, 2–3 sentence summary, ▶ timestamp back to that moment, 1–2 i-buttons for jargon / why-it-matters.
4. **Turn each step into an apply-it exercise.** One exercise per major step. Each takes the video's principle and makes the learner run it on their own project.
5. **Coach one exercise at a time.** Present ONE. Draft a starting answer from what you know about their project, let them sharpen it, lock it, then move on. Never dump all the exercises at once — the one-at-a-time rhythm is the process that makes it stick.
6. **On "done" → build the output iTabs.** A fresh, clean deck presenting what *they* discovered — their idea, packaged. NOT the course slides. This is the reward and the shareable proof.

## How to write the exercises (the schema)

- **One exercise per key step** the video teaches. Follow the video's own logic order.
- **Each = principle → applied to their project.** "The video says X. Now do X on your thing."
- **AI proposes, human sharpens.** Draft a starting answer from the project context the chat already holds, then let them cut and correct it. The exchange is the coaching.
- **Hold the problem tightly, the solution loosely.** If the learner keeps describing their product when asked about the problem, push them back to the pure problem.
- **Each exercise ends with something real** — a single concrete artefact. Label it: *"Walk out with: ___"*. If the exercise doesn't produce something that didn't exist before, it's too soft — rewrite it.

## Coaching rules

- **One question at a time.** Ceiling is one, not a target of three.
- **Make the call, don't interrogate.** Draft first with a one-line reason; only ask when it's genuinely 50/50.
- **Lock before moving on.** Mark each finished exercise ✅ with its "walk out with" so progress is visible.
- **Always their project.** Every example, every draft answer, anchored to the thing they're building.

## The cuts (v1 — keep it to one file)

Building for one user, on one project, first. Deliberately cut:

- ✂️ Transcript fetching / APIs / scrapers — **paste it yourself.**
- ✂️ Accounts, logins, saved profiles — **the chat is the memory.**
- ✂️ Payments, metering, unlocks.
- ✂️ Auto-generation / the Studio engine — build courses **by hand** first.
- ✂️ Cross-session saving.
- ✂️ "Works for any course/any creator" — prove it on ONE project before generalising.

The skill is course-agnostic by design, but the first job is always: make it work once, for this learner, on this project.

## Output decks (the iTabs)

Two decks, same visual system. Both: single self-contained HTML, mobile-first (max-width 430px), dark mode, swipeable, progress bar at top, scroll-*inside*-card fixed (thin 52px edge nav zones so the card body scrolls freely; horizontal swipe only fires when |dx| > 50 and |dx| > |dy|). **String concatenation only — no backtick template literals** (Val.town-safe). Output to `/mnt/user-data/outputs/`.

**1. The COURSE deck** (built at step 3–4)
- Intro card: "This isn't a summary. It's a course." Explain the two halves — read, then do.
- Teach cards (blue accent): kicker, headline, summary, ▶ timestamp chip, i-buttons (definition / context / why-it-matters) that open a bottom-sheet modal.
- Exercise cards (green accent): "Exercise N of M" banner, task text (with the video's principle bolded), ▶ "watch this bit" link, a textarea for the answer, and a green "Walk out with: ___" footer.
- Reuse the structure from `itabs-video-summary` for teach cards.

**2. The OUTPUT deck** (built on "done")
- A clean idea deck presenting the learner's own discoveries — one card per locked exercise answer, plus a cover and a closing "launch" card.
- Green accent, no i-buttons, no textareas. This is a pitch of *their* thinking, made by the act of doing the work. Shareable — even if only to themselves.

## The shape in one line

**Video in → coached on your own project → an iTabs of your idea out.**

## Proven on

Course #01 — YC / Michael Seibel, "How to Plan an MVP" — run on the iTabs course-builder itself. The five exercises (name your one user · hold the problem tight · smallest viable version · 3-week spec · launch = any customer) coached a fuzzy "something about training" into a concrete, dated, one-file MVP. The mechanic validated with zero code: dropping a course into a project-aware chat *does* coach the learner on their own thing.
