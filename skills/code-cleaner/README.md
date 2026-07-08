# Code Cleaner

Removes dead code, unused variables/functions, and duplicate logic from a source file — then writes the result back in place.

## Usage

```
/code-cleaner src/deploy.sh
/code-cleaner pipeline.groovy
```

- `<file-path>` — required. The file to clean up.

## What It Does

- **Analyzes** the file's language from its extension
- **Identifies dead code** — commented-out blocks, unused variables/parameters/functions, duplicate logic, unreachable statements
- **Removes it**, while preserving meaningful inline comments that explain *why* something is done
- Leaves formatting and any header comment untouched — pair with [Code Formatter](../code-formatter/) and [Code Header](../code-header/) for those

## Output

Overwrites the target file in place, then reports:
- Each removed block, its original line number(s), and the reason it was removed
- Total number of lines removed
- If no dead code is found, says so and leaves the file untouched
