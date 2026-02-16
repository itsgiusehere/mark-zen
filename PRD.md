# Product Requirements Document: Markdown Polish Editor

## Overview

A minimalist web-based markdown editor designed to bridge the gap between Obsidian drafting and final polish. Provides a beautiful, distraction-free environment for refining writing with seamless auto-save functionality.

## Problem Statement

When drafting content in Obsidian (job applications, LinkedIn posts, articles), users need a clean, focused environment to polish their writing. Current workflow involves friction: copying text, using external tools, or losing the markdown format. Users want to maintain `.md` files throughout the process while having a beautiful editing experience that supports AI-assisted refinement via Claude Chrome extension.

## Target User

- **Primary**: Giuseppe (strategic design consultant who drafts in Obsidian, polishes content for professional use)
- **Characteristics**: Values simplicity, aesthetics, and frictionless workflows. Works with markdown regularly. Uses AI assistance for writing refinement.

## Core Use Case

1. User drafts content in Obsidian vault
2. User drags `.md` or `.txt` file into Markdown Polish Editor
3. Editor loads content as scratchpad (no file link — content is copied, not connected)
4. User refines writing in beautiful, distraction-free interface
5. User invokes Claude Chrome extension for AI-assisted improvements when needed
6. User selects all (Cmd+A), copies (Cmd+C), and pastes back into Obsidian
7. Content persists in browser LocalStorage between sessions (scratchpad survives refresh)

## Product Principles

1. **Simplicity over features** - Do one thing exceptionally well
2. **Beauty matters** - Typography and spacing create pleasant reading/writing experience  
3. **Frictionless flow** - No manual saves, downloads, or copy-paste required
4. **Markdown fidelity** - Preserve markdown syntax perfectly
5. **AI-ready** - Content accessible to Claude Chrome extension

## v1 Requirements

### Must Have (MVP)

#### Functional Requirements

**File Management**
- Drag-and-drop `.md` or `.txt` files to load content (primary entry point)
- Content is copied into scratchpad — no file link maintained
- Manual export workflow: Select All → Copy → Paste elsewhere
- Content persists in LocalStorage between sessions (scratchpad survives refresh)
- Footer shows file name and modified date when file was loaded (informational only)
- No File System Access API — removed complexity, simpler UX

**Editor Core**
- WYSIWYG markdown rendering: text is always displayed as formatted (bold, italic, headers, etc.). No raw syntax visible.
- Formatting via keyboard shortcuts and markdown input rules (type `**` and it converts to bold, etc.)
- Support for standard markdown syntax (headers, bold, italic, lists, links, code blocks)
- Preserve exact markdown formatting in the underlying file (what saves to disk is valid .md)
- Keyboard shortcuts: Cmd/Ctrl+S (explicit save), Cmd/Ctrl+B (bold), Cmd/Ctrl+I (italic)

**UI/UX**
- Full viewport editing area (minimal chrome)
- Footer: word/character count (right), file name when loaded (left)
- Light/dark mode toggle (persisted to localStorage)
- Responsive typography: Lora font family, generous line-height (32px)
- Smooth transitions (theme switching, UI elements)
- No "Saved" indicator needed (scratchpad workflow)

#### Non-Functional Requirements

**Performance**
- Editor loads in < 1 second
- Auto-save operations don't cause noticeable lag
- Smooth typing experience even with large documents (5000+ words)

**Browser Support**
- Chrome/Edge on desktop (required for File System Access API)
- Safari graceful degradation (show message about limited support)
- Mobile not supported — File System Access API does not exist on any mobile browser. Show a message directing users to desktop.

**Accessibility**
- Keyboard navigable interface
- Readable contrast ratios (WCAG AA minimum)
- Focus indicators visible

### Technical Specifications

#### Tech Stack
- **Framework**: React 18+ with TypeScript
- **Editor**: TipTap (WYSIWYG markdown editor — text always rendered, formatting via shortcuts and input rules)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: Vercel or Netlify (static site)

#### Scratchpad Implementation
```typescript
// Drag and drop file loading
- FileReader API to read .md/.txt file content
- Load content into TipTap editor (no file handle saved)
- Warn user if editor has content before replacing

// LocalStorage persistence
- Auto-save editor content to localStorage on change (debounced)
- Restore content on page load
- Clear content manually or on file drop (with confirmation)
```

#### Editor Configuration (TipTap)
- Extensions: markdown input rules (type `**` → bold), standard markdown shortcuts
- Theme: Custom styling matching IA Writer aesthetic
- Font: System font stack (SF Pro on Mac) — not monospace
- Line height: 1.6-1.8 for comfortable reading
- Max width: 700px for optimal readability

#### State Management
```typescript
interface EditorState {
  content: string;
  fileName: string | null; // Informational only (from drag & drop)
  lastModified: string | null; // Informational only (from file metadata)
  wordCount: number;
  charCount: number;
  theme: 'light' | 'dark';
}
```

### Design Specifications

#### Visual Style (IA Writer Inspired)

**Typography**
- Body text: 19px Lora (weight 300), line-height 32px
- Headings: Lora (H1/H2: 700, H3+: 600)
- Strong: Lora 600, Italic: Lora italic
- Max content width: 700px, centered
- Letter spacing: default (0)

