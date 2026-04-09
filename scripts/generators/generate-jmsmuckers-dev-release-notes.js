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

// JM Smuckers Dev Deployment - January 21, 2026
// All tickets in "Ready for Dev Deploy" status
const tickets = [
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
    description: "Update footer styling to match new brand guidelines including background color and link colors",
    category: "Branding"
  },
  {
    key: "JMSMUC-87",
    summary: "Update footer site information",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update footer site information content and layout",
    category: "Branding"
  },
  {
    key: "JMSMUC-88",
    summary: "Update broadcast site alert styling",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update broadcast alert styling to align with new brand guidelines",
    category: "Branding"
  },
  {
    key: "JMSMUC-89",
    summary: "Change top level of Navigation links to use Bebas Neue google font",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update top-level navigation to use Bebas Neue Google Font for enhanced typography",
    category: "Branding"
  },
  {
    key: "JMSMUC-90",
    summary: "Update top nav colors",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update top navigation color scheme to match brand guidelines",
    category: "Branding"
  },
  {
    key: "JMSMUC-91",
    summary: "Update site body background color to creme",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Change site body background color from white to creme to match brand aesthetic",
    category: "Branding"
  },
  {
    key: "JMSMUC-92",
    summary: "Fix search typeahead see all background color",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Fix background color styling for the 'See All' option in search typeahead dropdown",
    category: "Search"
  },
  {
    key: "JMSMUC-93",
    summary: "Change Language Tokens for Show More to Load More throughout the site",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update language tokens globally to change 'Show More' text to 'Load More' for better UX clarity",
    category: "UX Improvements"
  },
  {
    key: "JMSMUC-94",
    summary: "Update News/Blog share buttons",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Update share button styling and functionality for News and Blog content",
    category: "Features"
  },
  {
    key: "JMSMUC-77",
    summary: "Replace Meganav view with Simple Menu view",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Replace the Meganav navigation view with a simpler menu view for better performance and usability",
    category: "Navigation"
  }
];

const deploymentInfo = {
  client: "JM Smuckers",
  environment: "Development",
  date: "January 21, 2026",
  branch: "1.26.01.21.01",
  pullRequest: "16094",
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
                  children: [new Paragraph(`#${deploymentInfo.pullRequest}`)],
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
          text: `This deployment includes ${tickets.length} items primarily focused on branding updates, navigation improvements, and UX enhancements to align with the new JM Smuckers brand guidelines.`,
          spacing: { after: 400 },
        }),

        // Changes by Category
        new Paragraph({
          text: "Changes Included",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),

        // Group tickets by category
        ...generateCategorySection(tickets, "Branding"),
        ...generateCategorySection(tickets, "Navigation"),
        ...generateCategorySection(tickets, "Search"),
        ...generateCategorySection(tickets, "UX Improvements"),
        ...generateCategorySection(tickets, "Features"),

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
              new TextRun({ text: "Priority: ", bold: true }),
              new TextRun(ticket.priority),
              new TextRun({ text: " | Status: ", bold: true }),
              new TextRun(ticket.status),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: ticket.description,
            spacing: { after: 200 },
          }),
          new Paragraph({ text: "", spacing: { after: 200 } }),
        ]),
      ],
    },
  ],
});

function generateCategorySection(tickets, category) {
  const categoryTickets = tickets.filter((t) => t.category === category);
  if (categoryTickets.length === 0) return [];

  return [
    new Paragraph({
      text: category,
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
const fileName = `JMSmuckers_Dev_Deployment_${deploymentInfo.date.replace(/\s/g, "_").replace(/,/g, "")}_Release_Notes.docx`;

// Write the document
docx.Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(fileName, buffer);
  console.log(`✅ Release notes generated: ${fileName}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Total tickets: ${tickets.length}`);
  console.log(`   - Branch: ${deploymentInfo.branch}`);
  console.log(`   - PR: #${deploymentInfo.pullRequest}`);
  console.log(`\n🚀 Next steps:`);
  console.log(`   1. Review the release notes document`);
  console.log(`   2. Verify PR #${deploymentInfo.pullRequest} is approved`);
  console.log(`   3. Trigger pipeline: ${deploymentInfo.pipeline}`);
});
