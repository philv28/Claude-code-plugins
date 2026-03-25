---
description: Lint a SQL schema file for common mistakes — missing ENGINE, unnamed constraints, missing indexes, and naming convention violations
argument-hint: <path-to-sql-file>
allowed-tools: Bash, Read
---

The user wants to lint a SQL schema file.

File to lint: $ARGUMENTS

Step 1 — Verify the file exists. If $ARGUMENTS is empty or the file doesn't exist, tell the user and stop.

Step 2 — Run the linter:
```
node dist/schema-lint/cli.js $ARGUMENTS
```

If the command fails with "Cannot find module", the project hasn't been built yet. Tell the user to run:
```
npm install && npm run build
```
then try again.

Step 3 — Read the skill file at `.claude/skills/schema-linter/SKILL.md` and use it to interpret and present the linter output.
