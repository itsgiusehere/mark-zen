# MD-Editor — Plan & Progress Tracker

Last updated: 2026-02-12

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
- [x] Refine: Editor in scratchpad mode (empty, with placeholder hint) — light mode
- [ ] Add variants: permission error state (not needed for scratchpad workflow)
- [ ] Check layout at 3 desktop widths: full (1440px+), laptop (1024-1440px), small laptop (768-1024px)
- Note: Scratchpad workflow implemented — drag & drop loads content without file link, no auto-save back to source
- Note: Footer shows word/character count (right), file name when loaded (left)
- Note: no mobile design — browser-based, mobile is out of scope for v1
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
- [x] Applied Figma design styling via Agentation feedback
- [x] Fixed heading Enter key behavior (exits to paragraph, handles all edge cases)
- [x] Switched to Lora font, refined typography (weights, line-height, margins)
- [x] Implemented scratchpad workflow (drag & drop .md/.txt, no file link)
- [x] Footer redesign (removed "Saved" indicator, stats on right)
- [ ] Test functionality: drag-and-drop, typing, dark mode toggle, footer stats
- [ ] Document any issues or unexpected behavior

### Phase 3.5 — Style with Claude Code (After testing)
- [x] Apply Figma design styles to local code
- [x] Replace default styles with Figma designs: colors, typography, spacing, layout
- [ ] Match both light and dark mode variants exactly (only light mode styled so far)

### Phase 4 — Wire up advanced logic
- [x] Drag-and-drop file handling (.md and .txt files)
- [x] Word/char count in footer
- [x] Light/dark mode toggle (persisted)
- [x] Keyboard shortcuts (Cmd+B, Cmd+I for formatting)
- [x] LocalStorage persistence (scratchpad content survives refresh)
- [ ] Heading keyboard shortcuts (Cmd+Alt+1-6)
- Note: File System Access API and auto-save removed in favor of scratchpad workflow
- Note: No "last saved" indicator needed — scratchpad has no file link

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
| 2026-02-12 | Figma design applied | Applied Figma light mode styling: Literata Light (300) body text, Figma color scheme (#FDFDFD bg, #010B13 text), adjusted spacing (120px top padding, 21px paragraph margins, 4px list spacing), edge-to-edge footer with system sans-serif. |
| 2026-02-12 | Heading Enter key fix | Created custom TipTap extension to fix behavior where pressing Enter after heading continued heading style instead of creating paragraph. Extension properly splits heading text and creates new paragraph. |
| 2026-02-12 | Custom bullet lists shelved | Attempted to implement two bullet styles (disc for *, dash for -) but alignment issues made it impractical. Reverted to default TipTap behavior (both * and - create disc bullets). |
| 2026-02-16 | Scratchpad workflow confirmed | Editor is now a true scratchpad: drag & drop loads content without file link, no auto-save back to source. Manual copy/paste workflow. This simplifies the UX and removes File System Access API complexity. Content persists in LocalStorage between sessions. |
| 2026-02-16 | Lora font family | Switched from Literata to Lora for better readability. All weights loaded for flexibility. Body: 300, Headings: 600-700, Strong: 600. |
| 2026-02-16 | Footer redesign | Removed "Saved" indicator (not needed for scratchpad). Moved word/character count to right side. File name/modified date shown on left when file is loaded. |
| 2026-02-16 | Typography refinements | Body line-height: 32px, H2 margin-bottom: 21px, H3: 22px size + 9px margin-bottom. Consistent heading weights (H1/H2: 700, H3+: 600). |
