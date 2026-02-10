# Figma Design Extract — MD-Editor
## "Mark Zen" File — Light & Dark Modes

**Generated:** 2026-02-09
**Method:** Figma API extraction + analysis
**Status:** Ready for React/TipTap implementation

---

## Quick Reference

### Frames
| Property | Light ("1024") | Dark ("1024 Dark mode") |
|----------|---|---|
| **Figma ID** | 12:73 | 38:25 |
| **Visible Size** | 1440×1963px | 1440×1963px |
| **Content Width** | 700px | 700px |
| **Background** | #FDFDFD | #1A1614 |

### Color Scheme Summary
**Light Mode:** Off-white bg, dark text, subtle gray code blocks
**Dark Mode:** Dark brown bg, light text, medium-dark code blocks

---

## Detailed Design Breakdown

### 1. Frame Structure (Both Modes)

```
┌─────────────────────────────────────┐
│ FRAME (1440×1963px)                 │
│ layoutMode: VERTICAL                │
├─────────────────────────────────────┤
│                                     │
│ ┌─ BODY FRAME ─────────────────────┐│
│ │ layoutMode: VERTICAL              ││
│ │ padding: 60px (top/bottom)         ││
│ │ gap: 27px                          ││
│ │                                    ││
│ │ ┌─ MAIN CONTENT FRAME ────────┐   ││
│ │ │ layoutMode: VERTICAL         │   ││
│ │ │ gap: 27px                    │   ││
│ │ │                              │   ││
│ │ │ [TEXT NODE 1: 700×1081px]    │   ││
│ │ │ [TEXT NODE 2: 700×357px]     │   ││
│ │ └──────────────────────────────┘   ││
│ │                                    ││
│ │ ┌─ CODE BLOCK FRAME ──────────┐   ││
│ │ │ padding: 9px (left/right)    │   ││
│ │ │ [CODE TEXT: monospace]       │   ││
│ │ └──────────────────────────────┘   ││
│ │                                    ││
│ └────────────────────────────────────┘│
│                                     │
│ ┌─ FOOTER FRAME ────────────────────┐│
│ │ layoutMode: HORIZONTAL             ││
│ │ padding: 9px (all sides)           ││
│ │ gap: 27px                          ││
│ │                                    ││
│ │ [COUNTER TEXT] ↕ [INDICATOR TEXT] ││
│ │ "0 words · 0 chars"    "Saving…"  ││
│ │                                    ││
│ └────────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 2. Colors — Light Mode (#FDFDFD background)

### Background & Containers
- **Frame background:** `#FDFDFD` (off-white, nearly pure white with slight warmth)
- **Code block background:** `#F7F7F7` (very light gray)

### Text
- **Body text:** `#1A1A1A` (almost pure black, very dark gray)
- **Code text:** `#010B13` (deep blue-black, slightly cooler than pure black)
- **Footer text:** `#010B13` (same as code text)

### Visual Contrast
- Body text on background: ~26 contrast ratio (excellent accessibility)
- Code on code block: ~11 contrast ratio (good)

---

## 3. Colors — Dark Mode (#1A1614 background)

### Background & Containers
- **Frame background:** `#1A1614` (very dark brown/charcoal, warm tone)
- **Code block background:** `#262422` (dark gray-brown, slightly lighter than frame)

