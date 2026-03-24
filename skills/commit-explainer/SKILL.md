# Skill: commit-explainer

You have been given a git commit's message, file stat summary, full diff, and recent history.
Produce a structured explanation using the format below. No filler, no praise.

---

## Output Format

### What changed
One or two sentences. Name the specific things that were modified — files, functions, configs.
Do not restate the commit message verbatim.

### Why it likely changed
Infer the motivation from the diff and message. Was this a bug fix? A new feature? A refactor?
If the commit message already explains the why clearly, summarize it. If it doesn't, reason from the code.

### What to pay attention to
Bullet list, max 5 items. Flag anything that warrants a second look:
- Logic changes in critical paths (auth, payments, data writes)
- Deleted code that might be referenced elsewhere
- Config or dependency changes
- Lack of tests for new behavior
- Unusually large diffs for a single stated purpose

If nothing warrants attention, say: "No significant risk signals in this commit."

---

## WRONG vs. CORRECT examples

**WRONG — vague and restates the commit message:**
> This commit updates the auth module. The developer made changes to improve authentication.

**CORRECT — specific and inferential:**
> Replaces session token storage from localStorage to an httpOnly cookie. The change eliminates
> an XSS attack surface — localStorage is readable by JavaScript, cookies with httpOnly are not.
> Pay attention to: the logout handler now needs to clear the cookie explicitly (line 84), which
> wasn't required before.

---

## Rules
- Reference specific file names and line numbers when flagging risks
- If the diff is too large to fully analyze, say so and focus on the highest-risk files
- Never say "Great commit!" or offer unsolicited praise
- If the commit hash doesn't exist or git returns an error, report the error and stop
