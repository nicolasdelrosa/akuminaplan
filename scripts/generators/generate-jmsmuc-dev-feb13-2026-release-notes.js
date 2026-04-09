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
} = docx;

// JM Smuckers Dev Deployment - February 13, 2026
// All 28 tickets in "Ready for Dev Deploy" status
const tickets = [
  {
    key: "JMSMUC-77",
    summary: "Replace Meganav view with Simple Menu view",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Replace the Meganav navigation view with a simpler menu view for better performance and usability",
    category: "Navigation & Search"
  },
  {
    key: "JMSMUC-82",
    summary: "Missed Branding Changes",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Bug",
    description: "Fix missed branding elements that were not updated in initial branding pass",
    category: "Branding"
  },
  {
    key: "JMSMUC-86",
    summary: "Update footer background color and link colors",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update footer styling including background color and link colors to match new brand guidelines",
    category: "Branding"
  },
  {
    key: "JMSMUC-87",
    summary: "Update footer site information",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update footer site information content, layout, and styling to match current requirements",
    category: "Branding"
  },
  {
    key: "JMSMUC-88",
    summary: "Update broadcast site alert styling",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update broadcast alert styling including colors, fonts, and spacing to align with new brand guidelines",
    category: "Branding"
  },
  {
    key: "JMSMUC-89",
    summary: "Change top level of Navigation links to use Bebas Neue google font",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update top-level navigation links to use Bebas Neue Google Font for enhanced typography and brand consistency",
    category: "Branding"
  },
  {
    key: "JMSMUC-90",
    summary: "Update top nav colors",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update top navigation color scheme including links, hover states, and background to match brand guidelines",
    category: "Branding"
  },
  {
    key: "JMSMUC-91",
    summary: "Update site body background color to creme",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Change site body background color from white to creme to match brand aesthetic and improve visual consistency",
    category: "Branding"
  },
  {
    key: "JMSMUC-92",
    summary: "Fix search typeahead see all background color",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Fix background color styling for the 'See All' option in search typeahead dropdown to match brand colors",
    category: "Branding"
  },
  {
    key: "JMSMUC-93",
    summary: "Change Language Tokens for Show More to Load More throughout the site",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update language tokens globally to change 'Show More' text to 'Load More' for better UX clarity and consistency",
    category: "Content & News"
  },
  {
    key: "JMSMUC-94",
    summary: "Update News/Blog share buttons",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update share button styling and functionality for News and Blog content items",
    category: "User Features & Preferences"
  },
  {
    key: "JMSMUC-101",
    summary: "Add new today/upcoming news widget view and style it accordingly",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Create new widget view for displaying today's and upcoming news with appropriate styling per brand guidelines",
    category: "Content & News"
  },
  {
    key: "JMSMUC-103",
    summary: "Remove Curated News Widget from News Listing Page",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Remove Curated News Widget from the News Listing Page to streamline content",
    category: "Content & News",
    manualDeployment: true,
    manualSteps: "Verify Curated News Widget is completely removed from all News Listing Page instances in Dev environment after deployment"
  },
  {
    key: "JMSMUC-104",
    summary: "Update Curated News main article background to cream color",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Change Curated News widget main article background color to cream for better visual hierarchy",
    category: "Branding"
  },
  {
    key: "JMSMUC-106",
    summary: "Update Footer background from darker teal to lighter teal",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Change footer background color from darker teal to lighter teal to improve readability and brand alignment",
    category: "Branding"
  },
  {
    key: "JMSMUC-108",
    summary: "Update Logo and Favicon with new images",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Replace existing logo and favicon with new JM Smuckers brand assets",
    category: "Branding",
    manualDeployment: true,
    manualSteps: "Upload new logo and favicon image files to the CDN/Assets folder. Update image references in Site Settings. Test logo and favicon display across all browsers and devices."
  },
  {
    key: "JMSMUC-111",
    summary: "Update Corporate New and Featured news Tabbed widget CTAs GN-004 | GN-005",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update call-to-action buttons in Corporate News and Featured News tabbed widgets per GN-004 and GN-005 design specs",
    category: "Branding"
  },
  {
    key: "JMSMUC-113",
    summary: "Update Tabbed Widget titles to use Bebas Neue",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Change tabbed widget title font to Bebas Neue Google Font across all tabbed widgets",
    category: "Branding"
  },
  {
    key: "JMSMUC-114",
    summary: "Update events card branding GE-002",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Update events card styling per GE-002 design specifications including colors, typography, and spacing",
    category: "Branding"
  },
  {
    key: "JMSMUC-115",
    summary: "Update Event calendar branding colors",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Update Event Calendar widget color scheme to match brand guidelines",
    category: "Branding"
  },
  {
    key: "JMSMUC-117",
    summary: "Remove Media library page from Search",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Exclude Media library from site search results",
    category: "Navigation & Search",
    manualDeployment: true,
    manualSteps: "Update search index configuration to exclude Media library page. Clear search cache. Verify Media library no longer appears in search results."
  },
  {
    key: "JMSMUC-118",
    summary: "Update People Directory Branding",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Update People Directory widget styling and colors to align with new JM Smuckers brand guidelines",
    category: "Branding"
  },
  {
    key: "JMSMUC-119",
    summary: "Remove color filter on teams icon throughout the site",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Remove color filter applied to Microsoft Teams icon across all site locations to display native Teams branding colors",
    category: "Teams Integration"
  },
  {
    key: "JMSMUC-121",
    summary: "Custom Events Widget updates",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Apply updates to Custom Events Widget styling and functionality",
    category: "User Features & Preferences"
  },
  {
    key: "JMSMUC-122",
    summary: "Hide My interests from header profile and where my preferences display across the site",
    priority: "High",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Remove My interests section from user profile and preferences throughout the site",
    category: "User Features & Preferences",
    manualDeployment: true,
    manualSteps: "Perform UAT verification that My interests section is hidden in user profile header and all preferences pages. Test with multiple user roles to ensure consistent hiding across all user types."
  },
  {
    key: "JMSMUC-123",
    summary: "Change Corporate News labels to Company News",
    priority: "High",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Update all Corporate News labels throughout the site to Company News",
    category: "User Features & Preferences",
    manualDeployment: true,
    manualSteps: "Search site content for all instances of 'Corporate News' labels and verify they display as 'Company News'. Validate label changes in news widgets, navigation, and news pages."
  },
  {
    key: "JMSMUC-125",
    summary: "Validation of Teams Link Functionality in Downloaded ICS Files for all Akumina Event types",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Validate that Microsoft Teams links are properly included and functional in downloaded ICS calendar files for all Akumina event types",
    category: "Teams Integration"
  },
  {
    key: "JMSMUC-126",
    summary: "Event calendar branding updates",
    priority: "High",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Apply comprehensive branding updates to event calendar component (HIGH PRIORITY)",
    category: "Branding"
  }
];

