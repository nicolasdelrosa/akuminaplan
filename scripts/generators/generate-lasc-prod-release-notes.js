const docx = require("docx");
const fs = require("fs");

const {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
  PageBreak,
  TableOfContents,
} = docx;

// Helper function to create a property table
function createPropertyTable(properties) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: "0066CC" },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Property",
                    bold: true,
                    color: "FFFFFF",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: "0066CC" },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Type",
                    bold: true,
                    color: "FFFFFF",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            shading: { fill: "0066CC" },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Description",
                    bold: true,
                    color: "FFFFFF",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      ...properties.map(
        (prop) =>
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: prop.name, bold: true })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: prop.type })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: prop.description })],
                  }),
                ],
              }),
            ],
          })
      ),
    ],
  });
}

// Helper function to create translation tables
function createTranslationTable(language, translations) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: "28A745" },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Key",
                    bold: true,
                    color: "FFFFFF",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            shading: { fill: "28A745" },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${language} Translation`,
                    bold: true,
                    color: "FFFFFF",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      ...translations.map(
        (trans) =>
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: trans.key, font: "Courier New", size: 18 })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: trans.value })],
                  }),
                ],
              }),
            ],
          })
      ),
    ],
  });
}

// Create document
const doc = new Document({
  title: "LA Courts Production Deployment - Release Notes",
  description: "Production deployment documentation for LA Courts January 16, 2026",
  sections: [
    {
      properties: {},
      children: [
        // Title Page
        new Paragraph({
          text: "LA Courts (LASC)",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Production Deployment",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Release Notes - January 16, 2026",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Document Version: 1.1",
              italics: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Generated: January 22, 2026",
              italics: true,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Table of Contents
        new Paragraph({
          text: "Table of Contents",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          pageBreakBefore: true,
        }),
        new TableOfContents("Table of Contents", {
          hyperlink: true,
          headingStyleRange: "1-3",
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Deployment Information
        new Paragraph({
          text: "Deployment Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Date: ", bold: true }),
            new TextRun({ text: "January 16, 2026" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Environment: ", bold: true }),
            new TextRun({ text: "Production (LASC)" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Source Branch: ", bold: true }),
            new TextRun({ text: "1.26.01.14.01" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Source Build: ", bold: true }),
            new TextRun({ text: "2601.1401 (Build ID 107996)" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Reference DEV Deployment: ", bold: true }),
            new TextRun({ text: "LAC-216 (Dev Deployment 1/9)" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Related Production Ticket: ", bold: true }),
            new TextRun({ text: "LAC-215" }),
          ],
          spacing: { after: 200 },
        }),

        // Summary
        new Paragraph({
          text: "Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "This production deployment includes 5 tickets with 44 commits from the DEV environment, covering custom widget implementation, PeopleSync improvements, and performance optimizations for images and UI components.",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Deployment Period: ", bold: true }),
            new TextRun({ text: "December 22, 2025 - January 14, 2026" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Contributors: ", bold: true }),
            new TextRun({ text: "Saikiran Puramsetti, Diego Rosa, Scott Kearney" }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // ============================
        // LAC-213: CUSTOM TILES WIDGET - COMPREHENSIVE DOCUMENTATION
        // ============================
        new Paragraph({
          text: "LAC-213: Custom Tiles Widget - Comprehensive Documentation",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Priority: ", bold: true }),
            new TextRun({ text: "Medium" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Status: ", bold: true }),
            new TextRun({ text: "Ready for Production" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Commits: ", bold: true }),
            new TextRun({ text: "40" }),
          ],
          spacing: { after: 200 },
        }),

        // Overview
        new Paragraph({
          text: "Overview",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
        }),
        new Paragraph({
          text: "The Custom Tiles Widget is a comprehensive search and display solution built on the GenericSearchListWidget framework. It provides a powerful, customizable interface for displaying court resources in both grid (tile) and list (table) views with advanced filtering, search, and multi-language support.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Key Features",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "• Dual View Modes: Grid (tiles) and List (table) with instant switching",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Advanced Search: Real-time keyword search with dynamic filtering",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Dynamic Refiners: Filterable taxonomy-based facets with live counts",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Pagination Support: Load more functionality with configurable page sizes",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Bookmark Integration: Add resources to user favorites",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Deep Linking: URL-based filter persistence and sharing",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Multi-Language: Full support for English, Spanish, and French",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Responsive Design: Mobile-optimized layouts and interactions",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Widget Configuration
        new Paragraph({
          text: "Widget Configuration Properties",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: "The following table describes all configurable properties available for the Court Resources Widget:",
          spacing: { after: 200 },
        }),

        createPropertyTable([
          {
            name: "selectfields",
            type: "String (CSV)",
            description: "SharePoint fields to retrieve from search results. Includes title, URL, description, icons, metadata, and identifiers.",
          },
          {
            name: "ispaging",
            type: "Boolean",
            description: "Enables pagination functionality. When true, results load in pages with 'Load More' button.",
          },
          {
            name: "pagesize",
            type: "Number",
            description: "Number of items per page. Default: 6. Controls initial load and subsequent pagination.",
          },
          {
            name: "query",
            type: "String (KQL)",
            description: "Keyword Query Language filter. Default: (ContentType:\"Court Resource\"). Defines base search criteria.",
          },
          {
            name: "refiners",
            type: "Array",
            description: "Managed metadata refiners for filtering. Each refiner has 'refinerName' (internal name) and 'refinerDisplayName' (user-facing label).",
          },
          {
            name: "xrank",
            type: "String",
            description: "XRANK query component for result boosting. Used to promote specific items in search results.",
          },
          {
            name: "callbackmethod",
            type: "String",
            description: "JavaScript function name for data transformation. Default: 'TransformCourtResourceData'. Processes raw search results before rendering.",
          },
          {
            name: "cacheinterval",
            type: "Number",
            description: "Cache duration in minutes. -1 disables caching. Positive values cache search results to reduce API calls.",
          },
          {
            name: "uicallbackmethod",
            type: "String",
            description: "JavaScript function for UI event binding. Default: 'BindCourtResourcesUI'. Attaches event handlers after rendering.",
          },
          {
            name: "sortlist",
            type: "String",
            description: "Default sort configuration. Empty string uses spsortfield/spsortorder properties instead.",
          },
          {
            name: "sitecollectionurl",
            type: "String",
            description: "Target site collection URL for search scope. Empty string searches current site collection.",
          },
          {
            name: "searchonfirstload",
            type: "Boolean",
            description: "Executes search immediately on widget load. True shows results automatically; false requires user action.",
          },
          {
            name: "searchscope",
            type: "String",
            description: "Defines search scope. Options: 'searchAcrossSites' (tenant-wide), 'searchCurrentSite', 'searchCurrentWeb'.",
          },
          {
            name: "fetchpromotedresult",
            type: "Boolean",
            description: "Includes SharePoint promoted results (Best Bets) in search results when true.",
          },
          {
            name: "fetchdocuments",
            type: "Boolean",
            description: "Includes document library items in results. Required for Court Resources content type.",
          },
          {
            name: "fetchpages",
            type: "Boolean",
            description: "Includes SharePoint pages in results. False for document-only searches.",
          },
          {
            name: "fetchpeople",
            type: "Boolean",
            description: "Includes people/user profiles in results. False for resource-only searches.",
          },
          {
            name: "fetchmedia",
            type: "Boolean",
            description: "Includes media files (images, videos) in results. False for standard content.",
          },
          {
            name: "trimduplicates",
            type: "Boolean",
            description: "Removes duplicate results based on URL. False preserves all matches.",
          },
          {
            name: "facets",
            type: "Array",
            description: "Additional facet configuration for advanced filtering scenarios. Empty array uses refiners instead.",
          },
          {
            name: "typeaheaddefaulttab",
            type: "String",
            description: "Default tab for search typeahead suggestions. Options: 'pages', 'documents', 'people'.",
          },
          {
            name: "supporteddocumentextensions",
            type: "String (CSV)",
            description: "File extensions to include in document search. Default: 'zip,txt,doc,docx,xls,xlsx,ppt,pptx,pdf'.",
          },
          {
            name: "querycallbackmethod",
            type: "String",
            description: "Pre-search query modification function. Allows dynamic query manipulation before API call.",
          },
          {
            name: "peopledirectoryquerycallbackmethod",
            type: "String",
            description: "People-specific query callback. Used when fetchpeople is true.",
          },
          {
            name: "spsortfield",
            type: "JSON String",
            description: "Sort field configuration array. Example: [{\"PropertyName\":\"LACCOURTSORTORDER\",\"DisplayName\":\"Sort Order\"}]. Supports multiple sort levels.",
          },
          {
            name: "spsortorder",
            type: "String",
            description: "Sort direction. Options: 'asc' (ascending), 'desc' (descending). Works with spsortfield.",
          },
          {
            name: "extendlookin",
            type: "JSON Array",
            description: "Additional search locations beyond configured scope. Empty array uses searchscope only.",
          },
        ]),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Data Transformation
        new Paragraph({
          text: "Data Transformation Process",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: "The TransformCourtResourceData Function",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "This custom callback function transforms raw SharePoint search results into a structured format optimized for the widget template. The transformation handles:",
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "1. Field Mapping and Normalization",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Extracts values from SharePoint managed properties",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Handles multiple field name formats (OWSTEXT, OWSURL, OWSMTXT, OWSBOOL, OWSNMBR)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Processes managed metadata taxonomy values (L0|#GUID|Label format)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Parses comma-separated URL fields to extract actual URLs",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "2. Pagination and Load More Support",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Detects pagination state (first load vs. load more)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Merges new results with existing items on pagination",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Prevents duplicate items using ID-based tracking",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Calculates total results and remaining pages",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "3. Refiner Processing",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Caches original refiner counts on first load",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Merges cached counts with filtered results",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Preserves refiner selection states across searches",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Maintains accurate counts when filters are applied",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "4. URL Parameter Integration",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Extracts search terms from URL hash parameters",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Populates PrepopulatedFilters for deep linking",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Supports filter sharing via URLs",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Handles SPA routing with hash-based navigation",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "5. View Mode Persistence",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "• Reads saved view preference from localStorage",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Defaults to grid view if no preference exists",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Includes IsListView flag in transformed data",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Ensures consistent view mode across page loads",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // UI Functionality
        new Paragraph({
          text: "User Interface Features",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),

        new Paragraph({
          text: "Search Functionality",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "Real-Time Keyword Search",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Custom search input (#courtResourcesSearch) with placeholder text",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Search button with Font Awesome icon (fa-search)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Enter key support for quick searching",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Synchronization with widget's internal search (#siteSearch)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Automatic URL parameter updates on search",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Search Term Persistence",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Search terms stored in URL hash (?search=term)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Auto-population of search box from URL on page load",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Search state preserved across page navigations",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Manual clearing tracked to prevent auto-repopulation",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Search Input Monitoring",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Detects manual clearing of search box",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Removes search parameter from URL when cleared",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Triggers new search when search term is removed",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Previous value tracking to detect changes",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "View Modes",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "Grid View (Tiles)",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Card-based layout with customizable columns (TilesPerRow setting)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Large icon display (image or Font Awesome icon)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Title as clickable heading (h3)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Description text with HTML rendering support",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Bookmark button positioned in top-right corner",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Data attributes for filtering (litigation-type, resource-type, department)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Responsive grid that adjusts to screen size",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "List View (Table)",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Tablesaw responsive table implementation",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Three columns: Icon (20%), Title (40%), Description (40%)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Smaller icon display in first column",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Compact presentation for scanning many items",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Stack mode for mobile devices (data-mode=\"stack\")",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Sortable columns (pending implementation)",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "View Toggle Controls",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Grid button (fa-grid icon) for tile view",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• List button (fa-list icon) for table view",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Active state highlighting (ia-active class)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Instant view switching without page reload",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Preference saved to localStorage",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• ARIA labels for accessibility",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        new Paragraph({
          text: "Filtering System",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "Refiner Panel",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Left sidebar with collapsible refiner sections",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Each refiner has header with expand/collapse toggle",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Checkbox-based selection for multiple values",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Result counts displayed next to each option",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Search box within each refiner for filtering options",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Refiner Search",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Inline search box (ia-filter-option-search)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Real-time filtering of refiner options as user types",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Case-insensitive matching on refiner labels",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Show/hide options based on search term",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Useful for refiners with many options (e.g., departments)",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Apply and Clear Filters",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Apply Filters button (ak-applyfilter-js) triggers search with selected refiners",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Clear Filters button (ak-clearfilter-js) removes all selections and search term",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• URL parameters updated when filters applied",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• URL parameters cleared when filters cleared",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Search term synchronized with filter actions",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Managed Metadata Handling",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Taxonomy values in format: L0|#GUID|Label",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Label extraction for user-friendly display",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Multiple values separated by semicolons",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Support for hierarchical taxonomy (L0, L1, L2 levels)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• RefinementToken storage for accurate filtering",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Deep Linking",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "URL Structure",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Base route: #/sitepages/courtresources",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Search parameter: ?search=appointment",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Filter parameters: ?litigationType=Civil&resourceType=Form&department=Legal",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Multiple values: ?litigationType=Civil,Criminal",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Full example: #/sitepages/courtresources?search=appointment&litigationType=Civil&resourceType=Form",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "URL Parameter Application",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• ApplyCourtResourceFilters function runs on page load",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Reads parameters from URL hash",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Populates search box with search term",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Checks corresponding refiner checkboxes",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Widget executes search automatically with applied filters",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "URL Parameter Updates",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• UpdateCourtResourceURL function called on filter changes",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Reads current search term and selected refiners",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Builds new query string with current state",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Uses history.replaceState to avoid page reload",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Removes parameters when filters/search cleared",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Filter Sharing",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Users can copy URL from browser address bar",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Shared URLs preserve search and filter state",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Recipients see same results when opening URL",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Useful for sharing specific resource sets with colleagues",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Bookmarkable URLs for frequently accessed queries",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        new Paragraph({
          text: "Bookmark Integration",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "Bookmark Button",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Star icon (fa-star-o) displayed in top-right of each tile",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Only visible in grid view (tiles)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Controlled by EnableBookmark setting",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Data attributes store title and URL for bookmarking",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• ARIA label for accessibility (\"Add [title] to favorites\")",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Bookmark Modal Integration",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• AddCourtResourceBookmark function handles click event",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Triggers Akumina bookmark widget modal (#btnBookmank)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Pre-populates modal with resource title and URL",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Sets link target (new tab vs. same tab) based on resource setting",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• User can save to Quick Links or other bookmark locations",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Modal retries with delay if not immediately available (up to 10 attempts)",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Bookmark Data Structure",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• title: Resource title for bookmark name",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• url: Target URL for the bookmark link",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• openInNewTab: Boolean based on resource's Target property",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• type: Set to 'quicklink' for categorization",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        new Paragraph({
          text: "Pagination",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "Load More Button",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• Displayed when IsPaging is true and more results available",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Hidden when PagingLastPage is true",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Button ID: #btnLoadMore",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Widget framework handles click event",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Loads next page of results (pagesize items)",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Incremental Loading",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• First page loaded on initial search",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Subsequent pages appended to existing results",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Transform function merges new items with existing",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Duplicate detection prevents showing same item twice",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Scroll position maintained during load",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Pagination State",
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 150, after: 100 },
        }),
        new Paragraph({
          text: "• CurrentPage: Current page number (1-based)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• TotalRows: Total number of matching results",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• RowLimit: Items per page (from pagesize property)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• PagingLastPage: Boolean indicating if last page reached",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• HasMoreResults: Calculated based on total vs. loaded items",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Multi-Language Support
        new Paragraph({
          text: "Multi-Language Support",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          text: "The widget supports three languages with complete translation coverage for all user-facing text. Language files are located in /src/js/library/language/ and use the Handlebars {{translate}} helper for runtime translation.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "English (en-us.js)",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        createTranslationTable("English", [
          { key: "search.placeholder", value: "Search court resources..." },
          { key: "search.arialabel", value: "Search court resources." },
          { key: "search.button", value: "Search" },
          { key: "view.grid", value: "Grid View" },
          { key: "view.list", value: "List View" },
          { key: "title", value: "Court Resources" },
          { key: "results.found.singular", value: "resource found" },
          { key: "results.found.plural", value: "resources found" },
          { key: "table.icon", value: "Icon" },
          { key: "table.title", value: "Title" },
          { key: "table.description", value: "Description" },
          { key: "table.type", value: "Type" },
          { key: "bookmark.add", value: "Add to favorites" },
          { key: "bookmark.addaria", value: "Add" },
        ]),

        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Spanish (es-es.js)",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        createTranslationTable("Spanish", [
          { key: "search.placeholder", value: "Buscar recursos judiciales..." },
          { key: "search.arialabel", value: "Buscar recursos judiciales." },
          { key: "search.button", value: "Buscar" },
          { key: "view.grid", value: "Vista de cuadrícula" },
          { key: "view.list", value: "Vista de lista" },
          { key: "title", value: "Recursos Judiciales" },
          { key: "results.found.singular", value: "recurso encontrado" },
          { key: "results.found.plural", value: "recursos encontrados" },
          { key: "table.icon", value: "Icono" },
          { key: "table.title", value: "Título" },
          { key: "table.description", value: "Descripción" },
          { key: "table.type", value: "Tipo" },
          { key: "bookmark.add", value: "Agregar a favoritos" },
          { key: "bookmark.addaria", value: "Agregar" },
        ]),

        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "French (fr-fr.js)",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        createTranslationTable("French", [
          { key: "search.placeholder", value: "Rechercher des ressources judiciaires..." },
          { key: "search.arialabel", value: "Rechercher des ressources judiciaires." },
          { key: "search.button", value: "Rechercher" },
          { key: "view.grid", value: "Vue en grille" },
          { key: "view.list", value: "Vue en liste" },
          { key: "title", value: "Ressources Judiciaires" },
          { key: "results.found.singular", value: "ressource trouvée" },
          { key: "results.found.plural", value: "ressources trouvées" },
          { key: "table.icon", value: "Icône" },
          { key: "table.title", value: "Titre" },
          { key: "table.description", value: "Description" },
          { key: "table.type", value: "Type" },
          { key: "bookmark.add", value: "Ajouter aux favoris" },
          { key: "bookmark.addaria", value: "Ajouter" },
        ]),

        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Language Switching",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "• Language determined by user's browser preference or site settings",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Akumina framework automatically loads appropriate language file",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• All UI text updates when language changes",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• No code changes required for language switching",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Fallback to English if translation missing",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // ============================
        // OTHER TICKETS (ABBREVIATED)
        // ============================
        new Paragraph({
          text: "Other Features & Enhancements",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),

        // LAC-219
        new Paragraph({
          text: "LAC-219: PeopleSync - Filter Corrections",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Priority: ", bold: true }),
            new TextRun({ text: "Medium | " }),
            new TextRun({ text: "Status: ", bold: true }),
            new TextRun({ text: "Ready for Production | " }),
            new TextRun({ text: "Commits: ", bold: true }),
            new TextRun({ text: "1" }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Fixed issue where PeopleSync filters were populated with incorrect entries by updating CustomFilter logic and refining filter population rules.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Affected Files:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• PeopleSync.Customization/CustomFilter.cs",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Tasks/Guide.txt",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        // LAC-207
        new Paragraph({
          text: "LAC-207: CustomFilter Refactor",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Priority: ", bold: true }),
            new TextRun({ text: "Medium | " }),
            new TextRun({ text: "Status: ", bold: true }),
            new TextRun({ text: "Ready for Production | " }),
            new TextRun({ text: "Commits: ", bold: true }),
            new TextRun({ text: "1" }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Refactored CustomFilter implementation to use employeeType instead of customfieldstring3 for improved user filtering logic and better alignment with data model.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Affected Files:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• PeopleSync.Customization/CustomFilter.cs",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Performance Optimizations
        new Paragraph({
          text: "Performance Optimizations",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),

        // LAC-193
        new Paragraph({
          text: "LAC-193 / BPS-205: Lazy Loading Images",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Priority: ", bold: true }),
            new TextRun({ text: "Medium | " }),
            new TextRun({ text: "Status: ", bold: true }),
            new TextRun({ text: "Ready for Production | " }),
            new TextRun({ text: "Commits: ", bold: true }),
            new TextRun({ text: "1" }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Implemented lazy loading for images across multiple widgets and master pages to improve page load performance. Images load progressively as user scrolls, reducing initial bandwidth consumption.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Affected Components:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Employee Detail Widget views",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• LaunchPad Widget views",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• MyOrgTree Widget views",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• QuickLinks Widget views",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Curated News Widget template",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Virtual masterpage templates (3 files)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Custom CSS",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Performance Impact:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Faster initial page load times",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Reduced initial bandwidth consumption",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Improved user experience on slower connections",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        // LAC-194
        new Paragraph({
          text: "LAC-194 / BPS-225: Footer and Header Default Height",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Priority: ", bold: true }),
            new TextRun({ text: "Medium | " }),
            new TextRun({ text: "Status: ", bold: true }),
            new TextRun({ text: "Ready for Production | " }),
            new TextRun({ text: "Commits: ", bold: true }),
            new TextRun({ text: "1" }),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Adjusted default heights for footer and header components to optimize layout and visual consistency.",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Changes:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Header height: 58px",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Footer min-height: 525px",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Improved layout stability",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Consistent spacing across pages",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Affected Files:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• digitalworkplace.custom.css",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Technical Summary
        new Paragraph({
          text: "Technical Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Total Commits: ", bold: true }),
            new TextRun({ text: "44" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Date Range: ", bold: true }),
            new TextRun({ text: "December 22, 2025 - January 14, 2026" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Primary Contributors: ", bold: true }),
            new TextRun({ text: "Saikiran Puramsetti, Diego Rosa, Scott Kearney" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Pipeline: ", bold: true }),
            new TextRun({ text: "LASC PROD - Headless Pipeline" }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Source Commit: ", bold: true }),
            new TextRun({ text: "ad7ce8958467eb28769dd6820196b245ae95fd7f", font: "Courier New", size: 18 }),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Deployment Categories:",
          bold: true,
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "🆕 New Features: 1 (Custom Tiles Widget)",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "🐛 Bug Fixes: 1 (PeopleSync Filters)",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "⚡ Performance: 2 (Lazy Loading, Header/Footer)",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "🔧 Refactoring: 1 (CustomFilter)",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        // Support Information
        new Paragraph({
          text: "Support Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "Deployment Team:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Lead: Diego Rosa (diego.rosa@akumina.com)",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Development: Saikiran Puramsetti, Scott Kearney",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Support Contacts:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "• Technical Issues: Akumina Support",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "• Business Questions: LA Courts Project Manager",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "",
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Document generated: January 22, 2026",
              italics: true,
              size: 18,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
      ],
    },
  ],
});

// Generate document
docx.Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(
    "LASC_Prod_Deployment_Jan_16_2026_Release_Notes.docx",
    buffer
  );
  console.log("✅ Release notes document created successfully!");
  console.log("📄 File: LASC_Prod_Deployment_Jan_16_2026_Release_Notes.docx");
});
