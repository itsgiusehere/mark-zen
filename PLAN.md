# MD-Editor — Plan & Progress Tracker

Last updated: 2026-02-10

---

## Approach

Design-first workflow. Giuseppe is a designer, so visual control is the priority.
Loveable handles the technical scaffold. Claude Code translates Figma designs into code.

### Tool roles
- **Figma** — source of truth for all UI decisions
- **Loveable** — generates the React + TipTap + Tailwind skeleton (technical boilerplate)
- **Claude Code** — styles the app to match Figma, wires up logic (File System API, auto-save)
- **Vercel** — deployment

---

## Phases

### Phase 1 — Design in Figma (Parallel with Phase 2)
- [x] Define screens and states to design (with Claude's help)
- [x] Revised: one screen only (editor is always visible — no separate empty/active screens)
- [x] Initial design sketches: "1024" (light mode) and "1024 Dark mode" frames created
- [ ] Refine: Editor in scratchpad mode (empty, with placeholder hint) — light mode
- [ ] Refine: Editor with file loaded (content visible, footer shows "last saved") — light mode
- [ ] Add variants: permission error state
- [ ] Check layout at 3 desktop widths: full (1440px+), laptop (1024-1440px), small laptop (768-1024px)
- Note: no "unsaved" state needed — auto-save is silent, only a "last saved" timestamp in footer
- Note: no mobile design — File System Access API is desktop-only, mobile is out of scope for v1
- Note: drag-and-drop is the file entry point. No "Open File" button.

### Phase 2 — Build Functional Prototype in Loveable (Parallel with Phase 1)
- [x] Editor choice resolved: TipTap WYSIWYG confirmed (see Decisions Log)
- [x] Initial Loveable prototype built and working: TipTap, two screens, footer, dark/light toggle
- [x] Build functional prototype (no styling): TipTap WYSIWYG, drag-and-drop file handling, dark/light toggle, footer with stats, auto-save logic
- [x] Export code from Loveable to local machine

### Phase 3 — Local Setup & Testing
- [x] Get Loveable code running on local machine (npm install, dev server)
- [x] Install Agentation for visual feedback workflow
- [x] First iteration: removed focus mode, fixed content width (700px + padding)
- [ ] Continue iterating with Agentation feedback
- [ ] Test functionality: drag-and-drop, typing, dark mode toggle, footer stats
- [ ] Document any issues or unexpected behavior

### Phase 3.5 — Style with Claude Code (After testing)
- [ ] Apply Figma design styles to local code
- [ ] Replace default styles with Figma designs: colors, typography, spacing, layout
- [ ] Match both light and dark mode variants exactly

### Phase 4 — Wire up advanced logic
- [ ] Drag-and-drop file handling (File System Access API)
- [ ] Auto-save with debouncing (every 2s) — only when file is loaded
- [ ] Permission handling + error states
- [ ] Keyboard shortcuts (Cmd+S, Cmd+B, Cmd+I)
- [ ] Word/char count in footer
- [ ] "Last saved" indicator
- [ ] Light/dark mode toggle (persisted)

### Phase 5 — Test & Deploy
- [ ] Test in Chrome/Edge
- [ ] Test Safari fallback message
- [ ] Deploy to Vercel
- [ ] Smoke test live URL

---

## Decisions Log
*Record key decisions here so future sessions don't re-debate them.*

| Date | Decision | Reason |
|------|----------|--------|
| 2026-02-04 | Design-first workflow (Figma before code) | Giuseppe is a designer, visual control is non-negotiable |
| 2026-02-04 | Loveable for scaffold only, Claude Code for styling | Loveable handles hard boilerplate; Claude translates Figma to code |
| 2026-02-04 | Tech stack: React 18 + TypeScript + Tailwind + Vite | Per PRD |
| 2026-02-04 | Swapped CodeMirror 6 → TipTap | CodeMirror is a code editor (raw text + colors). TipTap does live rendering. Seemed like the right fit at the time. |
| 2026-02-04 | TipTap shelved temporarily → explored Milkdown + CodeMirror | Tested TipTap mode switch (jarring), Milkdown (no syntax reveal despite claims), CodeMirror styled (felt like a code editor). |
| 2026-02-05 | TipTap WYSIWYG confirmed as the editor | Compared all prototypes side by side. The pure WYSIWYG experience (rendered text, no syntax visible) felt best. Syntax reveal is a Typora-only feature — no open source library does it well. TipTap WYSIWYG is the right fit. Keyboard shortcuts (Cmd+B, Cmd+I) handle formatting. |
| 2026-02-04 | Deploy to Vercel | Per PRD, free tier sufficient |
| 2026-02-04 | No mobile support in v1 | File System Access API doesn't exist on mobile browsers — hard technical limit |
| 2026-02-04 | No "unsaved" indicator — silent auto-save only | Matches IA Writer aesthetic; only show an alert when something breaks (permission error) |
| 2026-02-05 | One screen only — editor is always visible, no separate landing/empty screen | Drag-and-drop replaces "Open File" button. Editor doubles as scratchpad when no file is loaded. Scratchpad is ephemeral (no persistence, resets on refresh). |
| 2026-02-09 | Set up Figma MCP for design-to-code workflow | Figma MCP (official, http://127.0.0.1:3845/mcp) is more reliable than direct API calls. Gives Claude Code structured access to Figma design data. |
| 2026-02-09 | Revised workflow: Design ↔ Functional prototype → Local implementation → Styling | Design and functionality inform each other. Build a working (not styled) prototype in Loveable first, test it locally, then apply Figma styling. One step at a time. |
| 2026-02-10 | Agentation for visual feedback | Installed Agentation React component to enable click-to-annotate workflow. Faster iteration: click UI → add notes → paste markdown → instant fixes. |
| 2026-02-10 | Focus mode removed | User feedback: dimming inactive paragraphs was distracting. Removed Focus extension and all focus-related CSS. |
