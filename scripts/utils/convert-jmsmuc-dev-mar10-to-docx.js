const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType } = require('docx');

const markdownFile = path.join(__dirname, '../../deployments/JMSMUC/JMSMUC_Dev_Deployment_Mar_10_2026_Release_Notes.md');
const outputFile = path.join(__dirname, '../../deployments/JMSMUC/JMSMUC_Dev_Deployment_Mar_10_2026_Release_Notes.docx');

const markdown = fs.readFileSync(markdownFile, 'utf8');

const sections = [];

// Parse markdown and create document structure
const lines = markdown.split('\n');
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  // Skip horizontal rules
  if (line.trim() === '---') {
    sections.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    i++;
    continue;
  }

  // Main title (H1)
  if (line.startsWith('# ')) {
    sections.push(
      new Paragraph({
        text: line.substring(2),
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400, before: 200 }
      })
    );
  }
  // Subtitle (H2)
  else if (line.startsWith('## ')) {
    sections.push(
      new Paragraph({
        text: line.substring(3),
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 300, before: 400 }
      })
    );
  }
  // Sub-subtitle (H3)
  else if (line.startsWith('### ')) {
    sections.push(
      new Paragraph({
        text: line.substring(4),
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 200, before: 300 }
      })
    );
  }
  // Sub-sub-subtitle (H4)
  else if (line.startsWith('#### ')) {
    sections.push(
      new Paragraph({
        text: line.substring(5),
        heading: HeadingLevel.HEADING_4,
        spacing: { after: 150, before: 200 }
      })
    );
  }
  // Sub-sub-sub-subtitle (H5)
  else if (line.startsWith('##### ')) {
    sections.push(
      new Paragraph({
        text: line.substring(6),
        heading: HeadingLevel.HEADING_5,
        spacing: { after: 100, before: 150 }
      })
    );
  }
  // Table
  else if (line.includes('|') && !line.includes('---')) {
    const tableRows = [];
    let j = i;
    
    while (j < lines.length && lines[j].includes('|')) {
      if (!lines[j].includes('---')) {
        const cells = lines[j].split('|').slice(1, -1).map(cell => 
          new TableCell({
            children: [new Paragraph({ text: cell.trim() })],
            width: { size: 50, type: WidthType.PERCENTAGE }
          })
        );
        tableRows.push(new TableRow({ children: cells }));
      }
      j++;
    }
    
    if (tableRows.length > 0) {
      sections.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        }),
        new Paragraph({ text: '', spacing: { after: 200 } })
      );
      i = j - 1;
    }
  }
  // Numbered list
  else if (line.match(/^\d+\.\s/)) {
    const match = line.match(/^\d+\.\s(.+)/);
    if (match) {
      sections.push(
        new Paragraph({
          text: match[1],
          numbering: {
            reference: 'default-numbering',
            level: 0
          },
          spacing: { after: 100 }
        })
      );
    }
  }
  // Bullet list
  else if (line.match(/^\s*[-*]\s/)) {
    const indent = line.search(/[-*]/);
    const level = Math.floor(indent / 2);
    const match = line.match(/^\s*[-*]\s(.+)/);
    if (match) {
      sections.push(
        new Paragraph({
          text: match[1],
          bullet: { level: Math.min(level, 8) },
          spacing: { after: 100 }
        })
      );
    }
  }
  // Checkbox list
  else if (line.match(/^\s*-\s*\[[ x]\]/)) {
    const match = line.match(/^\s*-\s*\[([ x])\]\s*(.+)/);
    if (match) {
      const checked = match[1] === 'x';
      sections.push(
        new Paragraph({
          text: `${checked ? '☑' : '☐'} ${match[2]}`,
          spacing: { after: 100 }
        })
      );
    }
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
              size: 20
            })
          ],
          spacing: { after: 200, before: 200 }
        })
      );
    }
  }
  // Bold text parsing
  else if (line.includes('**')) {
    const children = [];
    const parts = line.split('**');
    parts.forEach((part, index) => {
      if (index % 2 === 0) {
        children.push(new TextRun({ text: part }));
      } else {
        children.push(new TextRun({ text: part, bold: true }));
      }
    });
    sections.push(
      new Paragraph({
        children: children,
        spacing: { after: 150 }
      })
    );
  }
  // Regular paragraph
  else if (line.trim().length > 0) {
    sections.push(
      new Paragraph({
        text: line.trim(),
        spacing: { after: 150 }
      })
    );
  }
  // Empty line
  else {
    sections.push(new Paragraph({ text: '' }));
  }

  i++;
}

// Create document
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'default-numbering',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT
          },
          {
            level: 1,
            format: 'lowerLetter',
            text: '%2.',
            alignment: AlignmentType.LEFT
          }
        ]
      }
    ]
  },
  sections: [
    {
      properties: {},
      children: sections
    }
  ]
});

// Write document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFile, buffer);
  console.log(`✅ DOCX file created: ${outputFile}`);
  console.log(`📄 Converted: ${markdownFile}`);
  console.log(`💾 Output: ${outputFile}`);
}).catch(err => {
  console.error('❌ Error creating DOCX:', err);
  process.exit(1);
});
