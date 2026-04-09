# LASC DEV Deployment Script
param(
    [Parameter(Mandatory = $false)]
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

# Deployment Configuration
$DeploymentConfig = @{
    Date = "2026-01-26"
    Branch = "dev_2026.01.26.01"
    SourceBranch = "main"
    Project = "ReleaseManagement"
    Repository = "LACourts"
    Pipeline = "LACourts-Headless-Dev"
    Tickets = @("LAC-219")
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  LA Courts Development Deployment - January 26, 2026  " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN] No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Pre-Deployment Validation
Write-Host "Step 1: Pre-Deployment Validation" -ForegroundColor Green
Write-Host "   Checking prerequisites..." -ForegroundColor Gray

$validationChecks = @(
    @{ Name = "Git installed"; Command = "git --version" },
    @{ Name = "Node.js installed"; Command = "node --version" },
    @{ Name = "Azure CLI installed"; Command = "az --version" }
)

foreach ($check in $validationChecks) {
    try {
        $null = Invoke-Expression $check.Command 2>&1
        Write-Host "   [OK] $($check.Name)" -ForegroundColor Green
    } catch {
        Write-Host "   [MISSING] $($check.Name) - Not found" -ForegroundColor Red
    }
}

# Step 2: Display Deployment Summary
Write-Host ""
Write-Host "Step 2: Deployment Summary" -ForegroundColor Green
Write-Host "   Project:    $($DeploymentConfig.Project)" -ForegroundColor White
Write-Host "   Repository: $($DeploymentConfig.Repository)" -ForegroundColor White
Write-Host "   Branch:     $($DeploymentConfig.Branch)" -ForegroundColor Cyan
Write-Host "   Pipeline:   $($DeploymentConfig.Pipeline)" -ForegroundColor White
Write-Host "   Tickets:    $($DeploymentConfig.Tickets -join ', ')" -ForegroundColor Yellow

# Step 3: Jira Ticket Status
Write-Host ""
Write-Host "Step 3: Jira Tickets" -ForegroundColor Green
Write-Host "   LAC-213: CUSTOM TILES WIDGET" -ForegroundColor White
Write-Host "            Status: Ready to Deploy" -ForegroundColor Green
Write-Host "            Priority: Medium" -ForegroundColor Gray
Write-Host "            Type: Story" -ForegroundColor Gray

# Step 4: Azure DevOps Instructions
Write-Host ""
Write-Host "Step 4: Azure DevOps Operations" -ForegroundColor Green
Write-Host ""
Write-Host "   Manual Steps Required (Azure DevOps Portal):" -ForegroundColor Yellow
Write-Host "   ---------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   A. Create Deployment Branch:" -ForegroundColor Cyan
Write-Host "      1. Navigate to: Azure DevOps > ReleaseManagement > LACourts repo" -ForegroundColor White
Write-Host "      2. Go to: Repos > Branches" -ForegroundColor White
Write-Host "      3. Click: 'New branch'" -ForegroundColor White
Write-Host "      4. Name: $($DeploymentConfig.Branch)" -ForegroundColor Green
Write-Host "      5. Based on: $($DeploymentConfig.SourceBranch)" -ForegroundColor White
Write-Host "      6. Click: Create" -ForegroundColor White
Write-Host ""
Write-Host "   B. Create Pull Request:" -ForegroundColor Cyan
Write-Host "      1. Source: $($DeploymentConfig.SourceBranch)" -ForegroundColor White
Write-Host "      2. Target: $($DeploymentConfig.Branch)" -ForegroundColor White
Write-Host "      3. Title: 'LASC Dev Deployment - Jan 26, 2026 (LAC-213)'" -ForegroundColor Green
Write-Host "      4. Description:" -ForegroundColor White
Write-Host "         - LAC-213: Custom Tiles Widget" -ForegroundColor Gray
Write-Host "      5. Link work items: LAC-213" -ForegroundColor White
Write-Host "      6. Complete PR after review" -ForegroundColor White
Write-Host ""
Write-Host "   C. Run Pipeline:" -ForegroundColor Cyan
Write-Host "      1. Navigate to: Pipelines > $($DeploymentConfig.Pipeline)" -ForegroundColor White
Write-Host "      2. Click: 'Run pipeline'" -ForegroundColor White
Write-Host "      3. Select branch: $($DeploymentConfig.Branch)" -ForegroundColor Green
Write-Host "      4. Review parameters (if any)" -ForegroundColor White
Write-Host "      5. Click: Run" -ForegroundColor White
Write-Host "      6. Monitor execution for errors" -ForegroundColor White

# Step 5: Local Build Verification (Optional)
Write-Host ""
Write-Host "Step 5: Local Build Verification (Optional)" -ForegroundColor Green
Write-Host ""
Write-Host "   To verify build before deployment:" -ForegroundColor Yellow
Write-Host "   ---------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Navigate to project directory:" -ForegroundColor White
Write-Host "      cd C:\Git\LACourt\LACourts\project\main" -ForegroundColor Cyan
Write-Host ""
Write-Host "   2. Install dependencies (if needed):" -ForegroundColor White
Write-Host "      npm install" -ForegroundColor Cyan
Write-Host ""
Write-Host "   3. Build the project:" -ForegroundColor White
Write-Host "      npm run build" -ForegroundColor Cyan
Write-Host ""
Write-Host "   4. Check for errors in output" -ForegroundColor White

# Step 6: Post-Deployment Verification
Write-Host ""
Write-Host "Step 6: Post-Deployment Verification" -ForegroundColor Green
Write-Host ""
Write-Host "   After pipeline completes successfully:" -ForegroundColor Yellow
Write-Host "   ------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Access Dev environment:" -ForegroundColor White
Write-Host "      [Check akumina.config.json for SharepointUrl]" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Verify LAC-213 (Custom Tiles Widget):" -ForegroundColor White
Write-Host "      - Navigate to Widget Manager" -ForegroundColor Gray
Write-Host "      - Confirm Custom Tiles Widget is available" -ForegroundColor Gray
Write-Host "      - Add widget to a test page" -ForegroundColor Gray
Write-Host "      - Verify widget renders correctly with custom tiles" -ForegroundColor Gray
Write-Host "      - Test widget configuration and properties" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Functional Testing:" -ForegroundColor White
Write-Host "      - Test tile click interactions" -ForegroundColor Gray
Write-Host "      - Verify responsive behavior" -ForegroundColor Gray
Write-Host "      - Check styling and layout" -ForegroundColor Gray

# Step 7: Rollback Plan
Write-Host ""
Write-Host "Step 7: Rollback Plan (If Issues Occur)" -ForegroundColor Green
Write-Host ""
Write-Host "   If deployment causes issues:" -ForegroundColor Red
Write-Host "   ---------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Identify the previous stable branch" -ForegroundColor White
Write-Host "   2. Re-run pipeline with previous branch" -ForegroundColor White
Write-Host "   3. Document issues for team review" -ForegroundColor White
Write-Host "   4. Update Jira tickets with findings" -ForegroundColor White

# Summary
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   Next Steps:" -ForegroundColor White
Write-Host "   1. Execute Azure DevOps steps (A, B, C above)" -ForegroundColor Yellow
Write-Host "   2. Monitor pipeline execution" -ForegroundColor Yellow
Write-Host "   3. Perform post-deployment verification" -ForegroundColor Yellow
Write-Host "   4. Update Jira ticket status" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

if (-not $DryRun) {
    Write-Host "Ready to proceed with deployment!" -ForegroundColor Green
} else {
    Write-Host "[DRY RUN COMPLETE] Review steps above" -ForegroundColor Yellow
}
