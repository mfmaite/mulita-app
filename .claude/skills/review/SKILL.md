---
name: review
description: Reviews a PR or the working diff with parallel agents, one per dimension (correctness, security, React performance, accessibility, repo rules, mechanical hygiene), verifies the severe findings and reports them sorted by severity. Use when the user asks to review a PR, a diff, or the changes on the branch (e.g. "/review 1234", "review this PR", "review what I changed").
---

# Review by dimensions, in parallel

Six agents review the same diff through different lenses, without seeing each other. Each lens finds things a single general pass misses, because none of them starts biased by what the others already found.

## 1. Decide what gets reviewed

- `$ARGUMENTS` with a PR number or URL → the diff is `gh pr diff <N>`. Also get the title and description with `gh pr view <N>`.
- `$ARGUMENTS` empty → the diff is `git diff main...HEAD` plus the uncommitted changes. If the branch is `main`, say so and stop.

**Do not paste the diff into the agent prompts.** Give them the exact command so they get it themselves. That saves multiplying the diff by six.

**Match the fan-out to the size of the diff.** Six agents for a three-line change is expensive ceremony. Look at the diff first and pick the axes that apply: if there is no JSX don't run accessibility, if there are no components don't run React performance, if nothing runs on the server don't run security. Under ~30 changed lines, review it in the main session and say so in one sentence. The full fan-out is for real PRs.

## 2. Launch the agents in a single message

All of them in the same message, or they run one after another and the parallelism is lost. Every prompt has to be **self-contained**: subagents do not see this conversation. Always include the command to get the diff, the repo path, and the requested output format.

Each agent returns a list of findings, and each finding carries: `file:line` with the line range, severity (`critical` / `high` / `medium` / `low`), a one line title, the explanation of the defect (see _How each finding is written_) and a concrete failure scenario (input or state → wrong result). Without a concrete failure scenario, the finding is dropped.

**Paste the rules from _How each finding is written_ (below) inside every agent prompt.** Subagents do not read this skill: if the rules are not in the prompt, the findings come back written in jargon and all ten have to be rewritten by hand.

| Axis                        | `model`  | What it looks for                                                                                                                                                                                       |
| --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Correctness and edge cases  | `opus`   | Broken logic, impossible states, null/undefined, race conditions, unhandled errors, business edge cases the diff does not cover                                                                         |
| Security of the server side | `opus`   | Who can call the server code and with what: missing permission checks, someone else's data returned by id, input that is trusted without validating it, secrets or internal data that reach the browser |
| React / Next.js performance | `sonnet` | Avoidable re-renders, wrong hook dependencies, server vs client components, waterfall data fetching, bundle. Check Next.js APIs against `node_modules/next/dist/docs/`, not memory (see `AGENTS.md`)  |
| Accessibility               | `sonnet` | Semantics, keyboard navigation, focus, labels and ARIA roles, contrast, alternative text, screen reader announcements                                                                                   |
| Repo rules and reuse        | `sonnet` | Everything written in `CLAUDE.md`, `AGENTS.md` and `.claude/rules/` if it exists (read them first), plus the reuse check                                                                                |
| Mechanical hygiene          | `haiku`  | Forgotten `console.log`, unused imports, commented out code, new `TODO`/`FIXME`, `.only` or `.skip` in tests, hardcoded credentials or URLs                                                             |

**Why those models.** Correctness and security are the two axes where deep reasoning changes the result, so they get the most expensive one. The three in the middle are pattern recognition against known criteria and Sonnet is plenty. Mechanical hygiene is literal search: paying for Opus there is throwing money away. If an axis keeps returning weak findings, raise its model before rewriting its prompt.

**Mandatory rule for the security axis.** Anything exported from a file with `"use server"`, and every route handler, is an address anyone on the internet can call, with whatever data they want to send. The screen only sends valid values, but the screen is not the only thing that can call it. For each one the diff touches or adds, the agent has to answer two questions before letting it pass: who is allowed to run this, and where is that checked. If the answer is that the check does not exist, that is a finding, even when the screen never lets it happen. A typical shape: an action that takes an id and returns that record's data, without checking that the record belongs to the logged-in user.

