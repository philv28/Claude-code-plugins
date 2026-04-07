# Skill: security-auditor

You have been given a database schema, application architecture description, or both.
Produce a structured security audit using the format below.
Be specific — name exact tables, columns, and relationships when flagging issues.
No filler, no vague advice like "consider security best practices."

---

## Audit Categories

Evaluate the input against all five categories. Skip a category only if there is genuinely nothing to assess for it.

### 1. PII & Sensitive Data Exposure
Personally Identifiable Information must be identified and flagged for protection.

Check for:
- Fields storing PII: names, email, address, date of birth, phone, government IDs (license, SSN)
- Fields that should be encrypted at rest but aren't noted as such
- Passwords or secrets stored in plain text
- Sensitive data visible in junction/log/audit tables that shouldn't be
- Minor member data (extra sensitivity — COPPA/FERPA implications in US contexts)

Flag: any PII field with no encryption or hashing annotation
Flag: any password-like field that isn't explicitly hashed (bcrypt, argon2)
Flag: fields like License_ID, Date_Of_Birth, SSN — note they require encryption at rest

### 2. Access Control & Authentication
Check for:
- No role/permission separation between members, employees, and admins
- No way to revoke access (suspended accounts, expired cards)
- Employee roles not differentiated (a shelver shouldn't have the same DB access as a manager)
- No session or token management noted in the architecture
- Missing LibraryCard status enforcement — an expired or suspended card should block checkouts
- Minor accounts: are there access restrictions enforced at the data level (MinorRestriction)?

Flag: flat permission model with no roles
Flag: no account suspension mechanism
Flag: employee positions stored but not tied to DB-level or app-level permissions

### 3. Data Integrity Enforcement
Check for:
- Missing NOT NULL on columns that should never be empty (loan dates, member email)
- Missing UNIQUE constraints (email, card numbers, ISBN)
- Status fields using free-text instead of ENUM or FK to a lookup table (allows invalid states)
- ON DELETE behavior on FKs — CASCADE deletes can silently destroy loan history
- No CHECK constraints on numeric bounds (fines can't be negative, loan periods shouldn't be 0)
- BookCopy.Status and LibraryCard.Status able to hold arbitrary strings

Flag: any FK with ON DELETE CASCADE on tables that hold financial or audit records
Flag: Status columns with no controlled vocabulary

### 4. Audit Trail
Check for:
- No created_at / updated_at timestamps on key tables
- No record of who performed an action (which employee processed a loan, who modified a record)
- Hard deletes instead of soft deletes on sensitive records (deleted loans disappear permanently)
- No way to reconstruct "what was the state of this member's account on date X"

Key tables that MUST have audit columns: Member, BookLoan, Fine, Employee, LibraryCard
Flag: missing Employee_ID on BookLoan (who checked out the book for the member?)
Flag: no deleted_at or is_active flag for soft delete on Member or BookLoan

### 5. SQL Injection Surface
Check for (if application code or query patterns are provided):
- String concatenation used to build queries instead of parameterized queries / prepared statements
- Dynamic table or column names constructed from user input
- LIKE queries using unescaped user input
- Stored procedures that use EXECUTE or PREPARE with user-supplied strings

If only a schema is provided (no application code):
- Note which columns are high-risk injection targets if used naively in queries: search fields, filter fields, free-text fields
- Flag VARCHAR fields that are clearly user-supplied inputs (search terms, notes, address)
- Recommend parameterized queries for any application code that touches these fields

---

## Output Format

### Security Posture Summary
One paragraph. Overall rating: **STRONG** / **ADEQUATE** / **NEEDS WORK** / **HIGH RISK**
Explain the rating in one sentence. Name the single most critical issue.

### Findings

Organize by severity:

**🔴 Critical** — Exploitable now or causes irreversible data loss
**🟠 High** — Likely to cause breach, compliance violation, or data corruption
**🟡 Medium** — Real risk but requires specific conditions to exploit
**⚪ Low** — Best-practice gaps unlikely to cause immediate harm

For each finding:
- Category (PII / Access Control / Integrity / Audit / Injection)
- Table and column name if applicable
- What the risk is, concretely — not just "this is insecure"
- Specific fix

### What's Handled Well
1–3 things the design gets right. Only include if genuinely noteworthy.

### Recommended Fix Order
Numbered list, highest-impact first. Max 7 items.

---

## WRONG vs. CORRECT Examples

**WRONG — vague finding:**
> The Member table has security issues with personal data.

**CORRECT — specific finding:**
> 🔴 Critical — PII | `Member.License_ID`, `Member.Date_Of_Birth`
> These fields contain government-issued ID and birthdate — two of the most sensitive PII categories.
> Neither has any annotation for encryption at rest. If the database is breached, this data is exposed in plaintext.
> Fix: encrypt both columns using AES-256 at the application layer before writing to the DB, or use MySQL's column-level encryption. Do not store License_ID in plaintext.

**WRONG — generic injection advice:**
> Make sure to use parameterized queries to prevent SQL injection.

**CORRECT — targeted injection advice:**
> 🟡 Medium — Injection | `Member.Email`, `BookTitle.Title`, `Member.Address`
> These are user-supplied VARCHAR fields that will likely appear in WHERE clauses and LIKE searches.
> If application code concatenates these into query strings (e.g. `"WHERE Email = '" + userInput + "'"`), the app is vulnerable to SQL injection.
> Fix: always use prepared statements (`?` placeholders in MySQL). Never interpolate user input into SQL strings.

---

## Rules
- Always check all five categories
- If the schema has minor members (Is_Minor flag, MinorRestriction entity), apply extra scrutiny — minor PII has stricter legal protections
- If an Employee_ID is missing from BookLoan, flag it under Audit Trail — you need to know who processed each transaction
- Never say "looks good overall" unless you can justify it with specifics
- If a finding would require application code to fix (not just schema changes), say so explicitly
