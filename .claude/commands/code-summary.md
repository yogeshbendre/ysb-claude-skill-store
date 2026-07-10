# Summarize the intent of a source file

## Argument syntax

```
/code-summary <file-path>
```

- `<file-path>` — required. The file to summarize. Parse it from `$ARGUMENTS`, stripping any surrounding quotes.

If no path is given, or the path does not exist, say so and stop — do not guess a file.

## Steps

### 1. Read and analyse the file

Read the full contents of the target file. Focus on intent, not mechanics:
- What problem this file exists to solve, or what role it plays in the larger system
- The main entry points (functions, classes, endpoints) and how they work together toward that purpose
- Any non-obvious design choices, assumptions, or constraints visible in the code

Do not narrate the file line by line or restate what individual statements do — that's implementation detail, not intent.

### 2. Write the summary

Produce a **4 to 5 line** summary in plain prose (no headings, no bullet list) that explains:
- Why the file exists / what it's responsible for
- How it achieves that at a high level
- Any dependencies, side effects, or integration points worth knowing before touching the code

Keep it tight — 4 to 5 lines total, not per section. If the file is trivial (e.g. a small config or constants file), a shorter summary is fine; do not pad it to hit the line count.

### 3. Report

Output the summary directly as your response, prefixed with the file path. Do not modify the target file or write any output file.
