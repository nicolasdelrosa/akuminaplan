#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { fetchRawTicket, loadWorkspaceConfig, normalizeTicket } = require('./jira-cli');

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    ticketKey: '',
    output: ''
  };

  while (args.length > 0) {
    const token = args.shift();
    if (!options.ticketKey && !token.startsWith('--')) {
      options.ticketKey = token.toUpperCase();
      continue;
    }

    if (token === '--output') {
      options.output = args.shift() || '';
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!options.ticketKey) {
    throw new Error('Usage: node scripts/tasks/fetch-jira-ticket.js <TICKET-KEY> [--output path]');
  }

  return options;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function main() {
  const { ticketKey, output } = parseArgs(process.argv.slice(2));
  const config = loadWorkspaceConfig();
  const rawTicket = fetchRawTicket(ticketKey);
  const normalized = normalizeTicket(rawTicket);

  const dataDir = path.resolve(config.paths.taskDataDir);
  ensureDir(dataDir);

  const outputPath = output
    ? path.resolve(output)
    : path.join(dataDir, `${ticketKey}.json`);

  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));

  process.stdout.write(`${outputPath}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
