---
name: gmail-gcal-mcp
description: Use Gmail and Google Calendar MCP tools to search emails, read messages, retrieve session logs, check calendar events, and find meeting times. Trigger this skill whenever the user asks to get logs from email, check their inbox, find a message, read a thread, look at their calendar, check what's on today, find free time, or schedule a meeting. Always use this skill for iTabs session log retrieval (subject: ITABS-QUOTE-LOG), lead checking (responses@itabs.ai), and calendar-based planning. Trigger on phrases like "get log from email", "check my inbox", "what's on my calendar", "find that email", "am I free", or any request involving Gmail or Google Calendar.
---

# Gmail & Google Calendar MCP

Use connected Gmail and Google Calendar tools to retrieve emails, session logs, leads, and calendar events directly in chat — no browser needed.

---

## Available Tools

### Gmail

| Tool | When to use |
|------|-------------|
| `Gmail:gmail_search_messages` | Find emails by sender, subject, date, keyword |
| `Gmail:gmail_read_message` | Read full content of a specific message |
| `Gmail:gmail_read_thread` | Read a full email conversation thread |

### Google Calendar

| Tool | When to use |
|------|-------------|
| `Google Calendar:gcal_list_events` | See what's on the calendar for a time range |
| `Google Calendar:gcal_find_meeting_times` | Find when all attendees are free |

---

## Common Workflows

### 1. Get Latest iTabs Session Log

Search for the most recent ITABS-QUOTE-LOG email:

```
gmail_search_messages(
  q="subject:ITABS-QUOTE-LOG",
  maxResults=5
)
```

Then read the most recent one by ID:

```
gmail_read_message(messageId="<id from search result>")
```

Present the full log content to the user. If multiple logs exist today (FINAL + Session 2 etc.), read both and present them combined.

**Jon's log format:**
- Subject: `ITABS-QUOTE-LOG — [date]` or `ITABS-QUOTE-LOG — [date] (FINAL)` or `ITABS-QUOTE-LOG — [date] (Session 2)`
- Sent to: `jgwynne7@gmail.com`
- Contains: What Was Discussed, What Was Built, Decisions Made, Next Actions

### 2. Check for New iTabs Leads

Search for inbound leads from Web3Forms:

```
gmail_search_messages(
  q="to:responses@itabs.ai OR subject:iTabs lead",
  maxResults=10
)
```

Read each lead message and summarise: name, phone, email, trade type, job description.

### 3. Check for Inbound Build Requests

Search for emails to the automated pipeline inbox:

```
gmail_search_messages(
  q="to:build@itabs.ai",
  maxResults=10
)
```

### 4. Search for a Specific Email

Use Gmail search syntax:

```
gmail_search_messages(q="from:max@example.com subject:quote comparison")
```

Common search operators:
- `from:` / `to:` — by sender or recipient
- `subject:` — subject line keyword
- `after:2026/3/1` / `before:2026/3/9` — date range
- `is:unread` — unread only
- `has:attachment` — has files attached
- `"exact phrase"` — exact match

### 5. What's On My Calendar Today

```
gcal_list_events(
  timeMin="[TODAY]T00:00:00",
  timeMax="[TODAY]T23:59:59",
  timeZone="Australia/Perth"
)
```

Always use `Australia/Perth` as the timezone for Jon unless specified otherwise.

### 6. What's On This Week

```
gcal_list_events(
  timeMin="[MONDAY]T00:00:00",
  timeMax="[FRIDAY]T23:59:59",
  timeZone="Australia/Perth"
)
```

### 7. Find Free Time / Meeting Slots

```
gcal_find_meeting_times(
  attendees=["jgwynne7@gmail.com"],
  duration=60,
  timeMin="[DATE]T00:00:00",
  timeMax="[DATE+7]T23:59:59",
  timeZone="Australia/Perth"
)
```

---

## Key Identities

| Identity | Value |
|----------|-------|
| Jon's email | `jgwynne7@gmail.com` |
| Session logs sent to | `jgwynne7@gmail.com` |
| iTabs leads inbox | `responses@itabs.ai` |
| Build pipeline inbox | `build@itabs.ai` |
| Timezone | `Australia/Perth` (AWST, UTC+8) |

---

## Session Log Retrieval — Step by Step

When Jon says "get log from email" or "get today's log":

1. Call `gmail_search_messages` with `q="subject:ITABS-QUOTE-LOG after:[today's date in YYYY/M/D format]"` and `maxResults=5`
2. If multiple results, read all of them (FINAL + any session numbers)
3. Present a combined summary: What Was Discussed, What Was Built, Open Next Actions
4. End with: "What are you picking up today?"

---

## Output Format for Logs

When presenting session logs, format as:

```
**ITABS-QUOTE-LOG — [date] ([session label])**

**Discussed:** [brief summary]

**Built:** [list of files/tools created]

**Open next actions:**
- [ ] item 1
- [ ] item 2
```

If multiple logs exist for the day, show both in chronological order with a horizontal rule between them.

---

## Error Handling

- If no logs found for today, search the last 7 days and show the most recent
- If a message ID returns an error, try reading the thread instead using `gmail_read_thread`
- If calendar returns no events, confirm the date and timezone before reporting empty
