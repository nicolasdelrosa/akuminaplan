---
name: docling-workflows
description: "Convert, OCR, extract, and serialize documents with Docling CLI or Docling MCP. Use when the user asks to parse PDFs, DOCX, PPTX, XLSX, HTML, images, audio, or text into Markdown, JSON, HTML, or other structured outputs; when OCR or table extraction is needed; when preparing documents for RAG/chunking; or when an agent should use Docling MCP instead of ad hoc document parsing."
---

# Docling Workflows

Prefer Docling over hand-rolled parsers when the task is document conversion, OCR, or structure-aware extraction.

## Workflow

1. Decide whether the task is a one-off local conversion or an agent/tool integration.
2. For local conversion, run `scripts/invoke-docling.ps1` with raw Docling CLI arguments.
3. Default to Markdown output for readable review. Add JSON when the user also needs structured inspection or downstream automation.
4. Save output into a sibling `docling-output/` folder unless the user requested another location.
5. Avoid overwriting source files.
6. For scanned PDFs or images, prefer OCR-specific flags and verify exact local flag names with `docling --help` if needed.
7. For agentic flows, prefer wiring Docling through MCP instead of embedding large parsing logic in the agent prompt.

## Common Commands

Use the wrapper so the skill can run either a local `docling` install or `uvx`.

```powershell
.github/skills/docling-workflows/scripts/invoke-docling.ps1 .\input.pdf --to md --output .\docling-output
```

```powershell
.github/skills/docling-workflows/scripts/invoke-docling.ps1 .\scan.pdf --to md --output .\docling-output --force-full-page-ocr
```

```powershell
.github/skills/docling-workflows/scripts/invoke-docling.ps1 .\documents\ --from pdf --to md --output .\docling-output
```

## MCP Notes

- Read `references/docling.md` for the official Docling MCP snippet.
- In this workspace, VS Code MCP configuration lives at `%APPDATA%\Code\User\mcp.json`.
- If the user wants Copilot or another MCP-capable agent to call Docling as a tool, add the Docling MCP server there instead of only relying on prompt instructions.

## Output Guidance

- Use Markdown for human review and quick diffing.
- Use JSON when another script or agent needs structured output.
- Keep generated files out of tracked source folders unless the user asks to commit them.
