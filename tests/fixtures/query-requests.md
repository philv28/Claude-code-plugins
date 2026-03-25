# Query Builder Test Fixtures
# Command: /query-builder <description>
# Run each request and check against the criteria
# ============================================================

## TEST 1 — Simple join
# Request: find all overdue loans with member name and email
# PASS criteria:
# [ ] Uses IS NULL for Return_Date check, not = NULL
# [ ] Uses CURDATE() for today's date comparison
# [ ] JOINs Member to get name and email
# [ ] JOINs through BookCopy to BookTitle to get the book name
# [ ] Includes Days_Overdue as a calculated column
# [ ] Orders by most overdue first

## TEST 2 — Aggregation
# Request: show how many copies each book title has, and how many are currently available
# PASS criteria:
# [ ] Uses GROUP BY on ISBN or Title
# [ ] Uses COUNT(*) for total copies
# [ ] Uses conditional aggregation (SUM or COUNT with CASE) for available copies
# [ ] Does NOT use a subquery when a CASE inside COUNT works
# [ ] Returns both total and available in the same row

## TEST 3 — Ambiguous request (should ask a clarifying question)
# Request: show me late books
# PASS criteria:
# [ ] Asks whether "late" means currently overdue OR returned late
# [ ] Does NOT assume and proceed — must clarify first

## TEST 4 — Multi-table
# Request: list all members who have never borrowed a book
# PASS criteria:
# [ ] Uses LEFT JOIN + IS NULL pattern (or NOT EXISTS subquery)
# [ ] Does NOT use NOT IN (unsafe with NULLs)
# [ ] Explains why LEFT JOIN was chosen

## TEST 5 — Aggregation with filter
# Request: find members with unpaid fines totalling more than $5
# PASS criteria:
# [ ] JOINs Member → BookLoan → Fine
# [ ] Filters Fine WHERE Paid_Status = 0
# [ ] Uses SUM(f.Amount) with HAVING > 5
# [ ] Uses HAVING not WHERE for the aggregate filter
