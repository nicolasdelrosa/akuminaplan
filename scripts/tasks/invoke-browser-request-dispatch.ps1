param(
    [string]$TicketFile,
    [switch]$Watch,
    [switch]$Claim = $true,
    [switch]$Force,
    [int]$PollSeconds = 5,
    [int]$ResponseTimeoutMinutes = 2
)

$ErrorActionPreference = 'Stop'

$workspaceRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$watcherScript = Join-Path $workspaceRoot 'scripts\tasks\browser-request-watcher.js'
$dispatcherScript = Join-Path $workspaceRoot 'tools\browser-request-automation\send-to-copilot.ahk'
$toastScript = Join-Path $workspaceRoot 'scripts\tasks\show-browser-request-toast.ps1'
$requestOutputDir = Join-Path $workspaceRoot 'AkuminaTasks\.browser-requests'
$statePath = Join-Path $requestOutputDir 'dispatch-state.json'
$logPath = Join-Path $requestOutputDir 'dispatch.log'

function Write-DispatchLog([string]$Level, [string]$Message) {
    Ensure-Directory $requestOutputDir
    $timestamp = Get-Date -Format 'yyyy-MM-ddTHH:mm:ssK'
    $line = "[{0}] [{1}] {2}" -f $timestamp, $Level.ToUpperInvariant(), $Message
    Add-Content -Path $logPath -Value $line
    if ($Level -eq 'error') {
        Write-Error $Message
        return
    }
    if ($Level -eq 'warn') {
        Write-Warning $Message
        return
    }
    Write-Host $line
}

function Get-AutoHotkeyCommand {
    $candidates = @(
        'AutoHotkey64.exe',
        'AutoHotkey.exe',
        'C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe',
        'C:\Program Files\AutoHotkey\v2\AutoHotkey.exe'
    )

    foreach ($candidate in $candidates) {
        $command = Get-Command $candidate -ErrorAction SilentlyContinue
        if ($command) {
            return $command.Source
        }
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    return $null
}

function Ensure-Directory([string]$PathValue) {
    if (-not (Test-Path $PathValue)) {
        New-Item -ItemType Directory -Path $PathValue | Out-Null
    }
}

function Read-DispatchState {
    if (-not (Test-Path $statePath)) {
        return @{}
    }

    try {
        return Get-Content $statePath -Raw | ConvertFrom-Json -AsHashtable
    }
    catch {
        return @{}
    }
}

function Read-JsonHashtable([string]$PathValue) {
    if (-not (Test-Path $PathValue)) {
        return @{}
    }

    try {
        return Get-Content $PathValue -Raw | ConvertFrom-Json -AsHashtable
    }
    catch {
        return @{}
    }
}

function Write-DispatchState([hashtable]$State) {
    Ensure-Directory $requestOutputDir
    $json = $State | ConvertTo-Json -Depth 5
    Set-Content -Path $statePath -Value $json
}

function Invoke-Watcher([string]$Mode, [string]$FilePath) {
    $arguments = @($watcherScript, $Mode)
    if ($FilePath) {
        $arguments += $FilePath
    }
    if ($Claim) {
        $arguments += '--claim'
    }
    if ($Force) {
        $arguments += '--force'
    }

    $result = & node @arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw ($result -join [Environment]::NewLine)
    }
    Write-DispatchLog -Level 'info' -Message ("watcher {0}{1}" -f $Mode, $(if ($FilePath) { " for $FilePath" } else { '' }))
    return ($result -join [Environment]::NewLine)
}

function Get-GeneratedPrompts([string]$WatcherOutput) {
    $lines = $WatcherOutput -split "\r?\n"
    $prompts = @()
    foreach ($line in $lines) {
        if ($line -match '^\[(?<ticket>[^\]]+)\] prompt: (?<path>.+)$') {
            $prompts += [pscustomobject]@{
                TicketKey = $matches.ticket
                PromptPath = $matches.path.Trim()
            }
        }
    }
    return $prompts
}

