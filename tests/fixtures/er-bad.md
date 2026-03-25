# ER Test: Multiple Serious Problems
# Command: /er-review
#
# PASS criteria — output must:
# [ ] Flag that Book and BookCopy are conflated (no separation of title vs physical copy)
# [ ] Flag that Author is stored as a string field (not a separate entity)
# [ ] Flag that BookLoan has no link to a specific copy — only to Book
# [ ] Flag missing Fine entity
# [ ] Flag missing Reservation entity
# [ ] NOT be vague — must name specific attributes and tables

Entities and relationships:

Member (Member_ID PK, First_Name, Last_Name, Email, Phone, Address)
Book (Book_ID PK, Title, Author, Genre, ISBN, Publisher, Year, Status)
BookLoan (Loan_ID PK, Member_ID FK→Member, Book_ID FK→Book, Loan_Date, Due_Date, Return_Date)
LibraryCard (Card_ID PK, Member_ID FK→Member, Expiry_Date)
Computer (Computer_ID PK, Location, Status)
ComputerBooking (Booking_ID PK, Member_ID FK→Member, Computer_ID FK→Computer, Date, Start_Time, End_Time)

Relationships:
- Member 1:M BookLoan
- Member 1:1 LibraryCard
- Book 1:M BookLoan
- Member 1:M ComputerBooking
- Computer 1:M ComputerBooking
