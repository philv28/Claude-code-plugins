# Skill: schema-generator

You are generating MySQL `CREATE TABLE` statements from an ER diagram description.
Output must be ready to paste directly into MySQL Workbench and execute without errors.

---

## Output Format

Produce output in three sections:

### 1. Table creation order
Before writing any SQL, list the tables in the order you will create them and briefly explain
why that order is required (parent tables must exist before child tables that reference them).

### 2. SQL
A single fenced ```sql code block containing all CREATE TABLE statements in the correct order.
Include a comment above each table explaining what it represents.

### 3. Notes
Bullet list of any design decisions made (e.g. "Used ENUM for Status — change to a lookup table
if you need to add values without a schema change") and anything the user should verify before running.

---

## MySQL rules to follow

**Always use:**
- `ENGINE=InnoDB` — required for foreign key support
- `DEFAULT CHARSET=utf8mb4` — handles all Unicode characters including emoji
- Backticks around all table and column names
- `AUTO_INCREMENT` on all surrogate primary keys
- `NOT NULL` on every column unless null is genuinely meaningful

**Data types — use these specifically:**
| Data | Type |
|---|---|
| Surrogate PKs / FKs | `INT UNSIGNED` |
| Names, titles | `VARCHAR(100)` |
| Email | `VARCHAR(255)` |
| Phone | `VARCHAR(20)` |
| ISBN-13 | `VARCHAR(13)` |
| Long descriptions | `TEXT` |
| Money (fines, salary) | `DECIMAL(10,2)` |
| Dates (birthdate, hire date, loan date) | `DATE` |
| Date + time (reservations) | `DATETIME` |
| Boolean flags | `TINYINT(1)` |
| Status with fixed options | `ENUM(...)` |

**Foreign keys:**
- Always name FK constraints explicitly: `CONSTRAINT fk_tablename_columnname`
- Always specify `ON DELETE` and `ON UPDATE` behavior
- Use `ON DELETE RESTRICT ON UPDATE CASCADE` as the default
- Use `ON DELETE SET NULL` only when the FK column is nullable

**Indexes:**
- Add an index on every FK column (MySQL does not do this automatically)
- Add indexes on columns that will be commonly searched (email, ISBN, status)

---

## Library-specific conventions

**ISA relationship (Employee IS-A Member):**
Employee's primary key should also be its FK to Member.
```sql
CREATE TABLE `Employee` (
  `Employee_ID` INT UNSIGNED NOT NULL,  -- same value as Member_ID
  ...
  CONSTRAINT `pk_employee` PRIMARY KEY (`Employee_ID`),
  CONSTRAINT `fk_employee_member` FOREIGN KEY (`Employee_ID`)
    REFERENCES `Member` (`Member_ID`)
    ON DELETE RESTRICT ON UPDATE CASCADE
);
```

**Self-referencing relationship (Guardian_of on Member):**
Add a nullable `Guardian_ID` FK on Member that references Member itself.
```sql
`Guardian_ID` INT UNSIGNED NULL,
CONSTRAINT `fk_member_guardian` FOREIGN KEY (`Guardian_ID`)
  REFERENCES `Member` (`Member_ID`)
  ON DELETE SET NULL ON UPDATE CASCADE
```
Note: Member must be created before this FK can be added. Use `ALTER TABLE` after initial creation,
or define the column without the constraint and add it at the end of the script.

**M:M relationships:**
Junction tables get a composite PK from both FKs — no separate surrogate key needed.
```sql
CREATE TABLE `BookTitle_Author` (
  `ISBN` VARCHAR(13) NOT NULL,
  `Author_ID` INT UNSIGNED NOT NULL,
  CONSTRAINT `pk_booktitle_author` PRIMARY KEY (`ISBN`, `Author_ID`),
  CONSTRAINT `fk_bta_isbn` FOREIGN KEY (`ISBN`) REFERENCES `BookTitle` (`ISBN`) ...,
  CONSTRAINT `fk_bta_author` FOREIGN KEY (`Author_ID`) REFERENCES `Author` (`Author_ID`) ...
);
```

**Correct table creation order for a library schema:**
1. `Member` (self-ref FK added via ALTER TABLE at the end)
2. `LibraryCard`
3. `Employee`
4. `Author`
5. `BookTitle`
6. `BookTitle_Author`
7. `BookCopy`
8. `BookLoan`
9. `Fine`
10. `BookReservation`
11. `Computer`
12. `ComputerReservation`
13. `ALTER TABLE Member ADD CONSTRAINT fk_member_guardian ...`

---

## WRONG vs. CORRECT examples

**WRONG — missing constraints and wrong types:**
```sql
CREATE TABLE BookLoan (
  loan_id INT PRIMARY KEY,
  member_id INT,
  copy_id INT,
  loan_date DATE
);
```

**CORRECT — production-ready:**
```sql
-- Records a specific physical copy being borrowed by a member
CREATE TABLE `BookLoan` (
  `Loan_ID`     INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `Member_ID`   INT UNSIGNED    NOT NULL,
  `Copy_ID`     INT UNSIGNED    NOT NULL,
  `Loan_Date`   DATE            NOT NULL,
  `Due_Date`    DATE            NOT NULL,
  `Return_Date` DATE            NULL,         -- NULL means not yet returned
  CONSTRAINT `pk_bookloan`        PRIMARY KEY (`Loan_ID`),
  CONSTRAINT `fk_bookloan_member` FOREIGN KEY (`Member_ID`)
    REFERENCES `Member` (`Member_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_bookloan_copy`   FOREIGN KEY (`Copy_ID`)
    REFERENCES `BookCopy` (`Copy_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_bookloan_member` (`Member_ID`),
  INDEX `idx_bookloan_copy`   (`Copy_ID`),
  INDEX `idx_bookloan_status` (`Return_Date`)  -- fast lookup for active loans
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Rules
- Output only valid MySQL syntax — no PostgreSQL, no SQLite
- Never use reserved words as column names without backticks
- If the user's ER has a design problem (e.g. missing BookLoan→BookCopy link), note it in the Notes
  section and make a reasonable assumption to keep the SQL complete
- Do not output partial SQL — always produce a complete, runnable script
