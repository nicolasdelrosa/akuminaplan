const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat, PageBreak, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType, VerticalAlign } = require('docx');
const fs = require('fs');
const path = require('path');

// Deployment tickets data - extracted from the release notes content
const deploymentTickets = [
  { key: 'UFA-287', project: 'UFA', summary: 'Global Search - Exclude SharePoint System Lists', type: 'Story', priority: 'Medium' },
  { key: 'UFA-286', project: 'UFA', summary: 'Enhanced Search Results - SLW Integration', type: 'Story', priority: 'Medium' },
  { key: 'UFA-285', project: 'UFA', summary: 'Enhanced Search Results - System & Tools', type: 'Story', priority: 'Medium' },
  { key: 'UFA-275', project: 'UFA', summary: 'Search Exclude Configuration Logic', type: 'Story', priority: 'Medium' },
  { key: 'UFA-276', project: 'UFA', summary: 'Custom Tools & Resources Widget', type: 'Story', priority: 'Medium' },
  { key: 'UFA-281', project: 'UFA', summary: 'User Greetings Widget Update', type: 'Story', priority: 'Medium' },
  { key: 'UFA-282', project: 'UFA', summary: 'Banner Carousel Height Reduction', type: 'Story', priority: 'Medium' },
  { key: 'UFA-283', project: 'UFA', summary: 'Widget Spacing Adjustment', type: 'Story', priority: 'Medium' },
  { key: 'UFA-278', project: 'UFA', summary: 'Top Navigation Text Color', type: 'Story', priority: 'Medium' },
  { key: 'UFA-279', project: 'UFA', summary: 'User Preferences Color Update', type: 'Story', priority: 'Medium' },
  { key: 'UFA-277', project: 'UFA', summary: 'Card Shadow Styling', type: 'Story', priority: 'Medium' },
  { key: 'UFA-274', project: 'UFA', summary: 'Document Search Results Enhancement', type: 'Story', priority: 'Medium' },
  { key: 'UFA-280', project: 'UFA', summary: 'Document Search Short Description', type: 'Story', priority: 'Medium' },
  { key: 'UFA-270', project: 'UFA', summary: 'ModifiedBy Null Value Handling', type: 'Bug', priority: 'Medium' },
  { key: 'UFA-288', project: 'UFA', summary: 'Deployment Tracking Ticket', type: 'Story', priority: 'Medium' }
];

// Function to generate Playwright tests for deployment tickets
function generatePlaywrightTests(tickets) {
  const testsDir = path.join(__dirname, 'tests');
  
  // Ensure tests directory exists
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }

  // Group tickets by project
  const ticketsByProject = tickets.reduce((acc, ticket) => {
    if (!acc[ticket.project]) {
      acc[ticket.project] = [];
    }
    acc[ticket.project].push(ticket);
    return acc;
  }, {});

  // Generate tests for each project
  Object.keys(ticketsByProject).forEach(project => {
    const projectDir = path.join(testsDir, project);
    
    // Create project directory if it doesn't exist
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
      console.log(`Created directory: ${projectDir}`);
    }

    // Generate test file for each ticket
    ticketsByProject[project].forEach(ticket => {
      const testFilePath = path.join(projectDir, `${ticket.key}.spec.ts`);
      
      // Skip if test already exists
      if (fs.existsSync(testFilePath)) {
        console.log(`Test already exists: ${testFilePath}`);
        return;
      }

      const testContent = generateTestTemplate(ticket);
      fs.writeFileSync(testFilePath, testContent);
      console.log(`Created test: ${testFilePath}`);
    });
  });
}

// Function to generate test template based on ticket type
function generateTestTemplate(ticket) {
  const baseUrl = getBaseUrlForProject(ticket.project);
  
  if (ticket.type === 'Bug') {
    return generateBugTestTemplate(ticket, baseUrl);
  } else if (ticket.summary.toLowerCase().includes('performance') || ticket.summary.toLowerCase().includes('load')) {
    return generatePerformanceTestTemplate(ticket, baseUrl);
  } else if (ticket.summary.toLowerCase().includes('search')) {
    return generateSearchTestTemplate(ticket, baseUrl);
  } else if (ticket.summary.toLowerCase().includes('widget') || ticket.summary.toLowerCase().includes('ui') || ticket.summary.toLowerCase().includes('color') || ticket.summary.toLowerCase().includes('styling')) {
    return generateUITestTemplate(ticket, baseUrl);
  } else {
    return generateGenericTestTemplate(ticket, baseUrl);
  }
}

