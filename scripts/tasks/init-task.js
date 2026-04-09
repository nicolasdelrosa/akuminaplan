#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { fetchRawTicket, loadWorkspaceConfig, normalizeTicket, WORKSPACE_ROOT } = require('./jira-cli');

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'be', 'by', 'for', 'from', 'how', 'in', 'into',
  'is', 'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'update', 'with'
]);

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    ticketKey: '',
    force: false
  };

  while (args.length > 0) {
    const token = args.shift();
    if (!options.ticketKey && !token.startsWith('--')) {
      options.ticketKey = token.toUpperCase();
      continue;
    }

    if (token === '--force') {
      options.force = true;
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  if (!options.ticketKey) {
    throw new Error('Usage: node scripts/tasks/init-task.js <TICKET-KEY> [--force]');
  }

  return options;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readTemplate(config) {
  return fs.readFileSync(path.resolve(config.paths.taskTemplate), 'utf8');
}

function stringifyList(items, fallback = '- None found yet') {
  if (!items.length) {
    return fallback;
  }

  return items.map(item => `- ${item}`).join('\n');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function runRg(args) {
  const result = spawnSync('rg', args, {
    cwd: WORKSPACE_ROOT,
    encoding: 'utf8'
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && result.status !== 1) {
    throw new Error((result.stderr || result.stdout || 'rg failed').trim());
  }

  return (result.stdout || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function getKeywordPattern(summary) {
  const keywords = summary
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word.length >= 4 && !STOP_WORDS.has(word))
    .slice(0, 5)
    .map(escapeRegExp);

  return keywords.join('|');
}

function collectRepoContext(ticket, config) {
  const projectPrefix = ticket.key.split('-')[0];
  const repoHints = config.jira.projectMappings[projectPrefix]?.repoHints || [];
  const relevantFiles = new Set();
  const existingTests = new Set();
  const similarWork = new Set();
  const keywordPattern = getKeywordPattern(ticket.summary);
  const existingSearchTargets = (targets) => targets.filter(target => fs.existsSync(path.join(WORKSPACE_ROOT, target)));

  const addLines = (set, lines, limit = 6) => {
    for (const line of lines) {
      if (shouldSkipSearchHit(line, ticket.key)) {
        continue;
      }
      if (set.size >= limit) {
        break;
      }
      set.add(line.replace(/\\/g, '/'));
    }
  };

  addLines(relevantFiles, runRg(['-n', '--hidden', '--glob', '!node_modules', '--glob', '!.git', ticket.key, '.']), 6);

  if (keywordPattern) {
    const searchTargets = existingSearchTargets(repoHints.length ? repoHints : ['tests', 'e2e', 'AkuminaTasks', 'deployments']);
    const testTargets = existingSearchTargets(['tests', 'e2e']);
    const similarTargets = existingSearchTargets(['AkuminaTasks', 'deployments']);

    if (searchTargets.length) {
      addLines(relevantFiles, runRg(['-n', '-i', '--glob', '!node_modules', '--glob', '!.git', '-e', keywordPattern, ...searchTargets]), 8);
    }
    if (testTargets.length) {
      addLines(existingTests, runRg(['-n', '-i', '--glob', '!node_modules', '--glob', '!.git', '-e', keywordPattern, ...testTargets]), 6);
    }
    if (similarTargets.length) {
      addLines(similarWork, runRg(['-n', '-i', '--glob', '!node_modules', '--glob', '!.git', '-e', keywordPattern, ...similarTargets]), 6);
    }
  }

  const projectTestDir = path.join('tests', projectPrefix);
  if (fs.existsSync(path.join(WORKSPACE_ROOT, projectTestDir))) {
    addLines(existingTests, runRg(['--files', projectTestDir]), 6);
  }

  return {
    relevantFiles: [...relevantFiles].slice(0, 8),
    existingTests: [...existingTests].slice(0, 8),
    similarWork: [...similarWork].slice(0, 8)
  };
}

function shouldSkipSearchHit(line, ticketKey) {
  const normalized = line.replace(/\\/g, '/');
  const skipPatterns = [
    /\.csv:/i,
    /AkuminaTasks\/\.data\//i,
    new RegExp(`AkuminaTasks/${escapeRegExp(ticketKey)}\\.md`, 'i')
  ];

  return skipPatterns.some(pattern => pattern.test(normalized));
}

function findPlaywrightArtifacts(ticketKey, config) {
  const artifactDir = path.resolve(config.paths.playwrightArtifacts);
  if (!fs.existsSync(artifactDir)) {
    return [];
  }

  const normalizedKey = ticketKey.toLowerCase();
  return fs.readdirSync(artifactDir)
    .filter(name => name.toLowerCase().includes(normalizedKey))
    .slice(0, 6)
    .map(name => path.join(config.paths.playwrightArtifacts, name).replace(/\\/g, '/'));
}

function determinePrimaryTestType(ticket, repoContext) {
  const text = `${ticket.summary}\n${ticket.descriptionText}`.toLowerCase();
  const uiSignals = ['page', 'search', 'filter', 'button', 'widget', 'user', 'screen', 'results'];
  const configSignals = ['deploy', 'pipeline', 'taxonomy', 'content type', 'term set', 'configuration'];

  if (configSignals.some(signal => text.includes(signal))) {
    return {
      type: 'Manual verification only',
      reason: 'The ticket reads like configuration or deployment work; start with browser tests only if a stable UI flow is clearly affected.'
    };
  }

  if (uiSignals.some(signal => text.includes(signal)) || repoContext.existingTests.length > 0) {
    return {
      type: 'Playwright',
      reason: 'The ticket appears user-visible and this workspace already uses Playwright for regression coverage.'
    };
  }

  return {
    type: 'Unit/integration',
    reason: 'No strong browser-flow signal was detected, so start with a smaller automated test if possible.'
  };
}

function buildTaskMarkdown(template, ticket, repoContext, artifacts, testType) {
  const acceptanceCriteria = buildAcceptanceCriteria(ticket.descriptionText);
  const attachmentLines = ticket.attachments.map(item => {
    const target = item.content || item.thumbnail || '';
    return target ? `[${item.filename}](${target})` : item.filename;
  });
  const similarFiles = repoContext.similarWork.filter(line => !line.includes(`${ticket.key}.md`));
  const plannedTestFile = suggestTestFile(ticket);
  const stage = 'Intake';
  const jiraSource = 'Live Jira via CLI';
  const lastUpdated = new Date().toISOString();
  const recommendation = deriveRecommendation(ticket, repoContext, testType);

  return template
    .replace('{{TICKET_KEY}}', ticket.key)
    .replace('{{TITLE}}', ticket.summary)
    .replace('- Project:', `- Project: ${ticket.key.split('-')[0]}`)
    .replace('- Status:', `- Status: ${ticket.status || 'Unknown'}`)
    .replace('- Type:', `- Type: ${ticket.issueType || 'Unknown'}`)
    .replace('- Priority:', `- Priority: ${ticket.priority || 'Unknown'}`)
    .replace('- Assignee:', `- Assignee: ${ticket.assignee || 'Unassigned'}`)
    .replace('- Jira URL:', `- Jira URL: ${ticket.url}`)
    .replace('- Stage: Intake', `- Stage: ${stage}`)
    .replace('- Jira Source: Live', `- Jira Source: ${jiraSource}`)
    .replace('- Working Branch:', '- Working Branch: Not started yet.')
    .replace('- Last Updated:', `- Last Updated: ${lastUpdated}`)
    .replace('What problem is this solving for the user or business?', ticket.summary)
    .replace('Rewrite the ticket in direct language. Remove Jira noise.', ticket.descriptionText || 'Ticket description is empty. Pull detail from comments or ask for clarification.')
    .replace(/1\.\n2\.\n3\./, acceptanceCriteria.join('\n'))
    .replace('- Missing details:', '- Missing details: Acceptance criteria should be confirmed if the description is incomplete.')
    .replace('- Ambiguous behavior:', '- Ambiguous behavior: Record any behavior gaps discovered during repo inspection.')
    .replace('- Dependencies:', `- Dependencies: ${ticket.parentKey ? `Parent ticket ${ticket.parentKey}` : 'None identified yet.'}`)
    .replace('- Open questions:', '- Open questions: Confirm whether any existing UX or persistence behavior must remain unchanged.')
    .replace('- Screenshots:', `- Screenshots: ${artifacts.length ? artifacts.map(item => item.replace(/\\/g, '/')).join('; ') : 'None linked yet'}`)
    .replace('- Attachments:', `- Attachments: ${attachmentLines.length ? attachmentLines.join('; ') : 'None attached in Jira'}`)
    .replace('- Related links:', `- Related links: ${ticket.url}`)
    .replace('- \n\n### Existing tests', `${stringifyList(repoContext.relevantFiles)}\n\n### Existing tests`)
    .replace('- \n\n### Similar prior work', `${stringifyList(repoContext.existingTests)}\n\n### Similar prior work`)
    .replace('- \n\n## Technical Understanding', `${stringifyList(similarFiles)}\n\n## Technical Understanding`)
    .replace('Current behavior:', `Current behavior:\n\n${ticket.descriptionText || 'Needs repo inspection.'}`)
    .replace('Expected behavior:', 'Expected behavior:\n\nTranslate the Jira request into a verifiable outcome before coding.')
    .replace('Likely impact area:', `Likely impact area:\n\n${repoContext.relevantFiles[0] || 'No relevant files were auto-detected yet.'}`)
    .replace('Risk level:', `Risk level:\n\n${repoContext.existingTests.length > 0 ? 'Medium' : 'Unknown until code inspection'}`)
    .replace('Recommendation:', `Recommendation:\n\n${recommendation.summary}`)
    .replace('Why this approach:', `Why this approach:\n\n${recommendation.why}`)
    .replace('What could make this larger than expected:', `What could make this larger than expected:\n\n${recommendation.risks}`)
    .replace(/- Playwright\n- Unit\/integration\n- Manual verification only/, `- ${testType.type}`)
    .replace('Reason:', `Reason:\n\n${testType.reason}`)
    .replace('Planned test file:', `Planned test file:\n\n${plannedTestFile}`)
    .replace('Scenario:', `Scenario:\n\nCover the main acceptance path for ${ticket.key}.`)
    .replace('Initial result:', 'Initial result:\n\nNot run yet.')
    .replace(/1\.\n2\.\n3\./, '1.\n2.\n3.')
    .replace('- Happy path:', `- Happy path: Validate the primary acceptance path for ${ticket.key}.`)
    .replace('- Edge cases:', '- Edge cases: Cover empty states, alternate view modes, and persistence boundaries where applicable.')
    .replace('- Regression checks:', '- Regression checks: Re-test the existing behavior in adjacent views or flows touched by the change.')
    .replace('- Files changed:', '- Files changed: Not started yet.')
    .replace('- Key decisions:', '- Key decisions: Not started yet.')
    .replace('- Assumptions:', '- Assumptions: Not started yet.')
    .replace('- Deferred work:', '- Deferred work: None recorded yet.')
    .replace('- Commands run:', '- Commands run: None yet.')
    .replace('- Test results:', '- Test results: None yet.')
    .replace('- Remaining risks:', '- Remaining risks: Unknown until implementation starts.')
    .replace('- Review findings:', '- Review findings: Pending review.')
    .replace('- Required fixes:', '- Required fixes: None yet.')
    .replace('- Nice-to-have follow-ups:', '- Nice-to-have follow-ups: None yet.')
    .replace('- Findings:', '- Findings: Pending review.')
    .replace('- Follow-ups:', '- Follow-ups: Pending review.')
    .replace('- Push recommendation:', '- Push recommendation: Pending review.')
    .replace('Short comment suitable for Jira after implementation/testing:', `Short comment suitable for Jira after implementation/testing:\n\n${ticket.key}: Work started. Implementation, verification, and review notes will be tracked in this file.`)
    .replace('Short summary suitable for Jira comment / PR / release notes.', `${ticket.key}: ${ticket.summary}`);
}

function deriveRecommendation(ticket, repoContext, testType) {
  const lower = `${ticket.summary}\n${ticket.descriptionText}`.toLowerCase();
  const userVisible = ['view', 'button', 'icon', 'favorite', 'search', 'filter', 'results'].some(term => lower.includes(term));
  const summary = userVisible
    ? 'Start with a focused implementation in the user-visible template or UI layer, then verify whether any shared behavior or persistence code also needs to change.'
    : 'Start with the narrowest impacted code path and only expand scope if repo inspection shows the behavior is shared.';
  const why = `The ticket appears ${userVisible ? 'user-visible' : 'implementation-focused'} and the current scaffold identified ${repoContext.relevantFiles[0] || 'a likely impact area'} as the first place to inspect. The selected primary test type is ${testType.type}.`;
  const risks = 'The actual fix may be larger if the behavior depends on shared widget logic, persisted user state, or hidden coupling that is not obvious from the ticket text alone.';

  return { summary, why, risks };
}

function suggestTestFile(ticket) {
  const projectPrefix = ticket.key.split('-')[0];
  return `tests/${projectPrefix}/${ticket.key}.spec.ts`;
}

function buildAcceptanceCriteria(descriptionText) {
  if (!descriptionText) {
    return ['1. Confirm the expected behavior with the ticket owner.'];
  }

  const acceptanceMatch = descriptionText.match(/Acceptance Criteria:\s*([\s\S]*)$/i);
  if (acceptanceMatch) {
    const extracted = acceptanceMatch[1]
      .split(/\n+/)
      .map(line => line.replace(/^- /, '').trim())
      .filter(Boolean)
      .slice(0, 6);

    if (extracted.length) {
      return extracted.map((line, index) => `${index + 1}. ${line}`);
    }
  }

  const lines = descriptionText
    .split(/\n+/)
    .map(line => line.replace(/^- /, '').trim())
    .filter(Boolean)
    .filter(line => line.length > 3)
    .slice(0, 3);

  if (!lines.length) {
    return ['1. Confirm the expected behavior with the ticket owner.'];
  }

  return lines.map((line, index) => `${index + 1}. ${line}`);
}

function main() {
  const { ticketKey, force } = parseArgs(process.argv.slice(2));
  const config = loadWorkspaceConfig();
  const template = readTemplate(config);
  const rawTicket = fetchRawTicket(ticketKey);
  const ticket = normalizeTicket(rawTicket);
  const repoContext = collectRepoContext(ticket, config);
  const artifacts = findPlaywrightArtifacts(ticket.key, config);
  const testType = determinePrimaryTestType(ticket, repoContext);

  const taskDir = path.resolve(config.paths.taskDir);
  const dataDir = path.resolve(config.paths.taskDataDir);
  ensureDir(taskDir);
  ensureDir(dataDir);

  const markdownPath = path.join(taskDir, `${ticket.key}.md`);
  const jsonPath = path.join(dataDir, `${ticket.key}.json`);

  if (!force && fs.existsSync(markdownPath)) {
    throw new Error(`${markdownPath} already exists. Re-run with --force to overwrite.`);
  }

  const markdown = buildTaskMarkdown(template, ticket, repoContext, artifacts, testType);

  fs.writeFileSync(jsonPath, JSON.stringify(ticket, null, 2));
  fs.writeFileSync(markdownPath, markdown);

  process.stdout.write(`${markdownPath}\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
}
