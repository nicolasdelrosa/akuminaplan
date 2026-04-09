$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$acliPath = Join-Path $workspaceRoot "tools\acli\acli.exe"

if (-not (Test-Path $acliPath)) {
    Write-Error "Atlassian CLI not found at $acliPath. Run .\scripts\setup-atlassian-cli.ps1 first."
}

& $acliPath @Args
exit $LASTEXITCODE
