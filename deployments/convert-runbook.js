const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TableOfContents,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  WidthType,
  TextRun
} = require('docx');

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

function createTable(lines, startIndex) {
  const rows = [];
  let index = startIndex;
  let isHeader = true;

  while (index < lines.length && lines[index].includes('|')) {
    const line = lines[index];
    if (!line.includes('---')) {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => new TableCell({
          children: [new Paragraph({
            text: cell.trim(),
            spacing: { before: 0, after: 0 }
          })],
          shading: isHeader ? {
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
        }));

      rows.push(new TableRow({ children: cells }));
      isHeader = false;
    }

    index++;
  }

  if (rows.length === 0) {
    return null;
  }

  return {
    endIndex: index - 1,
    table: new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        right: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: '000000' }
      }
    })
  };
}

function createBulletList(lines, startIndex) {
  const paragraphs = [];
  let index = startIndex;

  while (index < lines.length && (lines[index].match(/^\s*[-*]\s/) || lines[index].match(/^\s{2,}[-*]\s/))) {
    const match = lines[index].match(/^\s*[-*]\s(.+)/);
    if (match) {
      paragraphs.push(new Paragraph({
        text: match[1],
        bullet: { level: 0 }
      }));
    }
    index++;
  }

  if (paragraphs.length === 0) {
    return null;
  }

  return {
    endIndex: index - 1,
    paragraphs
  };
}

function createNumberedList(lines, startIndex) {
  const paragraphs = [];
  let index = startIndex;

  while (index < lines.length && lines[index].match(/^\d+\.\s/)) {
    const text = lines[index].replace(/^\d+\.\s/, '');
    paragraphs.push(new Paragraph({
      text,
      numbering: {
        reference: 'runbook-numbered',
        level: 0
      }
    }));
    index++;
  }

  if (paragraphs.length === 0) {
    return null;
  }

  return {
    endIndex: index - 1,
    paragraphs
  };
}

function parseMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith('```')) {
        sections.push(new Paragraph({
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
        }));
        j++;
      }
      sections.push(new Paragraph({ text: '', spacing: { after: 200 } }));
      i = j;
      continue;
    }

    if (line.startsWith('# ') && !line.startsWith('## ')) {
      sections.push(createHeadingParagraph(line.substring(2), 1));
      continue;
    }

    if (line.startsWith('## ') && !line.startsWith('### ')) {
      const headingText = line.substring(3).trim();
      if (headingText.toLowerCase() === 'table of contents') {
        sections.push(createHeadingParagraph(headingText, 1));
        sections.push(new TableOfContents('Table of Contents', {
          hyperlink: true,
          headingStyleRange: '1-3',
          pageNumbersEntryLevelsRange: '1-3',
          entryAndPageNumberSeparator: ' ',
          preserveTabInEntries: true
        }));
        sections.push(new Paragraph({ text: '', spacing: { after: 300 } }));

        let j = i + 1;
        while (j < lines.length && !lines[j].match(/^-{3,}$/)) {
          j++;
        }
        i = j - 1;
      } else {
        sections.push(createHeadingParagraph(headingText, 2));
      }
      continue;
    }

    if (line.startsWith('### ')) {
      sections.push(createHeadingParagraph(line.substring(4), 3));
      continue;
    }

    if (line.includes('|')) {
      const tableResult = createTable(lines, i);
      if (tableResult) {
        sections.push(tableResult.table);
        sections.push(new Paragraph({ text: '', spacing: { after: 300 } }));
        i = tableResult.endIndex;
        continue;
      }
    }

    if (line.match(/^\s*[-*]\s/)) {
      const bulletResult = createBulletList(lines, i);
      if (bulletResult) {
        sections.push(...bulletResult.paragraphs);
        sections.push(new Paragraph({ text: '', spacing: { after: 300 } }));
        i = bulletResult.endIndex;
        continue;
      }
    }

    if (line.match(/^\d+\.\s/)) {
      const numberedResult = createNumberedList(lines, i);
      if (numberedResult) {
        sections.push(...numberedResult.paragraphs);
        sections.push(new Paragraph({ text: '', spacing: { after: 300 } }));
        i = numberedResult.endIndex;
        continue;
      }
    }

    if (line.match(/^-{3,}$/)) {
      sections.push(new Paragraph({
        border: {
          bottom: { color: '000000', space: 1, type: BorderStyle.SINGLE, size: 6 }
        },
        spacing: { after: 300, before: 300 }
      }));
      continue;
    }

    if (line.trim().length > 0) {
      sections.push(new Paragraph({
        text: line.trim(),
        spacing: { after: 200 }
      }));
    } else {
      sections.push(new Paragraph({ text: '' }));
    }
  }

  return sections;
}

async function convertMarkdownToDocx(inputFile, outputFile) {
  const markdown = fs.readFileSync(inputFile, 'utf8');
  const sections = parseMarkdown(markdown);

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
    numbering: {
      config: [
        {
          reference: 'runbook-numbered',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: 'left'
            }
          ]
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

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputFile, buffer);
}

if (require.main === module) {
  const inputArg = process.argv[2];
  const outputArg = process.argv[3];

  if (!inputArg) {
    console.error('Usage: node deployments/convert-runbook.js <input.md> [output.docx]');
    process.exit(1);
  }

  const inputFile = path.resolve(inputArg);
  const outputFile = outputArg
    ? path.resolve(outputArg)
    : inputFile.replace(/\.md$/i, '.docx');

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  convertMarkdownToDocx(inputFile, outputFile)
    .then(() => {
      console.log(`Runbook DOCX generated: ${outputFile}`);
    })
    .catch((error) => {
      console.error('Error converting markdown to DOCX:', error);
      process.exit(1);
    });
}

module.exports = { convertMarkdownToDocx };
