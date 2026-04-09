
### Tool call: browser_batch_execute
- Args
```json
{
  "steps": [
    {
      "tool": "browser_navigate",
      "arguments": {
        "url": "https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/courtresources.aspx"
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_screenshot",
      "arguments": {
        "name": "court-resources-grid-view",
        "fullPage": false
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-people-results-byList"
          }
        ]
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_screenshot",
      "arguments": {
        "name": "court-resources-list-view",
        "fullPage": false
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-people-results-byGrid"
          }
        ]
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
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
            "css": "#courtResourcesSearch"
          }
        ],
        "text": "forms"
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": "#btnCourtResourcesSearch"
          }
        ]
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_screenshot",
      "arguments": {
        "name": "court-resources-search-results",
        "fullPage": false
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
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
[BatchExecute] Batch operation failed: Unknown tool: "browser_screenshot" at step 1. Available tools: browser_click,browser_close,browser_console_messages,browser_diagnose,browser_drag,browser_evaluate,browser_file_upload,browser_find_elements,browser_handle_dialog,browser_hover,browser_inspect_html,browser_install,browser_navigate,browser_navigate_back,browser_navigate_forward,browser_network_requests,browser_press_key,browser_resize,browser_select_option,browser_snapshot,browser_tab_close,browser_tab_list,browser_tab_new,browser_tab_select,browser_take_screenshot,browser_type,browser_wait_for
```


### Tool call: browser_batch_execute
- Args
```json
{
  "steps": [
    {
      "tool": "browser_navigate",
      "arguments": {
        "url": "https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/courtresources.aspx"
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "seconds": 3
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "fullPage": false,
        "name": "01-court-resources-grid-view"
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-people-results-byList"
          }
        ]
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "seconds": 1
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "fullPage": false,
        "name": "02-court-resources-list-view"
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-people-results-byGrid"
          }
        ]
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
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
            "css": "#courtResourcesSearch"
          }
        ],
        "text": "forms"
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": "#btnCourtResourcesSearch"
          }
        ]
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "seconds": 2
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "fullPage": false,
        "name": "03-court-resources-search-results"
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ak-clearfilter-js"
          }
        ]
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "seconds": 2
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-refinement-checkbox"
          }
        ]
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "seconds": 1
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "fullPage": false,
        "name": "04-court-resources-with-filters"
      },
      "continueOnError": false,
      "expectation": {
        "includeSnapshot": false,
        "includeConsole": false,
        "includeDownloads": false,
        "includeTabs": false,
        "includeCode": false
      }
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
- Total Steps: 16
- Successful: 0
- Failed: 1
- Total Time: 6169ms
- Note: Execution stopped early due to error

### Step Details
❌ Step 1: browser_navigate (6168ms)
   Error: page._wrapApiCall: Execution context was destroyed, most likely because of a navigation
Batch execution stopped due to error
```


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
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 3
      },
      "continueOnError": false
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
      "tool": "browser_wait_for",
      "arguments": {
        "time": 2
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
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 3
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "role": "button",
            "text": "No"
          }
        ]
      },
      "continueOnError": true
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 5
      },
      "continueOnError": false
    },
    {
      "tool": "browser_navigate",
      "arguments": {
        "url": "https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/courtresources.aspx"
      },
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 4
      },
      "continueOnError": false
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "filename": "01-court-resources-grid-view.png",
        "fullPage": false
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-people-results-byList"
          }
        ]
      },
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 1
      },
      "continueOnError": false
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "filename": "02-court-resources-list-view.png",
        "fullPage": false
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-people-results-byGrid"
          }
        ]
      },
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 1
      },
      "continueOnError": false
    },
    {
      "tool": "browser_type",
      "arguments": {
        "selectors": [
          {
            "css": "#courtResourcesSearch"
          }
        ],
        "text": "forms"
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": "#btnCourtResourcesSearch"
          }
        ]
      },
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 3
      },
      "continueOnError": false
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "filename": "03-court-resources-search-results.png",
        "fullPage": false
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ak-clearfilter-js"
          }
        ]
      },
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 2
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-refinement-checkbox"
          }
        ]
      },
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 1
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ak-applyfilter-js"
          }
        ]
      },
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 3
      },
      "continueOnError": false
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "filename": "04-court-resources-with-filters.png",
        "fullPage": false
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
- Total Steps: 29
- Successful: 2
- Failed: 1
- Total Time: 3808ms
- Note: Execution stopped early due to error

### Step Details
✅ Step 1: browser_navigate (584ms)
   
