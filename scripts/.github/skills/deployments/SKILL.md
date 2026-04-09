# Deployment Management Skill

## Purpose
This skill assists with managing deployments to client environments (Dev and Prod) by automating the deployment preparation process, including branch creation, change tracking, and release notes generation.

## ⚠️ CRITICAL: When User Requests a Deployment

**Trigger Phrases:**
- "start a dev deployment for [Client]"
- "prepare deployment for [Client]"
- "deploy to [Client] dev/prod"
- "create release for [Client]"

**REQUIRED ACTIONS - Execute in Order:**
1. ✅ Identify client Azure DevOps project and repository details
2. ✅ Query last successful pipeline run to find base branch
3. ✅ Get commits since last deployment
4. ✅ Create new deployment branch (with correct naming convention)
5. ✅ Create Pull Request to merge changes into deployment branch
6. ✅ Extract ticket references from commits
7. ✅ Verify ticket statuses in Jira (must be "Ready for Dev Deploy")
8. ✅ **Create deployment tracking ticket in Jira** (if not exists)
9. ✅ Link all deployed tickets to deployment tracking ticket
10. ✅ **Check for pipeline-specific deployments** (VirtualPages → Delivery Pipeline, Widgets → Central site widgets)
11. ✅ **Check for manual deployment steps** in ticket descriptions
12. ✅ Generate release notes script
13. ✅ Execute script to create .docx file

**DO NOT:**
- ❌ Skip branch creation
- ❌ Skip PR creation
- ❌ Jump directly to release notes without creating deployment infrastructure
- ❌ Assume work is done - follow ALL steps sequentially

## Environment Types
- **Dev Site Deployments**: Development environment deployments
- **Prod Site Deployments**: Production environment deployments

Each client has separate Dev and Prod pipelines configured in Azure DevOps.

## Client Configuration

| Client | Azure DevOps Project | Repository | Jira Project | Dev Pipeline | Prod Pipeline |
|--------|---------------------|------------|--------------|--------------|---------------|
| JM Smuckers | ReleaseManagement | JMSmuckers | **JMSMUC** | JMSmuckers-Headless-Dev | JMSmuckers-Headless-Prod |
| LA Courts | ReleaseManagement | LACourts | LAC | LACourts-Headless-Dev | LACourts-Headless-Prod |
| UFA | ReleaseManagement | UFA | UFA | UFA-Headless-Dev | UFA-Headless-Prod |
| WCB | ReleaseManagement | WCB | WCB | WCB-Headless-Dev | WCB-Headless-Prod |
| Ball Corp | ReleaseManagement | BallCorp | BCRS | BallCorp-Headless-Dev | BallCorp-Headless-Prod |

**IMPORTANT**: Ticket IDs must match the Jira Project key (e.g., JMSMUC-123, not JMS-123)

## Dev Site Deployment Workflow

### Step 1: Identify Changes
1. Query Azure DevOps to find the last successful run of the Headless Dev pipeline for the target client
2. Extract the last deployment date/time from that pipeline run
3. Use Azure DevOps Git API to get all commits to the master branch between that deployment date and today
4. Collect all changed files and commit information

**MCP Tools Used:**
- `#mcp microsoft_azu` - Azure DevOps MCP for pipeline history and Git operations

### Step 2: Create Deployment Branch
1. Identify the last branch used by the Headless Dev pipeline (e.g., `dev_1.25.12.17` or `2026.01.10.01`)
2. Create a new branch using the appropriate naming pattern:
   - If the last branch has a `dev_` prefix, use: `dev_YYYY.MM.DD.XX` (e.g., `dev_2026.01.16.01`)
   - Otherwise, use: `YYYY.MM.DD.XX` (e.g., `2026.01.16.01`)
   - The `.XX` suffix increments if multiple deployments occur on the same day
   - **Important**: Preserve the naming convention (with or without `dev_` prefix) from the last deployment branch
