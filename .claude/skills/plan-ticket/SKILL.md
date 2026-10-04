---
name: plan-ticket
description: Plans a ticket before writing any code — reads the ticket from Jira, explores the codebase, and leaves a written and approved plan before the first edit, with short steps and the commit each one will produce. Use when starting any change that touches more than one file, or when the user mentions a ticket (e.g. "/plan-ticket ABC-123", "let's start ABC-123", "arranquemos con este ticket").
---

# Plan a ticket

Core rule: **the plan exists and is approved before the first code edit.** Do not write or edit any code file until the user has approved the plan.

Second rule: **the work is implemented in short steps, and every code step ends with its own commit.** The plan is not only what will change, it is also the order in which the commits will appear.

`$ARGUMENTS` can be a ticket key (`ABC-123`), a free-form description, or empty. If it is empty, ask what needs to be planned before going further.

## Flow

### 1. Get the ticket

If `$ARGUMENTS` contains a key shaped like `ABC-###`, read it with the Atlassian MCP (`mcp__claude_ai_Atlassian__getJiraIssue`): title, description, acceptance criteria, comments and linked tickets. The comments often hold the product decision that is missing from the description.

If the ticket has linked issues marked as blockers, say so before planning anything. It may change whether this work should happen now at all.

If there is no ticket key, work from the description the user gave and move on to step 2.

### 2. Explore the codebase, in parallel

Invoking this skill is explicit authorization to use subagents. When the exploration splits into independent questions, launch several `Explore` agents **in the same message** so they run in parallel. For example: one to find where the feature lives today, another to find equivalent patterns already solved in the repo, another to find the tests and types that will be affected.

Before proposing any new dependency or approach, check whether the repo already solves it another way. Reuse beats adding.

If the repo has rules (`CLAUDE.md`, `.claude/rules/`), read them and respect them in the plan, especially any code style rules, because they shape how the code you are about to propose has to be structured.

### 3. Ask before assuming

If there is **any substantial product or scope doubt** — two possible readings of an acceptance criterion, an edge case that is not specified, a UX decision the ticket does not define — ask. Do not resolve it on your own and do not hide it inside the plan as an assumption.

Purely technical doubts that have an obviously better answer are yours to resolve. Write them down as decisions, not as questions.

### 4. Write the plan

Save it to `.claude/plans/<TICKET>.md` (or `.claude/plans/<short-slug>.md` when there is no ticket). `.claude/plans/` is in `.gitignore`. These are working notes, they do not belong in the repo.

Write the plan **in Spanish**, without em dashes, unless the user explicitly asks for English. The team reads it, nobody outside does, and when the PR is opened this file is used as the base for the PR description and translated to English at that point, so it does not need to be in English from the start.

Structure:

```markdown
# <TICKET>: <title>

## Goal

What changes from the user's point of view, in two or three sentences.

## Architecture decisions

Every non-obvious decision, with its reason and the alternative that was
discarded. If there is none, write "None" instead of inventing one.

## Steps

1. `path/to/file.tsx` — what changes and why
   → `Add award logo to the attorney card`
2. Add the new environment variable in the hosting provider
   → no commit (external configuration)
3. ...

## Testing

What gets verified and how. If the change is visual, which screen has to be
checked and at which route.

## Out of scope

What this ticket does NOT touch, so it does not leak into the diff.

## Open questions

What is still undefined and blocking. Empty if there is nothing.
```

Steps are ordered the way they will be executed, each one small and verifiable on its own, and there have to be at least three.

**A step is not the same as a commit.** Some steps leave no diff: configuring something in an external service, adding an environment variable, asking someone for a value, checking data in a third-party tool. Those steps still belong in the plan, marked as "no commit", because they are part of the work and of the order in which it has to happen. Code steps carry their proposed commit message next to them.

**If the plan produces more than 10 commits, stop before presenting it.** Count the commits, not the steps: the steps that leave no diff do not count toward the limit. More than 10 commits almost always means the ticket mixes more than one task. Tell the user in a sentence or two, show where you see the natural split, and ask whether they prefer to divide it into two tickets or keep one. If they decide to keep one ticket, keep one ticket and do not bring it up again.

### 5. Present the plan and stop

Present the plan with **plan mode** (`ExitPlanMode`) and wait for approval. Do not push through: the whole point of this skill is that there is a moment where the user says yes before the first diff shows up.

If the user asks for changes, update the plan file and present it again.

### 6. Only then, implement, step by step

Once approved, execute the steps in order, **one at a time**. When a code step is finished, leave its commit before starting the next one. Do not bundle five steps into one commit at the end: the branch has to be readable commit by commit during code review, and it has to be bisectable when something breaks.

Every commit:

- Leaves the branch in a coherent state on its own. If a change only makes sense together with another one, they are one step, not two.
- Has a **single-line** message, in English, saying what it does. No ticket key in front: it is already in the branch name and in the PR, and in the commit it only takes up room. No body, no bullets, no explanation underneath. If the message does not fit in one line, the commit is doing too much.
- Describes **what it does**, not which files it touches. `Add award logo to the attorney card`, not `Update AttorneyCard.tsx`.

When a step is one of those that leave no diff, do it in its turn anyway and say it is done, without an empty commit.

If halfway through you find that the plan was wrong, **stop and say so** instead of quietly improvising a different approach. Update the plan and confirm before continuing.

## When NOT to use this skill

A typo, a copy tweak, an obvious one-file change. Not every ticket deserves a plan, and planning those is empty ceremony. If the user invokes it anyway for something trivial, say so in one sentence and offer to do it directly. The single-line commit still applies, that one is always worth it.

## Notes

- The whole conversation is in Spanish, with correct accents and spelling. The plan file is in Spanish too, unless the user asks otherwise.
- Commit messages are in English, like the rest of the repo.
- The approved plan feeds the PR: when it is time to open it, read `.claude/plans/<TICKET>.md` instead of rebuilding the description from the diff.