✅ Step 2: browser_wait_for (3193ms)
   ### Result
   Waited for 3
   
   ...
❌ Step 3: browser_type (28ms)
   Error: Failed to resolve element selectors: No elements found matching CSS selector "input[name='loginfmt']"
Batch execution stopped due to error
```


### Tool call: browser_batch_execute
- Args
```json
{
  "steps": [
    {
      "tool": "browser_navigate",
      "arguments": {
        "url": "https://akbps-lacourts-sandbox-headless.onakumina.com/#/sitepages/courtresources.aspx"
      },
      "continueOnError": false
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 5
      },
      "continueOnError": false
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "filename": "01-court-resources-grid-view.png",
        "fullPage": false
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-people-results-byList"
          }
        ]
      },
      "continueOnError": true
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 1
      },
      "continueOnError": false
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "filename": "02-court-resources-list-view.png",
        "fullPage": false
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-people-results-byGrid"
          }
        ]
      },
      "continueOnError": true
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 1
      },
      "continueOnError": false
    },
    {
      "tool": "browser_type",
      "arguments": {
        "selectors": [
          {
            "css": "#courtResourcesSearch"
          }
        ],
        "text": "forms"
      },
      "continueOnError": true
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": "#btnCourtResourcesSearch"
          }
        ]
      },
      "continueOnError": true
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 3
      },
      "continueOnError": false
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "filename": "03-court-resources-search-results.png",
        "fullPage": false
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ak-clearfilter-js"
          }
        ]
      },
      "continueOnError": true
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 2
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ia-refinement-checkbox"
          }
        ]
      },
      "continueOnError": true
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 1
      },
      "continueOnError": false
    },
    {
      "tool": "browser_click",
      "arguments": {
        "selectors": [
          {
            "css": ".ak-applyfilter-js"
          }
        ]
      },
      "continueOnError": true
    },
    {
      "tool": "browser_wait_for",
      "arguments": {
        "time": 3
      },
      "continueOnError": false
    },
    {
      "tool": "browser_take_screenshot",
      "arguments": {
        "filename": "04-court-resources-filtered.png",
        "fullPage": false
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
- Status: ✅ Completed
- Total Steps: 19
- Successful: 18
- Failed: 1
- Total Time: 30420ms

### Step Details
✅ Step 1: browser_navigate (13ms)
   
✅ Step 2: browser_wait_for (5098ms)
   ### Result
   Waited for 5
   
   ...
✅ Step 3: browser_take_screenshot (155ms)
   ### Result
   Took the viewport screenshot and saved it as c:\AkuminaPlan\.playwright-mcp\01-court-resources-grid-view.png
   
✅ Step 4: browser_click (1124ms)
   
✅ Step 5: browser_wait_for (1042ms)
   ### Result
   Waited for 1
   
   ...
✅ Step 6: browser_take_screenshot (104ms)
   ### Result
   Took the viewport screenshot and saved it as c:\AkuminaPlan\.playwright-mcp\02-court-resources-list-view.png
   
✅ Step 7: browser_click (1088ms)
   
✅ Step 8: browser_wait_for (1037ms)
   ### Result
   Waited for 1
   
   ...
✅ Step 9: browser_type (1081ms)
   
✅ Step 10: browser_click (2905ms)
   
✅ Step 11: browser_wait_for (3044ms)
   ### Result
   Waited for 3
   
   ...
✅ Step 12: browser_take_screenshot (144ms)
   ### Result
   Took the viewport screenshot and saved it as c:\AkuminaPlan\.playwright-mcp\03-court-resources-search-results.png
   
✅ Step 13: browser_click (1894ms)
   
✅ Step 14: browser_wait_for (5294ms)
   ### Result
   Waited for 2
   
   ...
❌ Step 15: browser_click (7ms)
   Error: Failed to resolve any element selectors: No elements found matching CSS selector ".ia-refinement-checkbox"
✅ Step 16: browser_wait_for (1041ms)
   ### Result
   Waited for 1
   
   ...
✅ Step 17: browser_click (1883ms)
   
✅ Step 18: browser_wait_for (3341ms)
   ### Result
   Waited for 3
   
   ...
✅ Step 19: browser_take_screenshot (125ms)
   ### Result
   Took the viewport screenshot and saved it as c:\AkuminaPlan\.playwright-mcp\04-court-resources-filtered.png
   

### Final State
### Result
Took the viewport screenshot and saved it as c:\AkuminaPlan\.playwright-mcp\04-court-resources-filtered.png

Batch execution completed with failures
```