3. Use the branch from Step 1 as the base branch, NOT master
4. Merge all changes identified in Step 1 into the new deployment branch

**MCP Tools Used:**
- `#mcp microsoft_azu` - For branch creation and merge operations

### Step 3: Track Related Tickets
1. Parse all commit messages from Step 1 to extract Jira ticket references (e.g., LAC-123, WCB-456, BPS-789)
2. **OPTIMIZATION**: Use JQL batch search instead of individual calls:
   - **Fast Method**: `mcp_atlassian_atl_searchJiraIssuesUsingJql` with `key in (TICKET-1, TICKET-2, ...)`
   - **Fallback**: Check `my-jira-issues.csv` for cached data
   - **Last Resort**: Individual ticket fetches with caching
3. **Verify Ticket Status**: For each ticket worked on in the master branch:
   - Check if the ticket status is "Ready to Dev Deployment" or equivalent workflow status
   - **If NOT in correct status**: Alert the user with a list of tickets that need to be moved:
     ```
     ⚠️ The following tickets are NOT ready for dev deployment:
     - [LAC-123] Current status: In Progress
     - [WCB-456] Current status: Code Review
     ```
   - **Wait for user confirmation** before proceeding with deployment
   - User should move tickets to "Ready to Dev Deployment" in Jira before continuing

### Step 4: Create Deployment Tracking Ticket
1. **Check for existing deployment ticket**: Search Jira for deployment tracking ticket created in the last 24 hours
   - Use JQL: `project = [PROJECT] AND summary ~ "deployment" AND created >= "YYYY-MM-DD"`
2. **If no deployment ticket exists, create one**:
   - **Summary**: `Dev Deployment - [Month] [Day], [Year]` (e.g., "Dev Deployment - January 21, 2026")
   - **Issue Type**: Story or Task (based on project configuration)
   - **Description**: Include:
     - Deployment date and environment
     - Branch name (e.g., `1.26.01.21.01`)
     - Pull request number
     - Pipeline name
     - List of all included tickets organized by category
     - Deployment summary
     - Release notes document filename
   - **Priority**: Medium or High
3. **Add comment to deployment ticket** with list of all included tickets
4. **Store deployment ticket key** for reference (e.g., JMSMUC-97)

**Example Deployment Ticket:**
```
Summary: Dev Deployment - January 21, 2026

Description:
Deployment Information:
- Environment: Development
- Date: January 21, 2026
- Branch: 1.26.01.21.01
- Pull Request: #16094
- Pipeline: JMSmuckers-Headless-Dev

Included Tickets (11 Total):
- JMSMUC-82: Missed Branding Changes (Bug)
- JMSMUC-86: Update footer background color
[... etc]

Release Notes: JMSmuckers_Dev_Deployment_January_21_2026_Release_Notes.docx
```

**MCP Tools Used:**
- `#mcp atlassian` - For creating deployment ticket and adding comments

### Step 5: Link Tickets to Deployment
1. Add comment to each deployed ticket referencing the deployment ticket:
   ```
   Included in deployment: [DEPLOYMENT-TICKET-KEY]
   Branch: [BRANCH-NAME]
   Deployment Date: [DATE]
   ```
2. Optionally create ticket links between deployment ticket and all deployed tickets

**MCP Tools Used:**
- `#mcp atlassian` - For adding comments to tickets

### Step 6: Check Deployment Pipeline Requirements
1. **Analyze Changed Files**: Review all commits from Step 1 to identify which folders were modified
2. **VirtualPages Folder Changes**: 
   - If any files in the `VirtualPages` folder were modified, **advise running the Delivery Pipeline**
   - Add note to deployment ticket and release notes: "⚠️ Delivery Pipeline Required - VirtualPages modified"
3. **Widgets Folder Changes**:
   - If any files in the `Widgets` folder were modified, **advise running the Central Site Widgets pipeline**
   - Add note to deployment ticket and release notes: "⚠️ Central Site Widgets Pipeline Required - Widgets modified"
