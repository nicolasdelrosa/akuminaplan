
### Tool call: browser_batch_execute
- Args
```json
{
  "steps": [
    {
      "tool": "browser_navigate",
      "arguments": {
        "url": "https://akbps-lacourts-sandbox-headless.onakumina.com/"
      },
      "continueOnError": false,
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
  ],
  "stopOnFirstError": false
}
```
- Result
```
### Batch Execution Summary
- Status: ✅ Completed
- Total Steps: 1
- Successful: 1
- Failed: 0
- Total Time: 8497ms

### Step Details
✅ Step 1: browser_navigate (8496ms)
   
   ### Page state
   - **Page URL:** https://akbps-lacourts-sandbox-headless.onakumina.com/
   ...

### Final State

### Page state
- **Page URL:** https://akbps-lacourts-sandbox-headless.onakumina.com/
- **Page Title:** Home Page
- Page Snapshot:
```yaml
- main "main-header" [ref=e4]:
  - heading "Akumina Foundation Root Site" [level=1] [ref=e5]
  - button "Skip to content" [ref=e6] [cursor=pointer]
  - generic [ref=e8]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - link "Company logo." [ref=e13] [cursor=pointer]:
          - /url: https://akbps-lacourts-sandbox-headless.onakumina.com/
          - img "Company logo." [ref=e14]
        - generic [ref=e15]:
          - generic [ref=e16]:
            - text: 
            - generic [ref=e17]:
              - textbox "Search this site." [ref=e18]
              - button "Search this site." [ref=e19] [cursor=pointer]:
                - generic "Search this site." [ref=e20]: 
          - generic: 
          - list [ref=e21]:
            - listitem [ref=e22]:
              - button "Notifications" [ref=e23] [cursor=pointer]:
                - img "My profile picture." [ref=e24]
              - text:    
      - navigation [ref=e29]:
        - list [ref=e30]:
          - listitem [ref=e31]
    - generic [ref=e34]:
      - text: 
      - generic [ref=e35]: 
      - generic [ref=e37]:
        - link "Company Logo." [ref=e39] [cursor=pointer]:
          - /url: https://akbps-lacourts-sandbox-headless.onakumina.com
          - img "Company Logo." [ref=e40]
        - text: "|"
        - generic [ref=e41]: © Superior Court of California, County of Los Angeles All rights reserved.
  - text:    
```

```


### Tool call: browser_batch_execute
- Args
```json
{
  "steps": [
    {
      "tool": "browser_type",
      "arguments": {
        "selectors": [
          {
            "css": "#siteSearch, .ia-search-combo .form-control, input[placeholder*='Search']"
          }
        ],
        "text": "small"
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "role": "button",
            "text": "resources"
          },
          {
            "role": "button",
            "text": "Resources"
          },
          {
            "css": "[data-lookin='FetchMedia'], label:contains('Resources')"
          }
        ]
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ak-dw-searchlistimg, .ia-search-combo button[type='submit'], button[aria-label*='Search']"
          }
        ]
      },
      "continueOnError": false
    }
  ],
  "stopOnFirstError": false,
  "globalExpectation": {
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
- Error
```
### Batch Execution Summary
- Status: ❌ Stopped on Error
- Total Steps: 3
- Successful: 1
- Failed: 1
- Total Time: 16141ms
- Note: Execution stopped early due to error

### Step Details
✅ Step 1: browser_type (16099ms)
   
   ### Page state
   - **Page URL:** https://akbps-lacourts-sandbox-headless.onakumina.com/
   ...
❌ Step 2: browser_click (42ms)
   Error: Failed to resolve any element selectors: Failed to resolve CSS selector: locator.count: SyntaxError: Failed to execute 'querySelectorAll' on 'Document': 'label:contains("Resources")' is not a valid selector.
    at query (<anonymous>:5232:41)
    at <anonymous>:5242:7
    at SelectorEvaluatorImpl._cached (<anonymous>:5019:20)
    at SelectorEvaluatorImpl._queryCSS (<anonymous>:5229:17)
    at SelectorEvaluatorImpl._querySimple (<anonymous>:5109:19)
    at <anonymous>:5057:29
    at SelectorEvaluatorImpl._cached (<anonymous>:5019:20)
    at SelectorEvaluatorImpl.query (<anonymous>:5050:19)
    at Object.query (<anonymous>:5264:44)
    at <anonymous>:5222:21, No elements found with role "button" and text "resources", No elements found with role "button" and text "Resources"
Batch execution stopped due to error
```


### Tool call: browser_inspect_html
- Args
```json
{
  "selectors": [
    {
      "role": "search"
    },
    {
      "role": "combobox"
    },
    {
      "text": "small"
    }
  ],
  "depth": 3,
  "includeStyles": false,
  "maxSize": 50000,
  "format": "html",
  "includeAttributes": true,
  "preserveWhitespace": false,
  "includeSuggestions": false,
  "includeChildren": true,
  "optimizeForLLM": false
}
```
- Result
```
## HTML Inspection Results

**Configuration:**
- selectors: 3 selector(s)
- depth: 3
- format: html
- maxSize: 50000 bytes
- includeAttributes: true
- optimizeForLLM: false

