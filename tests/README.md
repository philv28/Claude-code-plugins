# Plugin Tests

These are manual test fixtures — sample inputs to feed each plugin so you can verify output quality.

Since these are LLM-based plugins, there are no automated assertions.
Instead, each fixture comes with a checklist of things the output MUST contain to pass.

---

## How to run a test

1. Open Claude Code in any directory
2. Run the command with the fixture content as input (or paste the fixture when prompted)
3. Check the output against the checklist for that test

---

## Test index

| Fixture | Tests | Command |
|---------|-------|---------|
| `fixtures/er-good.md` | Valid ER with minor issues | `/er-review` |
| `fixtures/er-bad.md` | ER with multiple serious problems | `/er-review` |
| `fixtures/queries.sql` | Three SQL queries of varying quality | `/explain-query` |
| `fixtures/errors.md` | Four real MySQL error scenarios | `/sql-debug` |
| `fixtures/seed-requests.md` | Seed data requests for each table | `/seed-data` |
| `fixtures/query-requests.md` | Plain-English query requests | `/query-builder` |