4. Include pipeline requirements in the deployment ticket description and release notes

**MCP Tools Used:**
- Azure DevOps Git API - For analyzing changed file paths

### Step 7: Check for Manual Deployment Steps
1. **Review Ticket Descriptions**: For each ticket identified in Step 3:
   - Check if the ticket description contains a `manualdeployment:` tag
   - Extract the manual deployment instructions following the tag
2. **Compile Manual Steps**:
   - Create a "Manual Deployment Steps" section in the release notes
   - Include each ticket's manual steps with ticket reference
3. **Add to Deployment Ticket**:
   - Update deployment ticket description with manual steps section
   - Format: 
     ```
     Manual Deployment Steps:
     - [TICKET-123]: [manual deployment instructions from ticket]
     - [TICKET-456]: [manual deployment instructions from ticket]
     ```
4. **Alert in Release Notes**: Highlight manual steps prominently with warning symbol

**Example Manual Step Tag in Ticket:**
```
Description:
Update database schema for new user fields

manualdeployment: Run SQL script located at /scripts/migration_001.sql on production database before deployment
```

**MCP Tools Used:**
- `#mcp atlassian` - For fetching complete ticket descriptions

### Step 8: Generate Release Notes
1. Create a JavaScript file using the `docx` library to generate release notes
2. For each ticket identified in Step 3:
   - Fetch the ticket details using `#mcp atlassian`
   - Extract relevant client-facing information:
     - Summary/Title
     - Description (client-relevant portions)
     - Acceptance criteria
     - Priority and Status
3. Structure the .docx document with:
   - **Title**: Client name + "Development Deployment" / "Release Notes - [Date]"
   - **Deployment Information Table**: Date, Environment, Branch, Pipeline, Pull Request
   - **Pipeline Requirements Section** (if applicable):
     - List required pipelines based on changed folders (VirtualPages → Delivery Pipeline, Widgets → Central Site Widgets)
   - **Manual Deployment Steps Section** (if applicable):
     - List all manual steps extracted from tickets with `manualdeployment:` tag
     - Format each step with ticket reference and clear instructions
   - **Summary Section**: Brief overview of changes
   - **Features & Enhancements**: Organized by category (e.g., Search Improvements, UI/UX, etc.)
     - For each ticket: Heading with ticket key, Priority, Status, Description, "What Changed" bullet list
   - **Bug Fixes Section**: Same structure as features
   - **Deployment Instructions**: Step-by-step deployment process
   - **Post-Deployment Verification**: Checkbox list for testing
   - **Support Section**: Contact information and tracking ticket reference
4. Use docx-js library features:
   - Professional styles with Arial font, proper spacing
   - Tables for deployment info (with borders and shading)
   - Heading hierarchy (Title, H1, H2, H3)
   - Bullet lists for changes (LevelFormat.BULLET)
   - Checkbox lists for verification (using "☐" character)
   - Page breaks between major sections
   - 1-inch margins throughout
5. Run the JavaScript file with Node.js to generate the .docx file
6. Name the output file: `[Client]_Dev_Deployment_[Month]_[Day]_[Year]_Release_Notes.docx`

**Critical docx-js Rules:**
- Never use `\n` for line breaks - create separate Paragraph objects instead
- For bullet lists, use `LevelFormat.BULLET` with numbering config, NOT unicode bullets
- Tables require explicit columnWidths and borders on TableCell, not Table
- Use `ShadingType.CLEAR` for cell background colors
- Images require `type` parameter
- Page breaks must be in a Paragraph object

**MCP Tools Used:**
- `#mcp atlassian` - For ticket details
- Node.js with `docx` library - For Word document creation

## Prod Site Deployment Workflow

