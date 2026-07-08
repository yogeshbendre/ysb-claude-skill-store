# Code Formatter

Applies consistent, language-aware formatting to a source file — without changing its logic — then writes the result back in place.

## Usage

```
/code-formatter src/deploy.sh
/code-formatter pipeline.groovy
```

- `<file-path>` — required. The file to format.

## What It Does

- **Detects the language** from the file extension and applies its style rules — Groovy, Python (PEP-8), Bash, YAML, JSON, JavaScript/TypeScript, and community-standard style for anything else
- **Normalizes** indentation, alignment, trailing whitespace, and blank lines
- Leaves code logic and any header comment untouched — pair with [Code Cleaner](../code-cleaner/) and [Code Header](../code-header/) for those

## Output

Overwrites the target file in place, then reports the key formatting changes applied (e.g. re-indented lines, aligned assignment blocks, stripped trailing whitespace). If the file already matched style conventions, says so explicitly.
