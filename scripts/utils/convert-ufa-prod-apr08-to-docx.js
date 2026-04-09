const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, HeadingLevel } = require('docx');

const markdownFile = path.join('C:', 'Git', 'UFA', 'UFA', 'deployments', 'UFA_PROD_Deployment_2026-04-08_Release_Notes.md');
const outputFile = path.join('C:', 'Git', 'UFA', 'UFA', 'deployments', 'UFA_PROD_Deployment_2026-04-08_Release_Notes.docx');

const markdown = fs.readFileSync(markdownFile, 'utf8');
const sections = [];
const lines = markdown.split('\n');

let i = 0;
while (i < lines.length) {
  const line = lines[i];

  if (line.startsWith('# ')) {
    sections.push(new Paragraph({ text: line.substring(2), heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }));
  } else if (line.startsWith('## ')) {
    sections.push(new Paragraph({ text: line.substring(3), heading: HeadingLevel.HEADING_2, spacing: { after: 300, before: 300 } }));
  } else if (line.startsWith('### ')) {
    sections.push(new Paragraph({ text: line.substring(4), heading: HeadingLevel.HEADING_3, spacing: { after: 200, before: 200 } }));
  } else if (line.startsWith('#### ')) {
    sections.push(new Paragraph({ text: line.substring(5), heading: HeadingLevel.HEADING_4, spacing: { after: 150, before: 150 } }));
  } else if (line.includes('|')) {
    const tableRows = [];
    let j = i;

    while (j < lines.length && lines[j].includes('|')) {
      if (!lines[j].includes('---')) {
        const cells = lines[j]
          .split('|')
          .slice(1, -1)
          .map((cell) => new TableCell({ children: [new Paragraph(cell.trim())] }));
        tableRows.push(new TableRow({ children: cells }));
      }
      j++;
    }

    if (tableRows.length > 0) {
      sections.push(new Table({ width: { size: 100, type: 'pct' }, rows: tableRows }));
      i = j - 1;
    }
  } else if (line.match(/^\s*[-*]\s/)) {
    let j = i;
    while (j < lines.length && lines[j].match(/^\s*[-*]\s/)) {
      const match = lines[j].match(/^\s*[-*]\s(.+)/);
      if (match) {
        sections.push(new Paragraph({ text: match[1], bullet: { level: 0 } }));
      }
      j++;
    }
    sections.push(new Paragraph({ text: '' }));
    i = j - 1;
  } else if (line.match(/^\s*\[\s*[x ]\s*\]\s/)) {
    let j = i;
    while (j < lines.length && lines[j].match(/^\s*\[\s*[x ]\s*\]\s/)) {
      const match = lines[j].match(/^\s*\[\s*[x ]\s*\]\s(.+)/);
      if (match) {
        sections.push(new Paragraph({ text: match[1], bullet: { level: 0 } }));
      }
      j++;
    }
    sections.push(new Paragraph({ text: '' }));
    i = j - 1;
  } else if (line.match(/^-{3,}$/)) {
    sections.push(new Paragraph({ text: '' }));
  } else if (line.trim().length > 0 && !line.match(/^\*\*/)) {
    sections.push(new Paragraph({ text: line.trim(), spacing: { after: 120 } }));
  } else {
    sections.push(new Paragraph({ text: '' }));
  }

  i++;
}

const doc = new Document({ sections: [{ children: sections }] });

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputFile, buffer);
  console.log('DOCX generated successfully.');
  console.log(`Input: ${markdownFile}`);
  console.log(`Output: ${outputFile}`);
});
