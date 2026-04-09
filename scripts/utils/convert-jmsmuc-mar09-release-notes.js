const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType } = require('docx');

const markdownFile = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Dev_Deployment_Mar_09_2026_Release_Notes.md');
const outputFile = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Dev_Deployment_Mar_09_2026_Release_Notes.docx');

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
  else if (line.startsWith('- ')) {
    const listItems = [];
    let j = i;
    while (j < lines.length && lines[j].startsWith('- ')) {
      const text = lines[j].substring(2).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
      listItems.push(
        new Paragraph({
          text: text,
          bullet: { level: 0 },
          spacing: { after: 100 }
        })
      );
      j++;
    }
    sections.push(...listItems);
    i = j - 1;
  }
  // Checkbox list
  else if (line.startsWith('- [ ]') || line.startsWith('- [x]') || line.startsWith('- [X]')) {
    const checked = line.startsWith('- [x]') || line.startsWith('- [X]');
    const text = line.substring(6).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
    sections.push(
      new Paragraph({
        text: `${checked ? '☑' : '☐'} ${text}`,
        spacing: { after: 100 }
      })
    );
  }
  // Code block
  else if (line.startsWith('```')) {
    const codeLines = [];
    i++;
    while (i < lines.length && !lines[i].startsWith('```')) {
      codeLines.push(lines[i]);
      i++;
    }
    if (codeLines.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: codeLines.join('\n'),
              font: 'Courier New',
              size: 18
            })
          ],
          spacing: { before: 100, after: 100 }
        })
      );
    }
  }
  // Bold text in paragraph
  else if (line.includes('**')) {
    const parts = line.split('**');
    const children = parts.map((part, index) => {
      const isBold = index % 2 === 1;
      // Remove markdown links
      const text = part.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      return new TextRun({
        text: text,
        bold: isBold
      });
    });
    sections.push(
      new Paragraph({
        children: children,
        spacing: { after: 100 }
      })
    );
  }
  // Horizontal rule
  else if (line.startsWith('---')) {
    sections.push(
      new Paragraph({
        text: '___________________________________________________________________________',
        spacing: { before: 200, after: 200 }
      })
    );
  }
  // Regular paragraph
  else if (line.trim().length > 0) {
    const text = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1');
    sections.push(
      new Paragraph({
        text: text,
        spacing: { after: 100 }
      })
    );
  }
  // Empty line
  else {
    // Skip empty lines between sections
  }

  i++;
}

const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: {
          top: 1440,
          right: 1440,
          bottom: 1440,
          left: 1440
        }
      }
    },
    children: sections
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFile, buffer);
  console.log('✓ DOCX file created successfully!');
  console.log('Output:', outputFile);
});
