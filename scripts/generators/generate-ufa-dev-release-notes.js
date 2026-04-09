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
  LevelFormat,
  convertInchesToTwip,
  PageBreak,
} = docx;

// Ticket data - only Ready to Deploy tickets
const tickets = [
  {
    key: "UFA-274",
    summary: "Update Document Search results",
    priority: "Medium",
    status: "Ready to Deploy",
    description: `Documents are currently pulling SharePoint document preview. This should be changed to pull the Short Description field instead. If the Short Description field is blank, the summary should remain blank.`,
    changes: [
      "Modified Generic Search List Widget to display Short Description for Documents",
      "Updated document short description setting in ufasearchcallback",
      "Ensured item shortdescription gets properly populated",
      "Added fallback logic when Short Description is blank"
    ],
    category: "Search Improvements"
  },
  {
    key: "UFA-275",
    summary: "Contents of the Preferences & Interests dialog is indexed in pagedata_AK",
    priority: "Medium",
    status: "Ready to Deploy",
    description: `The Preferences & Interests dialog content was being incorrectly indexed in the search index (pagedata_AK). This fix ensures that only actual page content is indexed, excluding the preferences panel contents.`,
    changes: [
      "Added aksearchexclude from configContext array",
      "Implemented logic to handle empty search exclude configuration",
      "Prevented user preferences modal content from being indexed",
      "Improved search result accuracy by excluding UI elements"
    ],
    category: "Search Improvements"
  },
  {
    key: "UFA-276",
    summary: "Custom Tools and Resource Widget",
    priority: "Medium",
    status: "Ready to Deploy",
    description: `Created a custom widget for the Tools & Systems page with searchable 4-column grid layout. The widget displays items consistently sized in a grid format with search functionality, group headers, and proper mobile responsive design.`,
    changes: [
      "Created POC view for Summary Links Widget with 4-column grid layout",
      "Implemented real-time search filtering on item titles and summaries",
      "Added styling for consistent tile sizing regardless of item count",
      "Implemented group display logic (groups hide when all children filtered)",
      "Added min-width fix for search box on mobile devices",
      "Enhanced POC view to show group names on individual cards",
      "Enabled search by group functionality"
    ],
    category: "UI/UX Enhancements"
  },
  {
    key: "UFA-278",
    summary: "Change top nav and header colors to be black with an orange hover",
    priority: "Medium",
    status: "Ready to Deploy",
    description: `Updated branding for header and top navigation to use black text with orange hover states for improved visual consistency.`,
    changes: [
      "Changed top navigation text color to black",
      "Changed header text color to black",
      "Implemented orange hover state for navigation items",
      "Updated branding CSS for consistency"
    ],
    category: "Branding & Design"
  },
  {
    key: "UFA-279",
    summary: "Change User Preference text color to be black",
    priority: "Medium",
    status: "Ready to Deploy",
    description: `Updated taxonomy label colors in the User Preferences panel from orange to black for better readability and visual consistency.`,
    changes: [
      "Changed taxonomy label colors to black",
      "Updated user preferences styling",
      "Improved text readability in preferences panel"
    ],
    category: "Branding & Design"
  },
  {
    key: "UFA-281",
    summary: "Hide date from user greetings widget",
    priority: "Medium",
    status: "Ready to Deploy",
    description: `Removed the date display from the user greetings widget to optimize space on the home page and reduce visual clutter.`,
    changes: [
      "Hidden date display in user greetings widget",
      "Optimized homepage space allocation",
      "Improved widget layout on home page"
    ],
    category: "UI/UX Enhancements"
  },
  {
    key: "UFA-282",
    summary: "Reduce the height of the Banner Carousel View on the homepage",
    priority: "Medium",
    status: "Ready to Deploy",
    description: `Reduced the height of the Banner Carousel images to 300px and removed additional unused space to optimize the homepage layout and improve page load performance.`,
    changes: [
      "Set Banner Carousel image height to 300px",
      "Removed unused vertical space in carousel",
      "Optimized slick slider track sizing",
      "Improved homepage above-the-fold content visibility"
    ],
    category: "UI/UX Enhancements"
  },
  {
    key: "UFA-283",
    summary: "Change --fs-widgets-bottom-spacing to 48px",
    priority: "Medium",
    status: "Ready to Deploy",
    description: `Reduced the bottom margin spacing between widgets from 96px to 48px to create a more compact and efficient page layout while maintaining adequate visual separation.`,
    changes: [
      "Updated CSS variable --fs-widgets-bottom-spacing from 96px to 48px",
      "Improved vertical spacing consistency across pages",
      "Optimized page layout density"
    ],
    category: "UI/UX Enhancements"
  }
];

