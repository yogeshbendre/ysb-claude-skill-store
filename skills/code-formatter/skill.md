# Format a source file

## Argument syntax

```
/code-formatter <file-path>
```

- `<file-path>` — required. The file to format.

Parse `$ARGUMENTS` as the file path, stripping surrounding quotes if present.

## Steps

### 1. Read and analyse the file

Read the file and identify its language from its extension (`.groovy` → Groovy/Jenkinsfile, `.py` → Python, `.sh` → Bash, `.yaml`/`.yml` → YAML, `.json` → JSON, `.js` → JavaScript, `.ts` → TypeScript, etc.).

### 2. Apply formatting

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
- Consistent indentation throughout the file
- No trailing whitespace on any line
- A single blank line at the end of the file
- Long lines broken sensibly at logical boundaries (operators, commas, pipeline steps)

Do not remove code, alter logic, or touch any header comment — those are handled by the separate `code-cleaner` and `code-header` skills.

### 3. Write back the result

Use the Edit or Write tool to save the reformatted content back to the target file, overwriting the original. Do not create a separate output file.

### 4. Report what changed

Summarize the key formatting changes applied (e.g. "re-indented 12 lines", "aligned assignment block at lines 20-24", "stripped trailing whitespace from 5 lines", "added final newline"). If the file already matched style conventions, say so explicitly.
