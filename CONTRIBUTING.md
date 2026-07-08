# Contributing a Skill

Thank you for contributing to Claude Skill Store! Follow these steps to add your skill to the gallery.

## Skill Structure

Create a folder under `skills/` using a kebab-case name that matches your skill's `id` field:

```
skills/
  your-skill-name/
    skill.json     ← required: metadata
    skill.md       ← required: the Claude skill definition
    README.md      ← recommended: usage docs and examples
    preview.png    ← optional: thumbnail image
```

## skill.json Reference

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Kebab-case identifier — must match the folder name |
| `name` | Yes | Human-readable name (title case) |
| `description` | Yes | One-line description, under 120 characters |
| `version` | Yes | Semantic version string, e.g. `"1.0.0"` |
| `author` | Yes | Your GitHub username |
| `tags` | Yes | Array of lowercase tag strings, e.g. `["code", "review"]` |
| `authorUrl` | No | URL to your GitHub profile |
| `domain` | No | Broad category the skill belongs to, e.g. `"Code Formatting"`, `"Code Quality"`, `"Documentation"` — used to power the gallery's filter panel |
| `license` | No | SPDX license identifier, e.g. `"MIT"` |
| `createdAt` | No | Creation date in `YYYY-MM-DD` format |
| `updatedAt` | No | Last update date in `YYYY-MM-DD` format |

### Example

```json
{
  "id": "doc-writer",
  "name": "Doc Writer",
  "description": "Generates clear API documentation from source code and inline comments.",
  "version": "1.0.0",
  "author": "your-github-username",
  "authorUrl": "https://github.com/your-github-username",
  "domain": "Documentation",
  "tags": ["docs", "api", "writing"],
  "license": "MIT",
  "createdAt": "2026-07-01",
  "updatedAt": "2026-07-01"
}
```

## skill.md Format

This file is the Claude Code command. Its content is injected as a prompt when a user invokes `/<skill-id>` inside Claude Code. You may use `$ARGUMENTS` as a placeholder for any text the user types after the command name.

Keep it focused: describe what Claude should do and how to structure its output. See [skills/code-reviewer/skill.md](skills/code-reviewer/skill.md) for a worked example.

## Testing Locally

1. Copy your `skill.md` to `.claude/commands/<your-skill-id>.md` inside any project
2. Open Claude Code in that project and type `/<your-skill-id>` to invoke it
3. Verify the output is correct and the instructions are followed as expected

## Submitting

1. Fork this repository
2. Add your skill folder under `skills/`
3. Open a pull request and fill in the PR template
4. A maintainer will review and merge

Once merged, the GitHub Actions workflow automatically rebuilds `docs/skills-index.json` and the gallery reflects your skill within seconds.
