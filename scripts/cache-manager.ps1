#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Caching utility for deployment data
.DESCRIPTION
    Reduces redundant API calls by caching:
    - Last deployment info per client
    - Jira ticket details (with expiration)
    - Branch naming patterns
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Get", "Set", "Clear", "Stats")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [string]$Key,
    
    [Parameter(Mandatory=$false)]
    [object]$Value,
    
    [Parameter(Mandatory=$false)]
    [int]$TTLMinutes = 60,
    
    [Parameter(Mandatory=$false)]
    [string]$CacheDir = "$PSScriptRoot\..\cache"
)

$ErrorActionPreference = "Stop"

# Ensure cache directory exists
if (-not (Test-Path $CacheDir)) {
    New-Item -ItemType Directory -Path $CacheDir -Force | Out-Null
}

function Get-CachedItem {
    param([string]$Key)
    
    $cacheFile = Join-Path $CacheDir "$Key.json"
    if (-not (Test-Path $cacheFile)) {
        return $null
    }
    
    $cached = Get-Content $cacheFile -Raw | ConvertFrom-Json
    $age = (Get-Date) - [DateTime]$cached.Timestamp
    
    if ($age.TotalMinutes -gt $cached.TTL) {
        Write-Host "⚠️  Cache expired for $Key (age: $([int]$age.TotalMinutes) min)" -ForegroundColor Yellow
        return $null
    }
    
    Write-Host "✅ Cache hit for $Key (age: $([int]$age.TotalMinutes) min)" -ForegroundColor Green
    return $cached.Data
}

function Set-CachedItem {
    param(
        [string]$Key,
        [object]$Value,
        [int]$TTL
    )
    
    $cacheFile = Join-Path $CacheDir "$Key.json"
    $cacheData = @{
        Timestamp = (Get-Date).ToString("o")
        TTL = $TTL
        Data = $Value
    }
    
    $cacheData | ConvertTo-Json -Depth 10 | Set-Content $cacheFile
    Write-Host "💾 Cached $Key (TTL: $TTL min)" -ForegroundColor Cyan
}

function Clear-Cache {
    Get-ChildItem $CacheDir -Filter "*.json" | Remove-Item -Force
    Write-Host "🗑️  Cache cleared" -ForegroundColor Green
}

function Get-CacheStats {
    $files = Get-ChildItem $CacheDir -Filter "*.json"
    
    Write-Host "`n📊 Cache Statistics:" -ForegroundColor Cyan
    Write-Host "   Location: $CacheDir" -ForegroundColor Gray
    Write-Host "   Total entries: $($files.Count)" -ForegroundColor Gray
    
    if ($files.Count -gt 0) {
        $totalSize = ($files | Measure-Object -Property Length -Sum).Sum
        Write-Host "   Total size: $([Math]::Round($totalSize / 1KB, 2)) KB" -ForegroundColor Gray
        
        Write-Host "`n   Entries:" -ForegroundColor Gray
        foreach ($file in $files) {
            $cached = Get-Content $file.FullName -Raw | ConvertFrom-Json
            $age = (Get-Date) - [DateTime]$cached.Timestamp
            $status = if ($age.TotalMinutes -gt $cached.TTL) { "EXPIRED" } else { "VALID" }
            $color = if ($status -eq "VALID") { "Green" } else { "Red" }
            
            Write-Host "   - $($file.BaseName): $status (age: $([int]$age.TotalMinutes) min)" -ForegroundColor $color
        }
    }
}

# Execute action
switch ($Action) {
    "Get" {
        $result = Get-CachedItem -Key $Key
        if ($result) {
            $result | ConvertTo-Json -Depth 10
        }
    }
    "Set" {
        Set-CachedItem -Key $Key -Value $Value -TTL $TTLMinutes
    }
    "Clear" {
        Clear-Cache
    }
    "Stats" {
        Get-CacheStats
    }
}
