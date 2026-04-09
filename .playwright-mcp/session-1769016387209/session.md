
### Tool call: browser_navigate
- Args
```json
{
  "url": "https://cloud-dev-fe-jmsmucker.onakumina.com",
  "expectation": {
    "includeSnapshot": true,
    "includeConsole": false,
    "includeDownloads": false,
    "includeTabs": false,
    "includeCode": false,
    "snapshotOptions": {
      "maxLength": 3000,
      "format": "aria"
    }
  }
}
```
- Code
```js
await page.goto('https://cloud-dev-fe-jmsmucker.onakumina.com');
```
- Snapshot: 001.snapshot.yml

