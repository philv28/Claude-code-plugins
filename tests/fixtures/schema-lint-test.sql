-- Schema lint test fixture
-- Contains intentional violations for testing all 8 rules

-- GOOD table: should produce zero issues
CREATE TABLE `Member` (
  `Member_ID`   INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `First_Name`  VARCHAR(100)    NOT NULL,
  `Last_Name`   VARCHAR(100)    NOT NULL,
  `Email`       VARCHAR(255)    NOT NULL,
  `Guardian_ID` INT UNSIGNED    NULL,
  CONSTRAINT `pk_member` PRIMARY KEY (`Member_ID`),
  CONSTRAINT `fk_member_guardian` FOREIGN KEY (`Guardian_ID`)
    REFERENCES `Member` (`Member_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_member_guardian` (`Guardian_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- BAD table: missing ENGINE, missing CHARSET, unnamed FK, missing FK index, bad PK name
CREATE TABLE `BookLoan` (
  `Loan_ID`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Member_ID` INT UNSIGNED NOT NULL,
  `Copy_ID`   INT UNSIGNED NOT NULL,
  `Loan_Date` DATE NOT NULL,
  `Due_Date`  DATE NOT NULL,
  `Return_Date` DATE NULL,
  CONSTRAINT `loan_pk` PRIMARY KEY (`Loan_ID`),
  FOREIGN KEY (`Member_ID`) REFERENCES `Member` (`Member_ID`),
  FOREIGN KEY (`Copy_ID`) REFERENCES `BookCopy` (`Copy_ID`)
);


-- BAD table: no primary key, no ENGINE
CREATE TABLE `Log` (
  `Message`    TEXT NOT NULL,
  `Created_At` DATETIME NOT NULL
);
