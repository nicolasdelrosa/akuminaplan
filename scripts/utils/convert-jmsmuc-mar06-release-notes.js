const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType } = require('docx');

const markdownFile = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Dev_Deployment_Mar_06_2026_Release_Notes.md');
const outputFile = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Dev_Deployment_Mar_06_2026_Release_Notes.docx');

console.log('Converting markdown to DOCX...');
console.log('Input:', markdownFile);
console.log('Output:', outputFile);

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
  else if (line.startsWith('#### ') && !line.includes('[JMSMUC-')) {
    sections.push(
      new Paragraph({
        text: line.substring(5),
        heading: HeadingLevel.HEADING_4,
        spacing: { after: 150, before: 150 }
      })
    );
  }
  // Ticket heading with link
  else if (line.startsWith('#### ') && line.includes('[JMSMUC-')) {
    const text = line.substring(5).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove markdown links
    sections.push(
      new Paragraph({
        text: text,
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
          rows: tableRows
        }),
        new Paragraph({ text: '', spacing: { after: 300 } })
      );
      i = j - 1;
    }
  }
  // Bullet list
  else if (line.match(/^\s*[-*]\s/) && !line.match(/^\s*\[\s*[\sx]\s*\]\s/)) {
    const listItems = [];
    let j = i;
    while (j < lines.length && (lines[j].match(/^\s*[-*]\s/) && !lines[j].match(/^\s*\[\s*[\sx]\s*\]\s/))) {
      const match = lines[j].match(/^\s*[-*]\s(.+)/);
      if (match) {
        const text = match[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove markdown links
        listItems.push(
          new Paragraph({
            text: text,
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
        const text = match[1].replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove bold
        checkboxItems.push(
          new Paragraph({
            text: '☐ ' + text,
            spacing: { after: 100 }
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
  // Code block
  else if (line.startsWith('```')) {
    const codeLines = [];
    let j = i + 1;
    while (j < lines.length && !lines[j].startsWith('```')) {
      codeLines.push(lines[j]);
      j++;
    }
    if (codeLines.length > 0) {
      sections.push(
        new Paragraph({
          text: codeLines.join('\n'),
          shading: { fill: 'f0f0f0' },
          spacing: { after: 300, before: 100 }
        })
      );
      i = j;
    }
  }
  // Horizontal rule
  else if (line.match(/^-{3,}$/)) {
    sections.push(
      new Paragraph({
        text: '',
        border: {
          bottom: { color: '000000', space: 1, type: 'single', size: 6 }
        },
        spacing: { after: 300, before: 300 }
      })
    );
  }
  // Bold text paragraph
  else if (line.match(/^\*\*[^*]+\*\*/) && line.trim().length > 0) {
    const text = line.replace(/\*\*([^*]+)\*\*/g, '$1');
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: true
          })
        ],
        spacing: { after: 200 }
      })
    );
  }
  // Regular paragraph with links or bold
  else if (line.trim().length > 0) {
    const text = line.trim()
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
      .replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove bold
    sections.push(
      new Paragraph({
        text: text,
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
  console.log('✓ Release notes converted successfully!');
  console.log('✓ Output file:', outputFile);
}).catch(error => {
  console.error('✗ Error converting to DOCX:', error);
  process.exit(1);
});
