# MD-Editor — Claude Context File

## What this project is
A minimalist markdown polish editor (IA Writer-inspired). Giuseppe drafts in Obsidian, polishes here, auto-saves back to the .md file.

## Key files — read these first
- **PLAN.md** — current phase, progress tracker, and all decisions made so far. Read this to know where we are.
- **LOG.md** — Giuseppe's reasoning journal. Read this to understand the thinking behind decisions.
- **markdown-editor-prd.md** — the full PRD. Reference only; PLAN.md is the source of truth for what's in scope now.

## Giuseppe's profile
- Designer, not a coder. Learning as he goes.
- Visual control is non-negotiable. Figma is the design source of truth.
- Wants step-by-step guidance, one thing at a time.

## Workflow
Figma (design) → Loveable (technical scaffold with TipTap) → Claude Code (style to match Figma + wire up logic) → Vercel (deploy)

## Editor: TipTap WYSIWYG — CONFIRMED
- CodeMirror 6 ruled out: code editor, can't render markdown.
- Milkdown ruled out: doesn't actually do syntax reveal despite marketing claims.
- TipTap mode switch (reading/editing flip) ruled out: felt jarring.
- **TipTap pure WYSIWYG is confirmed.** Text is always rendered. No syntax visible. Formatting via keyboard shortcuts (Cmd+B, Cmd+I) and TipTap's built-in input rules. This decision is closed. Do not reopen it.

## Custom commands
- `/update-docs` — updates LOG.md and PLAN.md based on the current session. Run this when Giuseppe asks.

## Rules for this project
- Never skip reading PLAN.md at the start of a session.
- One step at a time. Don't jump ahead.
- If unsure about a decision, check the Decisions Log in PLAN.md before re-debating it.
