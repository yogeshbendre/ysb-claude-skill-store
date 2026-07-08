# Onboard a skill into the Claude Skill Store

## Argument syntax

```
/skill-store-push <path-to-skill-file-or-folder>
```

- `<path-to-skill-file-or-folder>` — required. Path to the skill to onboard. May be:
  - A single command-style `.md` file (e.g. `.claude/commands/beautify.md`)
  - A folder containing a Claude Code Agent Skill (`SKILL.md` with YAML frontmatter), optionally with supporting resource files
  - An already-partial `skill.json`/`skill.md` pair

Parse `$ARGUMENTS` as this path, stripping surrounding quotes if present.

## Steps

### 0. Verify you're in the right repo

Confirm the current working directory is inside a clone of this store (Claude Skill Store): use `git rev-parse --show-toplevel` to find the repo root, then check that `skills/`, `CONTRIBUTING.md`, and `docs/skills-index.json` exist there. If any are missing, stop and tell the user this skill must be run from a clone of the Claude Skill Store repo — do not create files elsewhere.

### 1. Read the source skill

Read the file or folder at the given path.
- If it's a single `.md` file, treat its entire content as the prompt body.
- If it's a folder, look for `SKILL.md` first (Agent Skill format — parse any YAML frontmatter for `name`/`description` metadata), otherwise fall back to `skill.md` or the first `.md` file found.
- Note any other files in the folder (scripts, templates, resources) — these must be carried over alongside the skill in Step 4.

### 2. Derive metadata

From the source content and filename/foldername, derive:

- **id** — kebab-case, from the source filename/foldername (strip `.md` and any `SKILL` casing). Confirm it looks reasonable; ask the user if the source name is unclear or not already kebab-case.
- **name** — Title Case version of the id, unless the source frontmatter already provides a clear display name.
- **description** — one line, under 120 characters, summarizing what the skill does. Write your own from analysis of the instructions; don't copy a verbose source description verbatim.
- **version** — `"1.0.0"` unless the source specifies its own version.
- **tags** — 3–5 lowercase tags reflecting what the skill does.
- **domain** — a broad category. First read every `skills/*/skill.json` in this repo and collect the existing `domain` values — reuse one of those if it genuinely fits, to keep the taxonomy consistent. Only propose a new domain if none of the existing ones fit.
- **author** — default to the current session user (the `userEmail` in your session context, mapped to a GitHub username if you can reasonably infer one), falling back to `git config user.name` / `user.email`. Never guess a specific person's identity beyond what's derivable from session context or git config.
- **authorUrl** — `https://github.com/<author>` when `author` looks like a GitHub username.
- **license** — default to `"MIT"` to match the rest of this repo's skills, unless told otherwise.
- **createdAt** / **updatedAt** — today's date in `YYYY-MM-DD` format.

**Ask the user directly instead of guessing whenever:**
- The derived `id` would collide with an existing folder under `skills/`.
- `domain` doesn't clearly match any existing value and inventing a new one doesn't feel confident.
- `author` cannot be confidently resolved from session context or git config.
- The source skill's scope or purpose is ambiguous enough that the `description`/`tags` you'd write feel like a guess rather than an analysis.

### 3. Convert the skill body

Produce the `skill.md` content:
- If the source used Agent Skill frontmatter (`SKILL.md`), strip the frontmatter and keep the instructional body — do not summarize or shorten the behavior it describes.
- If the source already used `$ARGUMENTS`, keep that convention. If it took arguments some other way, adapt the argument-parsing instructions to use `$ARGUMENTS`, per this repo's convention (see `CONTRIBUTING.md`).
- Note any supporting files from Step 1 that must be carried over unchanged, with their relative references preserved.

### 4. Write the files

Create `skills/<id>/` containing:
- `skill.json` — per the schema in `CONTRIBUTING.md`, with all fields from Step 2.
- `skill.md` — the converted body from Step 3.
- `README.md` — following the pattern of existing skills (see `skills/beautify/README.md` for a worked example): title, one-line description, `## Usage` with example invocations, `## What It Does` bullets, `## Output` section.
- Any supporting files carried over from Step 1/3.

If `skills/<id>/` already exists, confirm with the user before overwriting anything in it.

### 5. Update the root README

Add a new row to the skills table in this repo's root `README.md`, keeping the table alphabetically sorted by skill name and matching the existing row format exactly.

Do not hand-edit `docs/skills-index.json` — the GitHub Actions workflow regenerates it automatically on push to `skills/`.

### 6. Report and offer to push

Summarize what was created or changed: the new `skills/<id>/` files and the README update — the equivalent of `git status --short` for these paths.

Then explicitly ask: **"Would you like me to commit and push this to the store repo now?"**

- If yes: run `git fetch origin` and check whether `origin/main` has diverged from the local branch; if so, rebase before pushing. Stage exactly the files this run created or modified, commit with a message summarizing the onboarded skill, and push.
- If no: leave the changes uncommitted and tell the user which files to review before pushing themselves.

Never run `git push` without this explicit confirmation for this run, even if the user approved a push earlier in the session.
