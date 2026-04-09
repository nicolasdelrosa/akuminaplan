# Jira CLI Setup Script
# Run this to configure Jira CLI for the first time

param(
    [string]$Email,
    [string]$ApiToken
)

$configDir = "$env:USERPROFILE\.jira-cli"
$configFile = Join-Path $configDir "config.json"

# Create directory if it doesn't exist
if (-not (Test-Path $configDir)) {
    Write-Host "Creating Jira CLI config directory..." -ForegroundColor Cyan
    New-Item -Path $configDir -ItemType Directory -Force | Out-Null
}

# Interactive mode if parameters not provided
if (-not $Email) {
    $Email = Read-Host "Enter your Akumina email"
}

if (-not $ApiToken) {
    Write-Host "`nTo get an API token:"
    Write-Host "1. Go to https://id.atlassian.com/manage-profile/security/api-tokens"
    Write-Host "2. Click 'Create API token'"
    Write-Host "3. Copy the token`n"
    $ApiToken = Read-Host "Enter your Jira API token" -AsSecureString
    $ApiToken = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($ApiToken))
}

# Create config (note: use 'url' field, not 'host' - critical for this jira-cli package)
$config = @{
    url = "https://akumina.atlassian.net/"
    user = $Email
    password = $ApiToken
    strictSSL = $true
} | ConvertTo-Json

# Write config file
$config | Out-File -FilePath $configFile -Encoding utf8 -Force

Write-Host "`n✅ Jira CLI configured successfully!" -ForegroundColor Green
Write-Host "Config file: $configFile`n"

# Test connection
Write-Host "Testing connection..." -ForegroundColor Cyan
$testResult = jira ls 2>&1 | Select-Object -First 5
if ($LASTEXITCODE -ne 0 -and $testResult -match "connection error") {
    Write-Host $testResult -ForegroundColor Yellow
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Connection successful! You can now use Jira CLI." -ForegroundColor Green
} else {
    Write-Host "`n❌ Connection failed. Please check your credentials." -ForegroundColor Red
}
