# @abstack/cli

Evaluate and scaffold your project for modern developer workflows — with opinionated defaults you can extend.

`abstack` checks your project against built-in pillar-based rubrics and reports a conformance score. No configuration required — run it against any repo and get immediate results. Add an `abstack.jsonc` to customize which tools and conventions your project uses.

## Features

- **Project conformance checks** — score your repo against 9 built-in pillars (style, build, testing, docs, dev environment, code quality, observability, security, agent compatibility)
- **Agent configuration checks** — audit your AI agent setup across 9 pillars (skills, MCPs, LSPs, plugins, agents, tools, formatters, permissions, sandboxes)
- **Zero config** — built-in rubrics apply automatically; customize via `abstack.jsonc` when needed
- **Dual output** — Markdown (human-friendly) or JSON (machine-readable) reports
- **Scoring engine** — pass / partial / fail rules with per-pillar and overall scores

## Quick Start

```bash
# Run without installing
bunx @abstack/cli project check
bunx @abstack/cli agents check

# Or install globally
bun add -g @abstack/cli
abstack project check
abstack agents check --format json
```

## Commands

### `project check`

Run project conformance checks and output a scored report.

```bash
abstack project check [options]
```

| Flag | Default | Description |
|------|---------|-------------|
| `-f, --format <format>` | `md` | Output format: `json` or `md` |
| `-r, --root <path>` | `process.cwd()` | Project root directory |

### `agents check`

Check AI agent configuration and output a scored report.

```bash
abstack agents check [options]
```

| Flag | Default | Description |
|------|---------|-------------|
| `-f, --format <format>` | `md` | Output format: `json` or `md` |
| `-r, --root <path>` | `process.cwd()` | Project root directory |

## Scoring

Each check evaluates your project against a set of **pillars**, each containing multiple **rules**. Every rule has one of three statuses:

| Status | Score | Meaning |
|--------|-------|---------|
| `pass` | 1 | Requirement fully met |
| `partial` | 0.5 | Partially met |
| `fail` | 0 | Not met |

- **Pillar score** = sum of rule scores / number of rules
- **Overall score** = average of all pillar scores (pillars with no rules are excluded)

### Project Check Pillars

| Pillar | Focus |
|--------|-------|
| Style & Validation | Formatting, linting config |
| Build & Tasks | Build scripts, task runners |
| Testing | Test framework, coverage |
| Documentation | README, API docs, changelogs |
| Dev Environment | Editor config, git hooks, env setup |
| Code Quality | Type checking, static analysis |
| Observability | Logging, monitoring, tracing |
| Security & Governance | Dependency audits, secrets, permissions |
| Agent Compatibility | AI tooling readiness, config files |

### Agents Check Pillars

| Pillar | Focus |
|--------|-------|
| Skills | Agent skills configuration |
| MCPs | Model Context Protocol servers |
| LSPs | Language server integrations |
| Plugins | Plugin system setup |
| Agents | Agent definitions |
| Tools | Tool integrations |
| Formatters | Formatter availability and config |
| Permissions | Permission policies |
| Sandboxes | Sandbox and isolation config |

## Configuration

Place an `abstack.jsonc` (or `abstack.json`) in your project root. JSONC is supported — use `//` and `/* */` comments.

No config file is required. Built-in rubrics apply automatically. Add a config file to declare your project's tooling choices.

### Schema

```jsonc
{
  "$schema": "./node_modules/abstack/schema.json",

  "formatter": ["biome"],              // "biome" | "prettier"
  "linter": ["biome"],                 // "biome" | "eslint" | "oxlint"
  "ide": ["vscode"],                   // "zed" | "vscode" | "cursor" | "windsurf"
  "lsp": ["typescript"],               // "typescript" | "gopls" | "rust-analyzer" | "pyright"
  "staticAnalysis": ["typescript"],    // "typescript" | "oxlint"
  "test": ["bun"],                     // "bun" | "vitest" | "jest" | "pytest"

  "agents": {
    "mcp": ["github", "filesystem"]    // "expect" | "codedb" | "githits" | "playwright" | "filesystem" | "github" | "memory"
  }
}
```

All fields are optional. An empty or missing config is valid — built-in rubrics apply regardless.

## Development

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev
bunx @biomejs/biome check .
bunx @biomejs/biome check --write .
bun test
```

## License

MIT
