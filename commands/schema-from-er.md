---
description: Generate MySQL CREATE TABLE statements from a library ER diagram description
argument-hint: [describe your entities and relationships, or type 'library' to use the standard library schema]
allowed-tools: Read
---

The user wants to generate MySQL schema SQL from their ER diagram.

Their input: $ARGUMENTS

If $ARGUMENTS is empty, ask the user to describe their entities, attributes, and relationships before proceeding.
If $ARGUMENTS is "library", use the standard library database entities (BookTitle, BookCopy, Member, Employee, LibraryCard, BookLoan, Author, Computer, ComputerReservation).

Once you have the design, read the skill file at `.claude/skills/schema-generator/SKILL.md` and follow its instructions exactly.
