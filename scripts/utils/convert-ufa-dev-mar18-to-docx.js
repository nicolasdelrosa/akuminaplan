const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

// Input and output paths
const markdownPath = path.join('C:', 'Git', 'UFA', 'UFA', 'deployments', 'UFA_DEV_Deployment_2026-03-18_Release_Notes.md');
const docxPath = path.join('C:', 'Git', 'UFA', 'UFA', 'deployments', 'UFA_DEV_Deployment_2026-03-18_Release_Notes.docx');

// Create document sections
const docSections = [];

// Title
docSections.push(
  new Paragraph({
    text: 'UFA DEV Deployment - March 18, 2026 Release Notes',
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 }
  })
);

// Deployment Information
docSections.push(new Paragraph({ text: 'Deployment Information', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ text: 'Environment: DEV', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Deployment Date: March 18, 2026', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Release Branch: main', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Deployment Ticket: UFA-313', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Deployed By: Diego Rosa', spacing: { after: 200 } }));

// Release Summary
docSections.push(new Paragraph({ text: 'Release Summary', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ 
  text: 'This release includes three search-related enhancements focused on improving search result display and functionality in the UFA environment.', 
  spacing: { after: 200 } 
}));

// Included Tickets
docSections.push(new Paragraph({ text: 'Included Tickets', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));

// UFA-301
docSections.push(new Paragraph({ text: 'UFA-301: Search - Header should not be indexed for search results', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [
  new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')
], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [
  new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')
], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [
  new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')
], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Header elements should not be indexed for search results to prevent duplicate or irrelevant search results.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Technical Details:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Attachments include reference images showing current behavior', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Implementation focuses on excluding header content from search indexing', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• None', spacing: { after: 200 } }));

// UFA-299
docSections.push(new Paragraph({ text: 'UFA-299: SEARCH - Display Short Description for document content type', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [
  new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')
], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [
  new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')
], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [
  new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')
], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Display Short Description for document content type. If one does not exist, show nothing.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'SharePoint Column Specification:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Column Name: Short Description', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Internal Name: Short_x0020_Description', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Implementation Requirements:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Create the Short Description column in sandbox environment matching production specs', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Widget should display the short description when available', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Widget should display nothing if short description field is empty', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Verify Short Description column exists in target environment', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Column Name: "Short Description"', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '3. Internal Name: "Short_x0020_Description"', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '4. If column does not exist, create it matching the exact specifications above', spacing: { after: 200 } }));

// UFA-304
docSections.push(new Paragraph({ text: 'UFA-304: Search - Searched words should be highlighted on the result set', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [
  new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')
], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [
  new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')
], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [
  new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')
], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Enable visual highlighting of search terms in search results. The GenericSearchListWidget is already configured with Search Experience 2.0 features including search term highlighting.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Current State:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Although highlight data is present in search responses (e.g., <c0>agriculture</c0>), the <c0> highlight tags do not have any CSS styling applied by default. As a result, users see the text without any visual emphasis.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Solution:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Apply CSS styling to make highlighted terms visually distinct. Example CSS (adjust colors to match UFA theme):', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'c0 { background-color: #fff100; font-weight: 600; color: #000; padding: 0 2px; }', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Expected SharePoint Behavior:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Highlighting appears when the search term exists in article content or summary', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Highlighting does NOT appear when the term exists only in the title, tags, or metadata', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Add callbackUI to GenericSearchListWidget on central site', spacing: { after: 50 }, bold: true }));
docSections.push(new Paragraph({ text: '2. Apply CSS styling for <c0> tags using UFA theme colors', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '3. Deploy CSS changes to DEV environment', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '4. Test search functionality with various terms to verify highlighting behavior', spacing: { after: 200 } }));

// Pre-Deployment Checklist
docSections.push(new Paragraph({ text: 'Pre-Deployment Checklist', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
const preDeployChecklist = [
  'Backup current DEV environment configuration',
  'Review all ticket descriptions and technical requirements',
  'Verify Short Description column exists in DEV SharePoint (UFA-299)',
  'Create Short Description column if needed (UFA-299)',
  'Prepare CSS theme colors for search highlighting (UFA-304)',
  'Confirm GenericSearchListWidget is configured on central site',
  'Review manual deployment steps for all tickets',
  'Schedule deployment window with stakeholders',
  'Notify team of deployment schedule'
];
preDeployChecklist.forEach(item => {
  docSections.push(new Paragraph({ text: `☐ ${item}`, spacing: { after: 50 } }));
});

// Post-Deployment Verification
docSections.push(new Paragraph({ text: 'Post-Deployment Verification', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ text: 'UFA-301: Header Search Indexing', heading: HeadingLevel.HEADING_2, spacing: { before: 100, after: 100 } }));
docSections.push(new Paragraph({ text: '☐ Perform search that would previously return header content', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Verify header elements are excluded from results', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Confirm search results are relevant and do not include header duplicates', spacing: { after: 100 } }));

docSections.push(new Paragraph({ text: 'UFA-299: Short Description Display', heading: HeadingLevel.HEADING_2, spacing: { before: 100, after: 100 } }));
docSections.push(new Paragraph({ text: '☐ Search for documents with Short Description populated', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Verify short description displays in search results', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Search for documents without Short Description', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Verify nothing displays when field is empty (no errors)', spacing: { after: 100 } }));

docSections.push(new Paragraph({ text: 'UFA-304: Search Term Highlighting', heading: HeadingLevel.HEADING_2, spacing: { before: 100, after: 100 } }));
docSections.push(new Paragraph({ text: '☐ Search for term "agriculture" (or other common term)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Verify term is highlighted in search result content', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Search for term that exists only in title', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Verify highlighting behaves as expected (title-only terms not highlighted)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Verify CSS styling matches UFA theme', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Test with multiple search terms', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Verify highlighting works across different content types', spacing: { after: 100 } }));

// Known Issues
docSections.push(new Paragraph({ text: 'Known Issues / Limitations', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ text: '• UFA-304: Search term highlighting only works for terms in content body, not title/metadata (expected SharePoint behavior)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• CSS colors must be verified against UFA branding guidelines before PROD deployment', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Short Description column must exist in target environment before deployment', spacing: { after: 100 } }));

// Sign-off
docSections.push(new Paragraph({ text: 'Sign-Off', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ text: 'Prepared By: Diego Rosa', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Date: March 18, 2026', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Reviewed By: _________________________', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Approved By: _________________________', spacing: { after: 100 } }));

// Create document
const doc = new Document({
  sections: [{
    properties: {},
    children: docSections
  }]
});

// Write to file
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ DOCX file created successfully: ${docxPath}`);
}).catch(error => {
  console.error('❌ Error creating DOCX:', error);
  process.exit(1);
});
