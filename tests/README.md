# Playwright Test Suite with Authentication

## Overview
This test suite automatically generates Playwright tests for deployment tickets and includes automated authentication for the Akumina platform.

## Authentication Setup

### How It Works
1. **Setup Test** ([tests/akumina-auth.setup.ts](tests/akumina-auth.setup.ts)) runs before all tests
2. Authenticates to the Akumina site via Microsoft login
3. Saves the authentication state to `tests/playwright/.auth/akumina-user.json`
4. All subsequent tests reuse this authenticated session

### Running Tests

**First time or when auth expires:**
```powershell
# Run auth setup (happens automatically when running tests)
npx playwright test --project=setup

# Or run all tests (includes setup automatically)
npx playwright test
```

**Run specific test file:**
```powershell
npx playwright test tests/UFA/UFA-287.spec.ts
```

**Run tests for a specific ticket:**
```powershell
npx playwright test UFA-287
```

**Run with UI mode:**
```powershell
npx playwright test --ui
```

## Generating Tests from Deployment

1. Update ticket list in `generate-release-notes.js` (deploymentTickets array)
2. Run the generator:
   ```powershell
   node generate-release-notes.js
   ```
3. Tests will be created in `tests/<PROJECT>/` folders

## Test Structure

### Generated Test Types

- **Bug Tests**: Verification + regression testing
- **Search Tests**: Global search, filters, typeahead
- **UI/Widget Tests**: Rendering, styling, responsive behavior
- **Performance Tests**: Load time measurements (cold/warm)
- **Generic Tests**: Basic verification structure

### Example Structure
```
tests/
  ├── akumina-auth.setup.ts       # Authentication setup
  ├── playwright/
  │   └── .auth/
  │       └── akumina-user.json   # Saved session (gitignored)
  └── UFA/
      ├── UFA-270.spec.ts
      ├── UFA-287.spec.ts
      └── ...
```

## Configuration

### Project URLs
URLs are configured in [tests/test.config.ts](tests/test.config.ts):
- UFA: `https://akbps-ufa-sandbox-headless.onakumina.com`
- LAC: `https://lacourts-dev.sharepoint.com`
- JMSMUC: `https://jmsmuckers-dev.sharepoint.com`
- etc.

### Authentication Credentials
Stored in [tests/akumina-auth.setup.ts](tests/akumina-auth.setup.ts):
- Email: `akumina@akbps.onmicrosoft.com`
- Password: `603US@kud@1`

⚠️ **Note**: Authentication state file (`.json`) is gitignored for security

## Viewing Results

**HTML Report:**
```powershell
npx playwright show-report
```

**Trace Viewer (for failed tests):**
```powershell
npx playwright show-trace test-results/<test-name>/trace.zip
```

## Troubleshooting

### Authentication Fails
- Delete `tests/playwright/.auth/akumina-user.json`
- Run `npx playwright test --project=setup` again

### Tests Can't Find Elements
- Run in headed mode to see what's happening: `npx playwright test --headed`
- Use Playwright Inspector: `npx playwright test --debug`

### Session Expired
Authentication is automatically re-run when needed. If issues persist:
```powershell
Remove-Item tests/playwright/.auth/akumina-user.json
npx playwright test --project=setup
```

## Best Practices

1. **Keep auth state fresh**: Re-run setup if tests fail with auth errors
2. **Update selectors**: Generated tests have TODO comments for specific selectors
3. **Add assertions**: Replace placeholder errors with real test logic
4. **Check test templates**: Review generated tests before running
5. **Use descriptive titles**: Update test descriptions as you implement them