**Mandatory rule for the rules and reuse axis.** If the diff adds a new dependency or a new pattern (a render, a fetch, a util, a component), the agent has to grep first for whether the repo already solves it, looking at `components/` (especially `components/ui/`) and `lib/`, before accepting it as reasonable. A new dependency is not a given. Accepting one that duplicates something existing leaves two ways of doing the same thing in the codebase.

## 3. Merge and drop the duplicates

When they come back, merge the findings and unify the ones pointing at the same `file:line` for the same cause. Two axes finding the same thing is a signal that the finding is real, not a reason to report it twice: keep it once and keep the highest severity.

## 4. Verify the severe ones before reporting them

For each `critical` or `high` finding, launch **in parallel** an agent with `model: sonnet` that tries to **refute it**: open the file, read the surrounding code, and look for evidence that the problem does not exist or is already handled somewhere else.

If the verifier refutes it, the finding drops. A false positive in a review costs more than a finding that slips through: it burns the trust of whoever receives it.

`medium` and `low` are not verified. It is not worth the spend.

## 5. Report

Report the surviving findings sorted from most to least severe, **one block per finding**, separated by a horizontal rule. Everything about a finding lives inside its own block, so it is read once, top to bottom, without jumping anywhere else.

Do not use the `ReportFindings` tool and do not write a separate index: these blocks are the report. The comment to paste on the PR is **not** part of the block, it is written later and only if it is asked for (step 6).

```
---
### 1. [critical] The Contact link is covered by the bar on desktop

**Where:** `components/header/header.tsx:42-58`

**What happens:** two to four plain sentences, in the language of the conversation, following the order in _How each finding is written_: what that part of the system is for, what the code does today, what it should do instead.

**How it breaks:** a visitor opens the home page on a laptop, clicks Contact in the top menu, and nothing happens: the click lands on the bar that sits on top of the link.

---
### 2. [high] The next finding
...
```

Rules for the block:

- **The number is the position in the list, starting at 1**, already sorted by severity. That number is how the finding is referred to for the rest of the conversation: if someone says "explain 7" or "the comment for 3", this is the number. **Do not renumber.** If a finding drops later or a new one is added, the rest keep the number they already had: 7 is still 7 even if 4 disappeared. A new finding goes at the end with the next number, even if it is more severe than the previous ones.
- **The severity goes in brackets** right after the number, in lowercase: `[critical]`, `[high]`, `[medium]`, `[low]`.
- **The title is one line** and says the defect in plain words, not the name of the mechanism. It has to be understandable without reading the rest of the block.
- **Where** is the exact path with the line range of the block, never just the file. If the finding does not land on a line of code (the PR description, a missing file), write in words where the comment would go, for example `PR description (QA paths section)`.
- **What happens** goes in the language of the conversation, in two to four sentences. This is the explanation of the defect: it is not a summary of the title and it does not repeat the failure scenario.
- **How it breaks** is one or two lines, told as a short story with a concrete subject: someone does X, the system responds Y, the person sees Z.

After the last block, close with two or three sentences: what the PR does, whether you would approve it as is, and what is the only thing that would block the merge. If no finding survived, say it straight and without decoration.

If an axis could not run or came back empty because of an error, say so explicitly instead of letting it look like that axis found nothing.

## 6. If you are asked for the comments to paste in the PR

The comments are asked for by number: "the comment for 3", "give me 1, 4 and 7", "all of them". Return **one block per requested finding**, separated by a horizontal rule, in this format and adding nothing else:

```
---
### 3. [high] The short title of the finding

**Where:** `lib/auth/actions.ts:14-22`

**Comment:**

> The comment in English, ready to paste.
```

Rules for the comment:

- **The number, the severity, the title and the path are the same ones from the report.** Do not renumber and do not reorder: if several are asked for, they go in the same order they had in the report.
- **Do not repeat _What happens_ or _How it breaks_.** They are already in the report, a few messages above. This step only produces what gets published.
- **The comment goes in English**, because that is what gets published on the PR. Simple non-native English, no em dash, only commas.
- **The comment says what is wrong, with what evidence, and proposes the fix as a question** ("Could we…?", "Can we…?"). It never gives an order.
- **The comment is short**: three to five lines. If it needs more, the finding is actually two.
- **Inside the comment, every reference to other code goes with its path and its line**, so whoever reads it opens it without searching. If the repo already solves that somewhere else, the comment cites it.
- **If the finding is preexisting or inherited, the comment says so in one sentence**, so it does not read as a regression introduced by the PR.

