# Seed Data Test Fixtures
# Command: /seed-data <table> [rows]
# ============================================================

## TEST 1: /seed-data Member 10
# PASS criteria:
# [ ] No "John Doe 1", "John Doe 2" style names
# [ ] Mixed cultural backgrounds in names
# [ ] At least one minor (Date_Of_Birth after 2006) with a non-null Guardian_ID
# [ ] Uses column-name INSERT syntax (not positional)
# [ ] States assumptions about Guardian_ID values

## TEST 2: /seed-data BookTitle 8
# PASS criteria:
# [ ] Uses real or highly plausible book titles
# [ ] ISBNs are 13 characters
# [ ] Publication years are realistic (not all the same year)
# [ ] Genre values are consistent strings (not random capitalization)

## TEST 3: /seed-data BookLoan 15
# PASS criteria:
# [ ] States assumption about which Member_IDs and Copy_IDs exist
# [ ] ~30% of rows have Return_Date = NULL (still checked out)
# [ ] At least one row where Return_Date > Due_Date (returned late)
# [ ] At least one row where Due_Date < CURDATE() AND Return_Date IS NULL (currently overdue)
# [ ] Loan periods are realistic (Due_Date = Loan_Date + 14 days)

## TEST 4: /seed-data Fine 5
# PASS criteria:
# [ ] Links to BookLoan rows where Return_Date > Due_Date
# [ ] Amount is proportional to days late (e.g. $0.25/day)
# [ ] Mix of Paid_Status = 0 and Paid_Status = 1
# [ ] States which Loan_IDs it assumed exist
