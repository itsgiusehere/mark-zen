# MD-Editor — Learning & Reasoning Log

A record of key questions, decisions, and how my thinking evolves as I build this project.

---

## Meta-learnings
*Bigger insights that apply beyond this project. Added as they emerge.*

- **Functional prototypes surface interactions that static designs miss.** You can't feel a broken interaction in Figma. AI tools (Loveable, Claude Code) let designers build working prototypes autonomously — which means the design process itself changes. Iteration happens in the browser, not just on the canvas.
- **Prototypes also expose the boundaries of a tech choice.** Building a quick throwaway prototype isn't just about testing UI — it's about testing whether the underlying technology can actually deliver the interaction you need. It lets you foresee how far a design approach can go before hitting a wall, and weigh whether to invest further effort or pivot. Design decisions and tech decisions are tightly coupled; prototyping is how you discover that early.
- **AI-assisted prototyping is designing — just with interactive models instead of static frames.** Iterating with Loveable/Claude isn't a shortcut around design. It *is* design. It surfaces edge cases (what happens when you drop a file mid-scratchpad?) that static Figma screens never would. The designer is still driving; the tool is just faster at rendering the scenarios.

---

## 2026-02-04 — Session 1: Planning & Approach

**Where I started:**
Read the PRD. Wanted to just dive in and build.

**Key questions I asked:**
- How do I get started with no coding experience? What tools do I need?
- At what stage do I get to design and control the UI? (This was the dealbreaker question.)

**What I learned / realized:**
- There's a tension between "fast scaffold" tools (Loveable) and "design control." Loveable is great for getting a working app fast, but its default UI isn't mine.
- The right workflow for a designer is: **design first, scaffold second, style third.** Not the other way around.
- Figma is still my source of truth. Code is just the translation layer.

**Decision made:**
Design-first. Figma → Loveable (skeleton only) → Claude Code (styles to match my design) → logic → deploy.

**Next step:**
Define what screens and states I need to design in Figma before opening it.

---

## 2026-02-04 — Session 2: Design Scope & Mobile

**Where I started:**
Plan and docs were set up. Ready to start Phase 1 (Figma design).

**Key questions I asked:**
- What about different screen sizes? Do I need to design for those?
- What happens on mobile? Can I open and auto-save .md files on a phone?

**What I learned / realized:**
- File System Access API is desktop-only. No mobile browser supports it. Mobile is a hard technical wall, not a choice.
- "Unsaved changes" state is unnecessary UX noise. Auto-save is silent by design — only the "last saved" timestamp updates quietly. The only alert state that matters is permission error (something actually broke).
- Because the layout is a centered 700px column, responsive design is mostly about padding — not radically different layouts. Just check 3 desktop widths.

**Decision made:**
- No mobile design or support for v1. Show a message directing to desktop if accessed on mobile.
- No "unsaved" indicator. Auto-save works silently; footer shows "last saved" timestamp only.
- Design scope: 2 screens, 3 states (light, dark, permission error), checked at 3 desktop widths.

**Next step:**
Open Figma and design the screens.

---

## 2026-02-04 — Session 3: Editor behaviour & tech stack change

**Where I started:**
Exploring Loveable in parallel with starting Figma design.

**Key questions I asked:**
- The markdown is raw and not previewed. Can I have it rendered, with syntax only showing when my cursor is on that part of the text?

**What I learned / realized:**
- What I wanted is called "live rendering" or "WYSIWYG markdown" — exactly how Typora works (already an inspiration in the PRD).
- CodeMirror 6 is a code editor. It can color syntax but it cannot render markdown into formatted text. It would fight this requirement the entire project.
- TipTap is the right swap: React-friendly, does cursor-aware live rendering, well-documented. Changing the editor library now (before any code is written) is painless.

**Decision made:**
Swap CodeMirror 6 → TipTap. Updated PRD, PLAN, and CLAUDE.md accordingly.

**Next step:**
Continue Figma design. Loveable prompt (Phase 2) will use TipTap.

---

## 2026-02-04 — Session 4: TipTap tested, doesn't cut it. Exploring Milkdown.

**Where I started:**
Had a working Loveable prototype with TipTap. Pushed it to add a reading/editing mode switch so I could feel the interaction.

**Key questions I asked:**
- Can TipTap deliver cursor-aware syntax reveal (Typora-style)? How much does TipTap Pro cost?
- What other editors exist that do this natively?

**What I learned / realized:**
- TipTap Pro pricing is irrelevant — the paid features are for collaboration/AI/cloud, not for syntax reveal. The cursor-aware reveal simply isn't what TipTap does well.
- Tested the mode switch (reading mode → editing mode on focus/blur) in Loveable. Not convincing. The whole-editor flip between rendered and raw feels jarring — breaks the flow rather than supporting it.
- Milkdown is the leading candidate: open source, built on ProseMirror, explicitly inspired by Typora, has React bindings. Needs to be explored next session.
- This is exactly the kind of decision that prototyping surfaces early. Glad we didn't build the full app on TipTap before discovering this.

**Decision made:**
TipTap is shelved. Next step is to explore Milkdown — build a quick prototype to test whether it delivers the Typora-style syntax reveal natively.

**Next step:**
New session: research Milkdown, build a small Loveable or local prototype to test the interaction.

---

## 2026-02-05 — Session 5: Editor decision closed. TipTap WYSIWYG confirmed.