## How each finding is written

Whoever reads the review is not always the person who wrote the code, and is not always familiar with the part of the system that was touched. A finding that is not understood is a finding that does not get fixed.

This applies to the text the agents return and to the final report:

- **Explain what happens, not what it is called.** Naming the mechanism ("type predicate", "race condition", "cache key") explains nothing to someone who does not use that term every day. Describe the behavior: what the code does, what it should do, and what the person using the site ends up seeing.
- **The explanation of the defect is a short paragraph, not a sentence.** A single sentence is enough for someone who already knows that part of the code, and leaves everyone else out. Write between two and four sentences answering, in this order: what that part of the system does and what it is for (one sentence of context, even if it seems obvious), what the code does today, what it should do instead, and why the difference matters. Without that initial context, the reader has to open the file before understanding what you are talking about.
- **Short is not the same as terse.** Do not pad it with filler and do not repeat the failure scenario, which has its own line. Four sentences understood in a single read are better than one dense sentence that has to be read three times. If when you finish writing it, it is not clear what has to change, it is still missing something.
- **If a technical term is unavoidable, define it right there the first time.** "a token (a kind of entry pass that expires in an hour)". Once is enough.
- **No acronyms or tribal abbreviations:** not "SA", not "TTL", not "payload", not `keyParts` as the subject of a sentence.
- **One idea per sentence**, and short sentences.
- **The exact name of the file, the function or the field goes at the end, in parentheses.** It is there to locate the problem, not to explain it. First the reader understands what is wrong, then where it is.
- **If the finding mentions other code, it goes with its path and its line.** This applies to the shared component that should be reused, the original that is being duplicated, the helper that already solves it, the rule that is being broken. Describing it in words is not enough: "the repo's shared popup component" forces the reader to go looking for it, and that is exactly where mistakes slip in. It is written `components/ui/modal.tsx:51-59`, with the line range of the block, not just the file.
- **The path is only written after having opened that file.** A component cited from memory, or guessed from its name, is made up data until it has been verified. If you mention that something appears in several places, list all of them with their path, and get that list by grepping, not by remembering. If you cannot find the path, remove the mention from the finding instead of leaving it vague.

The same finding written both ways:

> **Too technical:** `isCompleteReference` is a type predicate that lies: it claims the raw metadata is a `VertexAiSearchReference`, but `.map()` returns the original object, so undeclared fields survive at runtime and get serialized into the action payload.

> **Clear:** When someone runs a search, Google returns a list of articles, and each article comes with a lot of information: the title and the link we want to show, but also internal system data, like file paths on the server. Before sending that to the screen, the code should keep only the title and the link of each article. Today it says it does that, but it actually lets the whole package through exactly as it came. That whole package travels to every visitor's browser, so anyone can read it by opening the browser tools. (The function is `isCompleteReference`, in `lib/search/vertex-ai-search.ts:88-96`.)

No precision is lost between one version and the other: the only change is that the technical term stops being the starting point, and that the reader understands the situation before being told what is wrong.

And a finding that mentions another component, badly and well:

> **Vague:** The Escape key handling and the scroll lock are the same code, statement by statement, that already lives in the repo's shared popup component.

> **Locatable:** The Escape key handling and the scroll lock are the same code, statement by statement, that already lives in the shared popup component (`components/ui/modal.tsx:51-59` for Escape, `:65-71` for the scroll). The new copy is in `components/header/ai-search.tsx:40-66`.

With both paths, the reader opens both files and decides in thirty seconds. Without them, they have to reconstruct the search you already did.

## What NOT to report

- Style preferences that are not written in the repo rules (`CLAUDE.md`, `AGENTS.md`, `.claude/rules/`).
- Variable names that work but you would have called something else.
- Refactors outside the scope of the PR.
- Preexisting code the diff does not touch, unless the change makes it incorrect.

## Notes

- Hold the conversation in the language the user is writing in, with correct spelling and accents. The comments meant to be pasted in the PR are always in English.
- If the repo has PR rules (for example `.claude/rules/pull-requests.md`), check the PR description against them and flag what is missing.
- If the diff adds a database migration (`lib/db/migrations/`), check that it matches the schema change in `lib/db/schema/` and that it is safe to run on a database that already has data.
