---
description: Audit a database schema or application architecture for security vulnerabilities
argument-hint: [file-path or paste schema/architecture description]
allowed-tools: Read, Bash
---

The user wants a security audit of their database schema or application architecture.

Input: $ARGUMENTS

Step 1 — Determine what was provided:
- If $ARGUMENTS is a file path, read the file
- If $ARGUMENTS is empty, ask the user to paste their schema SQL or describe their application architecture
- If $ARGUMENTS is an inline description or schema, use it directly

Step 2 — If a file path was given and it ends in .sql, also run:
`grep -in "password\|secret\|token\|key\|ssn\|license" <file>` to surface any sensitive field names quickly

Step 3 — Read the skill file at `.claude/skills/security-auditor/SKILL.md` and follow its instructions exactly using the collected input.
