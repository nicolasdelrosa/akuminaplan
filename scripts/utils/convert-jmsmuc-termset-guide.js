const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } = require('docx');

const markdownFile = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Term_Set_Configuration_Guide.md');
const outputFile = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Term_Set_Configuration_Guide.docx');

console.log('Converting Term Set Configuration Guide to DOCX...');
console.log('Input:', markdownFile);
console.log('Output:', outputFile);

const markdown = fs.readFileSync(markdownFile, 'utf8');

const sections = [];

// Parse markdown and create document structure
const lines = markdown.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Main title (# )
  if (line.startsWith('# ')) {
    sections.push(
      new Paragraph({
        text: line.substring(2),
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 },
        alignment: AlignmentType.CENTER
      })
    );
  }
  // Subtitle (## )
  else if (line.startsWith('## ')) {
    sections.push(
      new Paragraph({
        text: line.substring(3),
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 300, before: 400 }
      })
    );
  }
  // Sub-subtitle (### )
  else if (line.startsWith('### ')) {
    sections.push(
      new Paragraph({
        text: line.substring(4),
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 200, before: 200 }
      })
    );
  }
  // Numbered list items
  else if (/^\d+\.\s/.test(line)) {
    const match = line.match(/^\d+\.\s(.+)$/);
    if (match) {
      const text = match[1];
      const children = [];
      
      // Check for bold text (**text**)
      if (text.includes('**')) {
        const parts = text.split('**');
        for (let j = 0; j < parts.length; j++) {
          if (j % 2 === 1) {
            children.push(new TextRun({ text: parts[j], bold: true }));
          } else {
            children.push(new TextRun({ text: parts[j] }));
          }
        }
      } else {
        children.push(new TextRun({ text }));
      }
      
      sections.push(
        new Paragraph({
          children,
          numbering: {
            reference: 'numbered-list',
            level: 0
          },
          spacing: { after: 100 }
        })
      );
    }
  }
  // Bulleted list items
  else if (line.startsWith('- ') || line.startsWith('   - ')) {
    const isIndented = line.startsWith('   - ');
    const text = isIndented ? line.substring(5) : line.substring(2);
    const children = [];
    
    // Check for checkmarks (✅)
    if (text.includes('✅')) {
      const parts = text.split('✅');
      for (let j = 0; j < parts.length; j++) {
        if (j > 0) {
          children.push(new TextRun({ text: '✅' }));
        }
        children.push(new TextRun({ text: parts[j] }));
      }
    }
    // Check for bold text (**text**)
    else if (text.includes('**')) {
      const parts = text.split('**');
      for (let j = 0; j < parts.length; j++) {
        if (j % 2 === 1) {
          children.push(new TextRun({ text: parts[j], bold: true }));
        } else {
          children.push(new TextRun({ text: parts[j] }));
        }
      }
    } else {
      children.push(new TextRun({ text }));
    }
    
    sections.push(
      new Paragraph({
        children,
        bullet: {
          level: isIndented ? 1 : 0
        },
        spacing: { after: 100 }
      })
    );
  }
  // Horizontal rule (---)
  else if (line.startsWith('---')) {
    sections.push(
      new Paragraph({
        text: '',
        spacing: { after: 200, before: 200 },
        border: {
          bottom: {
            color: 'CCCCCC',
            space: 1,
            style: 'single',
            size: 6
          }
        }
      })
    );
  }
  // Bold/Note text (**Note:**)
  else if (line.startsWith('**')) {
    const text = line.replace(/\*\*/g, '');
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: true,
            italics: text.startsWith('Note:') || text.startsWith('Solution:') || text.startsWith('Issue:')
          })
        ],
        spacing: { after: 100, before: 100 }
      })
    );
  }
  // Regular text (non-empty)
  else if (line.trim()) {
    const children = [];
    
    // Check for inline links or bold text
    if (line.includes('**') || line.includes('http')) {
      let currentText = line;
      
      // Handle bold text
      if (currentText.includes('**')) {
        const parts = currentText.split('**');
        for (let j = 0; j < parts.length; j++) {
          if (j % 2 === 1) {
            children.push(new TextRun({ text: parts[j], bold: true }));
          } else if (parts[j]) {
            children.push(new TextRun({ text: parts[j] }));
          }
        }
      } else {
        children.push(new TextRun({ text: currentText }));
      }
    } else {
      children.push(new TextRun({ text: line }));
    }
    
    sections.push(
      new Paragraph({
        children,
        spacing: { after: 100 }
      })
    );
  }
  // Empty line
  else {
    sections.push(
      new Paragraph({
        text: '',
        spacing: { after: 50 }
      })
    );
  }
}

// Create document
const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'numbered-list',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 720, hanging: 360 }
              }
            }
          }
        ]
      }
    ]
  },
  sections: [
    {
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
    }
  ]
});

// Save document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputFile, buffer);
  console.log('\n✅ Conversion complete!');
  console.log('📄 Output file:', outputFile);
}).catch(error => {
  console.error('Error creating DOCX:', error);
  process.exit(1);
});
