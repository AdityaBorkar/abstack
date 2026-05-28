export type McpServer =
	| "expect"
	| "codedb"
	| "githits"
	| "playwright"
	| "filesystem"
	| "github"
	| "memory";

export type Formatter = "biome" | "prettier";

export type Ide = "zed" | "vscode" | "cursor" | "windsurf";

export type Linter = "biome" | "eslint" | "oxlint";

export type Lsp = "typescript" | "gopls" | "rust-analyzer" | "pyright";

export type StaticAnalysis = "typescript" | "oxlint";

export type TestRunner = "bun" | "vitest" | "jest" | "pytest";

export type ConformanceSeverity = "off" | "warn" | "error";

export interface ConformanceOverride {
	id: string;
	reason: string;
	severity?: ConformanceSeverity;
}

export interface AbstackConfig {
	agents?: {
		mcp?: McpServer[];
	};
	conformance?: {
		overrides?: ConformanceOverride[];
		template?: string;
	};
	formatter?: Formatter[];
	ide?: Ide[];
	linter?: Linter[];
	lsp?: Lsp[];
	staticAnalysis?: StaticAnalysis[];
	test?: TestRunner[];
}
