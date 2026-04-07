# Phil's Learning Plugin

A Claude Code plugin built by reverse-engineering the kw-plugin architecture. Contains tools for learning Claude Code plugin development and for building a library database with MySQL Workbench. Includes a TypeScript-powered SQL schema linter.

## Installation

**1. Add the marketplace:**
```
/plugin marketplace add <your-github-username>/Claude-code-plugins
```

**2. Install the plugin:**
```
/plugin install Phil-learning-plugin@Phil-learning-plugins
```

**3. (Optional) Enable auto-updates:**

Run `/plugin`, go to Marketplaces tab, enable auto-update for `Phil-learning-plugins`

### Updating

```
/plugin update Phil-learning-plugin@Phil-learning-plugins
```

### Requirements
- Claude Code v2.0.12 or higher
- Node.js (for `/schema-lint`)

### Building the TypeScript CLI

```bash
npm install
npm run build
```

---

## Commands

### Git & Development

| Command | Description |
|---------|-------------|
| `/explain-commit [hash]` | Explain what a commit does in plain English, including risk signals |
| `/summarize <file-path>` | Summarize the contents of any file in plain language |

### Database Design

| Command | Description |
|---------|-------------|
| `/er-review` | Review a library ER diagram for missing entities, wrong cardinalities, and normalization issues |
| `/schema-from-er [description]` | Generate MySQL `CREATE TABLE` statements from an ER diagram description |

### Database Development

| Command | Description |
|---------|-------------|
| `/seed-data <table> [rows]` | Generate realistic `INSERT` statements for a library database table |
| `/query-builder <description>` | Describe what data you want in plain English and get the MySQL query |
| `/explain-query <sql>` | Paste a SQL query and get a plain-English explanation plus potential issues |
| `/sql-debug <error + sql>` | Paste a MySQL Workbench error and the SQL that caused it to get a diagnosis and fix |

### SQL Quality

| Command | Description |
|---------|-------------|
| `/schema-lint <file.sql>` | Lint any SQL schema file for structural and convention violations |
| `/security-audit [file or description]` | Audit a schema or architecture for PII exposure, access control gaps, injection surface, and audit trail issues |

---

## Command Details

### `/explain-commit`
Analyzes a git commit's diff and message to explain what changed, why it likely changed, and what to pay attention to. Defaults to HEAD if no hash is provided.

```
/explain-commit
/explain-commit abc1234
```

### `/summarize`
Reads any file and produces a three-part summary: what it is, what it contains, and one non-obvious insight. Works on code, config, documentation, and data files.

```
/summarize README.md
/summarize src/schema-lint/cli.ts
```

### `/er-review`
Reviews a library ER diagram description against library domain knowledge — checks for the Book/Copy split, correct M:M author relationships, missing Fine and Reservation entities, circular FK references, and ISA relationship modeling.

```
/er-review Member has Member_ID, First_Name, Last_Name...
```

### `/schema-from-er`
Generates production-ready MySQL `CREATE TABLE` statements with correct data types, FK constraints, named indexes, and proper table creation order. Use `library` as the argument to generate the full standard library schema.

```
/schema-from-er library
/schema-from-er <paste your entity descriptions>
```

### `/seed-data`
Generates realistic INSERT statements — not placeholder data. Uses real book titles, varied names, and realistic date distributions (overdue loans, unpaid fines, active vs. expired cards).

```
/seed-data Member 15
/seed-data BookLoan 20
/seed-data BookTitle
```

### `/query-builder`
Translates a plain-English data request into a correct, readable MySQL query. Knows the library schema and includes a clause-by-clause explanation of the output.

```
/query-builder find all overdue loans with member name and email
/query-builder show how many copies each book title has available
/query-builder list members with unpaid fines over $5
```

### `/explain-query`
Breaks down any SQL query clause by clause, explains why each part is written the way it is, and flags potential issues (missing indexes, unexpected NULLs, logic errors).

```
/explain-query SELECT m.First_Name ...
```

### `/sql-debug`
Diagnoses MySQL errors by error code, identifies the root cause (not just the error class), and returns a fixed version of the SQL with inline comments on what changed.

```
/sql-debug ERROR 1215 (HY000): Cannot add foreign key constraint ...
```

### `/security-audit`
Reviews a database schema or application architecture description across five categories: PII & sensitive data exposure, access control, data integrity enforcement, audit trail, and SQL injection surface. Returns findings by severity with specific fixes.

```
/security-audit schema.sql
/security-audit exports/library.sql
/security-audit Member stores First_Name, Last_Name, Email, License_ID...
```

**Categories checked:**

| Category | What it looks for |
|---|---|
| PII & Sensitive Data | Unencrypted PII, plaintext passwords, exposed minor member data |
| Access Control | Missing roles, no account suspension, LibraryCard status not enforced |
| Data Integrity | Missing NOT NULL/UNIQUE/ENUM, dangerous ON DELETE CASCADE |
| Audit Trail | Missing timestamps, no soft delete, no employee tracking on transactions |
| SQL Injection | High-risk user-input columns, dynamic query patterns |

---

### `/schema-lint`
Runs a TypeScript-powered linter against any `.sql` schema file. Checks 8 rules across ERROR, WARNING, and INFO severity levels. Returns a fix for every issue found.

```
/schema-lint schema.sql
/schema-lint exports/library.sql
```

**Rules checked:**

| Severity | Rule | Description |
|----------|------|-------------|
| ERROR | `missing-engine` | Table missing `ENGINE=InnoDB` |
| ERROR | `missing-pk` | Table has no PRIMARY KEY |
| WARNING | `missing-charset` | Table missing `DEFAULT CHARSET=utf8mb4` |
| WARNING | `unnamed-constraint` | FOREIGN KEY has no `CONSTRAINT` name |
| WARNING | `fk-naming` | FK constraint doesn't follow `fk_table_column` convention |
| WARNING | `missing-fk-index` | FK column has no corresponding INDEX |
| INFO | `pk-naming` | PK constraint doesn't follow `pk_table` convention |
| INFO | `missing-auto-increment` | Surrogate PK missing `AUTO_INCREMENT` |

---

## Skills

| Skill | Used By |
|-------|---------|
| `commit-explainer` | `/explain-commit` |
| `er-reviewer` | `/er-review` |
| `schema-generator` | `/schema-from-er` |
| `seed-data` | `/seed-data` |
| `query-builder` | `/query-builder` |
| `query-explainer` | `/explain-query` |
| `sql-debugger` | `/sql-debug` |
| `schema-linter` | `/schema-lint` |
| `security-auditor` | `/security-audit` |

---

## Structure

```
.claude-plugin/plugin.json   # Plugin metadata
marketplace.json             # Marketplace registry
commands/                    # Slash command definitions
skills/                      # Skill implementations (SKILL.md files)
  commit-explainer/
  er-reviewer/
  schema-generator/
  seed-data/
  query-builder/
  query-explainer/
  sql-debugger/
  schema-linter/
  security-auditor/
src/
  schema-lint/
    cli.ts                   # TypeScript linter CLI (compiles to dist/)
dist/                        # Compiled JavaScript (generated by npm run build)
tests/
  fixtures/                  # Sample inputs for manual testing
.claude/                     # Local copies for development and testing
  commands/
  skills/
```

## License

MIT
