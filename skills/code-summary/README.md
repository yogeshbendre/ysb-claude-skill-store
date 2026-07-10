# Code Summary

Generates a quick 4-5 line summary explaining the intent of a source file — why it exists and how it achieves its purpose, not a line-by-line narration.

## Usage

```
/code-summary src/payments.ts
```

- `<file-path>` — required. The file to summarize.

## What It Does

- **Reads the target file** and identifies its purpose, main entry points, and any non-obvious design choices
- **Writes a 4-5 line prose summary** focused on intent and high-level behavior, skipping mechanical, line-by-line description
- **Read-only** — never modifies the target file or writes an output file; the summary is returned directly as the response

## Output

A short summary (4-5 lines), prefixed with the file path, printed to the conversation.