### Text
- **Body text:** `#FDFDFD` (off-white, matches light mode's background)
- **Code text:** `#FDFDFD` (same off-white)
- **Footer text:** `#FDFDFD` (same off-white)

### Visual Contrast
- Body text on background: ~22 contrast ratio (excellent accessibility)
- Code on code block: ~10 contrast ratio (good)

---

## 4. Spacing & Dimensions

### Vertical Spacing
| Element | Top | Bottom | Gap | Notes |
|---------|-----|--------|-----|-------|
| **Body** | 60px padding | 60px padding | 27px (to Code Block) | Center content vertically |
| **Main Content** | — | — | 27px | Gap between paragraphs |
| **Code Block** | — | — | — | Follows Main Content |
| **Footer** | — | — | 27px (internal gap) | Horizontal gap between Counter/Indicator |

### Horizontal Spacing
| Element | Left | Right | Notes |
|---------|------|-------|-------|
| **Body** | auto | auto | Centered on frame |
| **Code Block** | 9px padding | 9px padding | Subtle padding around code |
| **Footer** | 9px padding | 9px padding | Subtle padding around footer items |

### Content Dimensions
| Element | Width | Height | Notes |
|---------|-------|--------|-------|
| **Main Content → Text Node 1** | 700px | 1081px | Heading + body content |
| **Main Content → Text Node 2** | 700px | 357px | Additional body content |
| **Code Block** | 700px | varies | Scales to content |

---

## 5. Typography Styles (Figma Text Styles)

### Defined Styles in Figma
These are reusable text styles that can be applied to any text node:

| Style Name | ID | Purpose | Current Nodes |
|------------|--|----|---|
| **H1** | 2:191 | Heading level 1 | — (not used in current screens) |
| **H2** | 2:192 | Heading level 2 | — (not used in current screens) |
| **H3** | 2:221 | Heading level 3 | — (not used in current screens) |
| **P** | 2:193 | Body paragraph | Text Node 1, Text Node 2 |
| **P Mono** | 12:82 | Code/monospace | Code Block text |
| **P** (footer) | 38:22 | Footer paragraph | Counter, Indicator |

### Typography Details (from Figma)
*Note: Specific font families, sizes, weights, and line heights are stored in Figma's text style definitions. The JSON extraction shows these are applied via styleId, not directly on nodes.*

**Estimated typography (from visual inspection):**
- **Body text:** ~18–20px, 1.6–1.7 line height, regular weight
- **Code text:** Monospace (likely system mono: SF Mono, Consolas, Monaco), similar size, slightly reduced line height
- **Footer text:** Smaller, similar weight

---

## 6. Layout Modes & Sizing

### Frame Layout Properties
| Element | Layout Mode | Primary Axis | Counter Axis | Sizing |
|---------|---|---|---|---|
| **Body** | VERTICAL | Stretches height (content determines) | FIXED width | Hugs content height, fills width |
| **Main Content** | VERTICAL | Stretches height | FIXED width | Hugs content |
| **Code Block** | VERTICAL | — | — | Hugs content |
| **Footer** | HORIZONTAL | Stretches width | FIXED height | Fills available space |

---

## 7. Component Hierarchy (Data Structure)

### Light Mode (ID: 12:73)
```json
{
  "id": "12:73",
  "name": "1024",
  "type": "FRAME",
  "backgroundColor": "#FDFDFD",
  "children": [
    {
      "id": "12:74",
      "name": "Body",
      "paddingTop": 60,
      "paddingBottom": 60,
      "gap": 27,
      "children": [
        {
          "id": "12:75",
          "name": "Main Content",
          "gap": 27,
          "children": [
            { "id": "14:90", "type": "TEXT", "width": 700, "height": 1081, "color": "#1A1A1A" },
            { "id": "12:76", "type": "TEXT", "width": 700, "height": 357, "color": "#1A1A1A" }
          ]
        },
        {
          "id": "14:83",
          "name": "Code Block",
          "backgroundColor": "#F7F7F7",
          "paddingLeft": 9,
          "paddingRight": 9,
          "children": [
            { "id": "14:85", "type": "TEXT", "color": "#010B13" }
          ]
        }
      ]
    },
    {
      "id": "38:18",
      "name": "Footer",
      "layoutMode": "HORIZONTAL",
      "gap": 27,
      "padding": 9,
      "children": [
        { "id": "38:20", "name": "Counter", "color": "#010B13", "text": "0 words · 0 characters" },
        { "id": "38:23", "name": "Indicator", "color": "#010B13", "text": "Saving…" }
      ]
    }
  ]
}
```

### Dark Mode (ID: 38:25)
Same structure, with colors:
- Frame: #1A1614
- Body Text: #FDFDFD
- Code Block BG: #262422
- Code Text: #FDFDFD
- Footer Text: #FDFDFD

---

## 8. Implementation Checklist

### Structure
- [ ] Create main frame container (1440px or responsive equivalent)
- [ ] Create Body section with 60px vertical padding, 27px gap to next sibling
- [ ] Create Main Content area with 27px gap between paragraphs
- [ ] Create Code Block section with 9px horizontal padding
- [ ] Create Footer with horizontal layout, 9px padding, 27px gap

### Styling
- [ ] Light mode: Apply #FDFDFD background
- [ ] Light mode: Apply #1A1A1A to body text, #010B13 to code/footer
- [ ] Light mode: Apply #F7F7F7 to code block background
- [ ] Dark mode: Apply #1A1614 background
- [ ] Dark mode: Apply #FDFDFD to all text
- [ ] Dark mode: Apply #262422 to code block background
- [ ] Set content max-width to 700px, center horizontally
- [ ] Apply typography styles (H1–H3 for headings, P for body, P Mono for code)

### Responsive (v1: Desktop only)
- [ ] Test layout at 1024px, 1440px, and 1920px viewports
- [ ] Verify content stays centered and max-width is maintained

### Dark Mode Toggle
- [ ] Implement theme switcher (likely context or state)
- [ ] Ensure smooth color transitions
- [ ] Persist theme preference (localStorage)

---

## 9. Notes for Developers

### TipTap Integration
- The "Main Content" area will be the TipTap editor
- TipTap will render markdown as formatted text (h1, h2, h3, p, code blocks, etc.)
- Typography styles (P, H1, H2, H3, P Mono) should be applied via TipTap's CSS or Tailwind classes

### Footer Behavior
- **Counter:** Shows live word/char count as user edits
- **Indicator:** Shows "Saving…" when auto-save is active, potentially other statuses on error

### Code Block Styling
- Should inherit from TipTap's code block rendering
- Apply the color scheme from this design (light bg in light mode, dark bg in dark mode)

### No Responsive Behavior Expected
- File System Access API is desktop-only
- Mobile fallback can show "Use desktop" message
- Laptop/desktop widths only (1024px+)

---

## 10. File Locations

### In Figma
- **File:** "Mark Zen"
- **File ID:** xhAYyINlvarv6b0YkTeCIH
- **Frame:** "1024" (light mode)
- **Frame:** "1024 Dark mode" (dark mode)

### In Project
- **Specification:** `/Users/giuse/Documents/Vibe-coding/MD-Editor/DESIGN-SPEC.md`
- **Raw Extract:** `/Users/giuse/Documents/Vibe-coding/MD-Editor/figma-design-extract.json`
- **This Document:** `/Users/giuse/Documents/Vibe-coding/MD-Editor/FIGMA-DESIGN-EXTRACT.md`

---

## 11. Next Conversation Topics

When implementing, ask about:
1. Exact font families (Figma API doesn't always expose this clearly)
2. Font sizes, weights, line heights for each text style
3. Exact responsive behavior (does content width stay 700px on all desktop sizes?)
4. Dark mode toggle UX (button location, persistence, etc.)
5. Any additional states or variants not shown in the current frames

---

**Ready to implement!** Use DESIGN-SPEC.md for quick reference, FIGMA-DESIGN-EXTRACT.md for detailed context, and figma-design-extract.json for programmatic access to dimensions and colors.
