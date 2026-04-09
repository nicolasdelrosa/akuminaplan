---
name: create-runbook
description: "Create or update Akumina client runbooks in Markdown and DOCX using the established Word/HTML-style format. Use when the user asks to create a runbook, regenerate a runbook, fix runbook formatting, or reuse an existing runbook layout for a client deployment document."
---

# Create Runbook

Use the bundled template and converter instead of rewriting runbook formatting from scratch.

## Workflow

1. Create or update the markdown runbook in `deployments/<CLIENT>/<CLIENT>_Runbook.md`.
2. Use `assets/RUNBOOK_TEMPLATE.md` as the starting structure when the runbook does not exist yet.
3. Keep the `## Table of Contents` section in markdown; the converter replaces that list with a native Word TOC.
4. Inventory support-relevant customizations before finalizing the runbook:
   - custom widget views, especially client-specific `.html` files
   - widget `callbackmethod` and `uicallbackmethod` values from widget configs
   - important logic in `src/js/library/digitalworkplace.custom.js`
   - other support-sensitive custom assets such as master pages when present
5. Generate the DOCX with:

```powershell
node .github/skills/create-runbook/scripts/convert-runbook.js "<input.md>" "<output.docx>"
```

6. Verify both files exist and that the DOCX opens cleanly.

## Formatting Rules

- Preserve the established Akumina runbook look:
  - H1: blue banner, white uppercase text
  - H2: light-blue banner, uppercase text
  - H3: standard heading
  - tables: gray header row with borders
  - code fences: shaded monospace paragraphs
- Do not include a Deployment section in the runbook unless the user explicitly asks for one.
- The Project Customizations area should be support-oriented, not generic.
- Always list custom widget views that are actually configured in the client repo. Client-specific views commonly have client prefixes in the `.html` filename, but verify from config and source instead of guessing.
- Always document widget callbacks when a widget instance uses `callbackmethod` or `uicallbackmethod`, even if the widget does not use a custom view.
- Always review `digitalworkplace.custom.js` and summarize important custom behaviors that support should know about.
- Call out gaps where config references a callback but no implementation is found in source.
- Let Word own the table of contents. Do not hand-build a numbered TOC inside the DOCX.
- Keep markdown headings in the document so the Word TOC can index them.
- Keep horizontal rules as `---` in markdown.

## Notes

- The converter updates Word fields so the TOC can be refreshed on open.
- If the TOC does not fully render on first open, refresh fields in Word with `Ctrl+A` then `F9`.
- The converter expects UTF-8 markdown and handles Windows line endings.
- If the user wants the layout to match an existing `.htm` or `.docx`, compare that artifact first and then adjust the markdown content or converter only where needed.
