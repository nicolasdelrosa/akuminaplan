# Check MCP Authentication Status
# This script checks the status of MCP server configurations

param(
    [switch]$Verbose
)

$mcpConfigPath = "$env:APPDATA\Code\User\mcp.json"

Write-Host "`n=== MCP Authentication Status ===" -ForegroundColor Cyan

if (-not (Test-Path $mcpConfigPath)) {
    Write-Host "✗ MCP configuration not found at: $mcpConfigPath" -ForegroundColor Red
    exit 1
}

# Read MCP configuration
try {
    $mcpConfig = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json
    $servers = $mcpConfig.servers
    
    Write-Host "`nConfigured MCP Servers:" -ForegroundColor White
    
    foreach ($serverKey in $servers.PSObject.Properties.Name) {
        $server = $servers.$serverKey
        $type = $server.type
        
        Write-Host "`n  $serverKey" -ForegroundColor Yellow
        Write-Host "    Type: $type" -ForegroundColor Gray
        
        # Check Atlassian
        if ($serverKey -like "*atlassian*") {
            if ($server.env.ATLASSIAN_API_TOKEN) {
                $tokenPreview = $server.env.ATLASSIAN_API_TOKEN.Substring(0, [Math]::Min(20, $server.env.ATLASSIAN_API_TOKEN.Length)) + "..."
                Write-Host "    Token: $tokenPreview" -ForegroundColor Gray
                Write-Host "    Domain: $($server.env.ATLASSIAN_DOMAIN)" -ForegroundColor Gray
                Write-Host "    Email: $($server.env.ATLASSIAN_EMAIL)" -ForegroundColor Gray
                Write-Host "    Status: ✓ Configured" -ForegroundColor Green
            }
            else {
                Write-Host "    Status: ✗ Token missing" -ForegroundColor Red
            }
        }
        
        # Check Azure DevOps
        if ($serverKey -like "*azure*") {
            Write-Host "    Status: ✓ Configured" -ForegroundColor Green
            if ($Verbose -and $server.args) {
                Write-Host "    Args: $($server.args -join ', ')" -ForegroundColor Gray
            }
        }
        
        # Check Playwright
        if ($serverKey -like "*playwright*") {
            Write-Host "    Status: ✓ Configured" -ForegroundColor Green
            if ($Verbose -and $server.args) {
                Write-Host "    Args: $($server.args -join ', ')" -ForegroundColor Gray
            }
        }
    }
    
    Write-Host "`n=== Quick Actions ===" -ForegroundColor Cyan
    Write-Host "  Reload VS Code: Ctrl+Shift+P → 'Reload Window'" -ForegroundColor White
    Write-Host "  Run reload script: .\scripts\reload-vscode.ps1" -ForegroundColor White
    Write-Host "  Update Atlassian token: https://id.atlassian.com/manage-profile/security/api-tokens" -ForegroundColor White
    
}
catch {
    Write-Host "✗ Error reading MCP configuration: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