// Get base URL for different projects
function getBaseUrlForProject(project) {
  const urls = {
    'UFA': 'https://akbps-ufa-sandbox-headless.onakumina.com',
    'LAC': 'https://lacourts-dev.sharepoint.com',
    'JMSMUC': 'https://jmsmuckers-dev.sharepoint.com',
    'WCB': 'https://wcb-dev.sharepoint.com',
    'BCRS': 'https://ballcorp-dev.sharepoint.com',
    'POM': 'https://pomerleau-dev.sharepoint.com'
  };
  return urls[project] || 'https://example.com';
}

// Bug test template
function generateBugTestTemplate(ticket, baseUrl) {
  return `import { test, expect } from '@playwright/test';

/**
 * ${ticket.key}: ${ticket.summary}
 * Type: ${ticket.type}
 * Priority: ${ticket.priority}
 * 
 * Bug Fix Verification Test
 */

test.describe('${ticket.key} - ${ticket.summary}', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application (authentication handled by setup)
    await page.goto('${baseUrl}');
    await page.waitForLoadState('networkidle');
  });

  test('should verify bug fix - ${ticket.summary}', async ({ page }) => {
    // TODO: Implement test steps to reproduce the original bug scenario
    // TODO: Verify that the bug no longer occurs
    
    // Example: Navigate to affected page
    // await page.goto('${baseUrl}/path/to/affected/page');
    
    // Example: Verify fix is applied
    // const element = await page.locator('selector');
    // await expect(element).toBeVisible();
    
    throw new Error('Test not implemented - please add specific verification steps');
  });

  test('should verify no regression in related functionality', async ({ page }) => {
    // TODO: Add regression tests for related features
    throw new Error('Test not implemented');
  });
});
`;
}

// Performance test template
function generatePerformanceTestTemplate(ticket, baseUrl) {
  return `import { test, expect } from '@playwright/test';

/**
 * ${ticket.key}: ${ticket.summary}
 * Type: ${ticket.type}
 * Priority: ${ticket.priority}
 * 
 * Performance Verification Test
 */

test.describe('${ticket.key} - ${ticket.summary}', () => {
  test('should meet performance metrics', async ({ page }) => {
    // Start measuring performance (authentication handled by setup)
    const startTime = Date.now();
    
    await page.goto('${baseUrl}');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // TODO: Adjust threshold based on requirements
    expect(loadTime).toBeLessThan(3000); // 3 seconds threshold
    
    console.log(\`Page load time: \${loadTime}ms\`);
  });

  test('should verify performance optimization is applied', async ({ page }) => {
    await page.goto('${baseUrl}');
    
    // TODO: Add specific checks for performance optimizations
    // Examples:
    // - Check if CDN is being used
    // - Verify lazy loading is enabled
    // - Check resource sizes
    // - Verify caching headers
    
    throw new Error('Test not implemented - add specific performance checks');
  });

  test('should measure cold load performance', async ({ page, context }) => {
    // Clear cache for cold load
    await context.clearCookies();
    
    const startTime = Date.now();
    await page.goto('${baseUrl}');
    await page.waitForLoadState('networkidle');
    const coldLoadTime = Date.now() - startTime;
    
    console.log(\`Cold load time: \${coldLoadTime}ms\`);
    
    // TODO: Set appropriate threshold
    expect(coldLoadTime).toBeLessThan(5000);
  });

  test('should measure warm load performance', async ({ page }) => {
    // First load to warm up cache
    await page.goto('${baseUrl}');
    await page.waitForLoadState('networkidle');
    
    // Measure warm load
    const startTime = Date.now();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const warmLoadTime = Date.now() - startTime;
    
    console.log(\`Warm load time: \${warmLoadTime}ms\`);
    
    // TODO: Set appropriate threshold
    expect(warmLoadTime).toBeLessThan(2000);
  });
});
`;
}

