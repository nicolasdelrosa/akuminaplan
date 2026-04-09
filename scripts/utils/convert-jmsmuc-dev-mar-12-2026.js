const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, HeadingLevel } = require('docx');

const markdownFile = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Dev_Deployment_Mar_12_2026_Release_Notes.md');
const outputFile = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Dev_Deployment_Mar_12_2026_Release_Notes.docx');

const markdown = fs.readFileSync(markdownFile, 'utf8');
const lines = markdown.split('\n');
const sections = [];

for (const rawLine of lines) {
  const line = rawLine.trimEnd();

  if (line.startsWith('# ')) {
    sections.push(new Paragraph({ text: line.slice(2), heading: HeadingLevel.HEADING_1, spacing: { after: 240 } }));
    continue;
  }

  if (line.startsWith('## ')) {
    sections.push(new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 160 } }));
    continue;
  }

  if (line.startsWith('### ')) {
    sections.push(new Paragraph({ text: line.slice(4), heading: HeadingLevel.HEADING_3, spacing: { before: 120, after: 120 } }));
    continue;
  }

  if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
    sections.push(new Paragraph({ text: line.replace(/^- \[[ x]\] /i, ''), bullet: { level: 0 } }));
    continue;
  }

  if (line.startsWith('- ') || line.startsWith('* ')) {
    sections.push(new Paragraph({ text: line.slice(2), bullet: { level: 0 } }));
    continue;
  }

  const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
  if (orderedMatch) {
    sections.push(new Paragraph({ text: `${orderedMatch[1]}` }));
    continue;
  }

  if (line.startsWith('---')) {
    sections.push(new Paragraph({ text: '' }));
    continue;
  }

  sections.push(new Paragraph({ text: line }));
}

const doc = new Document({
  sections: [{ children: sections }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputFile, buffer);
  console.log(`Generated: ${outputFile}`);
});
