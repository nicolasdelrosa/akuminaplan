$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$acliPath = Join-Path $workspaceRoot "tools\acli\acli.exe"

if (-not (Test-Path $acliPath)) {
    Write-Error "Atlassian CLI not found at $acliPath. Install it in this workspace first."
}

& $acliPath auth login
exit $LASTEXITCODE
