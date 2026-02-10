# Design Specifications — MD-Editor
## Master Reference Guide

**Status:** Complete and ready for implementation
**Date:** 2026-02-09
**Source:** Figma API extraction from "Mark Zen" file
**Frames:** "1024" (light) + "1024 Dark mode" (dark)

---

## Quick Navigation

### For Implementers
Start here based on what you need:

1. **I need colors, spacing, and dimensions** → Read **LIGHT-VS-DARK-COMPARISON.md**
2. **I need to set up Tailwind config** → Read **LIGHT-VS-DARK-COMPARISON.md** → Tailwind Config section
3. **I need all the details** → Read **FIGMA-DESIGN-EXTRACT.md**
4. **I need copy-paste values** → Use **DESIGN-VALUES.json**
5. **I need a quick spec sheet** → Read **DESIGN-SPEC.md**

---

## Files Created

### Documentation (Markdown)

| File | Purpose | Audience |
|------|---------|----------|
| **DESIGN-SPEC.md** | High-level overview of design system | Designers & developers |
| **FIGMA-DESIGN-EXTRACT.md** | Detailed breakdown of every component | Developers & designers |
| **LIGHT-VS-DARK-COMPARISON.md** | Side-by-side light/dark reference | Developers (implementation) |
| **DESIGN-VALUES.json** | Structured data for all design values | Developers (programmatic) |

### Reference Docs (Existing)

| File | Purpose |
|------|---------|
| **FIGMA-API-SETUP.md** | How to fetch Figma data via API |
| **FIGMA-BRIEF.md** | Original design brief from Figma |

---

## Design System at a Glance

### Frames
- **Light Mode ("1024"):** Figma ID `12:73`
- **Dark Mode ("1024 Dark mode"):** Figma ID `38:25`
- **Canvas Size:** 1440×1963px
- **Content Width:** 700px (centered, max-width)

### Colors

#### Light Mode
```
Background:          #FDFDFD (off-white)
Body Text:           #1A1A1A (dark gray)
Code Block BG:       #F7F7F7 (light gray)
Code/Footer Text:    #010B13 (blue-black)
```

#### Dark Mode
```
Background:          #1A1614 (dark brown)
Body Text:           #FDFDFD (off-white)
Code Block BG:       #262422 (dark gray)
Code/Footer Text:    #FDFDFD (off-white)
```

### Spacing
- **Body padding (vertical):** 60px
- **Content gaps:** 27px
- **Code block padding (horizontal):** 9px
- **Footer padding:** 9px

### Components
1. **Body** — Main container (60px top/bottom padding, 27px gap)
2. **Main Content** — Editor area (27px gap between paragraphs)
3. **Code Block** — Code sections (light gray/dark gray background)
4. **Footer** — Status bar (counter + indicator)

---

## Recommended Implementation Path

### Step 1: Structure
```
App
├── Body (60px vertical padding)
│   ├── MainContent (editor area - TipTap)
│   └── CodeBlock (code styling)
└── Footer (horizontal layout)
    ├── Counter
    └── Indicator
```

### Step 2: Light Mode Styling
- Apply colors from LIGHT-VS-DARK-COMPARISON.md
- Use 700px max-width
- Center content
- Apply typography styles

### Step 3: Dark Mode Toggle
- Add theme state (context or provider)
- Switch colors dynamically
- Persist preference (localStorage)

### Step 4: Typography
- Define or use Figma styles: H1, H2, H3, P, P Mono
- Apply to markdown elements via TipTap
- Ensure line-height and font-weight match design

---

## Copy-Paste Resources

### Hex Colors
```
Light: #FDFDFD, #1A1A1A, #F7F7F7, #010B13
Dark:  #1A1614, #FDFDFD, #262422, #FDFDFD
```

### Spacing Scale (Tailwind)
```javascript
spacing: {
  27: '27px',  // gaps
  60: '60px',  // body padding
  9: '9px',    // footer/code padding
}
```