**Colors (Light Mode)**
- Background: #FFFFFF or very light warm gray (#FAFAFA)
- Text: Near-black (#1A1A1A) 
- UI elements: Subtle gray (#888888)
- Syntax highlighting: Minimal, muted colors

**Colors (Dark Mode)**
- Background: Near-black (#1E1E1E)
- Text: Off-white (#E8E8E8)
- UI elements: Medium gray (#666666)
- Syntax highlighting: Slightly brighter but still subtle

**UI Chrome**
- No top bar or "Open File" button. The editor is the entire screen.
- Footer: left side shows file name/modified date (when loaded), right side shows word/char count
- Mode toggle button (light/dark)
- No focus mode (removed based on user feedback)
- Placeholder hint in empty editor: subtle, disappears on first keystroke or file drop

**Spacing**
- Generous padding around editing area (80-120px sides on desktop)
- Vertical rhythm: consistent spacing between paragraphs/blocks

### User Flows

#### Primary Flow: Drag-and-Drop File
1. User lands on the editor — it's empty, with subtle placeholder hint ("drag a .md file here, or just start writing")
2. User drags a `.md` file from Finder onto the editor
3. File content loads into editor as rendered markdown (syntax hidden). Any scratchpad content is replaced — no prompt.
4. User edits content
5. Auto-save runs every 2 seconds when changes detected
6. "Last saved" timestamp in footer updates silently — no "unsaved" indicator shown
7. User can continue editing indefinitely

#### Scratchpad Flow (no file)
1. User lands on the editor and starts typing directly
2. Editor works as a simple scratchpad — no file is associated, no auto-save to disk
3. On page refresh, the scratchpad is empty. Content is ephemeral by design.

#### Secondary Flow: Using Claude Extension
1. User selects text or works with full content
2. User activates Claude Chrome extension
3. Claude provides suggestions/improvements
4. User accepts/modifies suggestions
5. Auto-save captures changes automatically

#### Error Flow: Permission Denied
1. User opens file
2. Browser blocks write permission
3. Editor shows message: "Unable to auto-save. Please grant permission or use manual save (Cmd/Ctrl+S)"
4. Provide button to re-request permission

### Out of Scope for v1

**Explicitly NOT included:**
- File browser/library view
- Multiple file tabs
- Creating new files from scratch
- Export/download functionality  
- Separate live preview mode (rendering is built into the editor itself)
- Version history
- Focus mode (sentence/paragraph highlighting)
- Typewriter mode (centered cursor)
- Split view
- Find and replace
- Spell check integration
- Cloud sync
- Mobile optimization
- Collaboration features
- Plugin system

**Rationale**: These features add complexity. v1 focuses solely on the core polish workflow. Future versions can add these based on actual usage patterns.

### Success Metrics

**Qualitative**
- User (Giuseppe) successfully uses editor daily for content polishing
- Workflow feels frictionless compared to alternatives
- AI assistance via Claude extension works smoothly

**Quantitative** (if tracking added)
- Time from file open to first edit: < 5 seconds
- Auto-save success rate: > 99%
- User returns to app weekly

### Future Considerations (v2+)

**Potential enhancements** (not committed):
- Create new `.md` files directly
- Download/export functionality
- Focus mode (dim surrounding paragraphs)
- Typewriter scrolling mode
- Recent files list
- Customizable keyboard shortcuts
- Export to PDF/HTML
- Browser extension for quick access
- Mobile-responsive version

## Development Phases

### Phase 1: Foundation (Days 1-2)
- Set up React + TypeScript + Vite project
- Integrate Tailwind CSS
- Implement basic routing/layout

### Phase 2: Editor Core (Days 3-4)
- Integrate TipTap
- Configure WYSIWYG markdown rendering and input rules
- Implement basic styling (typography, spacing)

### Phase 3: File System (Days 5-6)
- Implement File System Access API
- File picker integration
- Auto-save logic with debouncing
- Permission handling

### Phase 4: Polish (Days 7-8)
- Light/dark mode implementation
- Word/character count
- Last saved indicator
- UI refinements and transitions
- Responsive adjustments

### Phase 5: Testing & Deployment (Days 9-10)
- Browser compatibility testing
- Edge case handling (large files, permission errors)
- Deploy to Vercel/Netlify
- Documentation (README)

## Technical Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|---------|-----------|------------|
| File System Access API browser support limited | High | High | Show clear messaging for unsupported browsers. Consider fallback to manual download/upload for Safari users. |
| Auto-save conflicts with user edits | Medium | Low | Implement proper debouncing and only save when user pauses typing. |
| Large file performance issues | Medium | Low | Test with 10,000+ word documents. Optimize TipTap config if needed. |
| Permission persistence issues | Low | Medium | Clear UI for re-requesting permissions. Graceful degradation to manual save. |

## Open Questions

1. **Which editor library?** RESOLVED — TipTap WYSIWYG. See Decisions Log in PLAN.md.
2. Should there be a setting to adjust auto-save frequency?
3. What's the maximum file size we should support?
4. Should we show a confirmation when user tries to close browser with unsaved changes?
5. Do we need offline/PWA support for v1?

**Answers can be deferred** - start with reasonable defaults, adjust based on usage.

## Appendix

### Inspiration References
- **iA Writer**: Minimalist aesthetic, focus mode, typography
- **Typora**: Seamless markdown editing experience
- **Bear**: Clean UI, pleasant writing environment

### Technical References
- [File System Access API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
- [TipTap Documentation](https://tiptap.dev/docs)
- [Markdown Specification](https://commonmark.org/)
