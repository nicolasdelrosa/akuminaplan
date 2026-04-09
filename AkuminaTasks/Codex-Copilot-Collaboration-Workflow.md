# Codex + Copilot Collaboration Workflow

## Purpose

Use Codex and Copilot together in a predictable way for tickets that need:

- code changes
- sandbox deployment
- browser verification
- screenshots or MCP-backed checks
- code review handoff

This workflow is intended for tickets where one tool alone is not enough.

## Principle

Use one shared ticket file as the source of truth:

- `AkuminaTasks/{TICKET}.md`

Do not split planning, implementation, and verification into separate docs unless there is a very strong reason.

## Role Split

### Codex

Best for:

- Jira ticket intake through local CLI
- repo inspection
- implementation planning
- code changes
- scoped git work
- updating technical notes in the ticket file

### Copilot

Best for:

- MCP-backed browser checks
- sandbox verification
- screenshots
- deployment-aware validation
- Playwright/MCP verification
- code review notes

## Standard Flow

### 1. Ticket Intake

Use Codex to create or refresh:

- `AkuminaTasks/{TICKET}.md`
- `AkuminaTasks/.data/{TICKET}.json`

Ticket file should contain:

- Jira summary
- acceptance criteria
- impacted files
- proposed fix
- test plan
- risks

### 2. Implementation

Use Codex to:

- inspect the repo
- implement the fix
- keep the ticket file updated in:
  - `Implementation Plan`
  - `Changes Made`
  - `Verification`

### 3. Push Branch

Use Codex to:

- create a scoped branch
- commit only ticket-related changes
- push the branch

Record branch and commit in the ticket file when useful.

### 4. Deploy

Deployment must happen before Copilot verifies browser behavior in sandbox.

Important:

- A pushed branch is not the same as a deployed sandbox.
- If Copilot tests before deployment, the findings may be correct for the old environment but stale relative to the branch.

### 5. Sandbox Verification

Use Copilot after deployment to:

- open the correct sandbox
- verify the exact acceptance criteria
- take screenshots
- update the ticket file in:
  - `Verification`
  - `Code Review`
  - `Review Notes`

### 6. Follow-up

Use Codex to:

- read Copilot findings from the ticket file
- fix issues
- push another scoped branch update if needed

Repeat deploy -> verify -> fix until the ticket is ready.

## Recommended Handoff Language

### Codex to Copilot

Use prompts like:

```text
@Ren verify {TICKET} in sandbox after deployment of branch {BRANCH}.

Open the target page.
Verify the acceptance criteria.
Take screenshots.
Update C:\AkuminaPlan\AkuminaTasks\{TICKET}.md in Verification and Code Review sections.
```

### Copilot to Codex

Use prompts like:

```text
@Scott read {TICKET}.md and address Copilot findings.
```

## Decision Rules

### Use Codex only when:

- no live browser validation is needed
- no MCP-backed tool is needed
- the task is mostly code and local verification

### Use Copilot too when:

- sandbox behavior matters
- deployment state matters
- screenshots are needed
- live browser verification is required
- MCP tools provide the easiest validation path

## Common Failure Modes

### 1. Wrong Environment

Symptom:

- Copilot says the feature is missing even though Codex pushed the branch

Cause:

- sandbox is not deployed from that branch yet

Fix:

- deploy first
- then verify

### 2. Stale Asset Cache

Symptom:

- sandbox appears unchanged after deployment

Cause:

- browser still using older assets

Fix:

- hard refresh
- confirm loaded asset/template matches deployed code

### 3. Ticket File Drift

Symptom:

- Codex and Copilot disagree about current state

Cause:

- `AkuminaTasks/{TICKET}.md` was not updated after implementation or verification

Fix:

- treat the ticket file as required handoff state, not optional notes

## Minimum Ticket Sections to Maintain

For this workflow to stay useful, always keep these current:

- `Workflow Status`
- `Proposed Fix`
- `Changes Made`
- `Verification`
- `Code Review`
- `Review Notes`

## Simple Status Model

Use one of these states in `Workflow Status`:

- `Planning`
- `Implementation in progress`
- `Pushed, awaiting deployment`
- `Awaiting re-verification`
- `Ready for review`
- `Ready to merge`

## Summary

The best use of Codex + Copilot is:

- Codex owns code and repo work
- Copilot owns deployed-browser verification
- both read and update the same ticket file

That gives you a stronger workflow than either tool alone for tickets that depend on both implementation and live validation.
