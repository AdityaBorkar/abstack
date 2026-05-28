# AGENTS.md

## What This Repo Is

An **OpenCode plugin** (`@abstack/harness`) that receives OpenCode events and persists them to a local SQLite database via Drizzle ORM. Not a standalone app.

## Runtime & Package Manager

- **Bun only** — runtime uses `bun:sqlite`, not Node. Install: `bun install`, run: `bun run src/index.ts`
- Lockfile: `bun.lock` — never use npm/yarn/pnpm

## Two Install Contexts

- **Root** (`package.json`): runtime deps + `drizzle-kit` as devDep
- **`.opencode/`**: separate `package.json` with `@opencode-ai/plugin` for OpenCode's plugin loader; needs its own `bun install`

## Checks

- `bun run check:lint` — Biome lint + format (`biome check --fix`)
- `bun run check:types` — TypeScript typecheck (`tsc --noEmit`)
- `bun test` — run tests via `bun:test` (no separate test runner installed)

## Tests

- `src/index.test.ts` — integration test for the full plugin (chdirs to tmpdir, inits plugin, verifies DB + JSONL + event handling)
- `src/utils/logger.test.ts` — unit tests for logger (also chdirs to tmpdir)
- `tests/integration.test.ts` — DB-only integration test using `:memory:` SQLite
- `src/utils/db.test.ts` — **entirely commented out**, do not rely on it

## Architecture

- `src/index.ts` — plugin entrypoint, exports `AbstackPlugin`. Auto-runs DB migrations on startup. Contains extensive commented-out reference code for other plugin hooks
- `src/db-schema/index.ts` — Drizzle schema (single `events` table with `type` index)
- `src/utils/db.ts` — SQLite init via `bun:sqlite` (WAL mode, `NORMAL` sync)
- `src/utils/logger.ts` — JSONL logger, appends to `abstack.jsonl` in cwd
- `.opencode/plugins/abstack.ts` — bridge file that re-exports `AbstackPlugin` for OpenCode to load

## DB & Log Gotchas

- Both `abstack.db` and `abstack.jsonl` are written to `process.cwd()` — location depends on the working directory at runtime, not the repo root
- Plugin auto-migrates from `./drizzle` folder on every startup via `drizzle-orm/bun-sqlite/migrator`
- `better-sqlite3` is listed in dependencies but **not used** — actual DB access goes through `bun:sqlite`
- `message.part.delta` events are explicitly filtered out (not persisted) to avoid noise

## Drizzle Commands

- `drizzle-kit generate` — generate migrations from schema changes
- `drizzle-kit studio` / `bun run db:studio` — inspect DB in browser
- Config: `drizzle.config.ts` at root (schema path: `./src/db-schema/index.ts`, out: `./drizzle`)

## TypeScript

- `verbatimModuleSyntax: true` — must use `import type` for type-only imports
- Path alias: `@/*` → `./src/*`
- Strict flags: `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`

## Biome

- Config: `biome.jsonc` at root — lint + format enabled
- `@biomejs/biome` is in `dependencies` (not devDependencies) — non-standard but intentional for this plugin
- Test files (`**/tests/**`, `**/*.test.ts`) relax `noExplicitAny` and `noNonNullAssertion`
