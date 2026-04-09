# Browser Navigation with Authentication - Examples

## Quick Start

### Navigate to Protected Site
```
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
```

This will:
1. Open the browser
2. Navigate to the URL
3. Enter credentials automatically
4. Complete the login flow
5. Show you the authenticated page

### Navigate to Public Site
```
Go to https://www.akumina.com
```

For public sites, only navigation occurs (no authentication needed).

## Advanced Usage

### Check Authentication Status
After navigation, you can:
```
Take a screenshot
Show me the page snapshot
What's on the page?
```

### Interact with Authenticated Pages
Once logged in, you can:
```
Click on "Dashboard"
Find button with text "Create New"
Type "test data" in search box
```

### Debug Authentication Issues
```
Show console messages
Diagnose the page
Check for errors
```

## Step-by-Step Example

### Example 1: Navigate and Verify Login
```
1. Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
2. Take a screenshot
3. Show me the current URL
```

### Example 2: Navigate and Search
```
1. Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
2. Wait 5 seconds
3. Type "performance" in search
4. Click search button
```

### Example 3: Multi-Tab Navigation
```
1. Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
2. Open new tab
3. Navigate to https://akumina.atlassian.net
4. Switch between tabs
```

## Common Workflows

### Daily Check-In
```javascript
// Navigate to your work environment
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/

// Check dashboard
Click on "Dashboard"
Take screenshot

// Review notifications
Click on notifications icon
```

### Testing Workflow
```javascript
// Login to test environment
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/

// Navigate to feature under test
Click on "Admin Panel"
Click on "Settings"

// Verify page loaded
Take screenshot
```

## Configuration Examples

### Custom Credentials
Edit `navigate.js` to use different credentials:

```javascript
const AUTH_CONFIG = {
  username: "myemail@company.com",
  password: "mypassword",
  baseUrl: "https://my-app.com"
};
```

### Custom Wait Times
Adjust for slower connections:

```javascript
// In the workflow, modify wait times:
{
  tool: "browser_wait_for",
  arguments: { time: 5 }  // Increase from 3 to 5 seconds
}
```

### Additional Selectors
Add more fallback selectors for reliability:

```javascript
{
  tool: "browser_type",
  arguments: {
    selectors: [
      { css: "input[name='loginfmt']" },
      { css: "input[type='email']" },
      { css: "#username" },          // Add custom selector
      { css: ".login-email-field" }  // Add class-based selector
    ],
    text: AUTH_CONFIG.username
  }
}
```

## Troubleshooting Examples

### Problem: Login Fails
```
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
Show console messages
Diagnose the page
```

### Problem: Page Not Loading
```
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
Wait 10 seconds
Take screenshot
Show me what's on the screen
```

### Problem: Can't Find Element
```
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
Find elements with text "Sign in"
Inspect HTML for button
```

## Integration with Other Skills

### With Jira Skill
```
// Navigate to authenticated site
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/

// Then use Jira commands
Show my Jira tickets
Update LAC-194 status to Done
```

### With PDF Skill
```
// Navigate and download report
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
Click on "Reports"
Click on "Download PDF"

// Then process the PDF
Extract text from downloaded PDF
```

### With DOCX Skill
```
// Navigate and work with documents
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
Click on "Documents"

// Create/edit documents
Create new document with title "Meeting Notes"
```
