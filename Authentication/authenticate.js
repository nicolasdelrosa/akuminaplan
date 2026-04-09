// Mount Sinai Authentication Script
const MOUNT_SINAI_CONFIG = {
  username: "akumina@akbps.onmicrosoft.com", // Replace with actual credentials
  password: "603US@kud@1",                // Replace with actual credentials
  baseUrl: "https://akbps-wcb-sandbox-headless.onakumina.com/"
};

// Authentication workflow
const authenticationSteps = [
  {
    tool: "browser_navigate",
    arguments: { url: MOUNT_SINAI_CONFIG.baseUrl },
    expectation: { includeSnapshot: true, includeConsole: true }
  },
  {
    tool: "browser_wait_for", 
    arguments: { time: 3 }
  },
  {
    tool: "browser_type",
    arguments: {
      selectors: [{ css: "input[name='loginfmt']" }],
      text: MOUNT_SINAI_CONFIG.username
    }
  },
  {
    tool: "browser_click",
    arguments: {
      selectors: [{ role: "button", text: "Avançar" }]
    }
  },
  {
    tool: "browser_wait_for",
    arguments: { time: 2 }
  },
  {
    tool: "browser_type",
    arguments: {
      selectors: [{ css: "input[name='passwd']" }],
      text: MOUNT_SINAI_CONFIG.password
    }
  },
  {
    tool: "browser_click",
    arguments: {
      selectors: [{ role: "button", text: "Entrar" }]
    }
  },
  {
    tool: "browser_wait_for",
    arguments: { time: 10 }
  }
];