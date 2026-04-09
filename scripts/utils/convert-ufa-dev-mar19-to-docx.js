const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');

// Input and output paths
const markdownPath = path.join('C:', 'Git', 'UFA', 'UFA', 'deployments', 'UFA_DEV_Deployment_2026-03-19_Release_Notes.md');
const docxPath = path.join('C:', 'Git', 'UFA', 'UFA', 'deployments', 'UFA_DEV_Deployment_2026-03-19_Release_Notes.docx');

// Create document sections
const docSections = [];

// Title
docSections.push(
  new Paragraph({
    text: 'UFA DEV Deployment - March 19, 2026 Release Notes',
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 }
  })
);

// Deployment Information
docSections.push(new Paragraph({ text: 'Deployment Information', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ text: 'Environment: DEV', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Deployment Date: March 19, 2026', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Release Branch: main', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Deployment Ticket: UFA-314', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Deployed By: Diego Rosa', spacing: { after: 200 } }));

// Release Summary
docSections.push(new Paragraph({ text: 'Release Summary', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ 
  text: 'This release includes 13 tickets focused on search enhancements, UI/UX improvements, footer updates, and widget styling fixes. Key updates include search typeahead fixes, result highlighting, duplicate result cleanup, URL format improvements, header indexing fixes, footer social media integration, and Tools & Systems card redesign.', 
  spacing: { after: 200 } 
}));

