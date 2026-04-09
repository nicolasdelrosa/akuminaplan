# GitHub Copilot Custom Instructions

## MCP Server Authentication Troubleshooting

### Automatic MCP Restart Protocol

**CRITICAL: When MCP Authentication Fails**

When detecting MCP authentication errors (401, 403, connection failures):

1. **FIRST ATTEMPT - Auto-Detection & User Notification:**
   ```
   Detected MCP authentication failure. I'll ask you to restart the MCP server.
   
   Please run: .\scripts\reload-vscode.ps1
   Or press Ctrl+Shift+P → "Developer: Reload Window"
   
   Let me know once you've restarted, and I'll continue.
   ```

2. **AFTER USER CONFIRMS RESTART:**
   - Immediately retry the failed MCP operation
   - If successful: Continue workflow without additional commentary
   - If still failing: Escalate to manual token verification

3. **DETECTION PATTERNS:**
   - `{"code":401,"message":"Unauthorized"}`
   - `{"error":true,"message":"Authentication failed"}`
   - `Connection refused` or timeout errors on MCP tools
   - Any `mcp_*` tool returning authentication-related errors

4. **DO NOT:**
   - Proceed with workflow if MCP is required and failing
   - Make multiple retry attempts without user intervention
   - Ask permission to suggest restart (just suggest it directly)

### Atlassian MCP Server
When encountering authentication errors with Atlassian MCP (`401 Unauthorized`, `Authentication failed`):

**Automatic Response Protocol:**
1. **DO NOT** ask user for permission to troubleshoot
2. **IMMEDIATELY** inform user: "The Atlassian MCP authentication has expired. I'll need you to restart the MCP server."
3. **PROVIDE** the reload command: Press `Ctrl+Shift+P` → "Developer: Reload Window"
4. **ALTERNATIVE**: Offer to run the PowerShell reload script: `.\scripts\reload-vscode.ps1`
5. **WAIT** for user confirmation before retrying

**Common Error Messages:**
- `{"code":401,"message":"Unauthorized"}`
- `Authentication failed: {\"code\":401,\"message\":\"Unauthorized\"}`
- `Authentication failed for content search`

**Tools Affected:**
- `mcp_atlassian_atl_getJiraIssue`
- `mcp_atlassian_atl_search`
- `mcp_atlassian_atl_addCommentToJiraIssue`
- All other `mcp_atlassian_*` tools

### Azure DevOps MCP Server
When encountering authentication errors with Azure DevOps MCP:

**Automatic Response Protocol:**
1. **IMMEDIATELY** inform user: "The Azure DevOps MCP authentication has failed. I'll need you to restart the MCP server."
2. **PROVIDE** the reload command: Press `Ctrl+Shift+P` → "Developer: Reload Window"
3. **ALTERNATIVE**: Offer to run: `.\scripts\reload-vscode.ps1`
4. **WAIT** for user confirmation before retrying
5. If reload doesn't work, check for Azure DevOps PAT expiration

**Common Error Patterns:**
- `401 Unauthorized`
- `TF400813: The user is not authorized`
- `VS403403: Token has expired`

### Browser Automation MCP (Playwright)
When encountering session issues:

**Automatic Response Protocol:**
1. **IMMEDIATELY** inform user: "The Browser Automation MCP has encountered an error. I'll need you to restart the MCP server."
2. **PROVIDE** the reload command: Press `Ctrl+Shift+P` → "Developer: Reload Window"
3. **ALTERNATIVE**: Offer to run: `.\scripts\reload-vscode.ps1`
4. **WAIT** for user confirmation before retrying
5. If browser-specific: Suggest closing and reopening browser

**Common Error Patterns:**
- `Browser not connected`
- `Session expired`
- `Timeout waiting for browser`
- Connection errors

## General Troubleshooting Rules

### Universal MCP Error Detection & Response

**FOR ALL MCP SERVERS** - When any MCP tool fails with authentication/connection errors:

1. **IMMEDIATE DETECTION TRIGGERS:**
   - HTTP 401 (Unauthorized)
   - HTTP 403 (Forbidden)
   - Authentication failed messages
   - Connection refused/timeout
   - Session expired errors
   - Any error containing "unauthorized", "forbidden", "expired"

2. **AUTOMATIC RESPONSE SEQUENCE:**
   ```
   Step 1: Detect error pattern
   Step 2: Immediately notify user with specific MCP name
   Step 3: Provide reload command (no permission needed)
   Step 4: Wait for user confirmation of restart
   Step 5: Retry the failed operation once
   Step 6: If still failing → escalate to token verification
   ```

3. **STANDARD NOTIFICATION FORMAT:**
   ```
   Detected [MCP Server Name] authentication failure.
   
   Please restart the MCP server:
   - Press Ctrl+Shift+P → "Developer: Reload Window"
   - Or run: .\scripts\reload-vscode.ps1
   
   Let me know once restarted, and I'll continue.
   ```

4. **AFFECTED MCP SERVERS:**
   - Atlassian (Jira/Confluence)
   - Azure DevOps
   - Playwright/Browser Automation
   - Any future MCP integrations

### When Authentication Fails
- **First attempt**: Suggest VS Code reload
- **Second attempt**: Check MCP configuration in `%APPDATA%\Code\User\mcp.json`
- **Third attempt**: Guide user to regenerate API tokens

### When to Reload VS Code
- MCP authentication failures (401, 403 errors)
- MCP server connection issues
- After updating MCP configuration
- After installing/updating MCP extensions

### User Preferences
- **Automation Level**: High - proceed with troubleshooting automatically
- **Confirmation Required**: No - for standard troubleshooting steps
- **Verbose Output**: Minimal - brief confirmations only

## Workspace-Specific Context

### Project Structure
- **MCP Skills Location**: `scripts/.github/skills/`
- **Scripts Location**: `scripts/`
- **Jira Cache**: `my-jira-issues.csv`

### Common Tasks
1. **Jira Integration**: Frequently used for ticket tracking and updates
   - **Ticket Updates**: When asked to update a ticket, use `#atlassian/atlassian-mcp-server` tools
2. **Azure DevOps**: Pipeline verification and build status checks
3. **Browser Automation**: Testing and verification in live environments

### Active MCP Servers
- `atlassian/atlassian-mcp-server`: Jira/Confluence integration
- `microsoft/azure-devops-mcp`: Pipeline and repository management
- `fast-playwright`: Browser automation for testing
- `microsoft/playwright-mcp`: Alternative browser automation

## Error Recovery Patterns

### Pattern 1: Silent Authentication Refresh
When: MCP 401 error detected
Action: Immediately suggest reload without multiple confirmation prompts

### Pattern 2: Configuration Verification
When: Repeated authentication failures after reload
Action: Guide user to verify API tokens in mcp.json

### Pattern 3: Fallback Methods
When: MCP tools unavailable
Action: Use alternative methods (CSV cache, browser automation, PowerShell scripts)

## Response Templates

### Authentication Failure Template
```
The [MCP Server Name] authentication has expired. Reloading VS Code will refresh the session.

Press Ctrl+Shift+P → "Developer: Reload Window"

Or run: .\scripts\reload-vscode.ps1
```

### Successful Recovery Template
```
✅ Authentication restored. Continuing with your request...
```

### Configuration Update Template
```
To update the [MCP Server] configuration:
1. Generate new API token at [URL]
2. Update $env:APPDATA\Code\User\mcp.json
3. Reload VS Code
```