### Step 1: Identify Changes from Dev
1. Query Azure DevOps to find the last successful run of the Headless Dev pipeline for the target client
2. Identify the dev branch that was deployed (e.g., `dev_2026.01.16.01`)
3. Query Azure DevOps to find the last successful run of the Headless Prod pipeline
4. Identify the last prod branch (e.g., `prod_1.25.12.17` or `2026.01.10.01`)
5. Get all commits from the dev branch that were deployed since the last prod deployment

**MCP Tools Used:**
- `#mcp microsoft_azu` - Azure DevOps MCP for pipeline history and Git operations

### Step 2: Create Production Branch
1. Create a new production branch using the appropriate naming pattern:
   - If the last prod branch has a `prod_` prefix, use: `prod_YYYY.MM.DD.XX` (e.g., `prod_2026.01.16.01`)
   - Otherwise, use: `YYYY.MM.DD.XX` (e.g., `2026.01.16.01`)
   - The `.XX` suffix increments if multiple deployments occur on the same day
   - **Important**: Preserve the naming convention (with or without `prod_` prefix) from the last prod deployment branch
2. Use the **dev branch** (e.g., `dev_2026.01.16.01`) as the source branch, NOT master
3. Merge all changes from the dev branch into the new production branch

**MCP Tools Used:**
- `#mcp microsoft_azu` - For branch creation and merge operations

### Step 3: Reuse Ticket Information
1. **Reuse tickets from Dev deployment** - The same tickets deployed to dev are being promoted to prod
2. Retrieve the production deployment tracking ticket in Jira
3. Update the production deployment ticket with a comment listing all included tickets (same list as dev)
4. Link to the corresponding dev deployment ticket for reference

**MCP Tools Used:**
- `#mcp atlassian` - For Jira ticket retrieval and updates

### Step 4: Generate Production Release Notes
1. **Reuse ticket information from dev deployment** - No need to re-fetch ticket details
2. Create a JavaScript file using the `docx` library to generate production release notes
3. Use the same ticket information structure as dev deployment:
   - Summary/Title
   - Description
   - Acceptance criteria
   - Priority and Status
4. Structure the .docx document with production-specific details:
   - **Title**: Client name + "Production Deployment" / "Release Notes - [Date]"
   - **Deployment Information Table**: Date, **Environment (Production)**, Branch (prod_XXX), Pipeline (Prod Pipeline), Pull Request
   - **Pipeline Requirements Section** (if applicable):
     - List required pipelines based on changed folders (VirtualPages → Delivery Pipeline, Widgets → Central Site Widgets)
     - Same requirements as dev deployment
   - **Manual Deployment Steps Section** (if applicable):
     - List all manual steps from dev deployment
     - Include production-specific considerations
   - **Summary Section**: Brief overview of changes being promoted to production
   - **Features & Enhancements**: Same categories and tickets as dev deployment
   - **Bug Fixes Section**: Same structure as dev deployment
   - **Deployment Instructions**: Production-specific deployment process
   - **Post-Deployment Verification**: Production verification checklist
   - **Rollback Procedures**: Steps to rollback if issues occur
   - **Support Section**: Contact information and tracking ticket reference
5. Use the same docx-js library features as dev deployment
6. Name the output file: `[Client]_Prod_Deployment_[Month]_[Day]_[Year]_Release_Notes.docx`

**MCP Tools Used:**
- `#mcp atlassian` - For deployment ticket updates only (reuse dev ticket details)
- Node.js with `docx` library - For Word document creation

### Additional Considerations for Prod:
- **Source Branch**: Use the dev branch that was successfully deployed and tested
- **Approval Required**: Verify dev deployment was successful before creating prod branch
- **Same Tickets**: Tickets are already validated in dev - reuse the same information
- **Pipeline Requirements**: Same pipeline requirements as dev (VirtualPages/Widgets folders)
- **Manual Steps**: Include all manual deployment steps from dev deployment
- **Environment Change**: Update all documentation to reflect Production environment
- **Rollback Plan**: Include rollback procedures in release notes
- **Stakeholder Notification**: Notify stakeholders after successful deployment
- **Smoke Testing**: Include production smoke test checklist in verification section

