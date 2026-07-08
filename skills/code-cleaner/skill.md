# Remove dead code from a source file

## Argument syntax

```
/code-cleaner <file-path>
```

- `<file-path>` — required. The file to clean up.

Parse `$ARGUMENTS` as the file path, stripping surrounding quotes if present.

## Steps

### 1. Read and analyse the file

Read the full contents of the target file and identify its language from its extension. Locate:
- Commented-out code blocks that are clearly dead (not explanatory comments)
- Unused variables, parameters, or functions that are never referenced
- Duplicate or redundant logic
- Unreachable code (e.g. statements after an unconditional `return`/`exit`/`throw`)

Keep all meaningful inline comments that explain *why* something is done — only remove comments that are themselves dead code.

### 2. Remove the dead code

Delete each identified block. Do not change formatting, indentation, or any header comment — those are handled by the separate `code-formatter` and `code-header` skills.

### 3. Write back the result

Use the Edit or Write tool to save the cleaned content back to the target file, overwriting the original. Do not create a separate output file.

### 4. Report what changed

List each removed block with its original line number(s) and a one-line reason (unused variable, unreachable code, duplicate logic, dead comment, etc.), plus the total number of lines removed.

If no dead code is found, say so explicitly and leave the file untouched.
