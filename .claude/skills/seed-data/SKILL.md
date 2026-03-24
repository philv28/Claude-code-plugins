# Skill: seed-data

You are generating realistic MySQL INSERT statements for a library database.
Data must look real — not placeholder garbage like "John Doe 1", "John Doe 2".

---

## Output Format

### 1. Assumptions
List any FK values you assumed (e.g. "Assumes Member_IDs 1–10 already exist").
Tell the user what order to run seed scripts if there are dependencies.

### 2. SQL
A single fenced ```sql code block with all INSERT statements.

### 3. Variations to try
Two or three suggestions for edge cases worth seeding manually
(e.g. "a member with an overdue loan", "a book with 4 authors").

---

## Realism rules

**Names:** Use varied, realistic first and last names. Mix cultural backgrounds.
Do not use "John Smith", "Jane Doe", or any name with a number suffix.

**Books:** Use real or plausible book titles and authors. Good library-realistic examples:
- "The Name of the Wind" by Patrick Rothfuss (ISBN: 9780756404079)
- "Educated" by Tara Westover (ISBN: 9780399590504)
- "The Midnight Library" by Matt Haig (ISBN: 9780525559474)
- "Pachinko" by Min Jin Lee (ISBN: 9781455563937)
- "Project Hail Mary" by Andy Weir (ISBN: 9780593135204)
- "The House in the Cerulean Sea" by TJ Klune (ISBN: 9781250217318)
- "Mexican Gothic" by Silvia Moreno-Garcia (ISBN: 9780525620785)
- "A Gentleman in Moscow" by Amor Towles (ISBN: 9780670026197)

**Dates:** Use realistic date ranges:
- Member birth dates: between 1950 and 2010
- Hire dates: between 2015 and 2024
- Loan dates: within the past 6 months
- Due dates: loan_date + 14 days (standard library loan period)
- Return dates: mix of NULL (still out) and dates before or after due_date

**Status fields:**
- BookCopy status: mostly 'Available', some 'Checked Out', occasional 'Lost' or 'In Repair'
- LibraryCard status: mostly 'Active', occasional 'Expired' or 'Suspended'
- Loan return: ~30% NULL (not yet returned), ~60% returned on time, ~10% returned late

**Emails:** Use realistic patterns: firstname.lastname@domain.com
Use varied domains: gmail.com, yahoo.com, outlook.com, hotmail.com

---

## Table-specific guidance

**Member:**
- Mix adults and minors (minors have a non-null Guardian_ID)
- Include at least one member who IS also an Employee (same Member_ID will appear in Employee table)

**BookLoan:**
- Always include both the Member_ID and Copy_ID
- Return_Date NULL means the book is still checked out — make ~30% of loans still active
- Include at least one overdue loan (Due_Date in the past, Return_Date still NULL)

**Fine:**
- Link to a BookLoan where Return_Date > Due_Date
- Amount: DATEDIFF(Return_Date, Due_Date) * 0.25 (25 cents per day is realistic)
- Mix of paid and unpaid fines

**ComputerReservation:**
- Usage_Start and Usage_End should be within the Start_Time / End_Time window
- Some reservations where Usage_Start is NULL (reserved but member never showed up)

---

## WRONG vs. CORRECT examples

**WRONG — fake and useless:**
```sql
INSERT INTO Member VALUES (1, 'John', 'Doe1', 'john1@email.com', '1990-01-01', ...);
INSERT INTO Member VALUES (2, 'John', 'Doe2', 'john2@email.com', '1990-01-02', ...);
```

**CORRECT — realistic and varied:**
```sql
INSERT INTO `Member` (`First_Name`, `Last_Name`, `Email`, `Date_Of_Birth`, `Address`, `Guardian_ID`)
VALUES
  ('Amara',   'Osei',       'amara.osei@gmail.com',      '1988-03-14', '412 Elm Street',     NULL),
  ('Lucas',   'Ferreira',   'lucas.ferreira@outlook.com','2008-07-22', '89 Birchwood Ave',   1),
  ('Priya',   'Nair',       'priya.nair@yahoo.com',      '1975-11-05', '1203 Lakeview Blvd', NULL),
  ('Marcus',  'Johansson',  'marcus.j@hotmail.com',      '1995-06-30', '55 Cedar Court',     NULL);
```

---

## Rules
- Always use column-name syntax in INSERT (never positional — it breaks if schema changes)
- Always use backticks around table and column names
- If seeding a table with FKs, state the assumed parent IDs clearly in Assumptions
- Never generate data that would violate a constraint (e.g. duplicate ISBNs, invalid FK values)
