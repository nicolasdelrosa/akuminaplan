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

// JM Smuckers Dev Deployment - February 24, 2026
// 4 tickets in "Ready for Dev Deploy" status
const tickets = [
  {
    key: "JMSMUC-99",
    summary: "Our People - Custom Widget",
    priority: "High",
    status: "Ready for Dev Deploy",
    type: "Story",
    description: "Replicate the current 'Our People' widget using Akumina's out-of-the-box Spotlight widget as a base. Display chronological carousel with detail page, correct fields/tags, distributed authoring, and multilingual tokens. Widget shows employee cards with M365 profile pictures, manual job title/location, tags (Welcome, Promotion), and post date.",
    category: "User Features & Widgets",
    manualDeployment: true,
    manualSteps: "1) Create Smucker Team list in SharePoint; 2) Add site columns to Spotlight content type; 3) Create content app; 4) Import SpotlightWidget/GenericItem; 5) Setup friendlyURL to current environment; 6) Setup TaxonomyRoute list; 7) Clear configuration cache; 8) Create spotlightdetail page and add widget; 9) Create employeespotlightlist page and add widget; 10) Test with multiple user profiles across all departments."
  },
  {
    key: "JMSMUC-130",
    summary: "Update greeting widget and search button branding",
    priority: "High",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Change the date display color to teal in the greeting widget and update search button styling to match JM Smuckers brand guidelines.",
    category: "Branding"
  },
  {
    key: "JMSMUC-132",
    summary: "Update People Directory Background images",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Replace existing People Directory background image(s) in Hive 6.4. Update via Widget Configuration and/or theme-level styling. Validate responsive behavior across desktop, tablet, and mobile devices.",
    category: "Branding"
  },
  {
    key: "JMSMUC-114",
    summary: "Update events card branding GE-002",
    priority: "Medium",
    status: "Ready for Dev Deploy",
    type: "Task",
    description: "Update Event cards styling per GE-002 design specifications: Change background color from white to #FFF7E5 (cream), keep title font black, ensure responsive layout.",
    category: "Branding"
  }
];

const deploymentInfo = {
  client: "JM Smuckers",
  environment: "Development",
  date: "February 24, 2026",
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
          text: `This deployment includes ${tickets.length} items focused on branding updates and a new custom widget feature for employee spotlights.`,
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Key Highlights:", bold: true }),
          ],
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: "• New 'Our People' custom widget for employee announcements (promotions, new hires, moves)",
          spacing: { after: 50 },
          indent: { left: convertInchesToTwip(0.5) },
        }),
        new Paragraph({
          text: "• Branding updates across greeting widget, People Directory, and event cards",
          spacing: { after: 50 },
          indent: { left: convertInchesToTwip(0.5) },
        }),
        new Paragraph({
          text: "• Color scheme alignment with JM Smuckers brand guidelines (teal and cream accents)",
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
        ...generateCategorySection(tickets, "User Features & Widgets"),

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
            new TextRun("The following ticket requires additional manual configuration and verification steps after the automated pipeline completes:"),
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
            new TextRun(`${tickets.filter(t => t.manualDeployment).length} ticket (see Manual Deployment Steps section)`),
          ],
          spacing: { after: 200 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Important: ", bold: true }),
            new TextRun("Complete the automated pipeline deployment first, then execute all manual steps for JMSMUC-99 before marking this deployment as complete."),
          ],
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
      text: `${category} (${categoryTickets.length} item${categoryTickets.length > 1 ? 's' : ''})`,
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
const fileName = `JMSMUC_Dev_Deployment_Feb_24_2026_Release_Notes.docx`;
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
  console.log(`   - User Features & Widgets: ${tickets.filter(t => t.category === "User Features & Widgets").length}`);
  console.log(`\n⚠️  Manual Deployment Required (${tickets.filter(t => t.manualDeployment).length} ticket):`);
  tickets.filter(t => t.manualDeployment).forEach(ticket => {
    console.log(`   - ${ticket.key}: ${ticket.summary}`);
  });
  console.log(`\n🚀 Next steps:`);
  console.log(`   1. Review the release notes document in deployments/JMSMUC/`);
  console.log(`   2. Create and merge PR for this deployment`);
  console.log(`   3. Update branch and PR number in the document`);
  console.log(`   4. Trigger pipeline: ${deploymentInfo.pipeline}`);
  console.log(`   5. Execute all manual deployment steps for JMSMUC-99`);
});