function Get-CompletedTickets([string]$WatcherOutput) {
    $lines = $WatcherOutput -split "\r?\n"
    $completed = @()
    $current = $null
    foreach ($line in $lines) {
        if ($line -match '^\[(?<ticket>[^\]]+)\] completed: (?<path>.+)$') {
            if ($current) {
                $completed += $current
            }
            $current = [ordered]@{
                TicketKey = $matches.ticket
                FilePath = $matches.path.Trim()
                Summary = ''
                Status = ''
            }
            continue
        }
        if (-not $current) {
            continue
        }
        if ($line -match '^\[(?<ticket>[^\]]+)\] summary: (?<summary>.*)$') {
            $current.Summary = $matches.summary.Trim()
            continue
        }
        if ($line -match '^\[(?<ticket>[^\]]+)\] status: (?<status>.*)$') {
            $current.Status = $matches.status.Trim()
            continue
        }
    }
    if ($current) {
        $completed += $current
    }
    return $completed
}

function Show-CompletionToast([string]$TicketKey, [string]$Summary, [string]$FilePath) {
    if (-not (Test-Path $toastScript)) {
        Write-DispatchLog -Level 'warn' -Message ("toast helper not found: {0}" -f $toastScript)
        return
    }

    $message = if ($Summary) {
        "{0}`n{1}" -f $Summary, $FilePath
    } else {
        $FilePath
    }

    & powershell -ExecutionPolicy Bypass -File $toastScript -Title ("Browser Findings Complete: {0}" -f $TicketKey) -Message $message | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-DispatchLog -Level 'warn' -Message ("toast helper failed for {0}" -f $TicketKey)
        return
    }

    Write-DispatchLog -Level 'info' -Message ("toast shown for completed ticket {0}" -f $TicketKey)
}

function Show-NoResponseToast([string]$TicketKey, [string]$FilePath, [int]$TimeoutMinutes) {
    if (-not (Test-Path $toastScript)) {
        Write-DispatchLog -Level 'warn' -Message ("toast helper not found: {0}" -f $toastScript)
        return
    }

    $message = "No completed Browser Findings detected after {0} minute(s).`n{1}" -f $TimeoutMinutes, $FilePath

    & powershell -ExecutionPolicy Bypass -File $toastScript -Title ("No Ren response yet: {0}" -f $TicketKey) -Message $message | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-DispatchLog -Level 'warn' -Message ("timeout toast helper failed for {0}" -f $TicketKey)
        return
    }

    Write-DispatchLog -Level 'warn' -Message ("timeout toast shown for {0}" -f $TicketKey)
}

function Dispatch-Prompt([string]$AutoHotkeyExe, [string]$PromptPath) {
    if (-not (Test-Path $dispatcherScript)) {
        throw "Dispatcher script not found: $dispatcherScript"
    }
    if (-not (Test-Path $PromptPath)) {
        throw "Prompt file not found: $PromptPath"
    }

    $dispatcherOutput = & $AutoHotkeyExe $dispatcherScript $PromptPath 2>&1
    if ($LASTEXITCODE -ne 0) {
        $details = ($dispatcherOutput -join [Environment]::NewLine).Trim()
        if (-not $details) {
            $details = 'No dispatcher output was returned.'
        }
        throw "AutoHotkey dispatcher failed for $PromptPath`n$details"
    }
    if ($dispatcherOutput) {
        Write-DispatchLog -Level 'info' -Message (($dispatcherOutput -join ' ').Trim())
    }
}

function Process-Output([string]$WatcherOutput, [string]$AutoHotkeyExe) {
    $state = Read-DispatchState
    $prompts = Get-GeneratedPrompts $WatcherOutput

    foreach ($prompt in $prompts) {
        $fingerprint = "{0}|{1}" -f $prompt.TicketKey, $prompt.PromptPath
        if ($state.ContainsKey($prompt.TicketKey) -and $state[$prompt.TicketKey].requestFingerprint -eq $fingerprint) {
            Write-DispatchLog -Level 'info' -Message ("skipping already dispatched request for {0}" -f $prompt.TicketKey)
            continue
        }

        Write-DispatchLog -Level 'info' -Message ("dispatching {0} from {1}" -f $prompt.TicketKey, $prompt.PromptPath)
        Dispatch-Prompt -AutoHotkeyExe $AutoHotkeyExe -PromptPath $prompt.PromptPath
        $state[$prompt.TicketKey] = @{
            requestFingerprint = $fingerprint
            lastDispatchedAt = (Get-Date).ToString('o')
            promptPath = $prompt.PromptPath
        }
        Write-DispatchState $state
        Write-DispatchLog -Level 'info' -Message ("sent {0} using {1}" -f $prompt.TicketKey, $prompt.PromptPath)
    }
}

