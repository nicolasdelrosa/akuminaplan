
### Tool call: browser_batch_execute
- Args
```json
{
  "steps": [
    {
      "tool": "browser_navigate",
      "arguments": {
        "url": "https://akumina.atlassian.net/issues/?jql=assignee%20%3D%20currentUser()%20AND%20resolution%20%3D%20Unresolved%20ORDER%20BY%20updated%20DESC"
      },
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 6
      },
      "continueOnError": false
    },
    {
      "tool": "browser_snapshot",
      "arguments": {},
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": true,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false,
        "snapshotOptions": {
          "maxLength": 120000,
          "format": "text"
        }
      }
    }
  ],
  "stopOnFirstError": false
}
```
- Result
```
### Batch Execution Summary
- Status: ✅ Completed
- Total Steps: 3
- Successful: 3
- Failed: 0
- Total Time: 10619ms

### Step Details
✅ Step 1: browser_navigate (3569ms)
   
✅ Step 2: browser_wait_for (6963ms)
   ### Result
   Waited for 6
   
   ...
✅ Step 3: browser_snapshot (86ms)
   
   ### Page state
   - **Page URL:** https://akumina.atlassian.net/issues/?jql=assignee%20%3D%20currentUser()%20AND%20resolution%20%3D%20Unresolved%20ORDER%20BY%20updated%20DESC
   ...

### Final State

### Page state
- **Page URL:** https://akumina.atlassian.net/issues/?jql=assignee%20%3D%20currentUser()%20AND%20resolution%20%3D%20Unresolved%20ORDER%20BY%20updated%20DESC
- **Page Title:** Jira
- Page Snapshot:
```yaml
- generic [ref=e2]:
  - generic:
    - generic: "Skip to:"
    - list:
      - listitem:
        - link "Banner":
          - /url: "#page-layout.banner"
      - listitem:
        - link "Top Bar":
          - /url: "#_r0_"
      - listitem:
        - link "Sidebar":
          - /url: "#_r3_"
      - listitem:
        - link "Main Content":
          - /url: "#_ra_"
  - generic [ref=e3]:
    - banner [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]:
          - button "Recolher barra lateral [" [ref=e9] [cursor=pointer]:
            - generic [ref=e10]: Recolher barra lateral [
          - button "The App Switcher is loading" [ref=e12] [cursor=pointer]:
            - alert "The App Switcher is loading" [ref=e15]
          - link "Acesse a página inicial do Jira" [ref=e17] [cursor=pointer]:
            - /url: /jira
            - generic [ref=e18]:
              - img "Página inicial do Jira"
        - generic [ref=e19]:
          - search [ref=e24]:
            - textbox "Pesquisar" [ref=e27]
          - button "Criar" [ref=e30] [cursor=pointer]:
            - generic [ref=e33]: Criar
        - navigation "Actions" [ref=e34]:
          - list [ref=e35]:
            - listitem [ref=e38]:
              - button "Ajuda" [ref=e39] [cursor=pointer]:
                - generic [ref=e41]: Ajuda
            - listitem [ref=e42]:
              - link "Your profile and settings" [ref=e43] [cursor=pointer]:
                - /url: https://id.atlassian.com/login?application=admin--jira-atlas-75650&continue=https%3A%2F%2Fakumina.atlassian.net%2Fissues%2F%3Fjql%3Dassignee%2520%253D%2520currentUser()%2520AND%2520resolution%2520%253D%2520Unresolved%2520ORDER%2520BY%2520updated%2520DESC&orgId=ff38009f-056d-49a0-ad71-0396bf094295
    - navigation "Sidebar" [ref=e46]:
      - list [ref=e50]:
        - generic [ref=e52]:
          - listitem [ref=e54]:
            - link "Espaços" [ref=e56] [cursor=pointer]:
              - /url: /jira/projects
              - generic [ref=e61]: Espaços
          - listitem [ref=e63]:
            - link "Filtros" [ref=e65] [cursor=pointer]:
              - /url: /jira/filters
              - generic [ref=e70]: Filtros
          - listitem [ref=e72]:
            - link "Painéis" [ref=e74] [cursor=pointer]:
              - /url: /jira/dashboards
              - generic [ref=e79]: Painéis
      - generic [ref=e82]:
        - slider "Redimensionar painel" [ref=e83]: "320"
        - text: Redimensionar painel
    - main [ref=e85]:
      - img "Carregando..." [ref=e88]
```

```


### User action: navigate
- Args
```json
{
  "name": "navigate",
  "url": "https://akumina.atlassian.net/issues/?jql=assignee%20%3D%20currentUser%28%29%20AND%20resolution%20%3D%20Unresolved%20ORDER%20BY%20updated%20DESC"
}
```
- Code
```js
await page.goto('https://akumina.atlassian.net/issues/?jql=assignee%20%3D%20currentUser%28%29%20AND%20resolution%20%3D%20Unresolved%20ORDER%20BY%20updated%20DESC');
```
- Snapshot: 002.snapshot.yml

