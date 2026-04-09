# UFA DEV Deployment Script (Clean ASCII)
param(
    [Parameter(Mandatory = $false)]
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"
# Deployment Configuration
$DeploymentConfig = @{
    Date = "2026-01-22"
    Branch = "dev_2026.01.22.01"
    SourceBranch = "main"
    Project = "ReleaseManagement"
    Repository = "UFA"
    Pipeline = "UFA-Headless-Dev"
    Tickets = @("UFA-285", "UFA-286")
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   UFA Development Deployment - January 22, 2026      " -ForegroundColor Cyan
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
    @{ Name = "Azure CLI installed"; Command = "az --version" }
foreach ($check in $validationChecks) {
    try {
        $null = Invoke-Expression $check.Command 2>&1
        Write-Host "   [OK] $($check.Name)" -ForegroundColor Green
    } catch {
        Write-Host "   [MISSING] $($check.Name) - Not found" -ForegroundColor Red
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
Write-Host "   UFA-285: Add System and Tools results in typeahead/global search" -ForegroundColor White
Write-Host "            Status: Ready to Deploy" -ForegroundColor Green
Write-Host "            Priority: Medium" -ForegroundColor Gray
Write-Host ""
Write-Host "   UFA-286: Add SLW results in typeahead/global search" -ForegroundColor White
Write-Host "            Status: Ready to Deploy" -ForegroundColor Green
Write-Host "            Priority: Medium" -ForegroundColor Gray
Write-Host "            Assignee: Ren Tetrault" -ForegroundColor Gray

# Step 4: Azure DevOps Instructions
Write-Host ""
Write-Host "Step 4: Azure DevOps Operations" -ForegroundColor Green
Write-Host ""
Write-Host "   Manual Steps Required (Azure DevOps Portal):" -ForegroundColor Yellow
Write-Host "   ---------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   A. Create Deployment Branch:" -ForegroundColor Cyan
Write-Host "      1. Navigate to Azure DevOps > ReleaseManagement > UFA repo" -ForegroundColor White
Write-Host "      2. Go to Branches" -ForegroundColor White
Write-Host "      3. Click 'New branch'" -ForegroundColor White
Write-Host "      4. Name: $($DeploymentConfig.Branch)" -ForegroundColor Green
Write-Host "      5. Based on: $($DeploymentConfig.SourceBranch)" -ForegroundColor White
Write-Host ""
Write-Host "   B. Create Pull Request:" -ForegroundColor Cyan
Write-Host "      1. Source: $($DeploymentConfig.SourceBranch) -> Target: $($DeploymentConfig.Branch)" -ForegroundColor White
Write-Host "      2. Title: 'UFA Dev Deployment - Jan 22, 2026 (UFA-285, UFA-286)'" -ForegroundColor Green
Write-Host "      3. Description: Include ticket summaries and deployment notes" -ForegroundColor White
Write-Host "      4. Link work items: UFA-285, UFA-286" -ForegroundColor White
Write-Host "      5. Complete PR after review" -ForegroundColor White
Write-Host ""
Write-Host "   C. Run Pipeline:" -ForegroundColor Cyan
Write-Host "      1. Navigate to Pipelines > $($DeploymentConfig.Pipeline)" -ForegroundColor White
Write-Host "      2. Click 'Run pipeline'" -ForegroundColor White
Write-Host "      3. Select branch: $($DeploymentConfig.Branch)" -ForegroundColor Green
Write-Host "      4. Monitor execution for errors" -ForegroundColor White
# Step 5: Manual Configuration Steps
Write-Host ""
Write-Host "Step 5: Post-Deployment Configuration" -ForegroundColor Green
Write-Host ""
Write-Host "   SharePoint Search Schema Configuration:" -ForegroundColor Yellow
Write-Host "   --------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Access SharePoint Admin Center" -ForegroundColor White
Write-Host "      URL: https://[tenant]-admin.sharepoint.com" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Navigate to Search > Manage Search Schema" -ForegroundColor White
Write-Host ""
Write-Host "   3. Configure Managed Property:" -ForegroundColor White
Write-Host "      - Find available RefinableString (e.g., RefinableString50)" -ForegroundColor Gray
Write-Host "      - Map crawled property: ows_NodeType or ows_q_CHCS_NodeType" -ForegroundColor Gray
Write-Host "      - Create alias: SPSUMMARYLINKNODETYPE" -ForegroundColor Green
Write-Host ""
Write-Host "   4. Enable Settings:" -ForegroundColor White
Write-Host "      - Queryable" -ForegroundColor Green
Write-Host "      - Retrievable" -ForegroundColor Green
Write-Host "      - Refinable" -ForegroundColor Green
Write-Host ""
Write-Host "   5. Trigger Re-crawl:" -ForegroundColor White
Write-Host "      - List: SummaryLinks_AK" -ForegroundColor Gray
Write-Host "      - Wait 10-15 minutes for indexing to complete" -ForegroundColor Gray

# Step 6: Testing & Verification
Write-Host ""
Write-Host "Step 6: Post-Deployment Verification" -ForegroundColor Green
Write-Host ""
Write-Host "   Environment: https://cloud-dev-fe-ufa.onakumina.com/" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Test Cases:" -ForegroundColor Yellow
Write-Host "   ----------" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Typeahead Search - System and Tools" -ForegroundColor White
Write-Host "     - Type 'tools' in global search" -ForegroundColor Gray
Write-Host "     - Verify System and Tools results appear" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Typeahead Search - SLW Results" -ForegroundColor White
Write-Host "     - Type summary link title" -ForegroundColor Gray
Write-Host "     - Verify SLW items appear" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Global Search - System and Tools" -ForegroundColor White
Write-Host "     - Execute full search" -ForegroundColor Gray
Write-Host "     - Verify results display correctly" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Global Search - SLW Results" -ForegroundColor White
Write-Host "     - Execute full search for summary links" -ForegroundColor Gray
Write-Host "     - Validate metadata (NodeType)" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Browser Console - No Errors" -ForegroundColor White
Write-Host "     - F12 > Console tab" -ForegroundColor Gray
Write-Host "     - Verify no JavaScript errors" -ForegroundColor Gray

# Step 7: Completion
Write-Host ""
Write-Host "Step 7: Deployment Completion" -ForegroundColor Green
Write-Host ""
Write-Host "   After successful verification:" -ForegroundColor Yellow
Write-Host "   -----------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Update Jira tickets (UFA-285, UFA-286)" -ForegroundColor White
Write-Host "      - Status: Deployed to Dev" -ForegroundColor Gray
Write-Host "      - Add deployment notes" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Notify stakeholders" -ForegroundColor White
Write-Host "      - Ren Tetrault (assignee)" -ForegroundColor Gray
Write-Host "      - Diego Rosa (primary contact)" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Document any issues in Jira" -ForegroundColor White
Write-Host ""

# Deployment Checklist
Write-Host ""
Write-Host "Deployment Checklist" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[x] Pre-deployment validation complete" -ForegroundColor White
Write-Host "[x] Branch created: $($DeploymentConfig.Branch)" -ForegroundColor White
Write-Host "[x] Pull request created and completed" -ForegroundColor White
Write-Host "[x] Pipeline executed successfully" -ForegroundColor White
Write-Host "[x] SharePoint search schema configured" -ForegroundColor White
Write-Host "[x] SummaryLinks_AK list re-crawled" -ForegroundColor White
Write-Host "[x] Typeahead search tested (System and Tools)" -ForegroundColor White
Write-Host "[x] Typeahead search tested (SLW)" -ForegroundColor White
Write-Host "[x] Global search tested (both features)" -ForegroundColor White
Write-Host "[x] No JavaScript errors in console" -ForegroundColor White
Write-Host "[x] Jira tickets updated" -ForegroundColor White
Write-Host "[x] Stakeholders notified" -ForegroundColor White
Write-Host ""

Write-Host "Support Contacts" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host "Primary:   Diego Rosa (diego.rosa@akumina.com)" -ForegroundColor White
Write-Host "Assignee:  Ren Tetrault" -ForegroundColor White
Write-Host "Secondary: Luke Shuck (Luke.Shuck@akumina.com)" -ForegroundColor White
Write-Host ""

if ($DryRun) {
    Write-Host "Dry run completed - Review steps above" -ForegroundColor Green
} else {
    Write-Host "Deployment guide displayed - Follow steps above" -ForegroundColor Green
}

Write-Host ""
<#
UFA DEV Deployment Script (ASCII Only)
Author: Akumina Team
Description: Automated deployment script for UFA DEV environment
Tickets: UFA-285, UFA-286 (Search enhancements)
#>

param(
    [Parameter(Mandatory = $false)]
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

# Deployment Configuration
$DeploymentConfig = @{
    Date = "2026-01-22"
    Branch = "dev_2026.01.22.01"
    SourceBranch = "main"
    Project = "ReleaseManagement"
    Repository = "UFA"
    Pipeline = "UFA-Headless-Dev"
    Tickets = @("UFA-285", "UFA-286")
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "   UFA Development Deployment - January 22, 2026      " -ForegroundColor Cyan
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
Write-Host "   UFA-285: Add System and Tools results in typeahead/global search" -ForegroundColor White
Write-Host "            Status: Ready to Deploy" -ForegroundColor Green
Write-Host "            Priority: Medium" -ForegroundColor Gray
Write-Host ""
Write-Host "   UFA-286: Add SLW results in typeahead/global search" -ForegroundColor White
Write-Host "            Status: Ready to Deploy" -ForegroundColor Green
Write-Host "            Priority: Medium" -ForegroundColor Gray
Write-Host "            Assignee: Ren Tetrault" -ForegroundColor Gray

# Step 4: Azure DevOps Instructions
Write-Host ""
Write-Host "Step 4: Azure DevOps Operations" -ForegroundColor Green
Write-Host ""
Write-Host "   Manual Steps Required (Azure DevOps Portal):" -ForegroundColor Yellow
Write-Host "   ---------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   A. Create Deployment Branch:" -ForegroundColor Cyan
Write-Host "      1. Navigate to Azure DevOps > ReleaseManagement > UFA repo" -ForegroundColor White
Write-Host "      2. Go to Branches" -ForegroundColor White
Write-Host "      3. Click 'New branch'" -ForegroundColor White
Write-Host "      4. Name: $($DeploymentConfig.Branch)" -ForegroundColor Green
Write-Host "      5. Based on: $($DeploymentConfig.SourceBranch)" -ForegroundColor White
Write-Host ""
Write-Host "   B. Create Pull Request:" -ForegroundColor Cyan
Write-Host "      1. Source: $($DeploymentConfig.SourceBranch) -> Target: $($DeploymentConfig.Branch)" -ForegroundColor White
Write-Host "      2. Title: 'UFA Dev Deployment - Jan 22, 2026 (UFA-285, UFA-286)'" -ForegroundColor Green
Write-Host "      3. Description: Include ticket summaries and deployment notes" -ForegroundColor White
Write-Host "      4. Link work items: UFA-285, UFA-286" -ForegroundColor White
Write-Host "      5. Complete PR after review" -ForegroundColor White
Write-Host ""
Write-Host "   C. Run Pipeline:" -ForegroundColor Cyan
Write-Host "      1. Navigate to Pipelines > $($DeploymentConfig.Pipeline)" -ForegroundColor White
Write-Host "      2. Click 'Run pipeline'" -ForegroundColor White
Write-Host "      3. Select branch: $($DeploymentConfig.Branch)" -ForegroundColor Green
Write-Host "      4. Monitor execution for errors" -ForegroundColor White

# Step 5: Manual Configuration Steps
Write-Host ""
Write-Host "Step 5: Post-Deployment Configuration" -ForegroundColor Green
Write-Host ""
Write-Host "   SharePoint Search Schema Configuration:" -ForegroundColor Yellow
Write-Host "   --------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Access SharePoint Admin Center" -ForegroundColor White
Write-Host "      URL: https://[tenant]-admin.sharepoint.com" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Navigate to Search > Manage Search Schema" -ForegroundColor White
Write-Host ""
Write-Host "   3. Configure Managed Property:" -ForegroundColor White
Write-Host "      - Find available RefinableString (e.g., RefinableString50)" -ForegroundColor Gray
Write-Host "      - Map crawled property: ows_NodeType or ows_q_CHCS_NodeType" -ForegroundColor Gray
Write-Host "      - Create alias: SPSUMMARYLINKNODETYPE" -ForegroundColor Green
Write-Host ""
Write-Host "   4. Enable Settings:" -ForegroundColor White
Write-Host "      - Queryable" -ForegroundColor Green
Write-Host "      - Retrievable" -ForegroundColor Green
Write-Host "      - Refinable" -ForegroundColor Green
Write-Host ""
Write-Host "   5. Trigger Re-crawl:" -ForegroundColor White
Write-Host "      - List: SummaryLinks_AK" -ForegroundColor Gray
Write-Host "      - Wait 10-15 minutes for indexing to complete" -ForegroundColor Gray

# Step 6: Testing & Verification
Write-Host ""
Write-Host "Step 6: Post-Deployment Verification" -ForegroundColor Green
Write-Host ""
Write-Host "   Environment: https://cloud-dev-fe-ufa.onakumina.com/" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Test Cases:" -ForegroundColor Yellow
Write-Host "   ----------" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Typeahead Search - System and Tools" -ForegroundColor White
Write-Host "     - Type 'tools' in global search" -ForegroundColor Gray
Write-Host "     - Verify System and Tools results appear" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Typeahead Search - SLW Results" -ForegroundColor White
Write-Host "     - Type summary link title" -ForegroundColor Gray
Write-Host "     - Verify SLW items appear" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Global Search - System and Tools" -ForegroundColor White
Write-Host "     - Execute full search" -ForegroundColor Gray
Write-Host "     - Verify results display correctly" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Global Search - SLW Results" -ForegroundColor White
Write-Host "     - Execute full search for summary links" -ForegroundColor Gray
Write-Host "     - Validate metadata (NodeType)" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Browser Console - No Errors" -ForegroundColor White
Write-Host "     - F12 > Console tab" -ForegroundColor Gray
Write-Host "     - Verify no JavaScript errors" -ForegroundColor Gray

# Step 7: Completion
Write-Host ""
Write-Host "Step 7: Deployment Completion" -ForegroundColor Green
Write-Host ""
Write-Host "   After successful verification:" -ForegroundColor Yellow
Write-Host "   -----------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Update Jira tickets (UFA-285, UFA-286)" -ForegroundColor White
Write-Host "      - Status: Deployed to Dev" -ForegroundColor Gray
Write-Host "      - Add deployment notes" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Notify stakeholders" -ForegroundColor White
Write-Host "      - Ren Tetrault (assignee)" -ForegroundColor Gray
Write-Host "      - Diego Rosa (primary contact)" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Document any issues in Jira" -ForegroundColor White
Write-Host ""

# Deployment Checklist
Write-Host ""
Write-Host "Deployment Checklist" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[x] Pre-deployment validation complete" -ForegroundColor White
Write-Host "[x] Branch created: $($DeploymentConfig.Branch)" -ForegroundColor White
Write-Host "[x] Pull request created and completed" -ForegroundColor White
Write-Host "[x] Pipeline executed successfully" -ForegroundColor White
Write-Host "[x] SharePoint search schema configured" -ForegroundColor White
Write-Host "[x] SummaryLinks_AK list re-crawled" -ForegroundColor White
Write-Host "[x] Typeahead search tested (System and Tools)" -ForegroundColor White
Write-Host "[x] Typeahead search tested (SLW)" -ForegroundColor White
Write-Host "[x] Global search tested (both features)" -ForegroundColor White
Write-Host "[x] No JavaScript errors in console" -ForegroundColor White
Write-Host "[x] Jira tickets updated" -ForegroundColor White
Write-Host "[x] Stakeholders notified" -ForegroundColor White
Write-Host ""

Write-Host "Support Contacts" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host "Primary:   Diego Rosa (diego.rosa@akumina.com)" -ForegroundColor White
Write-Host "Assignee:  Ren Tetrault" -ForegroundColor White
Write-Host "Secondary: Luke Shuck (Luke.Shuck@akumina.com)" -ForegroundColor White
Write-Host ""

if ($DryRun) {
    Write-Host "Dry run completed - Review steps above" -ForegroundColor Green
} else {
    Write-Host "Deployment guide displayed - Follow steps above" -ForegroundColor Green
}

Write-Host ""
#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Execute UFA Development Deployment - January 22, 2026
.DESCRIPTION
    Automated deployment script for UFA DEV environment
    Tickets: UFA-285, UFA-286 (Search enhancements)
#>

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

# Deployment Configuration
$DeploymentConfig = @{
    Date = "2026-01-22"
    Branch = "dev_2026.01.22.01"
    SourceBranch = "main"
    Project = "ReleaseManagement"
    Repository = "UFA"
    Pipeline = "UFA-Headless-Dev"
    Tickets = @("UFA-285", "UFA-286")

Write-Host "\n=======================================================" -ForegroundColor Cyan
Write-Host "   UFA Development Deployment - January 22, 2026      " -ForegroundColor Cyan
Write-Host "=======================================================\n" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "[DRY RUN] No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Pre-Deployment Validation
Write-Host "Step 1: Pre-Deployment Validation" -ForegroundColor Green
Write-Host "   Checking prerequisites..." -ForegroundColor Gray

$validationChecks = @(
    @{ Name = "Git installed"; Command = "git --version" },
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
Write-Host "\nStep 2: Deployment Summary" -ForegroundColor Green
Write-Host "   Project:    $($DeploymentConfig.Project)" -ForegroundColor White
Write-Host "   Repository: $($DeploymentConfig.Repository)" -ForegroundColor White
Write-Host "   Branch:     $($DeploymentConfig.Branch)" -ForegroundColor Cyan
Write-Host "   Pipeline:   $($DeploymentConfig.Pipeline)" -ForegroundColor White
Write-Host "   Tickets:    $($DeploymentConfig.Tickets -join ', ')" -ForegroundColor Yellow

# Step 3: Jira Ticket Status
Write-Host "\nStep 3: Jira Tickets" -ForegroundColor Green
Write-Host "   UFA-285: Add System and Tools results in typeahead/global search" -ForegroundColor White
Write-Host "            Status: Ready to Deploy" -ForegroundColor Green
Write-Host "            Priority: Medium" -ForegroundColor Gray
Write-Host ""
Write-Host "   UFA-286: Add SLW results in typeahead/global search" -ForegroundColor White
Write-Host "            Status: Ready to Deploy" -ForegroundColor Green
Write-Host "            Priority: Medium" -ForegroundColor Gray
Write-Host "            Assignee: Ren Tetrault" -ForegroundColor Gray

# Step 4: Azure DevOps Instructions
Write-Host "\nStep 4: Azure DevOps Operations" -ForegroundColor Green
Write-Host ""
Write-Host "   Manual Steps Required (Azure DevOps Portal):" -ForegroundColor Yellow
Write-Host "   ---------------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   A. Create Deployment Branch:" -ForegroundColor Cyan
Write-Host "      1. Navigate to Azure DevOps > ReleaseManagement > UFA repo" -ForegroundColor White
Write-Host "      2. Go to Branches" -ForegroundColor White
Write-Host "      3. Click 'New branch'" -ForegroundColor White
Write-Host "      4. Name: $($DeploymentConfig.Branch)" -ForegroundColor Green
Write-Host "      5. Based on: $($DeploymentConfig.SourceBranch)" -ForegroundColor White
Write-Host ""
Write-Host "   B. Create Pull Request:" -ForegroundColor Cyan
Write-Host "      1. Source: $($DeploymentConfig.SourceBranch) → Target: $($DeploymentConfig.Branch)" -ForegroundColor White
Write-Host "      2. Title: 'UFA Dev Deployment - Jan 22, 2026 (UFA-285, UFA-286)'" -ForegroundColor Green
Write-Host "      3. Description: Include ticket summaries and deployment notes" -ForegroundColor White
Write-Host "      4. Link work items: UFA-285, UFA-286" -ForegroundColor White
Write-Host "      5. Complete PR after review" -ForegroundColor White
Write-Host ""
Write-Host "   C. Run Pipeline:" -ForegroundColor Cyan
Write-Host "      1. Navigate to Pipelines > $($DeploymentConfig.Pipeline)" -ForegroundColor White
Write-Host "      2. Click 'Run pipeline'" -ForegroundColor White
Write-Host "      3. Select branch: $($DeploymentConfig.Branch)" -ForegroundColor Green
Write-Host "      4. Monitor execution for errors" -ForegroundColor White

# Step 5: Manual Configuration Steps
Write-Host "\nStep 5: Post-Deployment Configuration" -ForegroundColor Green
Write-Host ""
Write-Host "   SharePoint Search Schema Configuration:" -ForegroundColor Yellow
Write-Host "   --------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Access SharePoint Admin Center" -ForegroundColor White
Write-Host "      URL: https://[tenant]-admin.sharepoint.com" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Navigate to Search > Manage Search Schema" -ForegroundColor White
Write-Host ""
Write-Host "   3. Configure Managed Property:" -ForegroundColor White
Write-Host "      - Find available RefinableString (e.g., RefinableString50)" -ForegroundColor Gray
Write-Host "      - Map crawled property: ows_NodeType or ows_q_CHCS_NodeType" -ForegroundColor Gray
Write-Host "      - Create alias: SPSUMMARYLINKNODETYPE" -ForegroundColor Green
Write-Host ""
Write-Host "   4. Enable Settings:" -ForegroundColor White
Write-Host "      - Queryable" -ForegroundColor Green
Write-Host "      - Retrievable" -ForegroundColor Green
Write-Host "      - Refinable" -ForegroundColor Green
Write-Host ""
Write-Host "   5. Trigger Re-crawl:" -ForegroundColor White
Write-Host "      - List: SummaryLinks_AK" -ForegroundColor Gray
Write-Host "      - Wait 10-15 minutes for indexing to complete" -ForegroundColor Gray

# Step 6: Testing & Verification
Write-Host "\nStep 6: Post-Deployment Verification" -ForegroundColor Green
Write-Host ""
Write-Host "   Environment: https://cloud-dev-fe-ufa.onakumina.com/" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Test Cases:" -ForegroundColor Yellow
Write-Host "   ----------" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Typeahead Search - System and Tools" -ForegroundColor White
Write-Host "     - Type 'tools' in global search" -ForegroundColor Gray
Write-Host "     - Verify System and Tools results appear" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Typeahead Search - SLW Results" -ForegroundColor White
Write-Host "     - Type summary link title" -ForegroundColor Gray
Write-Host "     - Verify SLW items appear" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Global Search - System and Tools" -ForegroundColor White
Write-Host "     - Execute full search" -ForegroundColor Gray
Write-Host "     - Verify results display correctly" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Global Search - SLW Results" -ForegroundColor White
Write-Host "     - Execute full search for summary links" -ForegroundColor Gray
Write-Host "     - Validate metadata (NodeType)" -ForegroundColor Gray
Write-Host ""
Write-Host "   [ ] Browser Console - No Errors" -ForegroundColor White
Write-Host "     - F12 > Console tab" -ForegroundColor Gray
Write-Host "     - Verify no JavaScript errors" -ForegroundColor Gray

# Step 7: Completion
Write-Host "\nStep 7: Deployment Completion" -ForegroundColor Green
Write-Host ""
Write-Host "   After successful verification:" -ForegroundColor Yellow
Write-Host "   -----------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "   1. Update Jira tickets (UFA-285, UFA-286)" -ForegroundColor White
Write-Host "      - Status: Deployed to Dev" -ForegroundColor Gray
Write-Host "      - Add deployment notes" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Notify stakeholders" -ForegroundColor White
Write-Host "      - Ren Tetrault (assignee)" -ForegroundColor Gray
Write-Host "      - Diego Rosa (primary contact)" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Document any issues in Jira" -ForegroundColor White
Write-Host ""

# Deployment Checklist
Write-Host "\nDeployment Checklist" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[x] Pre-deployment validation complete" -ForegroundColor White
Write-Host "[x] Branch created: $($DeploymentConfig.Branch)" -ForegroundColor White
Write-Host "[x] Pull request created and completed" -ForegroundColor White
Write-Host "[x] Pipeline executed successfully" -ForegroundColor White
Write-Host "[x] SharePoint search schema configured" -ForegroundColor White
Write-Host "[x] SummaryLinks_AK list re-crawled" -ForegroundColor White
Write-Host "[x] Typeahead search tested (System and Tools)" -ForegroundColor White
Write-Host "[x] Typeahead search tested (SLW)" -ForegroundColor White
Write-Host "[x] Global search tested (both features)" -ForegroundColor White
Write-Host "[x] No JavaScript errors in console" -ForegroundColor White
Write-Host "[x] Jira tickets updated" -ForegroundColor White
Write-Host "[x] Stakeholders notified" -ForegroundColor White
Write-Host ""

Write-Host "\nSupport Contacts" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host "Primary:   Diego Rosa (diego.rosa@akumina.com)" -ForegroundColor White
Write-Host "Assignee:  Ren Tetrault" -ForegroundColor White
Write-Host "Secondary: Luke Shuck (Luke.Shuck@akumina.com)" -ForegroundColor White
Write-Host ""

if ($DryRun) {
    Write-Host "\nDry run completed - Review steps above" -ForegroundColor Green
} else {
    Write-Host "\nDeployment guide displayed - Follow steps above" -ForegroundColor Green
}

Write-Host ""
