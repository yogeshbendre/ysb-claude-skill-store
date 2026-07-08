# Write a standardized header for a source file

## Argument syntax

```
/code-header <file-path> [author="Name or email"] [summary="Short description"]
```

- `<file-path>` — required. The file to add or update a header on.
- `author="..."` — optional. Forces the header's `Author` field instead of auto-detecting it.
- `summary="..."` — optional. Forces the header's `Summary` field instead of analysing the file.

Parse `$ARGUMENTS` accordingly: the file path is the first token that is not one of the `key=value` flags above. Flag values may be wrapped in quotes — strip them before use.

## Steps

### 1. Read and analyse the file

Read the full contents of the target file. Identify:
- The file's language/type from its extension, to pick the correct comment style
- Any existing header comment and its `Author` field
- The overall purpose and high-level behaviour of the file

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

### 2. Write the header

Replace any existing header comment (or insert one at the very top) in the appropriate comment style for the language. Use the following template, filling in each field per the rules above. Include the `Co-Author` line **only** when an existing header author was kept and a new author was supplied via `author=` — omit it otherwise.

**For Groovy / Bash / JavaScript / TypeScript (block comment):**
```
// =============================================================================
// File     : <basename of the file>
// Author   : <resolved author>
// Co-Author: <new author from `author=`, only when an existing author was kept>
// Summary  : <resolved summary>
// =============================================================================
```

**For Python (block comment):**
```python
# =============================================================================
# File     : <basename of the file>
# Author   : <resolved author>
# Co-Author: <new author from `author=`, only when an existing author was kept>
# Summary  : <resolved summary>
# =============================================================================
```

**For YAML / JSON** — add a leading comment block (YAML supports `#` comments; for JSON, place a `_comment` key at the top if comments are not supported, or skip if the schema forbids it):
```yaml
# =============================================================================
# File     : <basename of the file>
# Author   : <resolved author>
# Co-Author: <new author from `author=`, only when an existing author was kept>
# Summary  : <resolved summary>
# =============================================================================
```

**For Markdown** — add a leading HTML comment block (invisible when rendered):
```
<!-- =============================================================================
     File     : <basename of the file>
     Author   : <resolved author>
     Co-Author: <new author from `author=`, only when an existing author was kept>
     Summary  : <resolved summary>
     ============================================================================= -->
```

Do not reformat the rest of the file or remove any code — those are handled by the separate `code-cleaner` and `code-formatter` skills.

### 3. Write back the result

Use the Edit or Write tool to save the file with its new/updated header, overwriting the original. Do not create a separate output file.

### 4. Report what changed

State what was written in the `Author`/`Co-Author` fields and whether each came from the `author=` argument, an existing header, or auto-detection, and likewise for `Summary`.
