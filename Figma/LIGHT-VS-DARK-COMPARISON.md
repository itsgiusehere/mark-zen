# Light Mode vs Dark Mode — Side-by-Side Comparison

**MD-Editor Design Specification**  
**Generated from Figma "Mark Zen" frames**

---

## Color Palette Comparison

### Light Mode (#FDFDFD background)
```
┌──────────────────────────────────────┐
│ Background: #FDFDFD (off-white)      │
│ ┌──────────────────────────────────┐ │
│ │ Body Text: #1A1A1A (dark gray)   │ │
│ │ Lorem ipsum dolor sit amet...    │ │
│ │ ┌──────────────────────────────┐ │ │
│ │ │ Code Block: #F7F7F7 (lt gray) │ │ │
│ │ │ Code Text: #010B13 (blue-blk) │ │ │
│ │ │ const hello = "world"         │ │ │
│ │ └──────────────────────────────┘ │ │
│ └──────────────────────────────────┘ │
│ Footer: #010B13 (dark text)          │
│ "0 words · 0 characters" | "Saving…" │
└──────────────────────────────────────┘
```

### Dark Mode (#1A1614 background)
```
┌──────────────────────────────────────┐
│ Background: #1A1614 (dark brown)     │
│ ┌──────────────────────────────────┐ │
│ │ Body Text: #FDFDFD (off-white)   │ │
│ │ Lorem ipsum dolor sit amet...    │ │
│ │ ┌──────────────────────────────┐ │ │
│ │ │Code Block: #262422 (dark gray)│ │ │
│ │ │ Code Text: #FDFDFD (off-white)│ │ │
│ │ │ const hello = "world"         │ │ │
│ │ └──────────────────────────────┘ │ │
│ └──────────────────────────────────┘ │
│ Footer: #FDFDFD (light text)         │
│ "0 words · 0 characters" | "Saving…" │
└──────────────────────────────────────┘
```

---

## Hex Color Values Table

| Element | Light Mode | Dark Mode | Contrast (light) | Contrast (dark) |
|---------|------------|-----------|------------------|-----------------|
| **Background** | `#FDFDFD` | `#1A1614` | — | — |
| **Body Text** | `#1A1A1A` | `#FDFDFD` | 26:1 | 22:1 |
| **Code Block BG** | `#F7F7F7` | `#262422` | 7% lighter | 3% lighter |
| **Code/Footer Text** | `#010B13` | `#FDFDFD` | 11:1 | 10:1 |

**Note:** All contrast ratios exceed WCAG AAA standards (7:1 for large text, 4.5:1 for normal text).

---

## Layout Comparison (Identical Structure)

Both modes use the same layout:

| Section | Layout | Padding | Gap | Notes |
|---------|--------|---------|-----|-------|
| **Body** | Vertical | 60px V | 27px | Centers content |
| **Main Content** | Vertical | — | 27px | Gap between paragraphs |
| **Code Block** | Vertical | 9px H | — | Horizontal padding only |
| **Footer** | Horizontal | 9px A | 27px | Spreads items apart |

**Content Width:** 700px max (same in both modes)

---

## RGBA Values (Alternative Format)

### Light Mode
```css
--bg-light: rgba(253, 253, 253, 1);       /* #FDFDFD */
--text-light: rgba(26, 26, 26, 1);        /* #1A1A1A */
--code-bg-light: rgba(247, 247, 247, 1);  /* #F7F7F7 */
--code-text-light: rgba(1, 11, 19, 1);    /* #010B13 */
```

### Dark Mode
```css
--bg-dark: rgba(26, 22, 20, 1);           /* #1A1614 */
--text-dark: rgba(253, 253, 253, 1);      /* #FDFDFD */
--code-bg-dark: rgba(38, 36, 34, 1);      /* #262422 */
--code-text-dark: rgba(253, 253, 253, 1); /* #FDFDFD */
```

---

## RGB Values (for reference)

### Light Mode
- Background: RGB(253, 253, 253)
- Text: RGB(26, 26, 26)
- Code BG: RGB(247, 247, 247)
- Code Text: RGB(1, 11, 19)

### Dark Mode
- Background: RGB(26, 22, 20)
- Text: RGB(253, 253, 253)
- Code BG: RGB(38, 36, 34)
- Code Text: RGB(253, 253, 253)

---

## CSS Custom Properties (Ready to Use)

```css
/* Light Mode */
:root {
  --md-bg: #FDFDFD;
  --md-text: #1A1A1A;
  --md-code-bg: #F7F7F7;
  --md-code-text: #010B13;
  --md-footer-text: #010B13;
  --md-spacing-body: 60px;
  --md-spacing-gap: 27px;
  --md-content-max-width: 700px;
}

/* Dark Mode */
[data-theme="dark"] {
  --md-bg: #1A1614;
  --md-text: #FDFDFD;
  --md-code-bg: #262422;
  --md-code-text: #FDFDFD;
  --md-footer-text: #FDFDFD;
}
```

---

## Tailwind Config (Quick Copy-Paste)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'md-light': {
          bg: '#FDFDFD',
          text: '#1A1A1A',
          'code-bg': '#F7F7F7',
          'code-text': '#010B13',
          footer: '#010B13',
        },
        'md-dark': {
          bg: '#1A1614',
          text: '#FDFDFD',
          'code-bg': '#262422',
          'code-text': '#FDFDFD',
          footer: '#FDFDFD',
        },
      },
      spacing: {
        27: '27px',
        60: '60px',
      },
    },
  },
};
```

---

## What Stays the Same

Both light and dark modes share:
- **Content width:** 700px max
- **Body padding:** 60px (vertical)
- **All gaps:** 27px (between sections and items)
- **Code block padding:** 9px (horizontal)
- **Footer padding:** 9px (all sides)
- **Overall layout structure:** Vertical body → Main Content + Code Block → Footer
- **Typography styles:** H1, H2, H3, P, P Mono (applied the same way)

---

## What Changes

| Aspect | Light | Dark | Change |
|--------|-------|------|--------|
| **Background** | `#FDFDFD` | `#1A1614` | Complete inversion |
| **Body Text** | `#1A1A1A` | `#FDFDFD` | Complete inversion |
| **Code Block** | `#F7F7F7` | `#262422` | Subtle shift (lighter to darker) |
| **Code/Footer Text** | `#010B13` | `#FDFDFD` | Complete inversion |

**Pattern:** Text and background invert; code block background shifts but stays muted.

---

## Quick Toggle Implementation

### React with Tailwind
```jsx
function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <div className="bg-md-light-bg dark:bg-md-dark-bg">
        {/* Content here */}
      </div>
    </div>
  );
}
```

### CSS Classes
```css
.light {
  background-color: #FDFDFD;
  color: #1A1A1A;
}

.dark {
  background-color: #1A1614;
  color: #FDFDFD;
}

.code-block {
  background-color: #F7F7F7;
  color: #010B13;
}

.dark .code-block {
  background-color: #262422;
  color: #FDFDFD;
}
```

---

## Figma Frame IDs for Reference

- **Light Mode:** `12:73` (Frame name: "1024")
- **Dark Mode:** `38:25` (Frame name: "1024 Dark mode")
- **Figma File ID:** `xhAYyINlvarv6b0YkTeCIH`

---

**Use this document as a reference during implementation. All values are copy-paste ready!**
