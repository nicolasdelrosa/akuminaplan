const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = require('docx');

const markdownFilePath = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Prod_Deployment_Mar_10_2026_Release_Notes.md');
const outputFilePath = path.join(__dirname, '..', '..', 'deployments', 'JMSMUC', 'JMSMUC_Prod_Deployment_Mar_10_2026_Release_Notes.docx');

function parseMarkdownToDocx(markdownContent) {
    const lines = markdownContent.split('\n');
    const docElements = [];
    let inCodeBlock = false;
    let inTable = false;
    let tableRows = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip horizontal rules
        if (line.trim() === '---') {
            continue;
        }

        // Code blocks
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }

        if (inCodeBlock) {
            docElements.push(
                new Paragraph({
                    text: line,
                    style: 'Code',
                    spacing: { before: 50, after: 50 }
                })
            );
            continue;
        }

        // Tables
        if (line.startsWith('|')) {
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }
            
            // Skip separator rows
            if (line.includes('---')) {
                continue;
            }

            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
            const tableCells = cells.map(cellText => 
                new TableCell({
                    children: [new Paragraph({ text: cellText.replace(/\*\*/g, '') })],
                    width: { size: 100 / cells.length, type: WidthType.PERCENTAGE }
                })
            );
            tableRows.push(new TableRow({ children: tableCells }));
            continue;
        } else if (inTable) {
            // End of table
            docElements.push(
                new Table({
                    rows: tableRows,
                    width: { size: 100, type: WidthType.PERCENTAGE }
                })
            );
            docElements.push(new Paragraph({ text: '' })); // Spacing
            inTable = false;
        }

        // Headings
        if (line.startsWith('# ')) {
            docElements.push(
                new Paragraph({
                    text: line.substring(2),
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                })
            );
        } else if (line.startsWith('## ')) {
            docElements.push(
                new Paragraph({
                    text: line.substring(3),
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                })
            );
        } else if (line.startsWith('### ')) {
            docElements.push(
                new Paragraph({
                    text: line.substring(4),
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 250, after: 100 }
                })
            );
        } else if (line.startsWith('#### ')) {
            docElements.push(
                new Paragraph({
                    text: line.substring(5),
                    heading: HeadingLevel.HEADING_4,
                    spacing: { before: 200, after: 100 }
                })
            );
        }
        // Bullet lists
        else if (line.startsWith('- ')) {
            const text = line.substring(2);
            const isChecked = text.startsWith('[ ] ');
            const isUnchecked = text.startsWith('[x] ') || text.startsWith('[X] ');
            const bulletText = isChecked || isUnchecked ? text.substring(4) : text;
            
            docElements.push(
                new Paragraph({
                    text: (isChecked ? '☐ ' : isUnchecked ? '☑ ' : '') + parseInlineFormatting(bulletText),
                    bullet: { level: 0 },
                    spacing: { before: 50, after: 50 }
                })
            );
        }
        // Numbered lists
        else if (/^\d+\.\s/.test(line)) {
            const text = line.replace(/^\d+\.\s/, '');
            docElements.push(
                new Paragraph({
                    text: parseInlineFormatting(text),
                    numbering: { reference: 'default-numbering', level: 0 },
                    spacing: { before: 50, after: 50 }
                })
            );
        }
        // Regular paragraphs
        else if (line.trim()) {
            const children = parseInlineMarkdown(line);
            docElements.push(
                new Paragraph({
                    children: children,
                    spacing: { before: 100, after: 100 }
                })
            );
        }
        // Empty lines
        else {
            docElements.push(new Paragraph({ text: '' }));
        }
    }

    return docElements;
}

function parseInlineFormatting(text) {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')  // Bold
        .replace(/\*([^*]+)\*/g, '$1')       // Italic
        .replace(/`([^`]+)`/g, '$1')         // Code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links
}

function parseInlineMarkdown(text) {
    const children = [];
    let currentPos = 0;
    
    // Regex patterns
    const boldPattern = /\*\*([^*]+)\*\*/g;
    const italicPattern = /\*([^*]+)\*/g;
    const codePattern = /`([^`]+)`/g;
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    // Find all matches
    const matches = [];
    
    let match;
    while ((match = boldPattern.exec(text)) !== null) {
        matches.push({ type: 'bold', index: match.index, length: match[0].length, text: match[1] });
    }
    while ((match = italicPattern.exec(text)) !== null) {
        matches.push({ type: 'italic', index: match.index, length: match[0].length, text: match[1] });
    }
    while ((match = codePattern.exec(text)) !== null) {
        matches.push({ type: 'code', index: match.index, length: match[0].length, text: match[1] });
    }
    while ((match = linkPattern.exec(text)) !== null) {
        matches.push({ type: 'link', index: match.index, length: match[0].length, text: match[1] });
    }
    
    // Sort matches by position
    matches.sort((a, b) => a.index - b.index);
    
    // Build TextRuns
    matches.forEach(match => {
        // Add text before match
        if (match.index > currentPos) {
            children.push(new TextRun({ text: text.substring(currentPos, match.index) }));
        }
        
        // Add formatted text
        switch (match.type) {
            case 'bold':
                children.push(new TextRun({ text: match.text, bold: true }));
                break;
            case 'italic':
                children.push(new TextRun({ text: match.text, italics: true }));
                break;
            case 'code':
                children.push(new TextRun({ text: match.text, font: 'Courier New', size: 20 }));
                break;
            case 'link':
                children.push(new TextRun({ text: match.text, color: '0000FF', underline: {} }));
                break;
        }
        
        currentPos = match.index + match.length;
    });
    
    // Add remaining text
    if (currentPos < text.length) {
        children.push(new TextRun({ text: text.substring(currentPos) }));
    }
    
    return children.length > 0 ? children : [new TextRun({ text: text })];
}

// Read markdown file
const markdownContent = fs.readFileSync(markdownFilePath, 'utf8');

// Parse markdown to DOCX elements
const docElements = parseMarkdownToDocx(markdownContent);

// Create DOCX document
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
            properties: {},
            children: docElements
        }
    ]
});

// Write DOCX file
Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputFilePath, buffer);
    console.log(`✅ DOCX file created: ${outputFilePath}`);
    console.log(`📄 Converted: ${markdownFilePath}`);
    console.log(`💾 Output: ${outputFilePath}`);
});
