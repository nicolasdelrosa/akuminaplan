param(
    [switch]$SkipStatusCheck
)

$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$acliPath = Join-Path $workspaceRoot "tools\acli\acli.exe"
$mcpConfigPath = Join-Path $env:APPDATA "Code\User\mcp.json"
$serverKey = "atlassian/atlassian-mcp-server"

if (-not (Test-Path $acliPath)) {
    Write-Error "Atlassian CLI not found at $acliPath. Install it in this workspace first."
}

if (-not (Test-Path $mcpConfigPath)) {
    Write-Error "VS Code MCP config was not found at $mcpConfigPath."
}

$mcpConfig = Get-Content -Path $mcpConfigPath -Raw | ConvertFrom-Json
$server = $mcpConfig.servers.$serverKey

if (-not $server) {
    Write-Error "MCP server '$serverKey' was not found in $mcpConfigPath."
}

$domain = $server.env.ATLASSIAN_DOMAIN
$email = $server.env.ATLASSIAN_EMAIL
$token = $server.env.ATLASSIAN_API_TOKEN

if ([string]::IsNullOrWhiteSpace($domain) -or [string]::IsNullOrWhiteSpace($email) -or [string]::IsNullOrWhiteSpace($token)) {
    Write-Error "Atlassian MCP credentials are incomplete in $mcpConfigPath."
}

Write-Host ""
Write-Host "Using Atlassian MCP credentials from VS Code:" -ForegroundColor Cyan
Write-Host "  Site:  $domain" -ForegroundColor Gray
Write-Host "  Email: $email" -ForegroundColor Gray
Write-Host ""

$token | & $acliPath jira auth login --site $domain --email $email --token
if ($LASTEXITCODE -ne 0) {
    Write-Error "Jira authentication failed."
}

$token | & $acliPath confluence auth login --site $domain --email $email --token
if ($LASTEXITCODE -ne 0) {
    Write-Error "Confluence authentication failed."
}

Write-Host ""
Write-Host "Atlassian CLI authentication complete." -ForegroundColor Green

if (-not $SkipStatusCheck) {
    Write-Host ""
    & $acliPath jira auth status
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Jira auth status check failed."
    }

    Write-Host ""
    & $acliPath confluence auth status
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Confluence auth status check failed."
    }
}