## Required MCP Servers
- **mcp atlassian**: Jira integration for ticket management
- **mcp microsoft_azu**: Azure DevOps integration for pipelines and Git operations

## Required Skills
- **docx skill**: Word document generation for release notes

## Usage Example
```
User: "Prepare deployment for LAC Dev environment"
Assistant: 
1. Checks last LAC Headless Dev pipeline run (e.g., Jan 10, 2026)
2. Gets all commits to master since Jan 10
3. Creates branch 2026.01.16.01 based on last deployment branch
4. Merges changes into new branch
5. Identifies tickets: LAC-219, LAC-212, etc.
6. Updates deployment ticket with ticket list
7. Generates release notes Word document
```

## Best Practices
- Always verify the base branch before creating deployment branches
- Include only completed and tested tickets in production deployments
- Maintain clear commit messages with ticket references
- Keep release notes client-friendly (avoid technical jargon)
- Archive release notes for historical reference
- **Work Incrementally**: Break deployment preparation into smaller, discrete steps to avoid connection timeouts and improve reliability:
  - Complete one major task before moving to the next (e.g., fetch tickets → create script → generate document)
  - Save intermediate results (scripts, data) to files before proceeding
  - Provide progress updates between steps so work can be resumed if interrupted
  - For large operations (e.g., fetching many tickets), process in batches
- **Workaround**: If direct branch creation fails, use PR creation to create the branch automatically
  - Create a PR from master to the non-existent target branch
  - Azure DevOps will create the target branch automatically
  - Complete the PR to merge all commits into the new branch

## Client Configuration Reference

### UFA (United Franchise Alliance)
**Azure DevOps:**
- **Project Name**: UFA
- **Project ID**: `75bfb86e-3db0-4f87-9686-fedfa85c5858`
- **Repository Name**: UFA
- **Repository ID**: `1c593bad-fc15-49e1-a70c-d2dcd620cdaf`
- **Dev Pipeline**: UFA Development - Headless Pipeline
- **Dev Pipeline ID**: `#839`
- **Branch Naming**: Uses `dev_` prefix (e.g., `dev_2026.01.16.01`)
- **Base Branch**: `master`

**Jira:**
- **Cloud ID**: `d07d95ef-fe55-4050-a8b8-5c310f3260da`
- **Project Key**: `UFA`
- **Deployment Tracking Ticket Pattern**: `UFA-XXX` (e.g., UFA-288)

**Key Contacts:**
- Diego Rosa (diego.rosa@akumina.com)
- Luke Shuck (Luke.Shuck@akumina.com)

### LA Courts (Los Angeles Courts)
**Azure DevOps:**
- **Project Name**: LA Courts (TBD)
- **Project ID**: (TBD)

**Jira:**
- **Project Key**: `LAC`
- **Example Tickets**: LAC-219, LAC-212

### JM Smuckers
**Azure DevOps:**
- **Organization**: akuminadev.visualstudio.com
- **Project Name**: Smuckers
- **Repository Name**: Smuckers
- **Dev Pipeline ID**: `934`
- **Git URL**: https://akuminadev.visualstudio.com/_git/Smuckers
- **Dev Pipeline URL**: https://akuminadev.visualstudio.com/Smuckers/_build?definitionId=934

**Jira:**
- **Cloud ID**: `d07d95ef-fe55-4050-a8b8-5c310f3260da`
- **Project Key**: `JMSMUC`

### WCB (Workers Compensation Board)
**Jira:**
- **Project Key**: `WCB`

### Ball Corporation
**Jira:**
- **Project Key**: `BCRS`

### Pomerleau
**Jira:**
- **Project Key**: `POM`

**Note**: Add configuration details for other clients as deployments are completed. 



