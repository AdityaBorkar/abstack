const VALID_MCP: readonly string[] = [
	"expect",
	"codedb",
	"githits",
	"playwright",
	"filesystem",
	"github",
	"memory",
];
const VALID_FORMATTER: readonly string[] = ["biome", "prettier"];
const VALID_IDE: readonly string[] = ["zed", "vscode", "cursor", "windsurf"];
const VALID_LINTER: readonly string[] = ["biome", "eslint", "oxlint"];
const VALID_LSP: readonly string[] = [
	"typescript",
	"gopls",
	"rust-analyzer",
	"pyright",
];
const VALID_STATIC: readonly string[] = ["typescript", "oxlint"];
const VALID_TEST: readonly string[] = ["bun", "vitest", "jest", "pytest"];
const VALID_SEVERITY: readonly string[] = ["off", "warn", "error"];

export interface ValidationError {
	path: string;
	message: string;
}

export interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
}

function validateEnumArray(
	values: unknown,
	valid: readonly string[],
	path: string,
	errors: ValidationError[],
): void {
	if (!Array.isArray(values)) {
		errors.push({ path, message: "Expected an array" });
		return;
	}
	for (let i = 0; i < values.length; i++) {
		const item = values[i];
		if (typeof item !== "string" || !valid.includes(item)) {
			errors.push({
				path: `${path}[${i}]`,
				message: `Invalid value "${String(item)}". Allowed: ${valid.join(", ")}`,
			});
		}
	}
}

export function validateConfig(config: unknown): ValidationResult {
	const errors: ValidationError[] = [];

	if (typeof config !== "object" || config === null) {
		return {
			valid: false,
			errors: [{ path: "", message: "Config must be an object" }],
		};
	}

	const cfg = config as Record<string, unknown>;

	if ("agents" in cfg && cfg.agents !== undefined) {
		if (
			typeof cfg.agents !== "object" ||
			cfg.agents === null ||
			Array.isArray(cfg.agents)
		) {
			errors.push({ path: "agents", message: "Expected an object" });
		} else {
			const agents = cfg.agents as Record<string, unknown>;
			if ("mcp" in agents && agents.mcp !== undefined) {
				if (Array.isArray(agents.mcp)) {
					validateEnumArray(agents.mcp, VALID_MCP, "agents.mcp", errors);
				} else {
					errors.push({ path: "agents.mcp", message: "Expected an array" });
				}
			}
		}
	}

	if ("conformance" in cfg && cfg.conformance !== undefined) {
		if (
			typeof cfg.conformance !== "object" ||
			cfg.conformance === null ||
			Array.isArray(cfg.conformance)
		) {
			errors.push({ path: "conformance", message: "Expected an object" });
		} else {
			const conf = cfg.conformance as Record<string, unknown>;
			if (
				"template" in conf &&
				conf.template !== undefined &&
				typeof conf.template !== "string"
			) {
				errors.push({
					path: "conformance.template",
					message: "Expected a string",
				});
			}
			if ("overrides" in conf && conf.overrides !== undefined) {
				if (!Array.isArray(conf.overrides)) {
					errors.push({
						path: "conformance.overrides",
						message: "Expected an array",
					});
				} else {
					for (let i = 0; i < conf.overrides.length; i++) {
						const override = (conf.overrides as unknown[])[i];
						if (
							typeof override !== "object" ||
							override === null ||
							Array.isArray(override)
						) {
							errors.push({
								path: `conformance.overrides[${i}]`,
								message: "Expected an object",
							});
							continue;
						}
						const obj = override as Record<string, unknown>;
						if (typeof obj.id !== "string") {
							errors.push({
								path: `conformance.overrides[${i}].id`,
								message: "Expected a string",
							});
						}
						if (typeof obj.reason !== "string") {
							errors.push({
								path: `conformance.overrides[${i}].reason`,
								message: "Expected a string",
							});
						}
						if (
							obj.severity !== undefined &&
							(typeof obj.severity !== "string" ||
								!VALID_SEVERITY.includes(obj.severity))
						) {
							errors.push({
								path: `conformance.overrides[${i}].severity`,
								message: `Invalid value. Allowed: ${VALID_SEVERITY.join(", ")}`,
							});
						}
					}
				}
			}
		}
	}

	if ("formatter" in cfg && cfg.formatter !== undefined) {
		validateEnumArray(cfg.formatter, VALID_FORMATTER, "formatter", errors);
	}
	if ("ide" in cfg && cfg.ide !== undefined) {
		validateEnumArray(cfg.ide, VALID_IDE, "ide", errors);
	}
	if ("linter" in cfg && cfg.linter !== undefined) {
		validateEnumArray(cfg.linter, VALID_LINTER, "linter", errors);
	}
	if ("lsp" in cfg && cfg.lsp !== undefined) {
		validateEnumArray(cfg.lsp, VALID_LSP, "lsp", errors);
	}
	if ("staticAnalysis" in cfg && cfg.staticAnalysis !== undefined) {
		validateEnumArray(
			cfg.staticAnalysis,
			VALID_STATIC,
			"staticAnalysis",
			errors,
		);
	}
	if ("test" in cfg && cfg.test !== undefined) {
		validateEnumArray(cfg.test, VALID_TEST, "test", errors);
	}

	return { valid: errors.length === 0, errors };
}
