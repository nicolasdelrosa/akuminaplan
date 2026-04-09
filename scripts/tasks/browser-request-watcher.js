#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..');
const TASK_DIR = path.join(WORKSPACE_ROOT, 'AkuminaTasks');
const OUTPUT_DIR = path.join(TASK_DIR, '.browser-requests');
const STATE_PATH = path.join(OUTPUT_DIR, 'state.json');
const COMPLETION_STATE_PATH = path.join(OUTPUT_DIR, 'completion-state.json');
const WATCH_EXT = '.md';
const POLL_INTERVAL_MS = 3000;
const TICKET_FILE_PATTERN = /^[A-Z][A-Z0-9]+-\d+\.md$/i;

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function getSection(markdown, heading) {
  const headingMarker = `## ${heading}`;
  const startIndex = markdown.indexOf(headingMarker);
  if (startIndex === -1) {
    return '';
  }

  const contentStart = markdown.indexOf('\n', startIndex);
  if (contentStart === -1) {
    return '';
  }

  const nextHeadingIndex = markdown.indexOf('\n## ', contentStart + 1);
  const rawSection = nextHeadingIndex === -1
    ? markdown.slice(contentStart + 1)
    : markdown.slice(contentStart + 1, nextHeadingIndex);

  return rawSection.trim();
}

