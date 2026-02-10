# Figma API Setup — Reference Guide

**Date:** 2026-02-09
**Purpose:** Enable Claude Code to read Figma designs via API (Option 2: Direct API calls)

---

## What This Does

Allows Claude Code to fetch your Figma designs directly without manual export. I can now:
- See your latest design changes in real-time
- Extract colors, typography, spacing, layout specs
- Compare design vs implementation while coding
- Reference specific frames and components by name

---

## Setup Summary

### 1. Figma API Token
- **Created in:** Figma → Settings → Personal access tokens
- **Scopes:** `file:read` (read-only — designs are source of truth, we don't write back)
- **Expiration:** As per your choice (recommended: 90 days for security)
- **Stored in:** `.env.local` (local only, not in git)

### 2. Figma File ID
- **From:** Your design file URL: `figma.com/file/[ID_HERE]/...`
- **Your file ID:** `xhAYyINlvarv6b0YkTeCIH`
- **Stored in:** `.env.local`

### 3. Utility Script
- **Location:** `scripts/figma-fetch.js`
- **Purpose:** Fetches full design data from Figma API
- **Usage:** `node scripts/figma-fetch.js` (reads `.env.local` credentials)

---

## How to Use

**Ask me to fetch your design:**
```
"Check my Figma design"
"Fetch the latest from Figma"
"What does Figma say about the editor layout?"
```

I'll pull the design data and tell you what I see.

---

## Security Notes

- ✅ **Token is local-only** — stored in `.env.local`, never committed to git
- ✅ **Read-only** — we only fetch, never modify Figma designs
- 🔄 **Token refresh** — You can revoke the token anytime in Figma Settings → Personal access tokens
- 📝 **If regenerating token** — Update `.env.local` and re-run any fetch commands

---

## Files Involved

| File | Purpose |
|------|---------|
| `.env.local` | Stores `FIGMA_API_TOKEN` and `FIGMA_FILE_ID` |
| `scripts/figma-fetch.js` | Node script to fetch Figma data |

---

## Troubleshooting

**"Missing FIGMA_API_TOKEN or FIGMA_FILE_ID"**
- Check `.env.local` exists and has both variables
- Verify token is still valid (hasn't expired in Figma)

**"Error fetching Figma file"**
- Token may have expired — regenerate in Figma Settings
- File ID may be wrong — double-check URL
- API might be temporarily down — try again in a moment

---

## Next Steps

- Check Figma design whenever you make changes
- I'll reference it while coding to match styles/layout exactly
- When ready, we'll style Phase 3 based on what's in your design file
