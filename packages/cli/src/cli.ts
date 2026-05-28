import { Command } from "commander";
import { runAgentsCheck } from "./agents/check";
import { runAgentsSetup } from "./agents/setup";
import { runProjectCheck } from "./project/check";
import { runProjectCreate } from "./project/create";
import type { ReportFormat } from "./utils/scoring-engine";

export function createProgram() {
	const program = new Command();

	program.name("abstack").description("Abstack CLI").version("0.1.0");

	const projectCmd = program
		.command("project")
		.description("Project management commands");

	projectCmd
		.command("create")
		.description("Create a new project interactively")
		.action(runProjectCreate);

	projectCmd
		.command("check")
		.description("Run project checks and report results")
		.option("-f, --format <format>", "Output format: json or md", "md")
		.option("-r, --root <path>", "Project root directory", process.cwd())
		.action(async (opts: { format: string; root: string }) => {
			const format = opts.format as ReportFormat;
			if (format !== "json" && format !== "md") {
				program.error(
					`Invalid format "${opts.format}". Must be "json" or "md".`,
				);
			}
			await runProjectCheck(format, opts.root);
		});

	const agentsCmd = program
		.command("agents")
		.description("AI agent management commands");

	agentsCmd
		.command("setup")
		.description("Set up AI agents (opencode, plugins, agents, skills)")
		.option("-g, --global", "Set up globally instead of project-level", false)
		.action(async (opts: { global: boolean }) => {
			await runAgentsSetup(opts);
		});

	agentsCmd
		.command("check")
		.description("Check AI agent configuration")
		.option("-f, --format <format>", "Output format: json or md", "md")
		.option("-r, --root <path>", "Project root directory", process.cwd())
		.action(async (opts: { format: string; root: string }) => {
			const format = opts.format as ReportFormat;
			if (format !== "json" && format !== "md") {
				program.error(
					`Invalid format "${opts.format}". Must be "json" or "md".`,
				);
			}
			await runAgentsCheck(format, opts.root);
		});

	return program;
}