const deploymentInfo = {
  client: "JM Smuckers",
  environment: "Development",
  date: "February 13, 2026",
  branch: "TBD",
  pullRequest: "TBD",
  pipeline: "JMSmuckers-Headless-Dev"
};

// Create document
const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // Title
        new Paragraph({
          text: `${deploymentInfo.client} - ${deploymentInfo.environment} Deployment`,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        
        new Paragraph({
          text: `Release Notes - ${deploymentInfo.date}`,
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Deployment Information Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Deployment Date", bold: true })],
                  shading: { fill: "D9E1F2" },
                }),
                new TableCell({
                  children: [new Paragraph(deploymentInfo.date)],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Environment", bold: true })],
                  shading: { fill: "D9E1F2" },
                }),
                new TableCell({
                  children: [new Paragraph(deploymentInfo.environment)],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Branch", bold: true })],
                  shading: { fill: "D9E1F2" },
                }),
                new TableCell({
                  children: [new Paragraph(deploymentInfo.branch)],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Pull Request", bold: true })],
                  shading: { fill: "D9E1F2" },
                }),
                new TableCell({
                  children: [new Paragraph(deploymentInfo.pullRequest === "TBD" ? "TBD" : `#${deploymentInfo.pullRequest}`)],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: "Pipeline", bold: true })],
                  shading: { fill: "D9E1F2" },
                }),
                new TableCell({
                  children: [new Paragraph(deploymentInfo.pipeline)],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "", spacing: { after: 400 } }),

        // Summary
        new Paragraph({
          text: "Deployment Summary",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          text: `This deployment includes ${tickets.length} items primarily focused on branding updates, navigation improvements, Teams integration enhancements, and UX improvements to align with the new JM Smuckers brand guidelines.`,
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Key Highlights:", bold: true }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: "• Comprehensive branding updates across the entire site including colors, fonts, and styling",
          spacing: { after: 50 },
          indent: { left: convertInchesToTwip(0.5) },
        }),
        new Paragraph({
          text: "• Microsoft Teams integration improvements for calendar events",
          spacing: { after: 50 },
          indent: { left: convertInchesToTwip(0.5) },
        }),
        new Paragraph({
          text: "• Navigation enhancements for improved user experience",
          spacing: { after: 50 },
          indent: { left: convertInchesToTwip(0.5) },
        }),
        new Paragraph({
          text: "• New features including today/upcoming news widget view",
          spacing: { after: 400 },
          indent: { left: convertInchesToTwip(0.5) },
        }),

        // Changes by Category
        new Paragraph({
          text: "Changes Included",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),

        // Group tickets by category
        ...generateCategorySection(tickets, "Branding"),
        ...generateCategorySection(tickets, "Content & News"),
        ...generateCategorySection(tickets, "Navigation & Search"),
        ...generateCategorySection(tickets, "Teams Integration"),
        ...generateCategorySection(tickets, "User Features & Preferences"),

        new Paragraph({ text: "", spacing: { after: 400 } }),

        // Detailed Ticket Information
        new Paragraph({
          text: "Detailed Ticket Information",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),

        // Individual ticket details
        ...tickets.flatMap((ticket) => [
          new Paragraph({
            text: `${ticket.key}: ${ticket.summary}`,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Type: ", bold: true }),
              new TextRun(ticket.type),
              new TextRun({ text: " | Priority: ", bold: true }),
              new TextRun(ticket.priority),
              new TextRun({ text: " | Category: ", bold: true }),
              new TextRun(ticket.category),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: ticket.description,
            spacing: { after: 200 },
          }),
          new Paragraph({ text: "", spacing: { after: 200 } }),
        ]),

        // Manual Deployment Steps Section
        new Paragraph({
          text: "Manual Deployment Steps Required",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "⚠️ IMPORTANT: ", bold: true }),
            new TextRun("The following 5 tickets require additional manual verification and deployment steps after the automated pipeline completes:"),
          ],
          spacing: { after: 200 },
        }),

        ...tickets
          .filter(t => t.manualDeployment)
          .flatMap((ticket) => [
            new Paragraph({
              text: `${ticket.key}: ${ticket.summary}`,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 150, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Manual Steps: ", bold: true }),
                new TextRun(ticket.manualSteps),
              ],
              spacing: { after: 150 },
            }),
          ]),

        new Paragraph({ text: "", spacing: { after: 200 } }),

        // Notes section
        new Paragraph({
          text: "Deployment Notes",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Total Tickets in Deployment: ", bold: true }),
            new TextRun(`${tickets.length} items`),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Automated Deployment: ", bold: true }),
            new TextRun(`${tickets.filter(t => !t.manualDeployment).length} tickets`),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Manual Deployment Required: ", bold: true }),
            new TextRun(`${tickets.filter(t => t.manualDeployment).length} tickets (see Manual Deployment Steps section)`),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          text: "Complete the automated pipeline deployment first, then execute all manual steps listed above before marking this deployment as complete.",
          spacing: { after: 400 },
        }),
      ],
    },
  ],
});

