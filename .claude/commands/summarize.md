---
description: Summarize the contents of a file in plain language
argument-hint: <file-path>
allowed-tools: Read
---

The user wants a plain-language summary of a file. The argument is the file path: $ARGUMENTS

Steps:
1. Read the file at the path provided.
2. Identify what kind of file it is (code, config, documentation, data, etc.).
3. Write a summary with three parts:
   - **What it is**: one sentence describing the file's purpose
   - **What it contains**: bullet list of the main sections, functions, or concepts (max 7 bullets)
   - **Key detail**: one insight that isn't obvious from the filename alone

Rules:
- Do not quote large blocks of the file back at the user — summarize, don't echo
- If the file does not exist, say so clearly and stop
- Keep the whole response under 200 words
