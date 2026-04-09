const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle } = require('docx');

const markdownFile = 'c:\\AkuminaPlan\\deployments\\LAC\\LAC_Prod_Deployment_Mar_30_2026_Release_Notes.md';
const outputFile = 'c:\\AkuminaPlan\\deployments\\LAC\\LAC_Prod_Deployment_Mar_30_2026_Release_Notes.docx';

const markdown = fs.readFileSync(markdownFile, 'utf8');

const sections = [];

// Parse markdown and create document structure
const lines = markdown.split('\n');
let i = 0;
let inCodeBlock = false;
let codeBlockLines = [];
let inTable = false;
let tableRows = [];

while (i < lines.length) {
  const line = lines[i];

  // Code blocks
  if (line.startsWith('```')) {
    if (inCodeBlock) {
      // End code block
      sections.push(
        new Paragraph({
          text: codeBlockLines.join('\n'),
          style: 'Code',
          spacing: { before: 200, after: 200 }
        })
      );
      codeBlockLines = [];
      inCodeBlock = false;
    } else {
      // Start code block
      inCodeBlock = true;
    }
    i++;
    continue;
  }

  if (inCodeBlock) {
    codeBlockLines.push(line);
    i++;
    continue;
  }

  // Table detection
  if (line.startsWith('|')) {
    if (!inTable) {
      inTable = true;
      tableRows = [];
    }
    const cells = line.split('|').filter(cell => cell.trim() !== '');
    // Skip separator rows
    if (!cells[0].includes('---')) {
      tableRows.push(cells);
    }
  } else if (inTable) {
    // End of table
    if (tableRows.length > 0) {
      const tableChildren = tableRows.map((cells, rowIndex) => {
        return new TableRow({
          children: cells.map(cell => 
            new TableCell({
              children: [new Paragraph({ 
                text: cell.trim().replace(/\*\*/g, ''),
                bold: rowIndex === 0
              })],
              width: { size: 100 / cells.length, type: WidthType.PERCENTAGE }
            })
          )
        });
      });
      
      sections.push(
        new Table({
          rows: tableChildren,
          width: { size: 100, type: WidthType.PERCENTAGE }
        })
      );
    }
    inTable = false;
    tableRows = [];
  }

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
  // Horizontal rule
  else if (line.startsWith('---')) {
    sections.push(
      new Paragraph({
        text: '',
        border: {
          bottom: {
            color: "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { before: 200, after: 200 }
      })
    );
  }
  // Checkbox list items
  else if (line.trim().startsWith('- [ ]')) {
    sections.push(
      new Paragraph({
        text: '☐ ' + line.trim().substring(5).trim(),
        spacing: { before: 100 }
      })
    );
  }
  else if (line.trim().startsWith('- [x]')) {
    sections.push(
      new Paragraph({
        text: '☑ ' + line.trim().substring(5).trim(),
        spacing: { before: 100 }
      })
    );
  }
  // List items
  else if (line.trim().startsWith('- ')) {
    sections.push(
      new Paragraph({
        text: line.trim().substring(2),
        bullet: { level: 0 },
        spacing: { before: 100 }
      })
    );
  }
  // Numbered list items
  else if (/^\d+\.\s/.test(line.trim())) {
    sections.push(
      new Paragraph({
        text: line.trim().replace(/^\d+\.\s/, ''),
        numbering: { reference: 'default-numbering', level: 0 },
        spacing: { before: 100 }
      })
    );
  }
  // Regular paragraph (skip empty lines and table/code related)
  else if (line.trim() && !line.startsWith('|')) {
    // Handle bold text
    const boldRegex = /\*\*(.+?)\*\*/g;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    if (boldRegex.test(line) || linkRegex.test(line)) {
      const children = [];
      let lastIndex = 0;
      let match;
      
      const combinedRegex = /(\*\*(.+?)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
      while ((match = combinedRegex.exec(line)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          children.push(new TextRun(line.substring(lastIndex, match.index)));
        }
        
        // Add bold or link
        if (match[2]) {
          children.push(new TextRun({ text: match[2], bold: true }));
        } else if (match[4]) {
          children.push(new TextRun({ text: match[4], color: '0000FF', underline: {} }));
        }
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        children.push(new TextRun(line.substring(lastIndex)));
      }
      
      sections.push(
        new Paragraph({
          children: children,
          spacing: { before: 100, after: 100 }
        })
      );
    } else {
      sections.push(
        new Paragraph({
          text: line,
          spacing: { before: 100, after: 100 }
        })
      );
    }
  }

  i++;
}

const doc = new Document({
  sections: [{
    properties: {},
    children: sections,
  }],
  numbering: {
    config: [
      {
        reference: 'default-numbering',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.START,
          },
        ],
      },
    ],
  },
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFile, buffer);
  console.log(`✓ Document created successfully: ${outputFile}`);
});