### CSS Variables
```css
--md-bg: #FDFDFD;
--md-text: #1A1A1A;
--md-code-bg: #F7F7F7;
--md-code-text: #010B13;
```

---

## Key Design Decisions

### Layout
- **Centered column:** 700px max-width (IA Writer-inspired)
- **Generous padding:** 60px vertical breathing room
- **Consistent gaps:** 27px throughout for rhythm
- **No responsive breakpoints:** Desktop only (File System Access API)

### Colors
- **High contrast:** All text meets WCAG AAA (22:1–26:1)
- **Warm tones:** Dark mode uses brown (#1A1614) not pure black
- **Code blocks muted:** Subtle background to distinguish code
- **Inverted theme:** Dark mode inverts colors, doesn't just darken

### Typography
- **6 text styles:** H1, H2, H3, P, P Mono, P (footer)
- **Proportional & monospace:** Different families for body vs code
- **Generous line-height:** 1.6–1.7 for readability

---

## Testing Checklist

- [ ] Light mode background and text colors match design
- [ ] Dark mode background and text colors match design
- [ ] Code block styling (background + text) correct in both modes
- [ ] Footer counter and indicator display correctly
- [ ] All spacing (padding, gaps) matches specifications
- [ ] Content width capped at 700px, centered
- [ ] Content area takes up proper vertical space (60px padding)
- [ ] Theme toggle works smoothly without flickering
- [ ] Theme preference persists across sessions
- [ ] No unstyled flash on page load (FOUC)
- [ ] Typography (font sizes, weights, line-height) applied correctly

---

## Figma File Access

### API Credentials (stored in .env.local)
```
FIGMA_API_TOKEN=your_figma_token_here
FIGMA_FILE_ID=xhAYyINlvarv6b0YkTeCIH
```
**Note:** Never commit your actual Figma API token. Keep it in `.env.local` which is gitignored.

### Direct Link
Open in Figma: [Mark Zen](https://figma.com/file/xhAYyINlvarv6b0YkTeCIH)

### Frame IDs
- Light: `12:73`
- Dark: `38:25`

---

## Questions? Reference This

| Question | Answer | Document |
|----------|--------|----------|
| What's the exact dark blue text color? | `#010B13` | LIGHT-VS-DARK-COMPARISON.md |
| How much padding between body and footer? | 27px gap | DESIGN-SPEC.md |
| What font size is the body text? | ~18-20px (check Figma styles) | FIGMA-DESIGN-EXTRACT.md |
| How do I style code blocks? | See Code Block component | FIGMA-DESIGN-EXTRACT.md |
| What's the max content width? | 700px | DESIGN-SPEC.md |
| Tailwind config for dark mode? | See LIGHT-VS-DARK-COMPARISON.md | LIGHT-VS-DARK-COMPARISON.md |

---

## File Structure in Project

```
/Users/giuse/Documents/Vibe-coding/MD-Editor/
├── DESIGN-SPEC.md                    (high-level spec)
├── FIGMA-DESIGN-EXTRACT.md           (detailed breakdown)
├── LIGHT-VS-DARK-COMPARISON.md       (color reference)
├── DESIGN-VALUES.json                (structured data)
├── README-DESIGN-SPECS.md            (this file)
├── figma-design-extract.json         (raw API response)
└── ... (other project files)
```

---

## Summary

You now have everything needed to implement the MD-Editor design:

✅ **Colors** — Exact hex values for light and dark modes
✅ **Layout** — Spacing, padding, and component structure
✅ **Dimensions** — Max-width, viewport sizes, and scaling
✅ **Typography** — Text styles and hierarchy
✅ **Figma Reference** — Component IDs and frame details
✅ **Implementation Guides** — Tailwind config, CSS, React patterns

**Next step:** Read LIGHT-VS-DARK-COMPARISON.md and start implementing!

---

**Questions about the design?** Check FIGMA-DESIGN-EXTRACT.md for detailed component breakdowns.
**Ready to code?** Start with LIGHT-VS-DARK-COMPARISON.md for quick color/spacing reference.

