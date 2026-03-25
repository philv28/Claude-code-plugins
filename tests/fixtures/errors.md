# SQL Error Test Fixtures
# Command: /sql-debug
# Paste the error + SQL block together for each test
# ============================================================


## TEST 1: Wrong table creation order (ERROR 1215)
# PASS criteria:
# [ ] Identifies this as a FK reference to a table that doesn't exist yet
# [ ] Explains the correct creation order
# [ ] Does NOT just say "syntax error"

ERROR 1215 (HY000): Cannot add foreign key constraint

CREATE TABLE `BookLoan` (
  `Loan_ID`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Member_ID` INT UNSIGNED NOT NULL,
  `Copy_ID`   INT UNSIGNED NOT NULL,
  `Loan_Date` DATE NOT NULL,
  `Due_Date`  DATE NOT NULL,
  CONSTRAINT `pk_bookloan` PRIMARY KEY (`Loan_ID`),
  CONSTRAINT `fk_bookloan_member` FOREIGN KEY (`Member_ID`)
    REFERENCES `Member` (`Member_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_bookloan_copy` FOREIGN KEY (`Copy_ID`)
    REFERENCES `BookCopy` (`Copy_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


## TEST 2: Data type mismatch on FK (ERROR 1215)
# PASS criteria:
# [ ] Identifies the INT vs INT UNSIGNED mismatch specifically
# [ ] Shows the fix on the correct column
# [ ] Explains why exact type match is required for FKs

ERROR 1215 (HY000): Cannot add foreign key constraint

CREATE TABLE `Employee` (
  `Employee_ID` INT NOT NULL,
  `Salary`      DECIMAL(10,2) NOT NULL,
  `Hire_Date`   DATE NOT NULL,
  `Position`    VARCHAR(100) NOT NULL,
  CONSTRAINT `pk_employee` PRIMARY KEY (`Employee_ID`),
  CONSTRAINT `fk_employee_member` FOREIGN KEY (`Employee_ID`)
    REFERENCES `Member` (`Member_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Member was created with: `Member_ID` INT UNSIGNED NOT NULL AUTO_INCREMENT


## TEST 3: Reserved word without backticks (ERROR 1064)
# PASS criteria:
# [ ] Identifies 'Status' or 'condition' as the problem (it's a reserved word in some contexts)
# [ ] Actually it's `Order` here — identifies it immediately
# [ ] Explains the reserved word issue, not just "syntax error near..."

ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near
'Order INT UNSIGNED NULL,' at line 6

CREATE TABLE `BookLoan` (
  `Loan_ID`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Member_ID` INT UNSIGNED NOT NULL,
  `Copy_ID`   INT UNSIGNED NOT NULL,
  `Loan_Date` DATE NOT NULL,
  Order INT UNSIGNED NULL,
  CONSTRAINT `pk_bookloan` PRIMARY KEY (`Loan_ID`)
) ENGINE=InnoDB;


## TEST 4: FK insert violation (ERROR 1452)
# PASS criteria:
# [ ] Identifies that Copy_ID 99 doesn't exist in BookCopy
# [ ] Explains the parent-must-exist-first rule
# [ ] Mentions SET FOREIGN_KEY_CHECKS as an option but warns about data integrity

ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails
(`library`.`bookloan`, CONSTRAINT `fk_bookloan_copy` FOREIGN KEY (`Copy_ID`)
REFERENCES `BookCopy` (`Copy_ID`))

INSERT INTO `BookLoan` (`Member_ID`, `Copy_ID`, `Loan_Date`, `Due_Date`)
VALUES (1, 99, '2026-03-20', '2026-04-03');
