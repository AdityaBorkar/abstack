# AGENTS.md

## Runtime & Package Manager

- **Bun** is the runtime and package manager. Use `bun install`, `bun run`, `bun test` — not npm/yarn/pnpm.
- TypeScript is run directly by Bun (`noEmit: true`); there is no build/compile step.

## Workspace Layout

- Root is a Bun workspace. `apps/cli` is the only app package.
- Each package has its own `package.json` and `tsconfig.json` (they are identical to root).

## Lint & Format

- **Biome** is the linter/formatter (`@biomejs/biome`), not ESLint/Prettier.
- No `biome.json` config exists yet; Biome runs on defaults.
- Run: `bunx @biomejs/biome check .` (lint + format check) or `bunx @biomejs/biome check --write .` (fix).

## TypeScript

- Strict mode with `verbatimModuleSyntax`: use `import type` for type-only imports.
- `noUncheckedIndexedAccess` is enabled: array/object index access returns `T | undefined`.
- `noImplicitOverride` is enabled: subclasses must use `override` keyword.

## Tests

- No tests exist yet. When adding them, use `bun test` (Bun's built-in test runner).

## Entrypoints

- `apps/cli/src/cli.ts` — main CLI logic
- `apps/cli/src/bin.ts` — CLI binary entry (empty/stub)
- `apps/cli/src/sdk.ts` — SDK module (empty/stub)
