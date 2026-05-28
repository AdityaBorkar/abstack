---
name: write-readme
description: Write or update a project README.md by exploring the codebase and interviewing the user about intent, audience, and design decisions. Use when user asks to write, create, update, or improve a README, or says "write a readme", "update readme", "improve readme".
---

# Write README

Produce a README that accurately reflects what the codebase *actually does* — not what it aspires to do.

## Phase 1 — Explore

Read the codebase before writing a single word.

- [ ] Package manifest (package.json, Cargo.toml, pyproject.toml, etc.)
- [ ] Entry points and CLI definitions
- [ ] Config types and schemas — these define the user-facing surface
- [ ] All commands/subcommands and their flags
- [ ] Source structure — what modules exist and what they do
- [ ] Existing README (if any) — what it gets right and wrong
- [ ] Git log of README changes (if repo is git) — what evolved

**Cross-reference claims against code.** If the code contradicts what the old README says, flag it.

## Phase 2 — Interview

Ask the user one question at a time. Do not batch. Wait for each answer before continuing.

### Mandatory questions

1. **Audience** — Who is the primary reader? (e.g. developer discovering the tool, contributor, AI agent)
2. **Problem** — What pain does this solve? Why would someone reach for it?
3. **Defaults** — Does it work with zero config? Or must everything be specified?
4. **Finished vs aspirational** — Which commands/features are done and which are stubs?
5. **Extensibility** — How does the user customize? Config file? Plugins? Templates?

### Principle: only document finished features

If a command prints a stub message, if a config field is defined in types but never consumed, if a feature is in a TODO — **omit it**. The README documents what exists.

If the user insists on including aspirational features, push back once. If they insist again, comply but mark it clearly.

### Resolve contradictions

If the user says something the code contradicts, surface it immediately:
> "You said X, but the code does Y — which is correct?"

If the user uses two terms for the same thing, propose one canonical term.

## Phase 3 — Write

### Structure

1. **Title + one-liner** — what it is and why it exists
2. **Features** — bullet list, each one a concrete capability
3. **Quick Start** — the fastest path to a result (install + one command)
4. **Commands** — each command with flags table
5. **Scoring/Architecture** — only if the tool has an internal model worth explaining
6. **Configuration** — schema with inline comments, valid values
7. **Development** — how to set up, lint, test
8. **License**

Omit any section that has no content. Do not pad.

### Writing rules

- Lead with the problem, not the API
- No aspirational language ("coming soon", "will support", "planned")
- Config examples show valid values as inline comments
- Flags tables use consistent format: `Flag | Default | Description`
- Explain the scoring/evaluation model if one exists — readers need to understand what the numbers mean
- No project structure diagram unless the codebase is large and non-obvious
- Keep development section minimal — just the commands

## Phase 4 — Verify

- [ ] Every command in the README exists in the code
- [ ] Every config field in the README exists in the types
- [ ] No stubs or TODOs documented as working features
- [ ] No contradictions between README and code
- [ ] Run linter/formatter if the project has one