// Included Tickets
docSections.push(new Paragraph({ text: 'Included Tickets', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));

// UFA-312
docSections.push(new Paragraph({ text: 'UFA-312: Search - Typeahead box staying expanded over the search results', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Search typeahead dropdown remains visible over search results when user types and immediately presses enter without waiting for typeahead to load.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Steps to Reproduce:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Type in a search term', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Immediately press enter (do not wait for typeahead to load)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '3. Result: Typeahead will display over the search results', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• None', spacing: { after: 200 } }));

// UFA-310
docSections.push(new Paragraph({ text: 'UFA-310: Search Result icons - Need to be the same size', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Search result icons are inconsistent in size. News icons appear larger than other content type icons, creating visual misalignment in the search results display.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Technical Details:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Currently on DEV, larger news icons are out of sync with other icons', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• All icons should be standardized to the same dimensions', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• None', spacing: { after: 200 } }));

// UFA-308
docSections.push(new Paragraph({ text: 'UFA-308: Update to footer', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Footer updates to match branding requirements including logo removal, copyright text update, and social media icon integration.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Requirements:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Remove the logo from the footer and match copy style', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Add text: "Homestead - Made for United Farmers of Alberta Co-operative Ltd."', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '3. Add social icons with links:', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '   • X (Twitter): https://x.com/UFAcooperative', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '   • LinkedIn: https://www.linkedin.com/company/ufa-co-operative-ltd/', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '   • Facebook: https://www.facebook.com/UFA-Co-operative-Limited-223810904432346/', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '   • YouTube: https://www.youtube.com/user/UFACooperativeLtd', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '   • Instagram: https://www.instagram.com/ufacooperative/', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Note: Should not include terms of use, privacy policy, or return policy links.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• None', spacing: { after: 200 } }));

// UFA-304
docSections.push(new Paragraph({ text: 'UFA-304: Search - Searched words should be highlighted on the result set', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Enable visual highlighting of search terms in search results. The GenericSearchListWidget is already configured with Search Experience 2.0 features including search term highlighting.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Current State:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Although highlight data is present in search responses (e.g., <c0>agriculture</c0>), the <c0> highlight tags do not have any CSS styling applied by default.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Expected SharePoint Behavior:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Highlighting appears when the search term exists in article content or summary', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Highlighting does NOT appear when the term exists only in the title, tags, or metadata', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Add callbackUI to GenericSearchListWidget on central site', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Apply CSS styling for <c0> tags using UFA theme colors', spacing: { after: 200 } }));

// UFA-299
docSections.push(new Paragraph({ text: 'UFA-299: SEARCH - Display Short Description for document content type', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Display Short Description for document content type. If one does not exist, show nothing.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'SharePoint Column Specification:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Column Name: Short Description', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Internal Name: Short_x0020_Description', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Verify Short Description column exists in target environment', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Column Name: "Short Description"', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '3. Internal Name: "Short_x0020_Description"', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '4. If column does not exist, create it matching the exact specifications above', spacing: { after: 200 } }));

// UFA-296
docSections.push(new Paragraph({ text: 'UFA-296: All links to match link styling', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Standardize inline content link styling across all content types including news articles, page content, and announcements.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Requirements:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Links should be displayed in orange color', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Links should show underline on hover', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Applies to all inline content links in articles and pages', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• None', spacing: { after: 200 } }));

// UFA-295
docSections.push(new Paragraph({ text: 'UFA-295: Update Theme manager To include UFA change', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Update theme manager configuration to include UFA-specific color customization.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Theme Variable Update:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Variable: fs-featured-card-bg-color', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Value: 495965', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• None', spacing: { after: 200 } }));

// UFA-294
docSections.push(new Paragraph({ text: 'UFA-294: Updates to Tools & Systems Cards', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Redesign Tools & Systems cards to improve visual consistency and alignment.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Requirements:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Hide the group title', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Make the icon (tool logo) 50px by 50px', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '3. Align icon with the title in the top left corner', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• None', spacing: { after: 200 } }));

// UFA-291
docSections.push(new Paragraph({ text: 'UFA-291: Summary Links widget View - 4/5 across', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Fix Summary Links widget (featured box view) card layout to prevent inconsistent sizing and ensure proper grid display.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Issue:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'The featured box view currently displays 5 cards in a row and has been impacted by the customized Tools & Systems page. Auto-adjusting card sizes creates unequal card dimensions when there are insufficient cards to complete the row.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Requirements:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Reverse the impact on featured box view from Tools & Systems customization', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Set fixed number of cards per row to 4', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '3. Ensure consistent card sizing across all rows', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• None', spacing: { after: 200 } }));

// UFA-290
docSections.push(new Paragraph({ text: 'UFA-290: Remove icon background color for POC view and fix tool detail size', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Ready to Deploy')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Fix visual issues in Tools & Systems POC (Point of Contact) view related to icon background and link description formatting.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Issues:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Icon Background: Icons for Tools & Systems POC view have an unwanted grey background that needs to be removed', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Link Description Size: When link descriptions contain multiple <p> tags (created by pressing enter), the description section sizing becomes inconsistent', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• None', spacing: { after: 200 } }));

// UFA-301
docSections.push(new Paragraph({ text: 'UFA-301: Search - Header should not be indexed', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Client Validation')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Configure search indexing to exclude header elements. Site header content should not appear in search results as it causes irrelevant matches for commonly searched terms.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Configure search indexing rules to exclude header elements', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Run full search reindex after configuration changes', spacing: { after: 200 } }));

// UFA-269
docSections.push(new Paragraph({ text: 'UFA-269: Search results showing multiple links', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Client Validation')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Fix duplicate search results caused by multiple page variations (default.aspx, DispForm.aspx) appearing for the same news article. For example, searching "annual meeting 2024" returns 3 different URLs pointing to the same article.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Root Cause:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'News articles with attachments generate extra list items in SharePoint (e.g., PageData_AK list), creating multiple indexed URLs for identical content.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Update SearchQuery_AK list to ensure unique IDs only', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Clean up duplicate entries in PageData_AK list', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '3. Run full search reindex to update results', spacing: { after: 200 } }));

// UFA-302
docSections.push(new Paragraph({ text: 'UFA-302: Search - Longer URL should be used', heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Type: ', bold: true }), new TextRun('Task')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Priority: ', bold: true }), new TextRun('Medium')], spacing: { after: 50 } }));
docSections.push(new Paragraph({ children: [new TextRun({ text: 'Status: ', bold: true }), new TextRun('Client Validation')], spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Description:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Update search result URLs to use canonical paths without default.aspx. Currently, search results return URLs with "default.aspx" which should be removed for cleaner, more user-friendly links.', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Requirements:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Remove default.aspx from search result URLs', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Use clean canonical URL format instead', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Manual Deployment Steps:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '1. Configure URL rewriting to remove default.aspx', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '2. Run search reindex to update all indexed URLs', spacing: { after: 200 } }));

// Pre-Deployment Checklist
docSections.push(new Paragraph({ text: 'Pre-Deployment Checklist', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
const preDeployChecklist = [
  'Backup current DEV environment configuration',
  'Review all code changes in repository',
  'Verify all tickets are in "Ready to Deploy" status',
  'Confirm deployment window with stakeholders',
  'Prepare rollback plan'
];
preDeployChecklist.forEach(item => {
  docSections.push(new Paragraph({ text: `☐ ${item}`, spacing: { after: 50 } }));
});

// Post-Deployment Verification
docSections.push(new Paragraph({ text: 'Post-Deployment Verification', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));

docSections.push(new Paragraph({ text: 'Search Enhancements', heading: HeadingLevel.HEADING_2, spacing: { before: 100, after: 100 } }));
docSections.push(new Paragraph({ text: '☐ UFA-312: Test search typeahead behavior', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-310: Verify search result icons are uniform in size', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-304: Test search term highlighting with UFA theme colors', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-299: Verify short description display for documents', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-301: Confirm header elements are not indexed', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-269: Verify no duplicate search results for same article', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-302: Test search result URLs without default.aspx', spacing: { after: 100 } }));

docSections.push(new Paragraph({ text: 'UI/UX Updates', heading: HeadingLevel.HEADING_2, spacing: { before: 100, after: 100 } }));
docSections.push(new Paragraph({ text: '☐ UFA-308: Verify footer updates and social media links', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-296: Test inline link styling (orange with underline on hover)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-295: Verify theme changes (featured card background color)', spacing: { after: 100 } }));

docSections.push(new Paragraph({ text: 'Widget Updates', heading: HeadingLevel.HEADING_2, spacing: { before: 100, after: 100 } }));
docSections.push(new Paragraph({ text: '☐ UFA-294: Verify Tools & Systems cards (50px icons, top left alignment)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-291: Test Summary Links widget (4 cards per row)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ UFA-290: Verify POC view icon fixes and description sizing', spacing: { after: 100 } }));

docSections.push(new Paragraph({ text: 'Cross-Browser Testing', heading: HeadingLevel.HEADING_2, spacing: { before: 100, after: 100 } }));
docSections.push(new Paragraph({ text: '☐ Chrome (latest)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Edge (latest)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Firefox (latest)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Safari (latest, if applicable)', spacing: { after: 100 } }));

docSections.push(new Paragraph({ text: 'Responsive Testing', heading: HeadingLevel.HEADING_2, spacing: { before: 100, after: 100 } }));
docSections.push(new Paragraph({ text: '☐ Desktop (1920x1080, 1366x768)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Tablet (iPad, Surface)', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '☐ Mobile (iPhone, Android)', spacing: { after: 100 } }));

// Rollback Plan
docSections.push(new Paragraph({ text: 'Rollback Plan', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ text: 'If critical issues are encountered post-deployment:', spacing: { after: 100 } }));
docSections.push(new Paragraph({ text: 'Immediate Actions:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Document the issue and impact', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Notify stakeholders', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Assess severity and user impact', spacing: { after: 100 } }));

docSections.push(new Paragraph({ text: 'Rollback Procedure:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Revert repository to previous commit', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Redeploy previous stable version', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Clear CDN cache if applicable', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Verify functionality restored', spacing: { after: 100 } }));

docSections.push(new Paragraph({ text: 'Post-Rollback:', bold: true, spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Root cause analysis', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Fix issues in development environment', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Retest before next deployment attempt', spacing: { after: 100 } }));

// Notes
docSections.push(new Paragraph({ text: 'Notes', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ text: '• All tickets tagged with label: march-2026-dev-release', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• No database changes required', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Manual steps documented in individual ticket sections', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• Some tickets (UFA-299, UFA-304) were included in previous deployment but remain in "Ready to Deploy" status', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: '• This deployment includes 13 total tickets: 10 Ready to Deploy + 3 Client Validation tickets (UFA-301, UFA-269, UFA-302)', spacing: { after: 100 } }));

// Support Contact
docSections.push(new Paragraph({ text: 'Support Contact', heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 } }));
docSections.push(new Paragraph({ text: 'Technical Lead: Diego Rosa', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Project: UFA Homestead', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'Jira Project: UFA', spacing: { after: 50 } }));
docSections.push(new Paragraph({ text: 'For deployment issues or questions, reference ticket UFA-314.', spacing: { after: 100 } }));

// Create the document
const doc = new Document({
  sections: [{
    properties: {},
    children: docSections
  }]
});

// Write to file
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ DOCX file created successfully at: ${docxPath}`);
  console.log(`📄 Markdown source: ${markdownPath}`);
}).catch(error => {
  console.error('❌ Error creating DOCX file:', error);
});