**Where I started:**
Milkdown prototype was built but didn't deliver syntax reveal. Also tested CodeMirror styled. Editor choice still open.

**Key questions I asked:**
- Are there open source desktop Mac apps that do Typora-style syntax reveal we could pivot to?
- (Implicit) Which of all the prototypes actually feels right to write in?

**What I learned / realized:**
- Typora-style syntax reveal is a closed-source feature. No open source library — not TipTap, not Milkdown, not MarkText — actually delivers it. Milkdown's marketing claims don't match reality.
- Desktop pivot (Electron) wouldn't solve the editor problem — same libraries available either way.
- Going back and comparing all prototypes side by side was the right move. The pure WYSIWYG version (rendered text, no syntax) is the one that felt best to write in.
- The syntax reveal was an ideal, not a requirement. What actually matters: does it feel good to write in? TipTap WYSIWYG: yes.

**Decision made:**
TipTap WYSIWYG is the editor. Decision is closed. Formatting happens via keyboard shortcuts (Cmd+B, Cmd+I) and markdown input rules (type `**` and it converts). No syntax ever visible.

**Next step:**
Phase 2 is unblocked. Export the Loveable code to local machine, move to Phase 3 (styling with Figma designs).

---

## 2026-02-05 — Session 6: UX rethink — one screen, drag-and-drop, scratchpad.

**Where I started:**
Editor decision closed. About to design screens in Figma. Original plan had two screens: empty state + editor active.

**Key questions I asked:**
- What if there's no "Open File" button at all? What if drag-and-drop is the only entry point?
- What happens to the scratchpad when a file is dropped? And on refresh?
- Do we need to persist the scratchpad?

**What I learned / realized:**
- Removing the button collapses two screens into one. The editor is always there. This is more minimal and more aligned with the IA Writer aesthetic.
- The scratchpad doesn't need persistence. Ephemeral is fine — it matches the "just start writing" mindset. Refresh = clean slate.
- No conflict prompt needed when dropping a file over scratchpad content. Minimalism wins: just replace.
- These edge cases (scratchpad vs file, what happens on drop, what happens on refresh) are exactly the kind of thing that emerges from conversational design with AI. You don't think of them until you ask "what happens if...?"

**Decision made:**
One screen only. Editor is always visible. Drag-and-drop is the file entry point (with a subtle placeholder hint). Scratchpad is ephemeral. No conflict handling needed.

**Next step:**
Figma design scope is now simpler: one screen, two states (scratchpad / file loaded), plus dark mode and permission error variants.

---

## 2026-02-09 — Session 7: Figma API integration & workflow refinement

**Where I started:**
Ready to see your Figma progress and move forward with implementation.

**Key questions I asked:**
- How do we connect Claude Code to Figma so I can see your designs in real-time?
- What's the best way to get design data into Claude Code?
- Should we build the whole product in Loveable first, or stick with the original plan?

**What I learned / realized:**
- Direct Figma API calls (Option 2) work but are finicky with token propagation and permissions.
- **Figma MCP (Model Context Protocol) is the right solution.** It's official, reliable, and gives structured access to design data through Claude Code.
- You're learning "design-to-code" workflow, and tools like MCP are part of that skillset. Worth getting right instead of taking shortcuts.
- The workflow should reflect how you actually work: **design + think about functionality in parallel, build a functional (not pretty) prototype in Loveable, then implement locally and style.**

**Decision made:**
- Set up Figma MCP (http://127.0.0.1:3845/mcp) in Claude Code configuration.
- Updated .env.local and created FIGMA-API-SETUP.md documentation for future reference.
- Confirmed the revised workflow: **Design (Figma) ↔ Functional prototype (Loveable) → Local implementation → Styling (Claude Code).**
- You'll build the functional prototype in Loveable while continuing to refine the design in Figma. Features and design inform each other.
- Only then will we export to local and apply Figma styling.

**Next step:**
Build the functional prototype in Loveable (TipTap WYSIWYG, drag-and-drop, dark/light toggle, footer stats, auto-save logic). When ready, export the code and bring it to local machine.

---

## 2026-02-10 — Session 8: Agentation setup & first iteration

**Where I started:**
Loveable prototype merged into local MD-Editor project. Dev server running at localhost:8080. Ready to iterate on the functional prototype.

**Key questions I asked:**
- Does Mark Zen save changes back to local files, or just open them?
- How do I install and use Agentation for visual feedback?
- Why is Grammarly appearing weirdly in the editor?

**What I learned / realized:**
- File System Access API (Phase 4) will enable true auto-save back to original files. Current prototype only reads files via drag-and-drop.
- Agentation is a React component, not a browser extension — needs to be added to App.tsx to work.
- Focus mode (dimming inactive paragraphs) was distracting and needed to be removed completely.
- Agentation enables precise, clickable feedback workflow: click UI elements → add notes → paste markdown → instant fixes.

**Decision made:**
- Installed Agentation and added it to App.tsx as a dev-only component.
- Removed focus mode entirely (CSS and TipTap Focus extension).
- Fixed content width: 700px max-width + responsive padding (2rem mobile, 3rem desktop).
- User disabled Grammarly manually for localhost (no code fix needed).

**Next step:**
Continue iterating with Agentation. Apply Figma design styles (Phase 3.5) or wire up File System Access API (Phase 4) depending on user priority.
