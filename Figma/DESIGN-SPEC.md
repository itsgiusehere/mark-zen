# MD-Editor Design Specification
## Extracted from Figma "Mark Zen" Project

**Date:** 2026-02-09
**Frames:** "1024" (Light Mode) and "1024 Dark mode" (Dark Mode)
**Source:** Figma API extraction

---

## Frame Dimensions

Both frames are designed for a 1024px viewport width (laptop/desktop screen):

| Property | Value |
|----------|-------|
| **Frame Width** | 1440px |
| **Frame Height** | 1963px |
| **Content Width** | 700px (centered) |
| **Viewport** | 1024px+ (desktop/laptop) |

---

## Layout Structure

### Overall Hierarchy
```
Frame (1440px × 1963px)
├── Body (vertical layout, 60px top/bottom padding, 27px gap)
│   ├── Main Content (vertical layout, 27px gap)
│   │   ├── Text Node 1 (700px × 1081px)
│   │   └── Text Node 2 (700px × 357px)
│   └── Code Block (700px × varies)
│       └── Code Text
└── Footer (horizontal layout, 27px gap, 9px padding all)
    ├── Counter (word/char count)
    └── Indicator (status - "Saving…")
```

### Padding & Spacing
- **Body padding:** 60px top, 60px bottom, left/right are auto-centered
- **Body gap:** 27px (vertical spacing between Main Content and Code Block)
- **Main Content gap:** 27px (spacing between paragraphs)
- **Footer padding:** 9px all sides
- **Footer gap:** 27px (spacing between Counter and Indicator)

### Content Width
- **Max content width:** 700px (IA Writer-inspired center column)
- **Centered** on the 1024px viewport
- Left/right padding fills remaining space

---

## Color Palette

### Light Mode (Frame: "1024")
| Element | Color | Hex | RGBA |
|---------|-------|-----|------|
| **Background** | Off-white | `#FDFDFD` | rgba(253, 253, 253, 1) |
| **Body Text** | Dark gray | `#1A1A1A` | rgba(26, 26, 26, 1) |
| **Code Block Background** | Light gray | `#F7F7F7` | rgba(247, 247, 247, 1) |
| **Code Text** | Deep blue/black | `#010B13` | rgba(1, 11, 19, 1) |
| **Footer Text** | Deep blue/black | `#010B13` | rgba(1, 11, 19, 1) |

### Dark Mode (Frame: "1024 Dark mode")
| Element | Color | Hex | RGBA |
|---------|-------|-----|------|
| **Background** | Very dark brown | `#1A1614` | rgba(26, 22, 20, 1) |
| **Body Text** | Off-white | `#FDFDFD` | rgba(253, 253, 253, 1) |
| **Code Block Background** | Dark gray-brown | `#262422` | rgba(38, 36, 34, 1) |
| **Code Text** | Off-white | `#FDFDFD` | rgba(253, 253, 253, 1) |
| **Footer Text** | Off-white | `#FDFDFD` | rgba(253, 253, 253, 1) |

---

## Typography

### Text Styles Defined in Figma
- **H1** (style ID: 2:191)
- **H2** (style ID: 2:192)
- **H3** (style ID: 2:221)
- **P** (style ID: 2:193) — Standard body paragraph
- **P Mono** (style ID: 12:82) — Monospace, used for code blocks
- **P** (style ID: 38:22) — Footer paragraph

### Font Properties (from Figma styles)
*Note: Specific font families, sizes, weights, and line heights are defined via Figma's text styles. The nodes reference these via styleId.*

- **Body text:** Uses standard proportional font (likely system or serif)
- **Code/Mono:** Uses monospace font (P Mono style)
- **Line height:** 1.6–1.7 apparent ratio (generous spacing)
- **Letter spacing:** Standard

---

## Component Details

### Main Content Area
- **Type:** Vertical layout frame
- **Gap:** 27px between text blocks
- **Width:** 700px (fills available space, constrained by max-width)
- **Height:** Hugs content

