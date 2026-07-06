# Claude Skills Hub

A community repository of reusable [Claude Code](https://claude.ai/code) skills — shareable slash commands that encode repeatable workflows.

**[Browse the Skills Gallery →](https://yogeshbendre.github.io/ysb-claude-skill-store)**

## What is a Skill?

Claude Code skills are `.md` files placed in `.claude/commands/`. When you type `/<skill-name>` inside Claude Code, the file's content is used as a prompt. Skills let you encode and share repeatable workflows: code review, doc generation, test writing, and more.

## Quick Install

Find a skill in the [gallery](https://yogeshbendre.github.io/ysb-claude-skill-store) and click **Copy install** to get a one-line command:

```bash
mkdir -p .claude/commands && curl -o .claude/commands/code-reviewer.md \
  "https://raw.githubusercontent.com/yogeshbendre/ysb-claude-skill-store/main/skills/code-reviewer/skill.md"
```

Then invoke it inside Claude Code:

```
/code-reviewer src/payments.ts
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) to submit your own skill.

## Setting Up the Gallery

After creating your fork or repo:

1. Go to **Settings → Pages**
2. Set Source to **Deploy from a branch**
3. Choose **main** branch and **/docs** folder, then save

Your gallery will be live at `https://yogeshbendre.github.io/ysb-claude-skill-store` within a minute.

The GitHub Actions workflow auto-populates `repoOwner` and `repoName` in `docs/skills-index.json` on every push to `skills/`.

## Skills

| Skill | Description | Tags |
|---|---|---|
| [Code Reviewer](skills/code-reviewer/) | Reviews code for bugs, security, performance, and style | code, review, security, quality |