function getBulletValue(section, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^- ${escapedLabel}:[ \\t]*(.*)$`, 'mi');
  const match = section.match(regex);
  return match ? match[1].trim() : '';
}

function stripInlineCode(value) {
  return value.replace(/^`(.+)`$/, '$1').trim();
}

function normalizePromptText(value) {
  return stripInlineCode(value).replace(/^- /, '').trim();
}

function getNestedBullets(section, label) {
  const lines = section.split(/\r?\n/);
  const startIndex = lines.findIndex(line => line.trim().toLowerCase() === `- ${label.toLowerCase()}:`);
  if (startIndex === -1) {
    return [];
  }

  const items = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^- /.test(line)) {
      break;
    }
    const bulletMatch = line.match(/^\s{2,}-\s+(.*)$/);
    if (bulletMatch) {
      items.push(bulletMatch[1].trim());
    }
  }
  return items;
}

function getBulletTextOrNested(section, label) {
  const directValue = getBulletValue(section, label);
  if (directValue) {
    return directValue;
  }

  const nested = getNestedBullets(section, label);
  return nested.join(' ');
}

function normalizeStatus(value) {
  return value.trim().toLowerCase();
}

function readState() {
  return readStructuredState(STATE_PATH);
}

function readCompletionState() {
  return readStructuredState(COMPLETION_STATE_PATH);
}

function readStructuredState(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    const rawState = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const normalizedState = {};

    for (const [ticketKey, value] of Object.entries(rawState)) {
      if (typeof value === 'string') {
        normalizedState[ticketKey] = {
          requestFingerprint: value,
          completionFingerprint: '',
          migratedAt: new Date().toISOString()
        };
        continue;
      }

      normalizedState[ticketKey] = value;
    }

    return normalizedState;
  } catch {
    return {};
  }
}

function writeState(state) {
  writeStructuredState(STATE_PATH, state);
}

function writeCompletionState(state) {
  writeStructuredState(COMPLETION_STATE_PATH, state);
}

function writeStructuredState(filePath, state) {
  ensureDir(OUTPUT_DIR);
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2));
}

function buildCompletionSummary(ticket) {
  return ticket.findingsSummary
    || ticket.findingsImpact
    || ticket.findingsRaw
    || ticket.completionState
    || 'Browser Findings completed.';
}

function scanCompletions() {
  ensureDir(OUTPUT_DIR);
  const completionState = readCompletionState();
  const results = [];

  for (const ticket of listTicketFiles().map(parseTicket).filter(Boolean)) {
    const ticketKey = path.basename(ticket.filePath, path.extname(ticket.filePath));
    const completionFingerprint = `${ticket.completionState}|${ticket.hasMeaningfulFindings}|${ticket.findingsSummary}|${ticket.findingsRaw}|${ticket.findingsImpact}`;
    const isComplete = normalizeStatus(ticket.completionState) === 'complete' || ticket.hasMeaningfulFindings;

    if (!isComplete) {
      continue;
    }

    if (completionState[ticketKey] && completionState[ticketKey].completionFingerprint === completionFingerprint) {
      continue;
    }

    completionState[ticketKey] = {
      completionFingerprint,
      filePath: ticket.filePath,
      summary: buildCompletionSummary(ticket),
      completedAt: new Date().toISOString()
    };
    results.push({
      ticketKey,
      filePath: ticket.filePath,
      completionState: ticket.completionState,
      summary: buildCompletionSummary(ticket)
    });
  }

  if (results.length) {
    writeCompletionState(completionState);
  }

  return results;
}

function readState() {
  if (!fs.existsSync(STATE_PATH)) {
    return {};
  }

  try {
    const rawState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
    const normalizedState = {};

    for (const [ticketKey, value] of Object.entries(rawState)) {
      if (typeof value === 'string') {
        normalizedState[ticketKey] = {
          requestFingerprint: value,
          completionFingerprint: '',
          migratedAt: new Date().toISOString()
        };
        continue;
      }

      normalizedState[ticketKey] = value;
    }

    return normalizedState;
  } catch {
    return {};
  }
}

function listTicketFiles() {
  if (!fs.existsSync(TASK_DIR)) {
    return [];
  }

  return fs.readdirSync(TASK_DIR)
    .filter(name => name.endsWith(WATCH_EXT))
    .filter(name => TICKET_FILE_PATTERN.test(name))
    .map(name => path.join(TASK_DIR, name));
}

function isTicketFile(filePath) {
  return TICKET_FILE_PATTERN.test(path.basename(filePath));
}

function parseTicket(filePath) {
  const markdown = fs.readFileSync(filePath, 'utf8');
  const requestSection = getSection(markdown, 'Browser Request');
  const findingsSection = getSection(markdown, 'Browser Findings');

  if (!requestSection) {
    return null;
  }

  const status = getBulletValue(requestSection, 'Status');
  if (!status) {
    return null;
  }

  const findingsStatus = findingsSection ? normalizePromptText(getBulletValue(findingsSection, 'Status') || '') : '';
  const findingsCapturedBy = findingsSection ? normalizePromptText(getBulletValue(findingsSection, 'Captured by') || '') : '';
  const findingsEnvironment = findingsSection ? normalizePromptText(getBulletValue(findingsSection, 'Environment') || '') : '';
  const findingsDate = findingsSection ? normalizePromptText(getBulletValue(findingsSection, 'Date') || '') : '';
  const findingsSummary = findingsSection ? normalizePromptText(getBulletValue(findingsSection, 'Findings') || '') : '';
  const findingsRaw = findingsSection ? normalizePromptText(getBulletValue(findingsSection, 'Raw payloads / snippets') || '') : '';
  const findingsImpact = findingsSection ? normalizePromptText(getBulletValue(findingsSection, 'Follow-up impact') || '') : '';

  const hasMeaningfulFindings = [
    findingsCapturedBy,
    findingsEnvironment,
    findingsDate,
    findingsSummary,
    findingsRaw,
    findingsImpact
  ].some(value => value && !/^not started$/i.test(value));

  const completionState = findingsStatus
    ? findingsStatus
    : (hasMeaningfulFindings ? 'Complete' : 'Not started');

  return {
    filePath,
    markdown,
    requestSection,
    findingsSection,
    status,
    owner: normalizePromptText(getBulletValue(requestSection, 'Owner') || 'Ren / Copilot'),
    environment: normalizePromptText(getBulletValue(requestSection, 'Environment') || 'Not specified'),
    targetPage: normalizePromptText(getBulletValue(requestSection, 'Target page') || 'Not specified'),
    reason: normalizePromptText(getBulletTextOrNested(requestSection, 'Reason') || 'Not specified'),
    needItems: getNestedBullets(requestSection, 'Need').map(normalizePromptText),
    returnFormatItems: getNestedBullets(requestSection, 'Return format').map(normalizePromptText),
    completionState,
    hasMeaningfulFindings,
    findingsSummary,
    findingsRaw,
    findingsImpact
  };
}

function buildPrompt(ticket) {
  const needBlock = ticket.needItems.length
    ? ticket.needItems.map(item => `- ${item}`).join('\n')
    : '- Fulfill the Browser Request section exactly as written.';
  const returnBlock = ticket.returnFormatItems.length
    ? ticket.returnFormatItems.map(item => `- ${item}`).join('\n')
    : '- Update Browser Findings in the same file.';

  return [
    `@Ren read ${ticket.filePath} and fulfill the Browser Request section.`,
    '',
    `Use MCP/browser tools in the ${ticket.environment}.`,
    `Open ${normalizePromptText(ticket.targetPage)}.`,
    'Collect exactly this data:',
    needBlock,
    'Return it in this format:',
    returnBlock,
    'Write the results into the Browser Findings section in the same file.',
    'Do not rewrite other sections.',
    '',
    `Reason: ${normalizePromptText(ticket.reason)}`
  ].join('\n');
}

function writePromptArtifact(ticket, promptText) {
  ensureDir(OUTPUT_DIR);
  const ticketKey = path.basename(ticket.filePath, path.extname(ticket.filePath));
  const promptPath = path.join(OUTPUT_DIR, `${ticketKey}.prompt.txt`);
  const metadataPath = path.join(OUTPUT_DIR, `${ticketKey}.json`);
  const metadata = {
    ticket: ticketKey,
    filePath: ticket.filePath,
    status: ticket.status,
    owner: normalizePromptText(ticket.owner),
    environment: normalizePromptText(ticket.environment),
    targetPage: normalizePromptText(ticket.targetPage),
    generatedAt: new Date().toISOString(),
    promptPath
  };

  fs.writeFileSync(promptPath, `${promptText}\n`);
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  return { promptPath, metadataPath };
}

function copyToClipboard(text) {
  const command = 'Set-Clipboard -Value @\'\n' + text.replace(/'/g, "''") + '\n\'@';
  const result = spawnSync('powershell', ['-NoProfile', '-Command', command], {
    cwd: WORKSPACE_ROOT,
    encoding: 'utf8'
  });

  return result.status === 0;
}

function openInVSCode(filePath) {
  const result = spawnSync('code', ['-r', filePath], {
    cwd: WORKSPACE_ROOT,
    encoding: 'utf8'
  });

  return result.status === 0;
}

function updateRequestStatus(markdown, nextStatus) {
  return markdown.replace(
    /^## Browser Request\r?\n([\s\S]*?)^- Status:\s*.*$/mi,
    (fullMatch, sectionBody) => `## Browser Request\n${sectionBody}- Status: ${nextStatus}`
  );
}

