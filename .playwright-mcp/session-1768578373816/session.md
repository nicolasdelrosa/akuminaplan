
### Tool call: browser_navigate
- Args
```json
{
  "url": "https://akbps-ufa-sandbox-headless.onakumina.com",
  "expectation": {
    "includeSnapshot": true,
    "includeConsole": false,
    "includeDownloads": false,
    "includeTabs": false,
    "includeCode": false,
    "snapshotOptions": {
      "format": "aria"
    }
  }
}
```
- Code
```js
await page.goto('https://akbps-ufa-sandbox-headless.onakumina.com');
```

