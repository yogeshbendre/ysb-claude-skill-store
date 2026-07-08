# Code Header

Inserts or updates a standardized file header — `File`, `Author`, `Co-Author`, and `Summary` fields — in the correct comment style for the file's language.

## Usage

```
/code-header src/deploy.sh
/code-header pipeline.groovy author="Jane Doe"
/code-header config.yaml summary="Defines the staging cluster topology"
```

- `<file-path>` — required. The file to add or update a header on.
- `author="..."` — optional. Forces the header's `Author` field. If the file already has an author in its header, the passed value is added as `Co-Author` instead of replacing it.
- `summary="..."` — optional. Forces the header's `Summary` field instead of analyzing the file.

## What It Does

- **Detects the language** from the file extension to pick the right comment syntax (block comments, `#`, or HTML comments for Markdown)
- **Resolves the author**: existing header → `author=` argument → current session user → git config, in that priority order
- **Resolves the summary**: `summary=` argument if given, otherwise written from analysis of the file's purpose
- Leaves code logic and formatting untouched — pair with [Code Cleaner](../code-cleaner/) and [Code Formatter](../code-formatter/) for those

## Output

Overwrites the target file in place, then reports where the `Author`/`Co-Author` and `Summary` values came from.