function claimTicket(ticket) {
  const updated = updateRequestStatus(ticket.markdown, 'In progress');
  if (updated !== ticket.markdown) {
    fs.writeFileSync(ticket.filePath, updated);
  }
}

function processTicket(ticket, state, options = {}) {
  const ticketKey = path.basename(ticket.filePath, path.extname(ticket.filePath));
  const fingerprint = `${ticket.status}|${ticket.environment}|${ticket.targetPage}|${ticket.needItems.join('|')}`;
  const completionFingerprint = `${ticket.completionState}|${ticket.hasMeaningfulFindings}`;

  if (normalizeStatus(ticket.completionState) === 'complete' || ticket.hasMeaningfulFindings) {
    if (!state[ticketKey] || state[ticketKey].completionFingerprint !== completionFingerprint) {
      state[ticketKey] = {
        requestFingerprint: fingerprint,
        completionFingerprint,
        completedAt: new Date().toISOString()
      };
      writeState(state);
    }
    return null;
  }

  if (state[ticketKey] && state[ticketKey].requestFingerprint === fingerprint) {
    return null;
  }

  const promptText = buildPrompt(ticket);
  const artifacts = writePromptArtifact(ticket, promptText);
  const copied = copyToClipboard(promptText);
  const opened = options.openPrompt ? openInVSCode(artifacts.promptPath) : false;

  if (options.claim) {
    claimTicket(ticket);
  }

  state[ticketKey] = {
    requestFingerprint: fingerprint,
    completionFingerprint,
    lastGeneratedAt: new Date().toISOString()
  };
  writeState(state);

  return {
    ticketKey,
    promptText,
    copied,
    opened,
    ...artifacts
  };
}

function scan(options = {}) {
  ensureDir(OUTPUT_DIR);
  const state = readState();
  const pending = listTicketFiles()
    .map(parseTicket)
    .filter(Boolean)
    .filter(ticket => normalizeStatus(ticket.status) === 'pending');

  const results = [];
  for (const ticket of pending) {
    const result = processTicket(ticket, state, options);
    if (result) {
      results.push(result);
    }
  }

  return results;
}

