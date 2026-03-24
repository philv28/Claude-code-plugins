# Phil's Learning Plugin

A Claude Code plugin built by reverse-engineering the kw-plugin architecture. Contains tools for learning Claude Code plugin development and for building a library database with MySQL Workbench.

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

---

## Command Details

### `/explain-commit`
Analyzes a git commit's diff and message to explain what changed, why it likely changed, and what to pay attention to. Defaults to HEAD if no hash is provided.

```
/explain-commit
/explain-commit abc1234
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

### `/sql-debug`
Diagnoses MySQL errors by error code, identifies the root cause (not just the error class), and returns a fixed version of the SQL with inline comments on what changed.

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
.claude/                     # Local copies for development/testing
  commands/
  skills/
```

## License

MIT
