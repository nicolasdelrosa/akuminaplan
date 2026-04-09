# Reload VS Code Window
# This script triggers a VS Code window reload to refresh MCP server connections

Write-Host "Reloading VS Code window..." -ForegroundColor Cyan

# Method 1: Use VS Code CLI if available
if (Get-Command code -ErrorAction SilentlyContinue) {
    code --command workbench.action.reloadWindow
    Write-Host "✓ Reload command sent via VS Code CLI" -ForegroundColor Green
}
else {
    # Method 2: Instructions for manual reload
    Write-Host "`nVS Code CLI not found. Please reload manually:" -ForegroundColor Yellow
    Write-Host "  1. Press Ctrl+Shift+P" -ForegroundColor White
    Write-Host "  2. Type 'Reload Window'" -ForegroundColor White
    Write-Host "  3. Select 'Developer: Reload Window'" -ForegroundColor White
    Write-Host "`nOr use keyboard shortcut: Ctrl+R" -ForegroundColor Cyan
}

# Note: This will restart all MCP servers and refresh authentication
Write-Host "`nNote: This will refresh all MCP server connections" -ForegroundColor Gray
