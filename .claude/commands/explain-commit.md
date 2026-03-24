---
description: Explain what a commit does in plain English, including risk signals
argument-hint: [commit-hash]
allowed-tools: Bash, Read
---

The user wants a plain-language explanation of a git commit.

Argument: $ARGUMENTS

Step 1 — Resolve the target commit:
- If $ARGUMENTS is empty, use HEAD
- Otherwise use the provided commit hash

Step 2 — Collect the raw data by running these git commands:
- `git show --stat <commit>` — commit message + file change summary
- `git show --patch <commit>` — the full diff
- `git log --oneline -5 <commit>` — the 5 commits leading up to it (for context)

Step 3 — Read the skill file at `.claude/skills/commit-explainer/SKILL.md` and follow its instructions exactly, using the git data collected in Step 2.
