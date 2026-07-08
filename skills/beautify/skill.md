<!-- =============================================================================
     File    : beautify.md
     Author  : Yogesh Bendre
     Summary : Defines the /beautify Claude Code custom command. When invoked
               with a file path (and optional author/summary/nocleanup
               arguments), it reads the file, optionally removes dead code,
               applies language-appropriate formatting, inserts a standard
               file header, and writes the cleaned result back in place.
     ============================================================================= -->

# Beautify a source file

## Argument syntax

```
/beautify <file-path> [author="Name or email"] [summary="Short description"] [nocleanup]
```

- `<file-path>` — required. The file to beautify.
- `author="..."` — optional. Forces the header's `Author` field instead of auto-detecting it.
- `summary="..."` — optional. Forces the header's `Summary` field instead of analysing the file.
- `nocleanup` — optional bare flag (no value). Skips the dead-code-removal step entirely; only formatting and the header are applied.

Parse `$ARGUMENTS` accordingly: the file path is the first token that is not one of the `key=value` flags above and not the bare `nocleanup` flag. Flag values may be wrapped in quotes — strip them before use.

Beautify the file at the parsed file path.

## Steps

### 1. Read and analyse the file

Read the full contents of the target file. Identify:
- The file's language / type from its extension (e.g. `.groovy` → Groovy/Jenkinsfile, `.py` → Python, `.sh` → Bash, `.yaml`/`.yml` → YAML, `.json` → JSON, `.js` → JavaScript, `.ts` → TypeScript, etc.)
- The author, if already present in an existing header comment.
- The overall purpose and high-level behaviour of the file.
- Any dead / unreachable / commented-out code blocks that serve no active purpose (skip this identification if `nocleanup` was passed).

**Determining the header author:**
- If `author=` was passed:
  - If the file has **no** existing header author, use the passed value as `Author`.
  - If the file **already has** an existing header author, keep that original value as `Author` and add the passed value as a new `Co-Author` line.
- If `author=` was **not** passed:
  - Use the author already present in an existing header comment, if any.
  - Otherwise, determine a default from the current Claude Code session's user (the `userEmail` supplied in your session context). If that is unavailable, fall back to `git config user.name` (or `git config user.email` if the name is unset). Never hardcode a specific person's name.

**Determining the header summary:**
- If `summary=` was passed, use it verbatim as the `Summary` field — do not analyse the file to write your own.
- Otherwise, write the Summary yourself based on your analysis of the file's purpose and behaviour. Do not copy an existing description verbatim unless it is already accurate and complete.

### 2. Remove unused code

**Skip this step entirely if `nocleanup` was passed** — leave all existing code as-is and proceed straight to formatting.

Otherwise, delete:
- Commented-out code blocks that are clearly dead (not explanatory comments).
- Unused variables, parameters, or functions that are never referenced.
- Duplicate or redundant logic.

Keep all meaningful inline comments that explain *why* something is done.

### 3. Format and align the code

Apply clean, consistent formatting suited to the file's language:

| Extension        | Style rules |
|------------------|-------------|
| `.groovy`        | 4-space indent; align `=` in adjacent assignment blocks; one blank line between top-level blocks; closing `}` on its own line |
| `.py`            | PEP-8: 4-space indent, 79-char line limit, two blank lines between top-level definitions |
| `.sh`            | 2-space indent; `[[` over `[`; consistent quoting |
| `.yaml` / `.yml` | 2-space indent; no trailing spaces; blank line between top-level keys |
| `.json`          | 2-space indent; no trailing commas |
| `.js` / `.ts`    | 2-space indent; single quotes; semicolons |
| Other            | Apply the most widely accepted community style for the detected language |

Ensure:
- Consistent indentation throughout the file.
- No trailing whitespace on any line.
- A single blank line at the end of the file.
- Long lines broken sensibly at logical boundaries (operators, commas, pipeline steps).

### 4. Write a file header

Replace any existing header comment (or insert one at the very top) in the appropriate comment style for the language. Use the following template, filling in each field per the rules in Step 1. Include the `Co-Author` line **only** when Step 1 determined one applies (an existing header author was kept and a new author was supplied via `author=`) — omit it otherwise.

**For Groovy / Bash / JavaScript / TypeScript (block comment):**
```
// =============================================================================
// File     : <basename of the file>
// Author   : <resolved author — see "Determining the header author">
// Co-Author: <new author from `author=`, only when an existing author was kept>
// Summary  : <resolved summary — see "Determining the header summary">
// =============================================================================
```

**For Python (block comment):**
```python
# =============================================================================
# File     : <basename of the file>
# Author   : <resolved author — see "Determining the header author">
# Co-Author: <new author from `author=`, only when an existing author was kept>
# Summary  : <resolved summary — see "Determining the header summary">
# =============================================================================
```

**For YAML / JSON** — add a leading comment block (YAML supports `#` comments; for JSON, place a `_comment` key at the top if comments are not supported, or skip if the schema forbids it):
```yaml
# =============================================================================
# File     : <basename of the file>
# Author   : <resolved author — see "Determining the header author">
# Co-Author: <new author from `author=`, only when an existing author was kept>
# Summary  : <resolved summary — see "Determining the header summary">
# =============================================================================
```

**For Markdown** — add a leading HTML comment block (invisible when rendered):
```
<!-- =============================================================================
     File     : <basename of the file>
     Author   : <resolved author — see "Determining the header author">
     Co-Author: <new author from `author=`, only when an existing author was kept>
     Summary  : <resolved summary — see "Determining the header summary">
     ============================================================================= -->
```

### 5. Write back the result

Use the Edit or Write tool to save the fully beautified content back to the target file. Do not create a separate output file — overwrite the original.

### 6. Report what changed

After saving, give the user a brief summary:
- Whether cleanup ran or was skipped (`nocleanup`), and if it ran, the number of lines removed (dead code, blank-line cleanup).
- Key formatting changes applied.
- What was written in the `Author` / `Co-Author` fields and whether each came from the `author=` argument, an existing header, or auto-detection.
- What was written in the `Summary` field and whether it came from the `summary=` argument or your own analysis.
