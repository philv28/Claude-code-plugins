---
description: Review a library ER diagram for missing entities, wrong cardinalities, and normalization issues
argument-hint: [paste your entities and relationships, or describe them]
allowed-tools: Read
---

The user wants a review of their library database ER diagram.

Their design: $ARGUMENTS

If $ARGUMENTS is empty, ask the user to describe their entities (tables), their attributes (columns), and the relationships between them before proceeding.

Once you have their design, read the skill file at `.claude/skills/er-reviewer/SKILL.md` and follow its instructions exactly.
