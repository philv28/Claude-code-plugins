---
description: Generate realistic INSERT statements for a library database table
argument-hint: <table-name> [number of rows]
allowed-tools: Read
---

The user wants realistic seed data for a library database table.

Their input: $ARGUMENTS

Parse $ARGUMENTS as: first word = table name, second word (optional) = number of rows (default 10).

If $ARGUMENTS is empty, ask the user which table they want seed data for and how many rows.

Read the skill file at `.claude/skills/seed-data/SKILL.md` and follow its instructions exactly.
