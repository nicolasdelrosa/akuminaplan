/**
 * Browser Navigation with Authentication
 * 
 * This script provides automated browser navigation with authentication
 * using the Playwright browser automation tool via MCP.
 */

// Authentication Configuration
const AUTH_CONFIG = {
  username: "akumina@akbps.onmicrosoft.com",
  password: "603US@kud@1",
  baseUrl: "https://akbps-wcb-sandbox-headless.onakumina.com/"
};

/**
 * Creates a batch execution workflow for navigating to a URL with authentication
 * @param {string} targetUrl - The URL to navigate to
 * @returns {Object} Batch execution configuration
 */
function createAuthenticatedNavigationWorkflow(targetUrl) {
  return {
    steps: [
      // Step 1: Navigate to the target URL
      {
        tool: "browser_navigate",
        arguments: { 
          url: targetUrl || AUTH_CONFIG.baseUrl,
          expectation: {
            includeSnapshot: true,
            includeConsole: true
          }
        }
      },
      
      // Step 2: Wait for initial page load
      {
        tool: "browser_wait_for",
        arguments: { time: 3 }
      },
      
      // Step 3: Enter username
      {
        tool: "browser_type",
        arguments: {
          selectors: [
            { css: "input[name='loginfmt']" },
            { css: "input[type='email']" },
            { role: "textbox", text: "email" }
          ],
          text: AUTH_CONFIG.username
        },
        expectation: {
          includeSnapshot: false
        }
      },
      
      // Step 4: Click Next/Continue button
      {
        tool: "browser_click",
        arguments: {
          selectors: [
            { role: "button", text: "Avançar" },
            { role: "button", text: "Next" },
            { css: "input[type='submit']" },
            { css: "button[type='submit']" }
          ]
        },
        expectation: {
          includeSnapshot: false
        }
      },
      
      // Step 5: Wait for password field to appear
      {
        tool: "browser_wait_for",
        arguments: { time: 2 }
      },
      
      // Step 6: Enter password
      {
        tool: "browser_type",
        arguments: {
          selectors: [
            { css: "input[name='passwd']" },
            { css: "input[type='password']" },
            { role: "textbox", text: "password" }
          ],
          text: AUTH_CONFIG.password
        },
        expectation: {
          includeSnapshot: false
        }
      },
      
      // Step 7: Click Sign In button
      {
        tool: "browser_click",
        arguments: {
          selectors: [
            { role: "button", text: "Entrar" },
            { role: "button", text: "Sign in" },
            { role: "button", text: "Login" },
            { css: "input[type='submit']" }
          ]
        },
        expectation: {
          includeSnapshot: false
        }
      },
      
      // Step 8: Wait for authentication to complete and page to load
      {
        tool: "browser_wait_for",
        arguments: { time: 10 }
      },
      
      // Step 9: Take final snapshot to verify successful login
      {
        tool: "browser_snapshot",
        arguments: {
          expectation: {
            includeSnapshot: true,
            includeConsole: true,
            includeTabs: true
          }
        }
      }
    ],
    
    // Global expectation settings for all steps
    globalExpectation: {
      includeSnapshot: false,
      diffOptions: {
        enabled: true,
        format: "minimal"
      }
    },
    
    // Continue on error for better debugging
    stopOnFirstError: false
  };
}

/**
 * Simple navigation workflow without authentication
 * Use this for public pages that don't require login
 */
function createSimpleNavigationWorkflow(targetUrl) {
  return {
    steps: [
      {
        tool: "browser_navigate",
        arguments: { 
          url: targetUrl,
          expectation: {
            includeSnapshot: true,
            includeConsole: true
          }
        }
      },
      {
        tool: "browser_wait_for",
        arguments: { time: 2 }
      },
      {
        tool: "browser_snapshot",
        arguments: {
          expectation: {
            includeSnapshot: true
          }
        }
      }
    ]
  };
}

/**
 * Detect if URL requires authentication
 * @param {string} url - The URL to check
 * @returns {boolean} True if authentication is likely needed
 */
function requiresAuthentication(url) {
  const authPatterns = [
    'onakumina.com',
    'akbps',
    'login',
    'auth',
    'signin'
  ];
  
  return authPatterns.some(pattern => url.toLowerCase().includes(pattern));
}

// Export for use by the skill system
module.exports = {
  createAuthenticatedNavigationWorkflow,
  createSimpleNavigationWorkflow,
  requiresAuthentication,
  AUTH_CONFIG
};
