const fs = require('fs');
const { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell } = require('docx');

const markdownFile = 'c:/Git/UFA/UFA/deployments/UFA_DEV_Deployment_2026-03-26_Release_Notes.md';
const outputFile = 'c:/Git/UFA/UFA/deployments/UFA_DEV_Deployment_2026-03-26_Release_Notes.docx';

const markdown = fs.readFileSync(markdownFile, 'utf8');
const lines = markdown.split('\n');
const children = [];

let i = 0;
while (i < lines.length) {
  const line = lines[i];

  if (line.startsWith('# ')) {
    children.push(new Paragraph({ text: line.slice(2), heading: HeadingLevel.HEADING_1, spacing: { after: 300 } }));
  } else if (line.startsWith('## ')) {
    children.push(new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 200 } }));
  } else if (line.startsWith('### ')) {
    children.push(new Paragraph({ text: line.slice(4), heading: HeadingLevel.HEADING_3, spacing: { before: 150, after: 150 } }));
  } else if (line.includes('|') && line.trim().startsWith('|')) {
    const tableRows = [];
    let j = i;
    while (j < lines.length && lines[j].trim().startsWith('|')) {
      if (!lines[j].includes('---')) {
        const cols = lines[j].split('|').slice(1, -1).map((c) =>
          new TableCell({ children: [new Paragraph(c.trim())] })
        );
        tableRows.push(new TableRow({ children: cols }));
      }
      j++;
    }
    if (tableRows.length > 0) {
      children.push(new Table({ rows: tableRows }));
    }
    i = j - 1;
  } else if (/^\s*[-*]\s+/.test(line)) {
    children.push(new Paragraph({ text: line.replace(/^\s*[-*]\s+/, ''), bullet: { level: 0 } }));
  } else if (/^\s*\d+\.\s+/.test(line)) {
    children.push(new Paragraph({ text: line.replace(/^\s*\d+\.\s+/, '') }));
  } else if (/^-{3,}$/.test(line.trim())) {
    children.push(new Paragraph({ text: '' }));
  } else if (line.trim().length === 0) {
    children.push(new Paragraph({ text: '' }));
  } else if (!line.trim().startsWith('```')) {
    children.push(new Paragraph({ text: line }));
  }

  i++;
}

const doc = new Document({ sections: [{ children }] });
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputFile, buffer);
  console.log('Created DOCX:', outputFile);
});
