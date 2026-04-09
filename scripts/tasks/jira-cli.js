const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..');
const ACLI_PATH = path.join(WORKSPACE_ROOT, 'tools', 'acli', 'acli.exe');
const DEFAULT_FIELDS = [
  'summary',
  'description',
  'status',
  'assignee',
  'issuetype',
  'priority',
  'created',
  'updated',
  'attachment',
  'comment',
  'labels',
  'parent',
  'issuelinks'
];

function ensureAcliExists() {
  if (!fs.existsSync(ACLI_PATH)) {
    throw new Error(`Atlassian CLI not found at ${ACLI_PATH}`);
  }
}

function runAcli(args) {
  ensureAcliExists();

  const result = spawnSync(ACLI_PATH, args, {
    cwd: WORKSPACE_ROOT,
    encoding: 'utf8'
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = (result.stderr || '').trim();
    const stdout = (result.stdout || '').trim();
    throw new Error(stderr || stdout || `acli exited with code ${result.status}`);
  }

  return result.stdout;
}

function fetchRawTicket(ticketKey, fields = DEFAULT_FIELDS) {
  const output = runAcli([
    'jira',
    'workitem',
    'view',
    ticketKey,
    '--json',
    '--fields',
    fields.join(',')
  ]);

  return JSON.parse(output);
}

function adfToText(node) {
  if (!node) {
    return '';
  }

  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(adfToText).filter(Boolean).join('');
  }

  const content = Array.isArray(node.content) ? node.content : [];
  const text = typeof node.text === 'string' ? node.text : '';
  const rendered = content.map(adfToText).join('');

  switch (node.type) {
    case 'text':
      return text;
    case 'paragraph':
      return `${rendered}\n\n`;
    case 'heading':
      return `${rendered}\n\n`;
    case 'bulletList':
      return content.map(item => `- ${adfToInlineText(item).trim()}`).join('\n') + '\n\n';
    case 'orderedList':
      return content.map((item, index) => `${index + 1}. ${adfToInlineText(item).trim()}`).join('\n') + '\n\n';
    case 'listItem':
      return content.map(adfToInlineText).join(' ').trim();
    case 'codeBlock':
      return `\`\`\`\n${rendered.trim()}\n\`\`\`\n\n`;
    case 'hardBreak':
      return '\n';
    case 'rule':
      return '\n---\n';
    default:
      return `${text}${rendered}`;
  }
}

function adfToInlineText(node) {
  return adfToText(node).replace(/\s+/g, ' ').trim();
}

function normalizeComment(comment) {
  const bodyText = adfToText(comment.body).trim();

  return {
    id: comment.id || null,
    author: comment.author?.displayName || null,
    created: comment.created || null,
    updated: comment.updated || null,
    bodyText
  };
}

function normalizeAttachment(attachment) {
  return {
    id: attachment.id || null,
    filename: attachment.filename || null,
    mimeType: attachment.mimeType || null,
    size: attachment.size || null,
    created: attachment.created || null,
    author: attachment.author?.displayName || null,
    content: attachment.content || null,
    thumbnail: attachment.thumbnail || null
  };
}

function normalizeTicket(rawTicket) {
  const fields = rawTicket.fields || {};
  const descriptionText = adfToText(fields.description).trim();
  const comments = Array.isArray(fields.comment?.comments)
    ? fields.comment.comments.map(normalizeComment)
    : [];
  const attachments = Array.isArray(fields.attachment)
    ? fields.attachment.map(normalizeAttachment)
    : [];

  return {
    key: rawTicket.key,
    url: `https://akumina.atlassian.net/browse/${rawTicket.key}`,
    summary: fields.summary || '',
    descriptionText,
    status: fields.status?.name || '',
    issueType: fields.issuetype?.name || '',
    priority: fields.priority?.name || '',
    assignee: fields.assignee?.displayName || '',
    created: fields.created || '',
    updated: fields.updated || '',
    labels: Array.isArray(fields.labels) ? fields.labels : [],
    parentKey: fields.parent?.key || '',
    attachments,
    comments,
    linkedIssues: normalizeLinkedIssues(fields.issuelinks),
    raw: rawTicket
  };
}

function normalizeLinkedIssues(issueLinks) {
  if (!Array.isArray(issueLinks)) {
    return [];
  }

  return issueLinks.map(link => {
    const inward = link.inwardIssue;
    const outward = link.outwardIssue;
    const issue = inward || outward || {};
    const direction = inward ? 'inward' : outward ? 'outward' : 'unknown';

    return {
      type: link.type?.name || '',
      direction,
      key: issue.key || '',
      summary: issue.fields?.summary || '',
      status: issue.fields?.status?.name || ''
    };
  });
}

function loadWorkspaceConfig() {
  const configPath = path.join(WORKSPACE_ROOT, 'AkuminaTasks', 'workspace-config.json');
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

module.exports = {
  ACLI_PATH,
  DEFAULT_FIELDS,
  WORKSPACE_ROOT,
  adfToText,
  fetchRawTicket,
  loadWorkspaceConfig,
  normalizeTicket,
  runAcli
};
