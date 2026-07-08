# Beautify

Cleans up dead code, applies language-aware formatting, and inserts a standardized file header into a source file — then writes the result back in place.

## Usage

```
/beautify src/deploy.sh
/beautify pipeline.groovy author="Jane Doe"
/beautify config.yaml summary="Defines the staging cluster topology"
/beautify script.py nocleanup
```

- `<file-path>` — required. The file to beautify.
- `author="..."` — optional. Forces the header's `Author` field instead of auto-detecting it. If the file already has an author in its header, the passed value is added as `Co-Author` instead of replacing it.
- `summary="..."` — optional. Forces the header's `Summary` field instead of analyzing the file.
- `nocleanup` — optional flag. Skips dead-code removal; only formatting and the header are applied.

## What It Does

- **Analyzes** the file's language from its extension and reads any existing header comment
- **Removes dead code** — unreachable blocks, unused variables/functions, duplicate logic (skipped when `nocleanup` is passed)
- **Formats consistently** per language: Groovy, Python (PEP-8), Bash, YAML, JSON, JavaScript/TypeScript, and other languages via community-standard style
- **Writes a standard header** with `File`, `Author`, `Co-Author` (when applicable), and `Summary` fields, using the correct comment syntax for the language (block comments, `#`, or HTML comments for Markdown)

## Output

Overwrites the target file in place, then reports:
- Whether cleanup ran or was skipped, and how many lines were removed
- Key formatting changes applied
- Where the `Author`/`Co-Author` and `Summary` values came from (the `author=`/`summary=` arguments, an existing header, or auto-detection)
