# Project Context

## Metadata

- **Language**: TypeScript
- **Runtime**: Bun
- **Package Manager**: Bun
- **CLI Framework**: Commander.js
- **Linter/Formatter**: Biome
- **Module System**: ESM

## Definitions

### Rubric

A rubric is the top-level evaluation framework for a project. It is composed of **Rubric Pillars**, each of which contains **Rubric Rules**. Running the rubric produces a scored report.

### Rubric Pillar

A category grouping related rules. Pillars are ordered and rendered in a fixed sequence:

1. Style & Validation
2. Build & Tasks
3. Testing
4. Documentation
5. Dev Environment
6. Code Quality
7. Observability
8. Security & Governance
9. Agent Compatibility

Pillar 9 (Agent Compatibility) checks for agent-specific configuration and signals (e.g., `AGENTS.md`, `.cursor/rules`, `.claude/agents`) that enhance autonomous agent effectiveness.

Each pillar receives its own score derived from its rules, and all 9 pillars contribute equally to the overall score.

### Rubric Rule

An individual check within a pillar. Each rule resolves to exactly one status:

| Status | Meaning |
|---|---|
| `pass` | Requirement fully met |
| `partial` | Requirement partially met (half credit) |
| `fail` | Requirement not met |

### Scoring

- **Rule score**: `pass` = 1, `partial` = 0.5, `fail` = 0
- **Pillar score** = sum of rule scores / count of rules (0.0–1.0)
- **Overall score** = average of all pillar scores (0.0–1.0)

### Agents Setup

The `agents setup` command installs and configures AI agent tooling (opencode, plugins, agents, skills) in a project. It performs two actions:

1. **Install** — installs the opencode CLI binary using the user's preferred package manager (bun or npm)
2. **Scaffold** — creates opencode configuration files (agents, skills, plugins)

**Project scope** (default): installs opencode as a dev dependency (`bun add -d opencode` / `npm install -D opencode`) and scaffolds `.opencode/` + `opencode.json` in the project root.

**Global scope** (`--global`): installs opencode globally (`bun install -g opencode` / `npm install -g opencode`) and scaffolds config in `~/.config/opencode/`.

### Agents Check

The `agents check` command validates the current AI agent configuration using its own rubric. It outputs results in md or json format, same as `project check`.

**Agent** in this context means a general-purpose coding agent (e.g., opencode, Cursor, Claude Code). The current implementation targets opencode exclusively; support for other agents may be added later.

#### Agents Check Pillars

1. Skills
2. MCPs
3. LSPs
4. Plugins
5. Agents
6. Tools
7. Formatters
8. Permissions
9. Sandboxes

### Abstack Config (`abstack.json` / `abstack.jsonc`)

A project-level configuration file that declares the project's tooling choices. Both `.json` and `.jsonc` (JSON with comments) formats are supported. If both exist, `.jsonc` takes precedence.

| Field | Type | Purpose |
|---|---|---|
| `formatter` | `("biome" \| "prettier")[]` | Configured formatters |
| `linter` | `("biome" \| "eslint" \| "oxlint")[]` | Configured linters |
| `lsp` | `("typescript" \| "gopls" \| "rust-analyzer" \| "pyright")[]` | Language servers |
| `staticAnalysis` | `("typescript" \| "oxlint")[]` | Static analysis tools |
| `test` | `("bun" \| "vitest" \| "jest" \| "pytest")[]` | Test runners |
| `ide` | `("zed" \| "vscode" \| "cursor" \| "windsurf")[]` | IDE/editor support |
| `agents.mcp` | `("expect" \| "codedb" \| "githits" \| "playwright" \| "filesystem" \| "github" \| "memory")[]` | MCP servers for agent use |
| `conformance.template` | `string` | Conformance check template |
| `conformance.overrides` | `{ id: string, reason: string, severity?: "off" \| "warn" \| "error" }[]` | Per-rule conformance overrides |

All fields are optional. An empty or missing config file defaults to `{}`.

### Conformance Overrides

Conformance overrides let users control how rules are surfaced in reports, without affecting scoring. All rules always run and always count in the denominator.

- **`error`** (default): rule runs normally, failure counts as `fail` in scoring
- **`warn`**: rule runs normally, scores the same, but is visually flagged as a warning in the report
- **`off`**: rule runs normally, scores the same (failure counts as `fail`), but is hidden from the report
