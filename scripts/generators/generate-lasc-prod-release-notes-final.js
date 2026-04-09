const docx = require("docx");
const fs = require("fs");
const path = require("path");

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
  ImageRun,
  Media,
} = docx;

// Read screenshots
const screenshotDir = path.join(__dirname, '.playwright-mcp');
const screenshots = {
  gridView: fs.existsSync(path.join(screenshotDir, '01-court-resources-grid-view.png'))
    ? fs.readFileSync(path.join(screenshotDir, '01-court-resources-grid-view.png'))
    : null,
  listView: fs.existsSync(path.join(screenshotDir, '02-court-resources-list-view.png'))
    ? fs.readFileSync(path.join(screenshotDir, '02-court-resources-list-view.png'))
    : null,
  searchResults: fs.existsSync(path.join(screenshotDir, '03-court-resources-search-results.png'))
    ? fs.readFileSync(path.join(screenshotDir, '03-court-resources-search-results.png'))
    : null,
  filtered: fs.existsSync(path.join(screenshotDir, '04-court-resources-filtered.png'))
    ? fs.readFileSync(path.join(screenshotDir, '04-court-resources-filtered.png'))
    : null,
};

// Create document
const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: [
        // Title
        new Paragraph({
          text: "LA Courts (LASC)",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Production Deployment",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Release Notes - January 16, 2026",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Deployment Information Table
        new Paragraph({
          text: "Deployment Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Date", bold: true })],
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  shading: { fill: "D9D9D9", type: ShadingType.CLEAR },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
                new TableCell({
                  children: [new Paragraph("January 16, 2026")],
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Environment", bold: true })],
                  shading: { fill: "D9D9D9", type: ShadingType.CLEAR },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
                new TableCell({
                  children: [new Paragraph("Production (LASC)")],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Branch", bold: true })],
                  shading: { fill: "D9D9D9", type: ShadingType.CLEAR },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
                new TableCell({
                  children: [new Paragraph("1.26.01.14.01")],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Build", bold: true })],
                  shading: { fill: "D9D9D9", type: ShadingType.CLEAR },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
                new TableCell({
                  children: [new Paragraph("2601.1401 (Build ID 107996)")],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Pipeline", bold: true })],
                  shading: { fill: "D9D9D9", type: ShadingType.CLEAR },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
                new TableCell({
                  children: [new Paragraph("LASC PROD - Headless Pipeline")],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
              ],
            }),
          ],
        }),

        // Summary Section
        new Paragraph({
          text: "Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: `This production deployment includes 5 enhancements with 44 commits, delivering a new Court Resources Widget with advanced search and filtering capabilities, PeopleSync improvements, and performance optimizations. The Court Resources Widget provides staff with an easy-to-use tool to find and access court resources, forms, and documents in multiple languages.`,
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Features & Enhancements
        new Paragraph({
          text: "Features & Enhancements",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        // LAC-213: Court Resources Widget
        new Paragraph({
          text: "LAC-213: Court Resources Widget",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Priority: ", bold: true }),
            new TextRun("Medium"),
            new TextRun(" | "),
            new TextRun({ text: "Status: ", bold: true }),
            new TextRun("Deployed"),
          ],
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "What It Does:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "The Court Resources Widget is a powerful search tool that helps staff quickly find and access court resources, forms, documents, and information. It provides an intuitive interface with multiple viewing options and filtering capabilities to make finding the right resource fast and easy.",
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "Key Features:",
          bold: true,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: "Two View Modes - Switch between Grid (visual cards) and List (table) views based on your preference",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "Quick Search - Type keywords to instantly find relevant resources",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "Smart Filters - Narrow results by Litigation Type, Resource Type, or Department",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "Multi-Language Support - Available in English, Spanish, and French",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "Save Favorites - Bookmark frequently used resources for quick access",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "Share Links - Send filtered searches to colleagues via URL",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        // Grid View Screenshot
        new Paragraph({
          text: "Grid View (Visual Cards)",
          bold: true,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "This view displays resources as visual cards with icons, making it easy to scan and recognize resources at a glance. Perfect for browsing and discovering new resources.",
          spacing: { after: 150 },
        }),
        ...(screenshots.gridView
          ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: screenshots.gridView,
                    transformation: {
                      width: 600,
                      height: 400,
                    },
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
            ]
          : []),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // List View Screenshot
        new Paragraph({
          text: "List View (Compact Table)",
          bold: true,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "This view shows resources in a compact table format, ideal for quickly scanning titles and descriptions. Great when you know what you're looking for and want to see more items at once.",
          spacing: { after: 150 },
        }),
        ...(screenshots.listView
          ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: screenshots.listView,
                    transformation: {
                      width: 600,
                      height: 400,
                    },
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
            ]
          : []),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Search Results Screenshot
        new Paragraph({
          text: "Search Functionality",
          bold: true,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Type keywords into the search box to instantly filter resources. The search looks through titles, descriptions, and keywords to find the most relevant matches.",
          spacing: { after: 150 },
        }),
        ...(screenshots.searchResults
          ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: screenshots.searchResults,
                    transformation: {
                      width: 600,
                      height: 400,
                    },
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
            ]
          : []),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Filtered Results Screenshot
        new Paragraph({
          text: "Filter Panel",
          bold: true,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Use the filter panel on the left to refine your search by specific categories. Select one or more filters, then click 'Apply Filters' to see matching resources. You can combine search and filters for precise results.",
          spacing: { after: 150 },
        }),
        ...(screenshots.filtered
          ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: screenshots.filtered,
                    transformation: {
                      width: 600,
                      height: 400,
                    },
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
            ]
          : []),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // How to Use
        new Paragraph({
          text: "How to Use the Court Resources Widget:",
          bold: true,
          spacing: { before: 200, after: 150 },
        }),
        new Paragraph({
          text: "1. Finding Resources",
          bold: true,
          spacing: { before: 150, after: 80 },
        }),
        new Paragraph({
          text: "Type keywords in the search box (e.g., 'civil forms', 'mediation', 'small claims')",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "Or browse all available resources by scrolling through the list",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "Click 'Search' or press Enter to see results",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "2. Using Filters",
          bold: true,
          spacing: { before: 150, after: 80 },
        }),
        new Paragraph({
          text: "Select one or more filter options from the left panel",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "Click 'Apply Filters' to see only matching resources",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "Use 'Clear Filters' to remove all selections and start over",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "3. Switching Views",
          bold: true,
          spacing: { before: 150, after: 80 },
        }),
        new Paragraph({
          text: "Click the Grid icon (squares) for visual card view",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "Click the List icon (lines) for compact table view",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "Your preference is remembered for next time",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "4. Saving Favorites",
          bold: true,
          spacing: { before: 150, after: 80 },
        }),
        new Paragraph({
          text: "Click the star icon on any resource card",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "The bookmark modal will open to save it to your Quick Links",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "Access your saved resources anytime from your Quick Links widget",
          bullet: { level: 0 },
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: "5. Sharing Searches",
          bold: true,
          spacing: { before: 150, after: 80 },
        }),
        new Paragraph({
          text: "After applying filters or search, copy the URL from your browser",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "Share the URL with colleagues - they'll see the same filtered results",
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
        new Paragraph({
          text: "Great for directing others to specific resource sets",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Other Features (Simplified)
        new Paragraph({
          text: "Additional Improvements",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
        }),

        // LAC-219
        new Paragraph({
          text: "LAC-219: PeopleSync Filter Improvements",
          bold: true,
          spacing: { before: 150, after: 80 },
        }),
        new Paragraph({
          text: "What It Does: ",
          bold: true,
        }),
        new Paragraph({
          text: "Fixed an issue where the People Directory filters were showing incorrect employee types. Filters now display the correct options, making it easier to find specific staff members.",
          spacing: { after: 150 },
        }),

        // LAC-207
        new Paragraph({
          text: "LAC-207: Enhanced Employee Filtering",
          bold: true,
          spacing: { before: 150, after: 80 },
        }),
        new Paragraph({
          text: "What It Does: ",
          bold: true,
        }),
        new Paragraph({
          text: "Improved how employee types are categorized in the system, providing more accurate filtering when searching for people. This ensures you see the right staff members when using filters.",
          spacing: { after: 150 },
        }),

        // LAC-193
        new Paragraph({
          text: "LAC-193: Faster Page Loading",
          bold: true,
          spacing: { before: 150, after: 80 },
        }),
        new Paragraph({
          text: "What It Does: ",
          bold: true,
        }),
        new Paragraph({
          text: "Implemented smart image loading that loads images as you scroll down the page instead of all at once. This makes pages load faster, especially on slower connections, providing a better browsing experience.",
          spacing: { after: 150 },
        }),

        // LAC-194
        new Paragraph({
          text: "LAC-194: Improved Page Layout",
          bold: true,
          spacing: { before: 150, after: 80 },
        }),
        new Paragraph({
          text: "What It Does: ",
          bold: true,
        }),
        new Paragraph({
          text: "Adjusted header and footer heights for more consistent spacing and better visual balance across all pages. Pages now have a cleaner, more professional appearance.",
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [new PageBreak()],
        }),

        // Support Information
        new Paragraph({
          text: "Support & Questions",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "If you have questions about these new features or need assistance:",
          spacing: { after: 150 },
        }),
        new Paragraph({
          text: "Contact your IT Help Desk for technical support",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "Reach out to your department's SharePoint administrator",
          bullet: { level: 0 },
          spacing: { after: 80 },
        }),
        new Paragraph({
          text: "Email: Akumina Support for system issues",
          bullet: { level: 0 },
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
    "LASC_Prod_Deployment_Jan_16_2026_User_Guide.docx",
    buffer
  );
  console.log("✅ Release notes document created successfully!");
  console.log("📄 File: LASC_Prod_Deployment_Jan_16_2026_User_Guide.docx");
  console.log("📸 Screenshots embedded: 4");
});