// Search test template
function generateSearchTestTemplate(ticket, baseUrl) {
  return `import { test, expect } from '@playwright/test';

/**
 * ${ticket.key}: ${ticket.summary}
 * Type: ${ticket.type}
 * Priority: ${ticket.priority}
 * 
 * Search Functionality Test
 */

test.describe('${ticket.key} - ${ticket.summary}', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('${baseUrl}');
    await page.waitForLoadState('networkidle');
  });

  test('should perform global search correctly', async ({ page }) => {
    // TODO: Locate search input (update selector)
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    
    // TODO: Update search term
    await searchInput.fill('test search term');
    await searchInput.press('Enter');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // TODO: Add verification for search results
    // const results = page.locator('.search-results');
    // await expect(results).toBeVisible();
    
    throw new Error('Test not implemented - add specific search verification');
  });

  test('should verify search filters work correctly', async ({ page }) => {
    // TODO: Implement search filter tests
    throw new Error('Test not implemented');
  });

  test('should verify search results exclude system lists', async ({ page }) => {
    // TODO: Add specific test for excluding SharePoint system paths
    // Verify that results don't include /style library/forms/allitems.aspx
    throw new Error('Test not implemented');
  });

  test('should verify typeahead search functionality', async ({ page }) => {
    // TODO: Test typeahead/autocomplete functionality
    throw new Error('Test not implemented');
  });
});
`;
}

// UI/Widget test template
function generateUITestTemplate(ticket, baseUrl) {
  return `import { test, expect } from '@playwright/test';

/**
 * ${ticket.key}: ${ticket.summary}
 * Type: ${ticket.type}
 * Priority: ${ticket.priority}
 * 
 * UI/Widget Verification Test
 */

test.describe('${ticket.key} - ${ticket.summary}', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('${baseUrl}');
    await page.waitForLoadState('networkidle');
  });

  test('should verify UI element renders correctly', async ({ page }) => {
    // TODO: Locate the UI element (update selector)
    // const element = page.locator('selector-for-element');
    
    // TODO: Verify element is visible
    // await expect(element).toBeVisible();
    
    throw new Error('Test not implemented - add specific UI verification');
  });

  test('should verify styling is applied correctly', async ({ page }) => {
    // TODO: Check CSS properties
    // const element = page.locator('selector');
    // const color = await element.evaluate(el => getComputedStyle(el).color);
    // expect(color).toBe('expected-color');
    
    throw new Error('Test not implemented');
  });

  test('should verify responsive behavior', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    // TODO: Add desktop verification
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    // TODO: Add tablet verification
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    // TODO: Add mobile verification
    
    throw new Error('Test not implemented');
  });

  test('should verify widget functionality', async ({ page }) => {
    // TODO: Test widget interactions and functionality
    throw new Error('Test not implemented');
  });
});
`;
}

// Generic test template
function generateGenericTestTemplate(ticket, baseUrl) {
  return `import { test, expect } from '@playwright/test';

/**
 * ${ticket.key}: ${ticket.summary}
 * Type: ${ticket.type}
 * Priority: ${ticket.priority}
 */

test.describe('${ticket.key} - ${ticket.summary}', () => {
  test.beforeEach(async ({ page }) => {
    // Authentication handled by setup
    await page.goto('${baseUrl}');
    await page.waitForLoadState('networkidle');
  });

  test('should verify ${ticket.summary}', async ({ page }) => {
    // TODO: Implement test steps
    // 1. Navigate to the affected area
    // 2. Perform actions related to the ticket
    // 3. Verify expected behavior
    
    throw new Error('Test not implemented - please add specific test steps');
  });

  test('should verify acceptance criteria', async ({ page }) => {
    // TODO: Add tests for each acceptance criteria from the ticket
    throw new Error('Test not implemented');
  });
});
`;
}

