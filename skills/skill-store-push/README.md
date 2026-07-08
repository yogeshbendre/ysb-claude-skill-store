# Skill Store Push

Converts an existing skill — a single command `.md` file or a Claude Code Agent Skill folder — into this repo's `skill.json` / `skill.md` / `README.md` format, asks about any ambiguous metadata instead of guessing, and optionally commits and pushes the result.

## Usage

```
/skill-store-push /path/to/other-repo/.claude/commands/my-command.md
/skill-store-push /path/to/other-repo/.claude/skills/my-skill/
```

Must be run from inside a clone of this repository (Claude Skill Store) — it writes directly into its `skills/` folder and, if you confirm, commits and pushes from there.

## What It Does

- Reads the source `.md` file or Agent Skill folder, including any supporting resource files
- Derives `id`, `name`, `description`, `version`, `tags`, `domain`, `author`, `authorUrl`, and `license` — reusing existing `domain` values from other skills in this repo where they genuinely fit
- Asks you directly instead of guessing whenever a field is ambiguous: `id` collisions, an unclear `domain`, an unresolvable `author`, or an unclear scope
- Converts the skill body to this repo's `$ARGUMENTS` convention when needed, and writes `skills/<id>/skill.json`, `skill.md`, and `README.md`
- Adds an alphabetically-sorted row to the skills table in the root `README.md`

## Output

A summary of the files created or changed, followed by an explicit prompt asking whether to commit and push to the store repo now. It never pushes without that confirmation — even later in the same session.
