
### Tool call: browser_batch_execute
- Args
```json
{
  "steps": [
    {
      "tool": "browser_navigate",
      "arguments": {
        "url": "https://akbps-smuckers-sandbox-headless.onakumina.com"
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": true,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_type",
      "arguments": {
        "selectors": [
          {
            "css": "input[name='loginfmt']"
          }
        ],
        "text": "akumina@akbps.onmicrosoft.com"
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "role": "button",
            "text": "Next"
          }
        ]
      },
      "continueOnError": false
    },
    {
      "tool": "browser_type",
      "arguments": {
        "selectors": [
          {
            "css": "input[name='passwd']"
          }
        ],
        "text": "603US@kud@1"
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "role": "button",
            "text": "Sign in"
          }
        ]
      },
      "continueOnError": false
    }
  ],
  "stopOnFirstError": false,
  "globalExpectation": {
    "includeSnapshot": false,
    "includeConsole": false,
    "includeDownloads": false,
    "includeTabs": false,
    "includeCode": false
  }
}
```
- Error
```
### Batch Execution Summary
- Status: ❌ Stopped on Error
- Total Steps: 5
- Successful: 0
- Failed: 1
- Total Time: 11161ms
- Note: Execution stopped early due to error

### Step Details
❌ Step 1: browser_navigate (11160ms)
   Error: page._wrapApiCall: Execution context was destroyed, most likely because of a navigation
Batch execution stopped due to error
```


### Tool call: browser_navigate
- Args
```json
{
  "url": "https://akbps-smuckers-sandbox-headless.onakumina.com",
  "expectation": {
    "includeSnapshot": true,
    "includeConsole": false,
    "includeDownloads": false,
    "includeTabs": false,
    "includeCode": false
  }
}
```
- Code
```js
await page.goto('https://akbps-smuckers-sandbox-headless.onakumina.com');
```
- Snapshot: 002.snapshot.yml