function Process-Completions([string]$WatcherOutput) {
    $completedTickets = Get-CompletedTickets $WatcherOutput
    foreach ($ticket in $completedTickets) {
        Write-DispatchLog -Level 'info' -Message ("completion detected for {0}" -f $ticket.TicketKey)
        Show-CompletionToast -TicketKey $ticket.TicketKey -Summary $ticket.Summary -FilePath $ticket.FilePath
    }
}

function Check-PendingResponses([hashtable]$DispatchState) {
    $completionPath = Join-Path $requestOutputDir 'completion-state.json'
    $completionState = Read-JsonHashtable $completionPath
    $now = Get-Date
    $stateChanged = $false

    foreach ($ticketKey in @($DispatchState.Keys)) {
        $entry = $DispatchState[$ticketKey]
        if (-not $entry -or -not $entry.lastDispatchedAt -or -not $entry.promptPath) {
            continue
        }

        if ($completionState.ContainsKey($ticketKey)) {
            if ($entry.ContainsKey('warningSentAt')) {
                $entry.Remove('warningSentAt') | Out-Null
                $stateChanged = $true
            }
            continue
        }

        try {
            $lastDispatchedAt = [DateTimeOffset]::Parse($entry.lastDispatchedAt)
        }
        catch {
            Write-DispatchLog -Level 'warn' -Message ("invalid dispatch timestamp for {0}" -f $ticketKey)
            continue
        }

        $elapsedMinutes = ($now - $lastDispatchedAt.LocalDateTime).TotalMinutes
        if ($elapsedMinutes -lt $ResponseTimeoutMinutes) {
            continue
        }

        if ($entry.ContainsKey('warningSentAt')) {
            continue
        }

        $filePath = if ($entry.promptPath -match "\\([^\\]+)\.prompt\.txt$") {
            Join-Path $workspaceRoot ("AkuminaTasks\{0}.md" -f $matches[1])
        } else {
            Join-Path $workspaceRoot ("AkuminaTasks\{0}.md" -f $ticketKey)
        }

        Show-NoResponseToast -TicketKey $ticketKey -FilePath $filePath -TimeoutMinutes $ResponseTimeoutMinutes
        $entry.warningSentAt = (Get-Date).ToString('o')
        $stateChanged = $true
    }

    if ($stateChanged) {
        Write-DispatchState $DispatchState
    }
}

$autoHotkeyExe = Get-AutoHotkeyCommand
if (-not $autoHotkeyExe) {
    throw 'AutoHotkey v2 is not installed. Install AutoHotkey, then rerun this dispatcher.'
}

Write-DispatchLog -Level 'info' -Message ("using AutoHotkey executable: {0}" -f $autoHotkeyExe)

if (-not (Test-Path $dispatcherScript)) {
    throw "Expected dispatcher script not found: $dispatcherScript"
}

if ($Watch) {
    Write-DispatchLog -Level 'info' -Message ("watching AkuminaTasks for pending Browser Requests. Poll: {0} seconds. Timeout: {1} minutes" -f $PollSeconds, $ResponseTimeoutMinutes)
    while ($true) {
        try {
            $output = Invoke-Watcher -Mode 'scan' -FilePath ''
            if ($output -notmatch 'No new pending Browser Requests found\.') {
                Process-Output -WatcherOutput $output -AutoHotkeyExe $autoHotkeyExe
            } else {
                Write-DispatchLog -Level 'info' -Message 'no new pending Browser Requests found'
            }

            $completionOutput = Invoke-Watcher -Mode 'completion-scan' -FilePath ''
            if ($completionOutput -notmatch 'No new completed Browser Findings found\.') {
                Process-Completions -WatcherOutput $completionOutput
            }

            $currentDispatchState = Read-DispatchState
            Check-PendingResponses -DispatchState $currentDispatchState
        }
        catch {
            Write-DispatchLog -Level 'warn' -Message $_
        }

        Start-Sleep -Seconds $PollSeconds
    }
}

if (-not $TicketFile) {
    throw 'Provide -TicketFile <path> or use -Watch.'
}

$singleOutput = Invoke-Watcher -Mode 'file' -FilePath $TicketFile
Process-Output -WatcherOutput $singleOutput -AutoHotkeyExe $autoHotkeyExe
