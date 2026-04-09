# AI Delivery Workflow

## Objective

Create a repeatable ticket-to-merge workflow that:

1. Pulls Jira data with low latency and low token cost.
2. Produces a task markdown file with enough context for implementation.
3. Starts with Playwright tests when the ticket is testable end-to-end.
4. Implements the change only after the first failing test is in place.
5. Runs an LLM-based code review before pushing.
6. Preserves useful memory without bloating prompts.

## Recommended Design

Use one orchestrator workflow with specialized skills, not independent free-running agents.

Reason:

- You want consistent outputs, shared conventions, and low token usage.
- Most failures come from missing context and weak handoffs, not from lacking more agents.
- Specialized skills are useful, but they should be invoked in sequence by one parent workflow.

## Proposed Roles

### 1. Jira Specialist

Responsibility:

- Read and update Jira tickets through CLI.
- Map workspace to Jira project.
- Export raw ticket details and linked artifacts.

Inputs:

- Workspace path
- Ticket key

Outputs:

- Normalized ticket JSON
- Downloaded attachments or linked image references
- Status update commands

Implementation note:

- Reuse `tools/acli/acli.exe`
- Reuse `scripts/setup-atlassian-cli.ps1`
- Replace MCP-first Jira fetches with CLI-first fetches and local cache

### 2. Context Builder

Responsibility:

- Convert raw ticket data into a task brief optimized for LLM implementation.
- Add repo-local context, impacted files, screenshots, acceptance criteria, risks, and assumptions.

Outputs:

- `AkuminaTasks/{TICKET}.md`

This is the highest-leverage part of the system. If this file is good, both Copilot and Codex perform better.

### 3. Senior Developer

Responsibility:

- Read task brief.
- Inspect codebase before proposing changes.
- Implement with minimal assumptions.
- Keep a short implementation log and summary.

### 4. QA

Responsibility:

- Decide whether the ticket should start with Playwright, unit tests, or both.
- Write the first failing test before implementation.
- Re-run after implementation and record results.

Important rule:

- Do not force Playwright-first for tickets that are configuration-only, content-only, infra-only, or blocked by missing stable UI selectors.
- Use Playwright-first for user-visible flows and regression-prone behavior.

### 5. Reviewer

Responsibility:

- Review diffs for correctness, regressions, missing tests, and release risk.
- Prefer a review-focused model or workflow, not the same prompt used for implementation.

### 6. DevOps / Release

Responsibility:

- Use the existing deployment skill and release workflow already in this repo.
- Consume completed ticket summaries instead of re-reading everything from Jira during sprint closeout.

## End-to-End Flow

### Phase 0: Bootstrap

Per workspace, define:

- Jira project key
- Main repo(s)
- Common paths
- Test commands
- Playwright auth/state requirements
- Release conventions

Store this in a small workspace config file.

Suggested file:

- `AkuminaTasks/workspace-config.json`

### Phase 1: Start Work on a Ticket

Command intent:

- "start JMSMUC-188"

Workflow:

1. Jira Specialist fetches full ticket details via CLI.
2. Context Builder inspects repo using ticket key, summary terms, and changed areas.
3. Build `AkuminaTasks/{TICKET}.md`.
4. Attach or reference screenshots from `.playwright-mcp/` when relevant.
5. Add a recommended implementation plan.

### Phase 2: Test-First

Workflow:

1. QA reads the task markdown.
2. QA creates a failing Playwright spec when the behavior is browser-verifiable.
3. If Playwright is not the right test type, QA records why and uses the correct alternative.
4. Save the initial failing output in the task markdown.

### Phase 3: Implementation

Workflow:

1. Senior Developer reads only the task markdown plus necessary source files.
2. Implement the smallest correct change.
3. Update the task markdown with:
   - files changed
   - assumptions made
   - follow-ups

### Phase 4: Verify

Workflow:

