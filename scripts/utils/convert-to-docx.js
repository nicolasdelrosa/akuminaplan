const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType } = require('docx');

const markdownFile = path.join(__dirname, 'LASC_Dev_Deployment_Jan_27_2026_Release_Notes.md');
const outputFile = path.join(__dirname, 'LASC_Dev_Deployment_Jan_27_2026_Release_Notes.docx');

const markdown = fs.readFileSync(markdownFile, 'utf8');

const sections = [];

// Parse markdown and create document structure
const lines = markdown.split('\n');
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  // Main title
  if (line.startsWith('# ')) {
    sections.push(
      new Paragraph({
        text: line.substring(2),
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      })
    );
  }
  // Subtitle
  else if (line.startsWith('## ')) {
    sections.push(
      new Paragraph({
        text: line.substring(3),
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 300, before: 300 }
      })
    );
  }
  // Sub-subtitle
  else if (line.startsWith('### ')) {
    sections.push(
      new Paragraph({
        text: line.substring(4),
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 200, before: 200 }
      })
    );
  }
  // Sub-sub-subtitle
  else if (line.startsWith('#### ')) {
    sections.push(
      new Paragraph({
        text: line.substring(5),
        heading: HeadingLevel.HEADING_4,
        spacing: { after: 150, before: 150 }
      })
    );
  }
  // Table
  else if (line.includes('|')) {
    const tableRows = [];
    let j = i;
    while (j < lines.length && lines[j].includes('|')) {
      if (!lines[j].includes('---')) {
        const cells = lines[j].split('|').slice(1, -1).map(cell => 
          new TableCell({
            children: [new Paragraph(cell.trim())]
          })
        );
        tableRows.push(new TableRow({ children: cells }));
      }
      j++;
    }
    if (tableRows.length > 0) {
      sections.push(
        new Table({
          width: { size: 100, type: 'pct' },
          rows: tableRows,
          spacing: { after: 300 }
        })
      );
      i = j - 1;
    }
  }
  // Bullet list
  else if (line.match(/^\s*[-*]\s/)) {
    const listItems = [];
    let j = i;
    while (j < lines.length && (lines[j].match(/^\s*[-*]\s/) || lines[j].match(/^\s{2,}[-*]\s/))) {
      const match = lines[j].match(/^\s*[-*]\s(.+)/);
      if (match) {
        listItems.push(
          new Paragraph({
            text: match[1],
            bullet: { level: 0 }
          })
        );
      }
      j++;
    }
    if (listItems.length > 0) {
      sections.push(...listItems);
      sections.push(new Paragraph({ text: '', spacing: { after: 300 } }));
      i = j - 1;
    }
  }
  // Checkbox list
  else if (line.match(/^\s*\[\s*[\sx]\s*\]\s/)) {
    const checkboxItems = [];
    let j = i;
    while (j < lines.length && lines[j].match(/^\s*\[\s*[\sx]\s*\]\s/)) {
      const match = lines[j].match(/^\s*\[\s*[\sx]\s*\]\s(.+)/);
      if (match) {
        checkboxItems.push(
          new Paragraph({
            text: match[1],
            bullet: { level: 0 }
          })
        );
      }
      j++;
    }
    if (checkboxItems.length > 0) {
      sections.push(...checkboxItems);
      sections.push(new Paragraph({ text: '', spacing: { after: 300 } }));
      i = j - 1;
    }
  }
  // Horizontal rule
  else if (line.match(/^-{3,}$/)) {
    sections.push(
      new Paragraph({
        border: {
          bottom: { color: '000000', space: 1, type: 'single', size: 6 }
        },
        spacing: { after: 300, before: 300 }
      })
    );
  }
  // Regular paragraph
  else if (line.trim().length > 0 && !line.match(/^\*\*/)) {
    sections.push(
      new Paragraph({
        text: line.trim(),
        spacing: { after: 200 }
      })
    );
  }
  // Empty lines
  else if (line.trim().length === 0) {
    sections.push(new Paragraph({ text: '' }));
  }

  i++;
}

const doc = new Document({
  sections: [{
    children: sections
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFile, buffer);
  console.log(`✓ Release notes converted to: ${outputFile}`);
});