// Group tickets by category
const categories = {};
tickets.forEach(ticket => {
  if (!categories[ticket.category]) {
    categories[ticket.category] = [];
  }
  categories[ticket.category].push(ticket);
});

// Create document sections
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
          text: "United Franchise Alliance",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Development Deployment",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          text: "Release Notes - January 20, 2026",
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
                  children: [new Paragraph("January 20, 2026")],
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
                  children: [new Paragraph("Development")],
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
                  children: [new Paragraph("dev_2026.01.20.01")],
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
                  children: [new Paragraph("UFA Development - Headless Pipeline")],
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
                  children: [new Paragraph({ text: "Pull Request", bold: true })],
                  shading: { fill: "D9D9D9", type: ShadingType.CLEAR },
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  },
                }),
                new TableCell({
                  children: [new Paragraph("PR #16072")],
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
          text: `This deployment includes 8 enhancements focused on search functionality improvements, UI/UX refinements, and branding updates. Key improvements include enhanced document search results, custom tools widget with search capability, updated color schemes for better brand consistency, and optimized page layouts for improved user experience.`,
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Page Break",
          children: [new PageBreak()],
        }),

        // Features & Enhancements by Category
        new Paragraph({
          text: "Features & Enhancements",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),

        // Search Improvements
        ...(categories["Search Improvements"] || []).flatMap((ticket, index) => {
          const elements = [];
          
          if (index === 0) {
            elements.push(
              new Paragraph({
                text: "Search Improvements",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              })
            );
          }

          elements.push(
            new Paragraph({
              text: `${ticket.key}: ${ticket.summary}`,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Priority: ", bold: true }),
                new TextRun(ticket.priority),
                new TextRun(" | "),
                new TextRun({ text: "Status: ", bold: true }),
                new TextRun(ticket.status),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: "Description:",
              bold: true,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: ticket.description,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: "What Changed:",
              bold: true,
              spacing: { after: 50 },
            }),
            ...ticket.changes.map(
              (change) =>
                new Paragraph({
                  text: change,
                  bullet: { level: 0 },
                  spacing: { after: 50 },
                })
            )
          );

          return elements;
        }),

        // UI/UX Enhancements
        ...(categories["UI/UX Enhancements"] || []).flatMap((ticket, index) => {
          const elements = [];
          
          if (index === 0) {
            elements.push(
              new Paragraph({
                text: "UI/UX Enhancements",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              })
            );
          }

          elements.push(
            new Paragraph({
              text: `${ticket.key}: ${ticket.summary}`,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Priority: ", bold: true }),
                new TextRun(ticket.priority),
                new TextRun(" | "),
                new TextRun({ text: "Status: ", bold: true }),
                new TextRun(ticket.status),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: "Description:",
              bold: true,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: ticket.description,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: "What Changed:",
              bold: true,
              spacing: { after: 50 },
            }),
            ...ticket.changes.map(
              (change) =>
                new Paragraph({
                  text: change,
                  bullet: { level: 0 },
                  spacing: { after: 50 },
                })
            )
          );

          return elements;
        }),

        // Branding & Design
        ...(categories["Branding & Design"] || []).flatMap((ticket, index) => {
          const elements = [];
          
          if (index === 0) {
            elements.push(
              new Paragraph({
                text: "Branding & Design",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 },
              })
            );
          }

          elements.push(
            new Paragraph({
              text: `${ticket.key}: ${ticket.summary}`,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Priority: ", bold: true }),
                new TextRun(ticket.priority),
                new TextRun(" | "),
                new TextRun({ text: "Status: ", bold: true }),
                new TextRun(ticket.status),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: "Description:",
              bold: true,
              spacing: { after: 50 },
            }),
            new Paragraph({
              text: ticket.description,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: "What Changed:",
              bold: true,
              spacing: { after: 50 },
            }),
            ...ticket.changes.map(
              (change) =>
                new Paragraph({
                  text: change,
                  bullet: { level: 0 },
                  spacing: { after: 50 },
                })
            )
          );

          return elements;
        }),

        new Paragraph({
          text: "Page Break",
          children: [new PageBreak()],
        }),

        // Deployment Instructions
        new Paragraph({
          text: "Deployment Instructions",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "1. Pre-Deployment Checklist",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "☐ Verify all tickets are in 'Ready to Deploy' status",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Review pull request for any conflicts",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Ensure development environment is accessible",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Notify stakeholders of deployment window",
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "2. Deployment Steps",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "Complete pull request #16072 to merge master into dev_2026.01.20.01",
          bullet: { level: 0 },
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Run UFA Development - Headless Pipeline with branch dev_2026.01.20.01",
          bullet: { level: 0 },
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Monitor pipeline execution for any errors",
          bullet: { level: 0 },
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Verify successful deployment completion",
          bullet: { level: 0 },
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "3. Manual Configuration Steps",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Important: ", bold: true, color: "FF0000" }),
            new TextRun("The following manual steps must be completed after the pipeline deployment to ensure full functionality."),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: "Step 1: Central Site Widget Deployment",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 100, after: 50 },
        }),
        new Paragraph({
          text: "Run central site deployment for the following widgets:",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "SummaryLinksWidget",
          bullet: { level: 0 },
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "GenericSearchListWidget",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: "Step 2: App Manager Search Configuration",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 100, after: 50 },
        }),
        new Paragraph({
          text: "Add central site App Manager search configuration for home.aspx",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: "Step 3: Fix Search Typeahead Deployment",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 100, after: 50 },
        }),
        new Paragraph({
          text: "Navigate to the global typeahead search configuration",
          bullet: { level: 0 },
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Verify that the typeahead view is selected",
          bullet: { level: 0 },
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "Save changes if typeahead view was not selected",
          bullet: { level: 0 },
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: "Step 4: DigiSpaceConfig Entry - Search Exclude Widgets",
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 100, after: 50 },
        }),
        new Paragraph({
          text: "Create the following entry in DigiSpaceConfig list:",
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Key: ", bold: true }),
            new TextRun("search-exclude-widgets"),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Value: ", bold: true }),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: '["4b096a68-3706-4e4c-875e-167badd119bd","e2c73690-81d5-76d9-3ded-a641ddadf70e","773e4981-04ea-4042-8bbf-23f5bf42e189","382a6e81-6f3b-42f8-ba97-f5758b8ac2c8","6c9c2fd5-323e-4c25-9364-bd0903ef589c"]',
          style: "IntenseQuote",
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Note: ", bold: true }),
            new TextRun("This configuration excludes specific widgets from being indexed in search results, preventing user preference panel content from appearing in search."),
          ],
          spacing: { after: 200 },
        }),

        // Post-Deployment Verification
        new Paragraph({
          text: "Post-Deployment Verification",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "☐ Document Search: Verify Short Description displays correctly for documents",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Search Index: Confirm preferences panel content is not indexed",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Tools Widget: Test search functionality and 4-column grid layout",
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "   Test URL: ", bold: true }),
            new TextRun("https://cloud-dev-fe-ufa.onakumina.com/#/sitepages/tools-system.aspx"),
          ],
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Navigation: Verify black text with orange hover on top nav and header",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ User Preferences: Confirm taxonomy labels are black",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Greetings Widget: Verify date is hidden",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Banner Carousel: Confirm 300px height on homepage",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Widget Spacing: Verify 48px bottom spacing between widgets",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Mobile Responsive: Test all changes on mobile devices",
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: "☐ Browser Compatibility: Test on Chrome, Edge, Safari, Firefox",
          spacing: { after: 200 },
        }),

        // Support Section
        new Paragraph({
          text: "Support & Contact Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Deployment Tracking: ", bold: true }),
            new TextRun("UFA-288"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Primary Contact: ", bold: true }),
            new TextRun("Diego Rosa (diego.rosa@akumina.com)"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Secondary Contact: ", bold: true }),
            new TextRun("Luke Shuck (Luke.Shuck@akumina.com)"),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "For Issues: ", bold: true }),
            new TextRun("Create a ticket in Jira under project UFA"),
          ],
          spacing: { after: 100 },
        }),
      ],
    },
  ],
});

// Generate and save the document
docx.Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("UFA_Dev_Deployment_Jan_20_2026_Release_Notes.docx", buffer);
  console.log("Release notes document created successfully!");
  console.log("File: UFA_Dev_Deployment_Jan_20_2026_Release_Notes.docx");
});