1. Re-run the failing tests.
2. Run adjacent smoke tests if the area is risky.
3. Record pass/fail and evidence in the task markdown.

### Phase 5: Review

Workflow:

1. Reviewer reads the task markdown, diff, and test evidence.
2. Reviewer produces:
   - findings
   - residual risks
   - push recommendation

### Phase 6: Push / Handoff

Workflow:

1. Generate commit message from ticket + actual change.
2. Push branch.
3. Optionally update Jira:
   - implementation summary
   - test evidence
   - PR link

## The Task Markdown Standard

Each ticket should produce one markdown file that is the single source of truth for the LLM session.

It should contain:

1. Ticket metadata
2. Plain-English summary
3. Business goal
4. Exact acceptance criteria
5. Unknowns / ambiguities
6. Relevant screenshots and links
7. Related files and search hits
8. Proposed test strategy
9. Implementation notes
10. Verification evidence
11. Final summary for Jira / PR / release notes

This avoids repeating Jira fetches and avoids oversized prompts.

## Context Strategy

### Keep 3 layers of memory

#### Layer 1: Stable workspace memory

Examples:

- project mappings
- repo conventions
- common commands
- auth requirements

Store in small config/reference files.

#### Layer 2: Ticket working memory

Examples:

- `AkuminaTasks/JMSMUC-188.md`
- temporary screenshots
- failing test notes

This is the main artifact passed between implementation and review.

#### Layer 3: Sprint/release memory

Examples:

- deployment summaries
- completed ticket outcomes
- release-impact notes

This should feed the release skill later.

### Summary technique

Do not keep appending raw logs to prompts.

Instead:

1. Keep raw artifacts on disk.
2. Maintain a short rolling summary inside the task markdown.
3. Replace old verbose notes with a concise "decisions made" section.

### RAG guidance

Use retrieval from local files, not vector infrastructure, for the first version.

Retrieve from:

- current ticket markdown
- workspace config
- repo search results
- existing tests for the same project
- prior ticket markdown files in `AkuminaTasks/`

This is simpler, cheaper, and probably enough for your scale.

## Best Practices for Prompts

### Start-Task prompt should instruct the agent to:

1. inspect the repo first
2. avoid assuming Jira is complete
3. extract missing context from code, tests, and screenshots
4. write a task markdown before implementation
5. choose the right test type instead of blindly using Playwright

### Review prompt should instruct the reviewer to:

1. prioritize bugs and regressions
2. verify acceptance criteria coverage
3. flag weak tests
4. avoid rewriting the implementation unless necessary

## Recommended MVP

Build this in four steps.

### Step 1

Create a `task-init` workflow that:

- fetches Jira ticket via CLI
- searches repo for related code
- writes `AkuminaTasks/{TICKET}.md` from a template

### Step 2

Create a `qa-first` workflow that:

- reads the task file
- creates or updates the first test
- records the initial failing result

### Step 3

Create a `review-task` workflow that:

- reads task file + git diff
- produces a review summary

### Step 4

Integrate completed task summaries into your existing release skill.

## Recommended Skill Set

Start with these skills only:

1. `jira-ticket-cli`
2. `task-context-builder`
3. `qa-test-first`
4. `code-reviewer`
5. reuse existing `deployments`

Do not start by creating many fine-grained subagents. The handoff cost will exceed the benefit.

## What I Would Change in Your Current Process

1. Stop giving the raw Jira ticket directly to the implementation model as the main context.
2. Make the task markdown the required first artifact.
3. Use CLI + cache for Jira, MCP only when CLI cannot do the job.
4. Make Playwright-first conditional, not universal.
5. Run review from a separate workflow with explicit review instructions.
6. Feed release generation from completed task summaries, not only live Jira reads.

## Immediate Next Step

The best next implementation is:

1. create `workspace-config.json`
2. create a Jira CLI fetch script that outputs normalized JSON
3. create a task markdown generator
4. test it on one real ticket

That gives you a working backbone for the rest of the system.
