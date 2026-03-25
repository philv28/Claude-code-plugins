# Skill: schema-linter

You have run the schema linter CLI and received its output. Your job is to present the findings
clearly and explain what each issue means and how to fix it.

---

## Output Format

### Summary
One sentence: how many tables were checked, how many issues were found, and the overall health
(Clean / Minor issues / Needs attention / Critical issues).

### Issues by severity

Group findings under ERROR, WARNING, and INFO headings.
For each issue:
- State which table it affects
- Explain what the rule means in plain language (not just the rule name)
- Show the exact fix — a code snippet of what to add or change

### What to fix first
If there are multiple issues, give a prioritized list. ERRORs always come before WARNINGs.
Within the same severity, fix structural issues (missing PK, missing ENGINE) before style issues
(naming conventions).

---

## Rule reference — what each finding means and how to fix it

**missing-engine** (ERROR)
The table was created without `ENGINE=InnoDB`. MySQL's default engine (MyISAM) does not support
foreign key constraints. Any FK on this table will silently fail.
Fix: add `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4` at the end of the CREATE TABLE statement.

**missing-pk** (ERROR)
The table has no PRIMARY KEY. Without a PK, rows have no guaranteed unique identifier, JOINs
become fragile, and replication can break.
Fix: add a surrogate key column and declare it as PK:
```sql
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
CONSTRAINT `pk_tablename` PRIMARY KEY (`id`)
```

**missing-charset** (WARNING)
The table doesn't specify `DEFAULT CHARSET=utf8mb4`. The default charset varies by MySQL version
and server config. `utf8mb4` is the only charset that supports full Unicode (including emoji and
many non-Latin scripts). `utf8` in MySQL is actually a 3-byte subset — not full UTF-8.
Fix: add `DEFAULT CHARSET=utf8mb4` to the end of the CREATE TABLE statement.

**unnamed-constraint** (WARNING)
One or more FOREIGN KEY constraints have no name. Unnamed constraints get auto-generated names
like `tablename_ibfk_1`, which are meaningless in error messages.
Fix: add `CONSTRAINT \`fk_tablename_columnname\`` before each `FOREIGN KEY`.

**fk-naming** (WARNING)
A FK constraint doesn't follow the `fk_tablename_columnname` convention.
Fix: rename the constraint to match the pattern. Example: `fk_bookloan_member_id`.

**missing-fk-index** (WARNING)
A FK column has no index. MySQL does not automatically create indexes on FK columns. Without an
index, every JOIN on this column causes a full table scan.
Fix: add an index immediately after the FK definition:
```sql
INDEX `idx_tablename_columnname` (`columnname`)
```

**pk-naming** (INFO)
The PK constraint doesn't follow the `pk_tablename` convention. This is a style issue only —
it doesn't affect functionality.
Fix: rename the constraint. Example: `CONSTRAINT \`pk_member\` PRIMARY KEY (\`Member_ID\`)`.

**missing-auto-increment** (INFO)
A single-column PK doesn't have AUTO_INCREMENT. This is only a problem for surrogate keys —
natural keys (like ISBN) intentionally don't use AUTO_INCREMENT.
Fix: add `AUTO_INCREMENT` to the PK column if it's a surrogate key.

---

## Rules
- If the linter finds no issues, say so clearly — a clean result is good news
- Always show the exact SQL fix, not just a description of what to change
- If the file has errors (exit code 1), lead with those before warnings
- Do not repeat the raw linter output — interpret and format it
