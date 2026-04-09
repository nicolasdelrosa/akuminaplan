const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, Table, TableCell, TableRow, TableOfContents, HeadingLevel, BorderStyle, ShadingType, WidthType, TextRun } = require('docx');

function createHeadingParagraph(text, level) {
  if (level === 1) {
    return new Paragraph({
      text: text.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 0, before: 200 },
      shading: {
        type: ShadingType.SOLID,
        color: '4F81BD',
        fill: '4F81BD'
      },
      border: {
        top: { style: BorderStyle.SINGLE, size: 9, color: '4F81BD' },
        bottom: { style: BorderStyle.SINGLE, size: 9, color: '4F81BD' },
        left: { style: BorderStyle.SINGLE, size: 9, color: '4F81BD' },
        right: { style: BorderStyle.SINGLE, size: 9, color: '4F81BD' }
      },
      run: {
        color: 'FFFFFF',
        font: 'Calibri',
        size: 22
      }
    });
  }

  if (level === 2) {
    return new Paragraph({
      text: text.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 0, before: 200 },
      shading: {
        type: ShadingType.SOLID,
        color: 'DBE5F1',
        fill: 'DBE5F1'
      },
      border: {
        top: { style: BorderStyle.SINGLE, size: 9, color: 'DBE5F1' },
        bottom: { style: BorderStyle.SINGLE, size: 9, color: 'DBE5F1' },
        left: { style: BorderStyle.SINGLE, size: 9, color: 'DBE5F1' },
        right: { style: BorderStyle.SINGLE, size: 9, color: 'DBE5F1' }
      },
      run: {
        font: 'Calibri',
        size: 22
      }
    });
  }

  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { after: 200, before: 200 }
  });
}

// Parse markdown content and create document sections with Akumina styling
function parseMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      let j = i + 1;

      while (j < lines.length && !lines[j].startsWith('```')) {
        sections.push(
          new Paragraph({
            shading: {
              type: ShadingType.SOLID,
              color: 'F3F3F3',
              fill: 'F3F3F3'
            },
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: lines[j],
                font: 'Consolas',
                size: 18
              })
            ]
          })
        );
        j++;
      }

      sections.push(new Paragraph({ text: '', spacing: { after: 200 } }));
      i = j;
    }
    // Main title (H1) - Blue background, white text, uppercase
    else if (line.startsWith('# ') && !line.startsWith('## ')) {
      sections.push(createHeadingParagraph(line.substring(2), 1));
    }
    // Subtitle (H2) - Light blue background, uppercase
    else if (line.startsWith('## ') && !line.startsWith('### ')) {
      const headingText = line.substring(3).trim();

      if (headingText.toLowerCase() === 'table of contents') {
        sections.push(createHeadingParagraph(headingText, 1));
        sections.push(
          new TableOfContents('Table of Contents', {
            hyperlink: true,
            headingStyleRange: '1-3',
            pageNumbersEntryLevelsRange: '1-3',
            entryAndPageNumberSeparator: ' ',
            preserveTabInEntries: true
          })
        );
        sections.push(new Paragraph({ text: '', spacing: { after: 300 } }));

        let j = i + 1;
        while (j < lines.length && !lines[j].match(/^-{3,}$/)) {
          j++;
        }
        i = j - 1;
      } else {
        sections.push(createHeadingParagraph(headingText, 2));
      }
    }
    // Sub-subtitle (H3)
    else if (line.startsWith('### ')) {
      sections.push(createHeadingParagraph(line.substring(4), 3));
    }
    // Table - Gray header row
    else if (line.includes('|')) {
      const tableRows = [];
      let j = i;
      let isFirstRow = true;
      
      while (j < lines.length && lines[j].includes('|')) {
        if (!lines[j].includes('---')) {
          const cells = lines[j].split('|').slice(1, -1).map(cell => {
            const cellContent = new TableCell({
              children: [new Paragraph({
                text: cell.trim(),
                spacing: { before: 0, after: 0 }
              })],
              shading: isFirstRow ? {
                type: ShadingType.SOLID,
                color: 'BFBFBF',
                fill: 'BFBFBF'
              } : undefined,
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 4, color: '000000' }
              }
            });
            return cellContent;
          });
          
          tableRows.push(new TableRow({ children: cells }));
          isFirstRow = false;
        }
        j++;
      }
      
      if (tableRows.length > 0) {
        sections.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
              left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
              right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
              insideVertical: { style: BorderStyle.SINGLE, size: 4, color: '000000' }
            }
          })
        );
        sections.push(new Paragraph({ text: '', spacing: { after: 300 } }));
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
    // Horizontal rule
    else if (line.match(/^-{3,}$/)) {
      sections.push(
        new Paragraph({
          border: {
            bottom: { color: '000000', space: 1, type: BorderStyle.SINGLE, size: 6 }
          },
          spacing: { after: 300, before: 300 }
        })
      );
    }
    // Regular paragraph
    else if (line.trim().length > 0) {
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

  return sections;
}

// Main conversion function
async function convertMarkdownToDocx(inputFile, outputFile) {
  console.log(`Reading markdown file: ${inputFile}`);
  const markdown = fs.readFileSync(inputFile, 'utf8');

  console.log('Parsing markdown content...');
  const sections = parseMarkdown(markdown);

  console.log('Creating Word document...');
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22
          }
        }
      },
      paragraphStyles: [
        {
          id: 'TOC1',
          name: 'TOC 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          paragraph: {
            spacing: { before: 200, after: 100, line: 276 },
            indent: { left: 0 }
          },
          run: {
            font: 'Calibri',
            size: 20
          }
        },
        {
          id: 'TOC2',
          name: 'TOC 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          paragraph: {
            spacing: { before: 200, after: 100, line: 276 },
            indent: { left: 220 }
          },
          run: {
            font: 'Calibri',
            size: 20
          }
        },
        {
          id: 'TOC3',
          name: 'TOC 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          paragraph: {
            spacing: { before: 200, after: 100, line: 276 },
            indent: { left: 400 }
          },
          run: {
            font: 'Calibri',
            size: 20
          }
        }
      ]
    },
    features: {
      updateFields: true
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,    // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440
          }
        }
      },
      children: sections
    }]
  });

  console.log(`Writing DOCX file: ${outputFile}`);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputFile, buffer);

  console.log('✓ Conversion complete!');
  console.log(`  Input:  ${inputFile}`);
  console.log(`  Output: ${outputFile}`);
}

// CLI execution
if (require.main === module) {
  const inputFile = path.join(__dirname, 'JMSMUC_Runbook.md');
  const outputFile = path.join(__dirname, 'JMSMUC_Runbook.docx');

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  convertMarkdownToDocx(inputFile, outputFile)
    .then(() => {
      console.log('\n✓ JM Smuckers runbook generated successfully!');
    })
    .catch(err => {
      console.error('Error converting markdown to DOCX:', err);
      process.exit(1);
    });
}

module.exports = { convertMarkdownToDocx };
