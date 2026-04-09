# Browser Navigation with Authentication Skill

## Overview
This skill enables automated browser navigation with authentication to protected web applications. It uses the Playwright browser automation to navigate to specified URLs and automatically handle the authentication flow.

## Trigger Patterns
This skill is activated when you use any of these phrases:
- "Navigate to [URL]"
- "Go to [URL]"
- "Open [URL]"
- "Browse to [URL]"
- "Login to [URL]"

## Features
- Automatic navigation to specified URLs
- Integrated authentication flow using Microsoft/Azure AD
- Batch execution for efficient browser operations
- Configurable wait times for page loads
- Console logging for debugging
- Snapshot capture for verification

## Usage Examples

### Basic Navigation
```
Navigate to https://akbps-wcb-sandbox-headless.onakumina.com/
```

### Alternative Phrases
```
Go to https://example.com
Open https://myapp.onakumina.com
Login to https://portal.akumina.com
```

## Authentication Configuration

The skill uses credentials configured in `Authentication/authenticate.js`:
- **Username**: akumina@akbps.onmicrosoft.com
- **Base URL**: https://akbps-wcb-sandbox-headless.onakumina.com/

The authentication flow handles:
1. Initial page navigation
2. Username entry
3. Password entry
4. Multi-step login process
5. Post-authentication page load

## Technical Details

### Browser Automation Flow
The skill uses `mcp_fast-playwrig_browser_batch_execute` to perform these steps:

1. **Navigate** to the target URL
2. **Wait** for page load (3 seconds)
3. **Type** username into login field
4. **Click** "Next/Avançar" button
5. **Wait** for password field (2 seconds)
6. **Type** password
7. **Click** "Sign In/Entrar" button
8. **Wait** for authentication complete (10 seconds)

### Selectors Used
- Username field: `input[name='loginfmt']`
- Password field: `input[name='passwd']`
- Next button: `role: button, text: "Avançar"`
- Sign In button: `role: button, text: "Entrar"`

## Configuration

### Customization
To use with different credentials or URLs, modify:
```javascript
const CONFIG = {
  username: "your-email@domain.com",
  password: "your-password",
  baseUrl: "https://your-app-url.com"
};
```

### Wait Times
Adjust wait times if needed for slower connections:
- Initial load: 3 seconds
- Between steps: 2 seconds  
- Final authentication: 10 seconds

## Error Handling

The skill includes:
- Console logging to track authentication steps
- Page snapshots for debugging
- Timeout handling for slow loads
- Fallback selectors for UI variations

## Security Notes

⚠️ **Important**: 
- Credentials are stored in plain text in `authenticate.js`
- Use environment variables or secure storage in production
- Never commit credentials to version control
- Consider using service accounts for automation

## Integration

This skill integrates with:
- Microsoft/Azure AD authentication
- Akumina platform applications
- Any web app using similar OAuth flows

## Troubleshooting

### Common Issues

**Authentication fails:**
- Verify credentials in `authenticate.js`
- Check if 2FA is enabled (may block automation)
- Increase wait times for slower connections

**Page not loading:**
- Verify URL is accessible
- Check network connectivity
- Ensure no firewall blocking

**Selectors not found:**
- Inspect page to verify element selectors
- Update selectors in authentication steps
- Check for UI changes in login flow

## License
MIT License - See LICENSE.txt for details