#### Text Nodes
1. **Node 1** (700px × 1081px)
   - Color: `#1A1A1A` (light) / `#FDFDFD` (dark)
   - Contains heading + body text
   - Name suggests: "### Welcome to MarkdownPad\n\nDrag a .md file here / or just start writing"

2. **Node 2** (700px × 357px)
   - Color: `#1A1A1A` (light) / `#1A1A1A` (dark) — interesting: this text is darker even in dark mode
   - Contains continuation of body text

### Code Block
- **Light mode background:** `#F7F7F7` (light gray)
- **Dark mode background:** `#262422` (dark gray-brown)
- **Padding:** 9px left/right
- **Content:** Monospace text in code style (P Mono)
- **Light mode text color:** `#010B13` (deep blue-black)
- **Dark mode text color:** `#FDFDFD` (off-white)

### Footer
- **Layout:** Horizontal (row)
- **Padding:** 9px all sides
- **Gap:** 27px between items
- **Height:** ~small fixed or hug content

#### Footer Items
1. **Counter** (left)
   - Text: "0 words · 0 characters"
   - Light color: `#010B13`
   - Dark color: `#FDFDFD`

2. **Indicator** (right/flex-end)
   - Text: "Saving…" (status indicator)
   - Light color: `#010B13`
   - Dark color: `#FDFDFD`

---

## Implementation Notes

### Tailwind CSS Considerations
- Use a **centered max-width container** (700px) for `.prose` / content area
- **Custom colors** needed for the dark/light color scheme (not default Tailwind)
- **Generous padding:** 60px top/bottom on Body suggests `py-[60px]` or custom
- **Generous gaps:** 27px gaps suggest `gap-[27px]` or custom spacing scale
- **Typography:** Use `prose` or custom classes for body text styling

### Color Tokens (Tailwind)
```javascript
// Suggested color configuration
colors: {
  light: {
    bg: '#FDFDFD',
    text: '#1A1A1A',
    codeBlock: '#F7F7F7',
    codeText: '#010B13',
    footer: '#010B13',
  },
  dark: {
    bg: '#1A1614',
    text: '#FDFDFD',
    codeBlock: '#262422',
    codeText: '#FDFDFD',
    footer: '#FDFDFD',
  },
}
```

### Spacing Scale (Tailwind)
```javascript
// Suggested spacing configuration
spacing: {
  // ... default
  27: '27px',
  60: '60px',
}
```

### Responsive Behavior
- **Desktop (1024px+):** Full layout as shown
- **Smaller desktops:** Content area stays 700px, padding adjusts
- **Responsiveness:** Not in scope for v1 (File System Access API is desktop-only)

---

## File References

### Figma IDs (for Figma plugin access)
- **Light Mode Frame ID:** `12:73`
- **Dark Mode Frame ID:** `38:25`
- **Figma File ID:** `xhAYyINlvarv6b0YkTeCIH`

### Figma Text Styles
These are defined in Figma and applied to text nodes via styleId:
- `2:191` → H1
- `2:192` → H2
- `2:221` → H3
- `2:193` → P (body)
- `12:82` → P Mono (code)
- `38:22` → P (footer)

---

## Next Steps for Implementation
1. **Verify typography details** — Request full font specs from Figma styles (family, size, weight, line-height)
2. **Export/verify exact colors** — These hex values are from Figma color fills; confirm with designer
3. **Check responsive behavior** — Confirm how content width/padding adjust on smaller viewports
4. **Implement in React/TipTap** — Use this spec as the source of truth for styling
5. **Test dark/light toggle** — Ensure color switching is smooth and covers all elements

---

## Raw Data Files
- Full Figma JSON dump: Available in Figma API response (see FIGMA-API-SETUP.md)
- Extracted design details: Available in `figma-detailed.json` if needed for reference
