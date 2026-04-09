# Docling Reference

Use this file only when the task needs Docling-specific commands or MCP setup details.

## Official Sources

- Documentation home: https://docling-project.github.io/docling/
- GitHub repository: https://github.com/docling-project/docling
- MCP server docs: https://docling-project.github.io/docling/usage/mcp/

## Current Fit

- Docling supports multiple formats including PDF, DOCX, PPTX, XLSX, HTML, images, audio, LaTeX, and plain text.
- It can export to Markdown, HTML, DocTags, and lossless JSON.
- It has local execution support, which is useful for sensitive documents.
- It exposes an MCP server for agent integrations.

## CLI Notes

The project README shows a direct CLI invocation:

```text
docling https://arxiv.org/pdf/2206.01062
```

Batch and OCR examples commonly use patterns like:

```text
docling ./documents/ --from pdf --to md --output ./docling-output
docling ./scan.pdf --to md --output ./docling-output --force-full-page-ocr
```

If the local CLI differs, run `docling --help` and adapt before proceeding.

## MCP Server Snippet

The Docling docs show this MCP configuration pattern:

```json
{
  "mcpServers": {
    "docling": {
      "command": "uvx",
      "args": [
        "--from=docling-mcp",
        "docling-mcp-server"
      ]
    }
  }
}
```

For this workspace, place that block in `%APPDATA%\Code\User\mcp.json` if you want VS Code or Copilot to call Docling through MCP.
