# Loveable Brief — Functional Prototype Requirements

**Date:** 2026-02-09
**Purpose:** Build a functional (not styled) prototype of MD-Editor in Loveable before local implementation.

---

## Core Behavior

### 1. Start Screen
- Editor loads empty with cursor blinking and ready to type
- No splash screen, no "Open File" button, no placeholder text
- Just the editor, waiting for input

### 2. Scratchpad (Browser Cache)
**Persistence:**
- Whatever is typed is auto-saved to browser cache (localStorage or IndexedDB)
- Persists across browser refreshes
- **Cache cleared only when:**
  - User manually deletes all content (select all + delete)
  - Browser cache is cleared by the OS/user
  - User uploads a .md file (new file content replaces cached content immediately)

**Behavior:**
- Scratchpad is ephemeral — there's only one cache slot
- When a .md file is uploaded, the scratchpad cache is cleared immediately and gone forever
- No way to "get back" to the old scratchpad once a file is uploaded
- No conflict prompts or warnings — just replace

### 3. File Upload (Drag-and-drop)
- User can drag a .md file into the editor
- **Drag visual feedback:** When dragging a file over the editor, show a pulsing gradient expanding from the edges of the screen (design TBD in Figma)
- **File validation:** If file is not markdown (.md), show a dialog message: "Please upload a markdown file (.md)"
- **Content replacement warning:** If editor has content and a valid .md file is dropped, show browser confirm dialog: "Current content will be lost. Do you want to proceed?"
  - If user clicks "OK": File content replaces editor content, scratchpad cache is cleared
  - If user clicks "Cancel": No change, file is rejected, editor content and cache unchanged
- Footer shows file metadata (filename, last saved timestamp, word count)

### 4. Dark/Light Mode (No Toggle)
- Theme automatically follows system preference (OS light/dark mode setting)
- If user changes OS theme, app updates automatically
- No manual toggle button or UI control needed

### 5. Layout Structure
- **Editor:** Full-height, full-width, scrollable (content can scroll underneath the footer)
- **Footer:** Fixed at bottom, shows stats and status
  - Left: Word count and character count
  - Right: Save status indicator ("Saved" or "Saving")
  - Last modified timestamp (for file, not scratchpad)

### 6. Focus Mode (Subtle)
- **Active paragraph focus:** The paragraph where the cursor is located should have full color/opacity
- **Inactive paragraphs:** All other paragraphs should be slightly dimmed (reduced opacity, subtle effect)
- **Purpose:** Help the user focus on what they're writing without distracting darkening
- **Design note:** Keep the dimming subtle — not harsh, just enough to guide attention (design specifics TBD in Figma)

### 7. Auto-Scroll (Writing Space)
- **Automatic scroll on typing:** As you type and approach the bottom of the visible area, the editor automatically scrolls up so your cursor stays in the middle-upper area of the viewport
- **No manual scrolling needed:** The scroll should happen automatically without user intervention — you never have to stop writing to scroll
- **Purpose:** Keep your active paragraph in the center of your view with plenty of space below for breathing room while thinking
- **Implementation:** Use TipTap's `scrollIntoView` or similar to keep the cursor position centered vertically as you type

---

## Technical Stack (Per PRD)
- React 18 + TypeScript
- TipTap WYSIWYG editor (not CodeMirror)
- Tailwind CSS (styling comes later)
- Vite (build tool)
- Browser cache for persistence (localStorage or IndexedDB, TBD)

---

## Notes
- **Markdown styles required.** All markdown elements must have default styling so they're visually distinct when typed:
  - Headings (# ## ###)
  - Bold (**text**)
  - Italic (*text*)
  - Lists (- or *) — **Each list item should have focus mode applied individually** (when cursor is on that item, only that item is full color, others dimmed)
  - Blockquotes (> text)
  - Code blocks (``` ```) — **Inline code and code blocks must have visible styling** (e.g., different background color, font family, or text color)
  - Links, tables, etc.
  - These are placeholder styles — we'll redesign them in Phase 3.5 to match Figma
- **Focus mode on list items:** When cursor is inside a list item, only that item should be full color — other items in the same list and other paragraphs should be dimmed
- **No File System Access API yet.** That's Phase 4 (local implementation). For now, just drag-and-drop file upload.
- **No keyboard shortcuts yet.** Cmd+B, Cmd+I, Cmd+S come in Phase 4.
- **Minimal UX.** No modals, confirmations, or error states (except permission errors, which are Phase 4).
- **Editor is NOT in a constrained frame.** Editor should be full-screen scrollable, with content scrolling underneath a fixed footer (not the other way around).