**Timing:**
- total: 160ms
- selector resolution: 35ms
- extraction: 125ms

**Statistics:**
- elements found: 1
- selectors not found: 2
- average depth: 1.0
- Total size: 22 bytes
- truncated: false

**Extracted HTML Content:**

### Element 2 (small)
**Tag:** strong
**Size:** 22 bytes

```html
<strong>small</strong>
```

**Suggestions:**
- Some selectors did not match elements. Try using more specific or alternative selectors.


```
- Code
```js
// HTML inspection completed
// Extracted 1 element(s) in 160ms
```


### Tool call: browser_snapshot
- Args
```json
{
  "expectation": {
    "includeSnapshot": true,
    "includeConsole": false,
    "includeDownloads": false,
    "includeTabs": false,
    "includeCode": false,
    "snapshotOptions": {
      "maxLength": 5000,
      "format": "aria"
    }
  }
}
```
- Snapshot: 004.snapshot.yml


### Tool call: browser_batch_execute
- Args
```json
{
  "steps": [
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "ref": "e72"
          }
        ]
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "ref": "e19"
          }
        ]
      },
      "continueOnError": false
    }
  ],
  "stopOnFirstError": false,
  "globalExpectation": {
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
- Result
```
### Batch Execution Summary
- Status: ✅ Completed
- Total Steps: 2
- Successful: 2
- Failed: 0
- Total Time: 17722ms

### Step Details
✅ Step 1: browser_click (16096ms)
   
   ### Page state
   - **Page URL:** https://akbps-lacourts-sandbox-headless.onakumina.com/
   ...
✅ Step 2: browser_click (1626ms)
   
   ### Page state
   - **Page URL:** https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/search.aspx?term=small
   ...

### Final State

### Page state
- **Page URL:** https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/search.aspx?term=small
- **Page Title:** lacourts - Search
- Page Snapshot:
```yaml
- generic [ref=e1]:
  - main "main-header" [ref=e4]:
    - heading "Akumina Foundation Root Site" [level=1] [ref=e5]
    - button "Skip to content" [ref=e6] [cursor=pointer]
    - generic [ref=e8]:
      - generic:
        - generic:
          - generic:
            - button "Toggle Dashboard" [active] [ref=e42] [cursor=pointer]:
              - generic "Toggle Dashboard" [ref=e43]: 
            - text: 
      - generic [ref=e9]:
        - generic [ref=e10]:
          - link "Company logo." [ref=e13] [cursor=pointer]:
            - /url: https://akbps-lacourts-sandbox-headless.onakumina.com/
            - img "Company logo." [ref=e14]
          - generic [ref=e15]:
            - generic [ref=e16]:
              - text: 
              - generic [ref=e17]:
                - generic [ref=e48]:
                  - textbox "Search this site." [ref=e49]
                  - textbox "Search this site." [ref=e18]:
                    - /placeholder: Search
                    - text: small
                - button "Search this site." [ref=e19] [cursor=pointer]:
                  - generic "Search this site." [ref=e20]: 
              - text:     
            - button "Save Bookmark" [ref=e88] [cursor=pointer]:
              - generic "Save Bookmark" [ref=e89]: 
            - text:    
            - list [ref=e21]:
              - listitem [ref=e22]:
                - button "Notifications" [ref=e23] [cursor=pointer]:
                  - img "My profile picture." [ref=e24]
                  - generic "Offline" [ref=e90]
                - text:    
        - generic [ref=e91]:
          - text: 
          - navigation [ref=e92]:
            - text: 
            - list [ref=e93]:
              - listitem [ref=e94]:
                - link "Home" [ref=e96] [cursor=pointer]:
                  - /url: https://akbps-lacourts-sandbox-headless.onakumina.com
              - listitem [ref=e97]:
                - generic [ref=e98]:
                  - link "Court Info" [ref=e99] [cursor=pointer]:
                    - /url: javascript:void(0)
                  - generic [ref=e101]: 
              - listitem [ref=e102]:
                - link "Events" [ref=e104] [cursor=pointer]:
                  - /url: https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/eventlist.aspx
              - listitem [ref=e105]:
                - link "Staff Directory" [ref=e107] [cursor=pointer]:
                  - /url: https://akbps-lacourts-sandbox-headless.onakumina.com#/sitepages/peoplefinder.aspx
              - listitem [ref=e108]:
                - generic [ref=e109]:
                  - link "Department Site" [ref=e110] [cursor=pointer]:
                    - /url: javascript:void(0)
                  - generic [ref=e112]: 
      - navigation "breadcrumb" [ref=e440]:
        - list [ref=e441]:
          - listitem [ref=e442]:
            - link "Home" [ref=e443] [cursor=pointer]:
              - /url: https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/home.aspx
          - listitem [ref=e444]: / Search
      - generic [ref=e34]:
        - text: 
        - generic [ref=e35]: 
        - list [ref=e362]:
          - listitem [ref=e363]:
            - link "Get to know us" [ref=e364] [cursor=pointer]:
              - /url: javascript:void(0)
            - list [ref=e367]:
              - listitem [ref=e368]:
                - link "Akumina Community" [ref=e369] [cursor=pointer]:
                  - /url: https://community.akumina.com/
              - listitem [ref=e370]:
                - link "Support" [ref=e371] [cursor=pointer]:
                  - /url: https://akumina.com/support/
              - listitem [ref=e372]:
                - link "Developer Portal" [ref=e373] [cursor=pointer]:
                  - /url: https://akumina.github.io/
          - listitem [ref=e374]:
            - link "Privacy" [ref=e375] [cursor=pointer]:
              - /url: javascript:void(0)
            - list [ref=e378]:
              - listitem [ref=e379]:
                - link "Privacy policy" [ref=e380] [cursor=pointer]:
                  - /url: javascript:void(0)
              - listitem [ref=e381]:
                - link "Cookie policy" [ref=e382] [cursor=pointer]:
                  - /url: javascript:void(0)
          - listitem [ref=e383]:
            - link "Terms & conditions" [ref=e384] [cursor=pointer]:
              - /url: javascript:void(0)
        - generic [ref=e37]:
          - link "Company Logo." [ref=e39] [cursor=pointer]:
            - /url: https://akbps-lacourts-sandbox-headless.onakumina.com
            - img "Company Logo." [ref=e40]
          - text: "|"
          - generic [ref=e41]: © Superior Court of California, County of Los Angeles All rights reserved.
    - text:    
  - navigation [ref=e386]:
    - generic [ref=e387]:
      - generic [ref=e388]:
        - button "Expand Menu" [ref=e390] [cursor=pointer]:
          - generic "Expand Menu" [ref=e391]: 
        - button "Create New" [ref=e394] [cursor=pointer]:
          - generic "Create New" [ref=e395]: 
        - button "Pages" [ref=e397] [cursor=pointer]:
          - generic "Pages" [ref=e398]: 
        - button "Structured Content" [ref=e400] [cursor=pointer]:
          - generic "Structured Content" [ref=e401]: 
        - button "Asset Library" [ref=e403] [cursor=pointer]:
          - generic "Asset Library" [ref=e404]: 
        - button "Menus" [ref=e406] [cursor=pointer]:
          - generic "Menus" [ref=e407]: 
        - button "Analytics" [ref=e410] [cursor=pointer]:
          - generic "Analytics" [ref=e411]: 
        - button "Awards & Recognitions" [ref=e413] [cursor=pointer]:
          - generic "Awards & Recognitions" [ref=e414]: 
        - button "Broadcast Center" [ref=e416] [cursor=pointer]:
          - generic "Broadcast Center" [ref=e417]: 
        - button "Workflows" [ref=e419] [cursor=pointer]:
          - generic "Workflows" [ref=e420]: 
        - button "Editorial Notifications" [ref=e422] [cursor=pointer]:
          - generic "Editorial Notifications" [ref=e423]: 
        - button "Launch App Manager" [ref=e425] [cursor=pointer]:
          - generic "Launch App Manager" [ref=e426]: 
      - generic [ref=e427]:
        - button "Debug" [ref=e429] [cursor=pointer]:
          - generic "Debug" [ref=e430]: 
        - generic [ref=e432]:
          - img "Akumina Inc." [ref=e434] [cursor=pointer]
          - text:    
        - button "Toggle page builder bars" [ref=e435] [cursor=pointer]:
          - generic "Toggle page builder bars" [ref=e436]: 
```

```


### Tool call: browser_inspect_html
- Args
```json
{
  "selectors": [
    {
      "role": "main"
    },
    {
      "css": ".ak-widget, #genericsearchlist, [id*='search'], .fs-search-result"
    }
  ],
  "depth": 5,
  "includeStyles": false,
  "maxSize": 50000,
  "format": "html",
  "includeAttributes": true,
  "preserveWhitespace": false,
  "includeSuggestions": false,
  "includeChildren": true,
  "optimizeForLLM": false
}
```
- Result
```
## HTML Inspection Results

**Configuration:**
- selectors: 2 selector(s)
- depth: 5
- format: html
- maxSize: 50000 bytes
- includeAttributes: true
- optimizeForLLM: false

**Timing:**
- total: 3155ms
- selector resolution: 16ms
- extraction: 3138ms

**Statistics:**
- elements found: 2
- selectors not found: 0
- average depth: 5.0
- Total size: 23343 bytes
- truncated: false

**Extracted HTML Content:**

### Element 0 (main)
**Tag:** div
**Size:** 1442 bytes
**Attributes:** {"rel":"Mission control","class":"ak-widget","id":"4db2dd2b-ca5a-4f46-ab4c-6ba70ff0208e"}

```html
<div rel="Mission control" class="ak-widget" id="4db2dd2b-ca5a-4f46-ab4c-6ba70ff0208e"><div class="ia-misson-control-wrapper"><a href="javascript:void(0)" class="ia-icon-dashboard fs-js-icon-rocket" role="button"><i class="fa-light fa-rocket-launch" aria-label="Toggle Dashboard"></i></a><div id="missioncontrolcontainer" class="fs-js-mission-control ia-mission-control" style="display: none;"><div class="ia-mission-control-modal-content"><header class="ia-mission-control-header"><div class="fs-js-close-mission-control ia-close-mission-control"><a href="javascript:void(0)" role="button"><i class="fa-regular fa-xmark" aria-label="Close Mission Control"></i></a></div><h1 id="fs-mission-control-title">Dashboard</h1></header><!--Add company mandated widgets here--><section class="ia-mission-control-section"></section><section class="ia-mission-control-section"><div rel="LaunchPad misson control" class="ak-widget fs-js-mission-control-widget" id="0ce86121-aab2-49b8-8846-1b04923d9e8e"></div><div class="row"><div class="col-12"><div rel="DashboardConfigurationWidget-DashboardConfiguration" class="ak-widget fs-js-mission-control-widget" id="00452c52-411d-464c-9173-8e991b71334e"></div></div></div><div class="fs-js-mission-control-widget-section"><div rel="DashboardRendererWidget-DashboardRenderer" class="ak-widget fs-js-mission-control-widget" id="00452f52-411d-464c-9273-8e661b71334e"></div></div></section></div></div></div></div>
```

**Children (1):**
- <div class="ia-misson-control-wrapper"> (1349 bytes)

### Element 1 (.ak-widget, #genericsearchlist, [id*='search'], .fs-search-result)
**Tag:** div
**Size:** 21901 bytes
**Attributes:** {"id":"ak-master","class":"rootsite-page","role":"main","aria-label":"main-header"}

```html
<div id="ak-master" class="rootsite-page" role="main" aria-label="main-header"><h1 id="main-header" class="main-landmark--header ia-sr-only" role="heading" aria-level="1">Akumina Foundation Root Site</h1><a href="#content" id="skip" class="ia-skip" role="button">Skip to content</a><div id="s4-workspace"><div class="ia-page-wrapper ia-mega-menu-always-open"><div class="fs-toggle-mission-control ak-widget-wrapper"><div rel="Mission control" class="ak-widget" id="4db2dd2b-ca5a-4f46-ab4c-6ba70ff0208e"><div class="ia-misson-control-wrapper"><a href="javascript:void(0)" class="ia-icon-dashboard fs-js-icon-rocket" role="button"><i class="fa-light fa-rocket-launch" aria-label="Toggle Dashboard"></i></a><div id="missioncontrolcontainer" class="fs-js-mission-control ia-mission-control" style="display: none;"><div class="ia-mission-control-modal-content"><header class="ia-mission-control-header"><div class="fs-js-close-mission-control ia-close-mission-control"><a href="javascript:void(0)" role="button"><i class="fa-regular fa-xmark" aria-label="Close Mission Control"></i></a></div><h1 id="fs-mission-control-title">Dashboard</h1></header><!--Add company mandated widgets here--><section class="ia-mission-control-section"></section><section class="ia-mission-control-section"><div rel="LaunchPad misson control" class="ak-widget fs-js-mission-control-widget" id="0ce86121-aab2-49b8-8846-1b04923d9e8e"></div><div class="row"><div class="col-12"><div rel="DashboardConfigurationWidget-DashboardConfiguration" class="ak-widget fs-js-mission-control-widget" id="00452c52-411d-464c-9173-8e991b71334e"></div></div></div><div class="fs-js-mission-control-widget-section"><div rel="DashboardRendererWidget-DashboardRenderer" class="ak-widget fs-js-mission-control-widget" id="00452f52-411d-464c-9273-8e661b71334e"></div></div></section></div></div></div></div></div><div class="tour-container ak-widget-wrapper"><div rel="Tour" class="ak-widget" id="39330afb-5230-4bfa-bd6e-aa11c29aa411"></div></div><header class="fs-header fs-js-header aksearchexclude"><div class="ia-top-header"><div class="ia-left-header"><div class="ia-logo-wrapper ak-site-logo"><a class="ak-spalink" data-interception="off" href="https://akbps-lacourts-sandbox-headless.onakumina.com/"><img src="https://samplenonclient.blob.core.windows.net/lacourtssandbox/akumina library/digitalworkplace/images/courtspace_logomark.png" alt="Company logo."></a></div></div><div class="ia-right-header action-items ak-widget-wrapper"><div class="respSearch fs-search-wrapper fs-oobsearch-wrapper"><a class="ia-oobsearch-close ia-js-oobsearch-close" aria-hidden="true"><i class="fa-regular fa-xmark" aria-label="Close search"></i></a><div class="ia-search-combo"><span class="twitter-typeahead" style="position: relative; display: inline-block;"><input type="text" class="ia-search-combo-box form-control ak-dw-searchlistbox ia-search-box tt-hint" autocomplete="off" aria-label="Search this site." readonly="" spellcheck="false" tabindex="-1" dir="ltr" style="position: absolute; top: 0px; left: 0px; border-color: transparent; box-shadow: none; opacity: 1; background: none 0% 0% / auto repeat scroll padding-box padding-box rgb(255, 255, 255);"><input type="text" id="siteSearch" class="ia-search-combo-box form-control ak-dw-searchlistbox ia-search-box tt-input" autocomplete="off" aria-label="Search this site." placeholder="Search" spellcheck="false" dir="auto" style="position: relative; vertical-align: top; background-color: transparent;"><pre aria-hidden="true" style="position: absolute; visibility: hidden; white-space: pre; font-family: Lato, sans-serif; font-size: 16px; font-style: normal; font-variant: normal; font-weight: 400; word-spacing: 0px; letter-spacing: 0px; text-indent: 0px; text-rendering: auto; text-transform: none;"></pre><div class="tt-menu tt-empty" style="position: absolute; top: 100%; left: 0px; z-index: 100; display: none;"><div class="tt-dataset tt-dataset-akuminasearch"></div></div></span><button class="fs-search-site ia-btn-search" id="btnSearchAction"><i class="fa-regular fa-magnifying-glass" aria-label="Search this site."></i></button></div><div class="ak-search-typeahead-container ak-widget-wrapper" style="position: absolute; display: none;"><div class="ak-widget" id="5f95efff-4148-4850-a3a4-65d4a2e0dd0f"><div class="fs-search-typeahead-container aksearchexclude"><div class="fs-search-typeahead-tabs"><ul class="fs-search-tabs" id="typeaheadTabs"><li class="fs-tab-item" data-tabname="pages"><a class="fs-active" href="javascript:void(0)"><i class="fa-light fa-file-lines" aria-hidden="true"></i><label>Pages</label></a></li><li class="fs-tab-item" data-tabname="document"><a href="javascript:void(0)"><i class="fa-light fa-folder" aria-hidden="true"></i><label>Documents</label></a></li><li class="fs-tab-item" data-tabname="people"><a href="javascript:void(0)"><i class="fa-light fa-circle-user" aria-hidden="true"></i><label>People</label></a></li><li class="fs-tab-item" data-tabname="media"><a href="javascript:void(0)"><i class="fa-regular fa-photo-film" aria-hidden="true"></i><label>Media</label></a></li><li class="fs-tab-item" data-tabname="resources"><a href="javascript:void(0)"><i class="fa fa-gavel" aria-hidden="true"></i><label>Resources</label></a></li></ul></div><div class="fs-search-tab-content"><div id="typeaheadLoader" class="ia-hide"></div><div class="fs-search-typeahead-tabs-content"><div id="suggestionstab" class="fs-search-suggestions fs-tabs-content ia-popularResult "><p class="fs-zero-suggestion">No suggestions found</p></div><div id="pagestab" class="fs-tabs-content fs-pages  fs-active "><div class="fs-item "><a class="fs-item-link ak-spalink" href="https://akbps-lacourts-sandbox-headless.onakumina.com#/foundationnews/en-us/mesh-for-microsoft-teams" data-interception="off"><div class="fs-item-image  "><img src="https://akbps-lacourts-sandbox-am.onakumina.com/api/sharepoint/spfile?siteUrl=https://akbps.sharepoint.com/sites/lacourts-sandbox-delivery&amp;relativeUrl=/sites/lacourts-sandbox-delivery/akumina%20library/digitalworkplace/images/metaverse.jpg" alt="Mesh for Microsoft Teams" aria-hidden="true"></div><div class="fs-item-searched"><div class="h4 fs-item-title">Mesh for Microsoft Teams</div><div class="fs-item-site">lacourts</div><div class="fs-item-summary">More than a year and a half into a global pandemic that forced workers around the world to abandon their offices and learn to collaborate online, Microsoft productivity experts have observed two trends: remote workers are far more efficient than most business leaders ever imagined, and they miss...</div></div></a></div></div><div id="documenttab" class="fs-tabs-content fs-document "><p class="fs-empty-results">Your search for "<strong>small</strong>" did not return any results, try searching again.</p></div><div id="peopletab" class="fs-tabs-content fs-people "><p class="fs-empty-results">Your search for "<strong>small</strong>" did not return any results, try searching again.</p></div><div id="mediatab" class="fs-tabs-content fs-document "><div class="fs-item "><a class="fs-item-link ak-spalink" href="https://akbps.sharepoint.com/sites/lacourts-sandbox-delivery/Lists/FoundationNews_AK/7_.000" target="_blank" data-interception="off"><div class="fs-item-image"><img class="fs-js-mediafiletype-thumbnail " src="https://akbps-lacourts-sandbox-am.onakumina.com/api/sharepoint/spfile?siteUrl=https://akbps.sharepoint.com/sites/lacourts-sandbox-delivery&amp;relativeUrl=/sites/lacourts-sandbox-delivery/akumina%20library/digitalworkplace/images/metaverse.jpg" alt="Mesh for Microsoft Teams" aria-hidden="true" data-thumbnailpath=""></div><div class="fs-item-searched"><p class="h4 fs-item-title">Mesh for Microsoft Teams</p><p class="fs-item-site">lacourts</p><p class="fs-item-summary">More than a year and a half into a global pandemic that forced workers around the world to abandon their offices and learn to collaborate online, Microsoft productivity experts have observed two trends: remote workers are far more efficient than most business leaders ever imagined, and they miss...</p></div></a></div></div><div id="resourcestab" class="fs-tabs-content fs-document "></div><div id="resultCount" class="fs-search-result-count ia-search-result-count"><a href="javascript:void(0)">Go to search results</a></div></div></div></div></div></div></div><div class="ia-bookmark-container"><button type="button" class="ia-button-bookmark" id="btnBookmank" title="Save Bookmark"><i class="fa-regular fa-bookmark" aria-label="Save Bookmark"></i></button><div rel="Bookmark-Favorites" class="ak-widget mfp-hide" id="3f58c6dc-d497-4e2c-a96d-03c32c19392a"><!-- aksearchexclude:start --><div id="addBookmarkModal" class="ia-modal ia-modal-small ia-bookmark-modal mfp-hide aksearchexclude"><header class="ia-modal-header"><h2>Add Favorites</h2></header><section class="ia-modal-content fs-js-modal-content"><div class="ia-form-row"><label>Title</label><div class="ia-value"><input id="fs-js-value-favorite-title" required="" minlength="1" type="text" placeholder="Add a Title"><span style="font-size: 0.8em;color: #882424; display:none;">Please enter title</span></div></div><div class="ia-form-row"><label>URL</label><div class="ia-value "><input id="fs-js-value-favorite-url" required="" minlength="1" type="text" placeholder="Add a URL"><span style="font-size: 0.8em;color: #882424; display:none;">Please enter a valid URL</span></div></div><div class="ia-form-row"><div class="ia-value"><label class="ia-checkbox-wrapper"><input id="fs-js-value-favorite-new-tab" class="checkbox ak-lookin-checkbox" type="checkbox"><span class="ia-checkbox-label">Open in new window</span><span class="ia-checkbox"></span></label></div></div><div class="ia-form-row"><label>Type</label><div class="ia-value"><select id="fs-js-value-favorite-type" class="text w-100"><option value="shortcut">Shortcuts</option><option value="news">News</option><option value="contact">Contacts</option><option value="quicklink">Quick Links</option></select></div></div></section><footer class="ia-modal-footer"><input type="button" id="cancelBtn" class="ia-button-text " value="Cancel"><input type="button" id="popupSaveButton" class="ia-button-primary " value="Save"></footer></div><!-- aksearchexclude:end --></div></div><div id="setNotificationTop" class="ia-toggle-notification ak-widget-wrapper" title="Notifications"><div rel="ActivityNotifications stub instance" class="ak-widget" id="bda833d9-3657-608e-9ffa-92bc25c8a900"><div class="ia-notification"><a href="#" class="notification-bell activity-options"><i class="fa fa-bell"></i><div></div></a><div><div></div><section class="notification-submenu-container ia-notification-panel aksearchexclude" style="display: none;"><header class="fs-notification-header clearfix"><div class="ia-notification-header"><h2 class="h4">Notifications</h2></div><button class="ia-button-text" role="button" title="Notification Settings"><i class="fa-solid fa-sliders"></i></button><a href="javascript:void(0)" role="button" class="ia-close" aria-label="Closed notificaton bar"><i class="fa-regular fa-xmark" aria-hidden="true"></i></a></header><div class="ia-notification-tab-wrapper"><div class="ia-notification-tab-header"></div></div><div class="notification-list fs-notification-list"><div class="ia-button-row"><a href="javascript:void(0)" class="ia-button"><i class="fa-regular fa-arrow-rotate-right" aria-hidden="true"></i>Load More</a></div></div></section></div></div></div></div><ul id="setMeTop" class="ia-user-profile user-profile-dropdown"><li class="ia-js-user-profile-icon"><button id="userDisplayButton" type="button" class="ia-user-profile-button ia-user-teams-presence-container" aria-label="Notifications"><img class="userImageDisplay" src="https://samplenonclient.blob.core.windows.net/profile-picture/akumina@akbps.onmicrosoft.com" alt="My profile picture."><div id="userPresence" title="Offline" class="ia-user-profile-by-status ia-offline"></div></button><ul id="userDropdown" class="ia-user-profile-dropdown"><li class="liPreferences fs-preferences"><div rel="User personalization" class="ak-widget" id="31aa33b6-c238-52d6-061c-8b2a0c625f61"></div><a id="masterPreferences" class="openpersonalization" href="javascript:void(0)"><span><i class="fa-regular fa-sliders" aria-hidden="true"></i></span><span>My Preferences &amp; Interests</span></a></li><li class="liProfile fs-profile"><a href="javascript:void(0)"><span><i class="fa-regular fa-circle-user" aria-hidden="true"></i></span><span id="masterProfile">View Profile</span></a></li><li id="li-langprofile" class="ia-languagepicker-active mfp-hide"><a id="langprofile" class="" href="javascript:void(0)"><span><i class="fa-regular fa-language" aria-hidden="true"></i></span><span>Switch Language</span></a></li><li class="li-Signout fs-signout"><a href="javascript:void(0)"><span><i class="fa-regular fa-arrow-right-from-bracket" aria-hidden="true"></i></span><span id="masterSignout">Sign Out</span></a></li></ul></li></ul></div></div><div class="ak-foundation-main-nav-wrapper ak-widget-wrapper fs-js-header"><div rel="TopNav-MegaMenu" class="ak-widget" id="30125804-3eb3-4d16-9ca1-476be1613081"><div class="ak-widget-item aksearchexclude ia-mega-menu-wrapper fs-js-mega-menu-wrapper"><!--Partial start--><!--Partial end--><button class="ia-menu-toggle fs-js-menu-toggle"><i class="fa-regular fa-bars" aria-hidden="true"></i><span>Menu</span></button><nav class="ia-mega-menu ia-css-menu"><button class="ia-close-menu fs-js-menu-toggle"><i class="fa-regular fa-xmark" aria-hidden="true"></i><span>Close</span></button><ul class="ia-menu-level-1"><li data-itemlevel="1" data-id="27" data-heading="Home" class=""><div class="ia-menu-level-1-link"><a class="ak-spalink  fs-js-menu-link" href="https://akbps-lacourts-sandbox-headless.onakumina.com" target="_self" data-interception="off"><i class="fa-regular fa-none" aria-hidden="true"></i>Home</a></div></li><li data-itemlevel="1" data-id="32" data-heading="Court Info" class="ia-has-submenu fs-js-has-submenu"><div class="ia-menu-level-1-link fs-js-expand-menu"><a href="javascript:void(0)" target="_self" class="ak-spalink " data-interception="off"><i class="fa-regular fa-none" aria-hidden="true"></i>Court Info</a><span><i tabindex="0" class="fa-solid fa-chevron-down"></i></span></div><div class="ia-menu-submenu-wrapper fs-js-menu-submenu-wrapper "><ul class="fs-js-submenu-ul ia-menu-submenu ia-menu-level-2"><li data-itemlevel="2" data-id="33" class=""><a class="ak-spalink ia-menu-level-2-link fs-js-menu-link" href="https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/newslist.aspx" target="_self" onclick="" aria-label="News" data-interception="off"><i class="fa-regular fa-none" aria-hidden="true"></i>News</a></li><li data-itemlevel="2" data-id="34" class=""><a class="ak-spalink ia-menu-level-2-link fs-js-menu-link" href="https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/about.aspx" target="_self" onclick="" aria-label="About" data-interception="off"><i class="fa-regular fa-none" aria-hidden="true"></i>About</a></li></ul></div></li><li data-itemlevel="1" data-id="28" data-heading="Events" class=""><div class="ia-menu-level-1-link"><a class="ak-spalink  fs-js-menu-link" href="https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/eventlist.aspx" target="_self" data-interception="off"><i class="fa-regular fa-none" aria-hidden="true"></i>Events</a></div></li><li data-itemlevel="1" data-id="12" data-heading="Staff Directory" class=""><div class="ia-menu-level-1-link"><a class="ak-spalink  fs-js-menu-link" href="https://akbps-lacourts-sandbox-headless.onakumina.com#/sitepages/peoplefinder.aspx" target="_self" data-interception="off"><i class="fa-regular fa-" aria-hidden="true"></i>Staff Directory</a></div></li><li data-itemlevel="1" data-id="30" data-heading="Department Site" class="ia-has-submenu fs-js-has-submenu"><div class="ia-menu-level-1-link fs-js-expand-menu"><a href="javascript:void(0)" target="_self" class="ak-spalink " data-interception="off"><i class="fa-regular fa-none" aria-hidden="true"></i>Department Site</a><span><i tabindex="0" class="fa-solid fa-chevron-down"></i></span></div><div class="ia-menu-submenu-wrapper fs-js-menu-submenu-wrapper "><ul class="fs-js-submenu-ul ia-menu-submenu ia-menu-level-2"><li data-itemlevel="2" data-id="31" class=""><a class="ak-spalink ia-menu-level-2-link fs-js-menu-link" href="https://akbps-lacourts-sandbox-headless.onakumina.com/sites/lacourts-sandbox-department" target="_self" onclick="" aria-label="Information Technology" data-interception="off"><i class="fa-regular fa-none" aria-hidden="true"></i>Information Technology</a></li></ul></div></li></ul></nav></div></div></div></header><div class="ak-foundation-page-wrapper ia-content-wrapper"><div class="ak-widget-wrapper"><div rel="SiteAlerts" class="ak-widget" id="0d2d284a-3715-4e4a-beda-bb770b59ef21"><div class="ia-empty-site-alerts" style="padding: 5px;"></div></div></div><div class="ak-widget-wrapper"><div rel="Breadcrumbs Widget" class="ak-widget" id="3b4f2e0a-784c-4bad-8b23-070f7238357c"><nav aria-label="breadcrumb"><ol class="breadcrumb ia-breadcrumb"><li class="breadcrumb-item"><a href="https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/home.aspx" class="ak-spalink" data-interception="off">Home</a></li><li class="breadcrumb-item active">Search</li></ol></nav></div></div><div class="ia-content"><div id="content"><div class="ak-page-wrapper row"><div class="page-component-action"><div class="ak-widget-row zoneLayoutComponent"><div class="grid-x ak-clear-fix"><div class="one-z-sm12 row"><div class="cell small-12 medium-12 columns col-12"><div class="ak-zone-component" data-zone-id="zone1"><div class="ak-widget ak-clear-fix widgetComponent" id="c28c7ca3-8912-4aa9-a082-030488cd958a"></div></div></div></div></div></div></div></div></div></div></div><footer class="ia-footer aksearchexclude ia-site-footer"><button id="scrollOnTop" class="ia-scroll-top ia-hide ia-scroll-top-square"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i><span>Top</span></button><div class="ia-top-footer load-form ia-load-form-link"><span>How do you like the intranet?</span><a href="#"><i class="fa-regular fa-comment-arrow-up-right" aria-hidden="true"></i>Tell Us What You Think</a></div><div class="ia-top-footer ak-widget-wrapper"><div rel="Foundation3-FooterLinks" class="ak-widget" id="d59ed461-e23d-4d97-8fcb-1a158a59c1ab"><div class="ak-widget-item aksearchexclude" ak-item=""><ul class="ia-footer-level-1"><li><a title="" href="javascript:void(0)" target="_self" onclick="" class="ia-footer-title ak-spalink" data-interception="off">Get to know us</a><div class="fs-category-cols"><div class="fs-footer-col"><ul class="ia-footer-level-2"><li><a title="Akumina Community" href="https://community.akumina.com/" class="ak-spalink" target="_self" onclick="" data-interception="off">Akumina Community</a></li><li><a title="Support" href="https://akumina.com/support/" class="ak-spalink" target="_self" onclick="" data-interception="off">Support</a></li><li><a title="Developer Portal" href="https://akumina.github.io/" class="ak-spalink" target="_self" onclick="" data-interception="off">Developer Portal</a></li></ul></div></div></li><li><a title="" href="javascript:void(0)" target="_self" onclick="" class="ia-footer-title ak-spalink" data-interception="off">Privacy</a><div class="fs-category-cols"><div class="fs-footer-col"><ul class="ia-footer-level-2"><li><a title="" href="javascript:void(0)" class="ak-spalink" target="_self" onclick="" data-interception="off">Privacy policy</a></li><li><a title="" href="javascript:void(0)" class="ak-spalink" target="_self" onclick="" data-interception="off">Cookie policy</a></li></ul></div></div></li><li><a title="" href="javascript:void(0)" target="_self" onclick="" class="ia-footer-title ak-spalink" data-interception="off">Terms &amp; conditions</a></li></ul></div></div></div><div class="ia-bottom-footer"><div class="ia-footer-logo ak-site-logo"><a class="ak-spalink" data-interception="off" href="https://akbps-lacourts-sandbox-headless.onakumina.com"><img src="https://samplenonclient.blob.core.windows.net/lacourtssandbox/akumina library/digitalworkplace/images/courtspace_logomark.png" alt="Company Logo." loading="lazy"></a></div><div class="ia-footer-page-details"><div class="ia-page-contact"><span>Page contact:</span><a href="mailto:"></a></div><div class="ia-page-modified"><span>Last updated:</span><span>08/18/25 4:28 PM</span></div></div><div class="ia-footer-copyright">©Superior Court of California, County of Los AngelesAll rights reserved.</div></div></footer></div><div id="formscontainer" class="forms-modal ia-modal mfp-hide"><div rel="Forms" class="hive-widget" id="9f4ec881-fca6-4013-95db-bbcc75a59508"></div><div class="ia-button-row ia-js-modal-close-row"><button class="ia-js-close-btn ia-button ia-button-primary">Close</button></div></div></div><nav class="ia-mobile-nav-wrapper"><ul class="ia-mobile-nav"><li><button id="ia-js-menu-btn-search" class="ia-mobile-menu-btn ia-mobile-menu-search"><i class="fa-light fa-magnifying-glass" aria-hidden="true"></i><span>Search</span></button></li><li><button id="ia-js-menu-btn-mission-control" class="ia-mobile-menu-btn ia-mobile-menu-mission-control"><i class="fa-light fa-rocket-launch" aria-hidden="true"></i><span>Mission Control</span></button></li><li><button id="ia-js-menu-btn-notifications" class="ia-mobile-menu-btn ia-mobile-menu-notifications"><i class="fa-regular fa-bell" aria-hidden="true"></i><span>Notifications</span><span class="ia-mobile-unread-count">0</span></button></li><li><button id="ia-js-menu-btn-toggle" class="ia-mobile-menu-btn ia-mobile-menu-toggle ia-js-mobile-menu-toggle"><i class="fa-regular fa-bars" aria-hidden="true"></i><span>Menu</span></button></li></ul></nav></div>
```

**Children (3):**
- <h1 id="main-header" class="main-landmark--header ia-sr-only"> (125 bytes)
- <a id="skip" class="ia-skip"> (78 bytes)
- <nav class="ia-mobile-nav-wrapper"> (901 bytes)


```
- Code
```js
// HTML inspection completed
// Extracted 2 element(s) in 3155ms
```


### Tool call: browser_console_messages
- Args
```json
{
  "consoleOptions": {
    "levels": [
      "error",
      "warn"
    ],
    "maxMessages": 50,
    "removeDuplicates": false
  }
}
```
- Result
```
[ERROR] Failed to load resource: the server responded with a status of 404 () @ https://login.microsoftonline.com/favicon.ico:0
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Akumina Caught Error:  There was a problem with your language tokens (TokenExists) window.lang is undefined @ https://akuminafiles.azureedge.net/products/6.3.0.0/fe/6.3.2501.2308/digitalworkplace.headless.bundle.hive.min.js?v=2026.03.20.03:6424
[ERROR] Failed to load resource: the server responded with a status of 404 () @ https://akbps-lacourts-sandbox-headless.onakumina.com/staticfiles/favicon.ico:0
```

