# MD-Editor — Figma Design Brief

Everything you need to design the screens. One page, no switching.

---

## Screens to design

One screen. Four states. Three widths.

| # | State | Description |
|---|-------|-------------|
| 1 | **Scratchpad (empty)** | Editor is empty. Placeholder hint visible. Footer shows word/char count (both 0). No "last saved." |
| 2 | **File loaded** | Editor has content. Placeholder gone. Footer shows word count, char count, and "last saved" timestamp. |
| 3 | **Dark mode** | Variant of state 2. Same layout, dark palette. |
| 4 | **Permission error** | Variant of state 2. An error message appears (see error spec below). |

Check each state at these widths:
- Full desktop: 1440px
- Laptop: 1280px
- Small laptop: 1024px

---

## Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│          ← 80-120px padding →               │
│                                             │
│              ┌──────────┐                   │
│              │          │                   │
│              │  Editor  │  ← max 700px      │
│              │  area    │     centered      │
│              │          │                   │
│              └──────────┘                   │
│                                             │
│                                             │
│  ░░░░░░░░░░░░░░ footer ░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────┘
```

- Editor area: max-width 700px, horizontally centered
- Side padding: 80px (small laptop) → 100px (laptop) → 120px (full desktop)
- Footer: pinned to bottom of viewport, full width

---

## Colors

| Token | Light mode | Dark mode |
|-------|-----------|-----------|
| Background | `#FAFAFA` | `#1E1E1E` |
| Text (body) | `#1A1A1A` | `#E8E8E8` |
| UI elements (footer text, placeholder) | `#888888` | `#666666` |
| Permission error text | `#888888` | `#666666` |

---

## Typography

| Element | Size | Weight | Line height | Notes |
|---------|------|--------|-------------|-------|
| Body / editor text | 19px | 400 | 1.7 | SF Pro (Mac) / Segoe UI (Win) / system font stack |
| H1 | 32px | 600 | 1.3 | |
| H2 | 26px | 600 | 1.4 | |
| H3 | 22px | 600 | 1.4 | |
| Footer stats | 13px | 400 | — | Muted color (`#888888` light / `#666666` dark) |
| Placeholder hint | 19px | 400 | 1.7 | Same size as body, muted color. Italic. |
| Permission error | 14px | 400 | 1.5 | See error spec below |

Letter spacing: body text slightly open (+0.01em)

---

## Footer

Pinned bottom. Full width. Subtle top border or just spacing — your call.

**Scratchpad mode (no file loaded):**
```
  0 words · 0 characters                          [theme toggle]
```

**File loaded:**
```
  247 words · 1,482 characters · Saved just now   [theme toggle]
```

- Stats on the left. Theme toggle on the right.
- "Saved just now" updates to "Saved 2 min ago" etc. No dramatic change — it's quiet.
- Theme toggle: simple icon. Sun (light) / moon (dark). No label needed.

---

## Placeholder (scratchpad empty state)

Centered in the editor area, vertically and horizontally. Two lines:

```
  drag a .md file here
  or just start writing
```

- Italic, muted color (`#888888` light / `#666666` dark)
- Disappears the moment user types or drops a file
- This is the only "hint" in the entire UI. No other instructions, buttons, or onboarding.

---

## Permission error (state 4)

A subtle banner or inline message. Not a modal — don't interrupt the editor.

Suggested placement: just above the footer, or as a thin strip at the very bottom above the footer bar.

```
  Unable to auto-save. Grant permission or save manually (Cmd+S).   [Grant permission]
```

- Text in muted color. The "Grant permission" link/button in a slightly more visible color — but still understated.
- The editor stays fully usable. User can keep typing.

---

## What to NOT design

- No "Open File" button anywhere
- No top bar / header
- No "unsaved changes" indicator
- No mobile layout
- No onboarding screens or welcome page
- No settings panel

---

## Sample content for the "file loaded" state

Use this as placeholder text when designing state 2 (so it looks realistic):

---

*Strategic design is not decoration. It is the act of making complex systems feel inevitable — as though there was never another way to do it.*

*The best interfaces disappear. You stop noticing the chrome and start noticing the work. That is the goal.*

## What this means in practice

When you open a document, the editor should feel like a quiet room. No noise. No friction. Just you and the words.

*The tool should get out of the way.*

---