const doc = new Document({
  styles: {
    default: { 
      document: { 
        run: { font: "Arial", size: 24 } // 12pt default
      } 
    },
    paragraphStyles: [
      {
        id: "Title",
        name: "Title",
        basedOn: "Normal",
        run: { size: 56, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER }
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 1 }
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 120, after: 60 }, outlineLevel: 2 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullet-list",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 }
              }
            }
          }
        ]
      },
      {
        reference: "checkbox-list",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "☐",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 }
              }
            }
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // Title
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun("UFA Development Deployment")]
      }),
      new Paragraph({
        heading: HeadingLevel.TITLE,
        children: [new TextRun("Release Notes - January 16, 2026")]
      }),
      new Paragraph({ children: [new TextRun("")] }), // Spacing

      // Deployment Information Section
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Deployment Information")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // Table for deployment info
      new Table({
        columnWidths: [3120, 6240],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })] })]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 6240, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("January 16, 2026")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Environment", bold: true })] })]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 6240, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("Development (UFA-sandbox)")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Branch", bold: true })] })]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 6240, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("dev_2026.01.16.01")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Pipeline", bold: true })] })]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 6240, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("UFA Development - Headless Pipeline (#839)")] })]
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Pull Request", bold: true })] })]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
                width: { size: 6240, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun("#16042")] })]
              })
            ]
          })
        ]
      }),

      new Paragraph({ children: [new TextRun("")] }), // Spacing
      new Paragraph({ children: [new PageBreak()] }),

      // Summary
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Summary")]
      }),
      new Paragraph({ children: [new TextRun("This deployment includes 27 commits from master with 15 tickets addressing search functionality improvements, UI/UX enhancements, and widget optimizations.")] }),
      new Paragraph({ children: [new TextRun("")] }),

      // Features & Enhancements
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Features & Enhancements")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // Search Improvements
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Search Improvements")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-287
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-287: Global Search - Exclude SharePoint System Lists")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Internal Testing")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Global search and typeahead now filters out SharePoint system lists and forms to prevent users from being directed to internal system paths.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Search results no longer include /style library/forms/allitems.aspx and similar system paths")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Users will only see relevant content in search results")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-286 & UFA-285
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-286 & UFA-285: Enhanced Search Results")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("To Do")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Added SLW (Site List Widget) and System & Tools results to both typeahead and global search functionality.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Search now includes results from Site List Widgets")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("System & Tools content is now searchable")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-275
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-275: Search Exclude Configuration Logic")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Ready to Deploy")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Added logic to handle empty search exclude configuration.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("System properly handles cases where search exclude config is not set")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Prevents errors when aksearchexclude configuration is empty")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // UI/UX Improvements
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("UI/UX Improvements")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-276
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-276: Custom Tools & Resources Widget")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("In Progress")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Implemented a customized widget with searchable 4-column grid layout for the Tools & Systems page.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("New custom view: ufa-search-grid")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("4-column grid layout with consistent tile sizing")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Real-time search functionality filtering items by title and summary")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Mobile-responsive design with minimum width for search box")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-281
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-281: User Greetings Widget Update")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Ready to Deploy")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Removed date display from user greetings widget to optimize space on homepage.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-282
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-282: Banner Carousel Height Reduction")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Ready to Deploy")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Reduced the height of the Banner Carousel View on the homepage.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Image height within slick slider reduced to 300px")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Additional unused space removed for cleaner appearance")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-283
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-283: Widget Spacing Adjustment")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Ready to Deploy")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Reduced widget bottom margin for better visual flow.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("--fs-widgets-bottom-spacing reduced from 96px to 48px")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Tighter, more compact layout across all widgets")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // Content & Styling Updates
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Content & Styling Updates")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-278
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-278: Top Navigation Text Color")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Ready to Deploy")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Updated top navigation and header text colors for better brand consistency.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Navigation text changed to black")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Orange hover effect added")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Improved visual hierarchy and readability")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-279
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-279: User Preferences Color Update")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Ready to Deploy")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Changed taxonomy label colors in user preferences.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Taxonomy labels changed from orange to black")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Consistent with overall branding improvements")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-277
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-277: Card Shadow Styling")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Ready to Deploy")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Updated card styling to use drop shadows instead of borders.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Orange border removed from cards")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Drop shadow applied for modern, elevated appearance")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Consistent styling across all card components")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // Document Search
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Document Search")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-274 & UFA-280
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-274 & UFA-280: Document Search Results Enhancement")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Ready to Deploy")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Updated document search results to display Short Description instead of SharePoint document preview.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Short Description field now displayed in search results")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("If Short Description is blank, summary remains blank (no fallback)")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Cleaner, more controlled search result display")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // Bug Fixes
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Bug Fixes")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // UFA-270
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun("UFA-270: ModifiedBy Null Value Handling")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Priority: ", bold: true }), new TextRun("Medium")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Status: ", bold: true }), new TextRun("Ready to Deploy")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Description:", bold: true })]
      }),
      new Paragraph({
        children: [new TextRun("Created fallback logic for when ModifiedBy field is null.")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "What Changed:", bold: true })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Fallback chain: ModifiedBy → Editor → Author")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Prevents errors when document metadata is incomplete")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Ensures user information always displays")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      new Paragraph({ children: [new PageBreak()] }),

      // Deployment Instructions
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Deployment Instructions")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Complete PR #16042 merge in Azure DevOps")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Run UFA Development - Headless Pipeline (#839)")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Select branch: dev_2026.01.16.01")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Verify deployment on UFA dev environment")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Test search functionality and widget updates")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Confirm visual changes match specifications")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // Post-Deployment Verification
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Post-Deployment Verification")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        numbering: { reference: "checkbox-list", level: 0 },
        children: [new TextRun("Search excludes SharePoint system lists")]
      }),
      new Paragraph({
        numbering: { reference: "checkbox-list", level: 0 },
        children: [new TextRun("SLW and System & Tools appear in search results")]
      }),
      new Paragraph({
        numbering: { reference: "checkbox-list", level: 0 },
        children: [new TextRun("Tools & Resources widget displays correctly with 4-column layout")]
      }),
      new Paragraph({
        numbering: { reference: "checkbox-list", level: 0 },
        children: [new TextRun("Banner carousel height is 300px")]
      }),
      new Paragraph({
        numbering: { reference: "checkbox-list", level: 0 },
        children: [new TextRun("Widget spacing is 48px")]
      }),
      new Paragraph({
        numbering: { reference: "checkbox-list", level: 0 },
        children: [new TextRun("Top nav shows black text with orange hover")]
      }),
      new Paragraph({
        numbering: { reference: "checkbox-list", level: 0 },
        children: [new TextRun("Cards display with drop shadow")]
      }),
      new Paragraph({
        numbering: { reference: "checkbox-list", level: 0 },
        children: [new TextRun("Document search shows Short Description")]
      }),
      new Paragraph({
        numbering: { reference: "checkbox-list", level: 0 },
        children: [new TextRun("User greetings widget has no date")]
      }),
      new Paragraph({ children: [new TextRun("")] }),

      // Support
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun("Support")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun("For questions or issues related to this deployment, contact:")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Diego Rosa (diego.rosa@akumina.com)")]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun("Luke Shuck (Luke.Shuck@akumina.com)")]
      }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({ children: [new TextRun("")] }),
      new Paragraph({
        children: [new TextRun({ text: "Deployment Tracking Ticket: ", bold: true }), new TextRun("UFA-288")]
      }),
      new Paragraph({
        children: [new TextRun({ text: "Last Updated: ", bold: true }), new TextRun("January 16, 2026")]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  try {
    fs.writeFileSync("c:\\AkuminaPlan\\UFA_Dev_Deployment_Jan_16_2026_Release_Notes.docx", buffer);
    console.log("Document created successfully!");
  } catch (error) {
    console.log("Note: Could not write document file (file may be open):", error.message);
  }
  
  // Generate Playwright tests for deployment tickets
  console.log("\n=== Generating Playwright Tests ===");
  generatePlaywrightTests(deploymentTickets);
  console.log("=== Test Generation Complete ===\n");
});
