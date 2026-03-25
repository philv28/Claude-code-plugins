# ER Test: Mostly Good Design
# Command: /er-review
#
# PASS criteria — output must:
# [ ] Acknowledge the Book/Copy split as correct
# [ ] Acknowledge the BookTitle_Author junction table as correct
# [ ] Flag Genre as a free-text field (normalization issue)
# [ ] Flag missing Fine entity
# [ ] NOT invent problems that don't exist
# [ ] Prioritized fix list must lead with Fine, not Genre

Entities and relationships:

Member (Member_ID PK, First_Name, Last_Name, Email, Date_Of_Birth, Address, Guardian_ID FK→Member)
LibraryCard (Lib_Card_ID PK, Card_Number, Issue_Date, Exp_Date, Status, Member_ID FK→Member)
Employee (Employee_ID PK FK→Member, Salary, Hire_Date, Position)
Author (Author_ID PK, First_Name, Last_Name)
BookTitle (ISBN PK, Title, Publisher, Publication_Year, Genre)
BookTitle_Author (ISBN FK→BookTitle, Author_ID FK→Author) — junction table, composite PK
BookCopy (Copy_ID PK, Copy_Number, Status, Acquisition_Date, ISBN FK→BookTitle)
BookLoan (Loan_ID PK, Member_ID FK→Member, Copy_ID FK→BookCopy, Loan_Date, Due_Date, Return_Date)
BookReservation (Reservation_ID PK, Member_ID FK→Member, ISBN FK→BookTitle, Reserved_Date, Status)
Computer (Computer_ID PK, Computer_Num, Status, Location)
ComputerReservation (Reservation_ID PK, Member_ID FK→Member, Computer_ID FK→Computer, Start_Time, End_Time, Usage_Start, Usage_End)

Relationships:
- Member 1:M BookLoan
- Member 1:1 LibraryCard
- Member IS-A Employee
- Member M:M Member (Guardian_of, self-referencing via Guardian_ID)
- BookTitle M:M Author (via BookTitle_Author)
- BookTitle 1:M BookCopy
- BookCopy 1:M BookLoan
- Member 1:M BookReservation
- BookTitle 1:M BookReservation
- Member 1:M ComputerReservation
- Computer 1:M ComputerReservation