function generateCategorySection(tickets, category) {
  const categoryTickets = tickets.filter((t) => t.category === category);
  if (categoryTickets.length === 0) return [];

  return [
    new Paragraph({
      text: `${category} (${categoryTickets.length} items)`,
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
    }),
    ...categoryTickets.map((ticket) => 
      new Paragraph({
        text: `• ${ticket.key}: ${ticket.summary}`,
        spacing: { after: 50 },
        indent: { left: convertInchesToTwip(0.5) },
      })
    ),
    new Paragraph({ text: "", spacing: { after: 200 } }),
  ];
}

// Generate filename
const fileName = `JMSMUC_Dev_Deployment_Feb_13_2026_Release_Notes.docx`;
const outputPath = `./deployments/JMSMUC/${fileName}`;

// Create directory if it doesn't exist
const dir = './deployments/JMSMUC';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Write the document
docx.Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Release notes generated: ${outputPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Total tickets: ${tickets.length}`);
  console.log(`   - Branding updates: ${tickets.filter(t => t.category === "Branding").length}`);
  console.log(`   - Content & News: ${tickets.filter(t => t.category === "Content & News").length}`);
  console.log(`   - Navigation & Search: ${tickets.filter(t => t.category === "Navigation & Search").length}`);
  console.log(`   - Teams Integration: ${tickets.filter(t => t.category === "Teams Integration").length}`);
  console.log(`   - User Features & Preferences: ${tickets.filter(t => t.category === "User Features & Preferences").length}`);
  console.log(`\n⚠️  Manual Deployment Required (${tickets.filter(t => t.manualDeployment).length} tickets):`);
  tickets.filter(t => t.manualDeployment).forEach(ticket => {
    console.log(`   - ${ticket.key}: ${ticket.summary}`);
  });
  console.log(`\n🚀 Next steps:`);
  console.log(`   1. Review the release notes document in deployments/JMSMUC/`);
  console.log(`   2. Create and merge PR for this deployment`);
  console.log(`   3. Update branch and PR number in the document`);
  console.log(`   4. Trigger pipeline: ${deploymentInfo.pipeline}`);
  console.log(`   5. Execute all 5 manual deployment steps listed in the release notes`);
});
