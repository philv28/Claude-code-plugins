-- ============================================================
-- Query Test Fixtures
-- Command: /explain-query
-- Paste one query at a time
-- ============================================================


-- TEST 1: Well-written query
-- PASS criteria:
-- [ ] Correctly identifies this returns overdue loans only
-- [ ] Explains why IS NULL is used instead of = NULL
-- [ ] Explains what DATEDIFF does
-- [ ] Explains why INNER JOIN (not LEFT JOIN) is appropriate here
-- [ ] Notes that results are ordered most-overdue first

SELECT
    m.First_Name,
    m.Last_Name,
    m.Email,
    bt.Title,
    bl.Due_Date,
    DATEDIFF(CURDATE(), bl.Due_Date) AS Days_Overdue
FROM BookLoan bl
INNER JOIN Member m  ON m.Member_ID  = bl.Member_ID
INNER JOIN BookCopy bc ON bc.Copy_ID = bl.Copy_ID
INNER JOIN BookTitle bt ON bt.ISBN   = bc.ISBN
WHERE bl.Return_Date IS NULL
  AND bl.Due_Date < CURDATE()
ORDER BY Days_Overdue DESC;


-- TEST 2: Buggy query — should be caught
-- PASS criteria:
-- [ ] Flags that = NULL should be IS NULL
-- [ ] Flags the ambiguous column reference (member_id appears in both tables)
-- [ ] Provides a corrected version

select first_name, last_name, loan_date, due_date
from member, bookloan
where member.member_id = bookloan.member_id
and return_date = null;


-- TEST 3: Correct but teaches something non-obvious
-- PASS criteria:
-- [ ] Explains what LEFT JOIN does here vs INNER JOIN
-- [ ] Explains that COUNT(*) vs COUNT(bl.Loan_ID) matters when there are NULLs
-- [ ] Explains GROUP BY + HAVING relationship

SELECT
    m.Member_ID,
    CONCAT(m.First_Name, ' ', m.Last_Name) AS Full_Name,
    COUNT(bl.Loan_ID) AS Total_Loans
FROM Member m
LEFT JOIN BookLoan bl ON bl.Member_ID = m.Member_ID
GROUP BY m.Member_ID, m.First_Name, m.Last_Name
HAVING COUNT(bl.Loan_ID) > 3
ORDER BY Total_Loans DESC;