function processSingleFile(rawFilePath, options = {}) {
  const resolvedPath = path.resolve(WORKSPACE_ROOT, rawFilePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Ticket file not found: ${resolvedPath}`);
  }

  if (!isTicketFile(resolvedPath)) {
    throw new Error(`Not a ticket file: ${resolvedPath}`);
  }

  const ticket = parseTicket(resolvedPath);
  if (!ticket) {
    throw new Error(`No Browser Request section found in ${resolvedPath}`);
  }

  if (normalizeStatus(ticket.status) !== 'pending') {
    throw new Error(`Browser Request status is not Pending in ${resolvedPath}`);
  }

  if (normalizeStatus(ticket.completionState) === 'complete' || ticket.hasMeaningfulFindings) {
    throw new Error(`Browser Findings already indicate completion in ${resolvedPath}`);
  }

  const state = readState();
  if (options.force) {
    delete state[path.basename(resolvedPath, path.extname(resolvedPath))];
  }

  const result = processTicket(ticket, state, options);
  if (!result) {
    throw new Error(`No new Browser Request generated for ${resolvedPath}. Use --force to regenerate.`);
  }

  return result;
}

function watch() {
  process.stdout.write(`Watching ${TASK_DIR} for pending Browser Requests...\n`);
  const runScan = () => {
    const results = scan();
    for (const result of results) {
      process.stdout.write(`\n[${result.ticketKey}] prompt written to ${result.promptPath}\n`);
      process.stdout.write(`[${result.ticketKey}] metadata written to ${result.metadataPath}\n`);
      process.stdout.write(`[${result.ticketKey}] clipboard ${result.copied ? 'updated' : 'not updated'}\n`);
      process.stdout.write(`${result.promptText}\n`);
    }
  };

  runScan();
  setInterval(runScan, POLL_INTERVAL_MS);
}

function main() {
  const mode = (process.argv[2] || 'scan').toLowerCase();
  const claim = process.argv.includes('--claim');
  const openPrompt = process.argv.includes('--open-prompt');
  const force = process.argv.includes('--force');

  if (mode === 'scan') {
    const results = scan({ claim, openPrompt });
    if (!results.length) {
      process.stdout.write('No new pending Browser Requests found.\n');
      return;
    }

    for (const result of results) {
      process.stdout.write(`[${result.ticketKey}] prompt: ${result.promptPath}\n`);
      process.stdout.write(`[${result.ticketKey}] metadata: ${result.metadataPath}\n`);
      process.stdout.write(`[${result.ticketKey}] clipboard ${result.copied ? 'updated' : 'not updated'}\n`);
      if (openPrompt) {
        process.stdout.write(`[${result.ticketKey}] editor ${result.opened ? 'opened' : 'not opened'}\n`);
      }
    }
    return;
  }

  if (mode === 'watch') {
    watch();
    return;
  }

  if (mode === 'completion-scan') {
    const results = scanCompletions();
    if (!results.length) {
      process.stdout.write('No new completed Browser Findings found.\n');
      return;
    }

    for (const result of results) {
      process.stdout.write(`[${result.ticketKey}] completed: ${result.filePath}\n`);
      process.stdout.write(`[${result.ticketKey}] summary: ${result.summary}\n`);
      process.stdout.write(`[${result.ticketKey}] status: ${result.completionState}\n`);
    }
    return;
  }

  if (mode === 'file') {
    const rawFilePath = process.argv[3];
    if (!rawFilePath) {
      throw new Error('Usage: node scripts/tasks/browser-request-watcher.js file <ticket-file> [--claim] [--open-prompt] [--force]');
    }

    const result = processSingleFile(rawFilePath, { claim, openPrompt, force });
    process.stdout.write(`[${result.ticketKey}] prompt: ${result.promptPath}\n`);
    process.stdout.write(`[${result.ticketKey}] metadata: ${result.metadataPath}\n`);
    process.stdout.write(`[${result.ticketKey}] clipboard ${result.copied ? 'updated' : 'not updated'}\n`);
    if (openPrompt) {
      process.stdout.write(`[${result.ticketKey}] editor ${result.opened ? 'opened' : 'not opened'}\n`);
    }
    return;
  }

  throw new Error('Usage: node scripts/tasks/browser-request-watcher.js <scan|watch|completion-scan|file> [ticket-file] [--claim] [--open-prompt] [--force]');
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
