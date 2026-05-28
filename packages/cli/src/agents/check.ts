import { loadConfig } from "../utils/config/load";
import type { AbstackConfig } from "../utils/config/types";
import { reportJson } from "../utils/reporters/json";
import { reportMd } from "../utils/reporters/md";
import type { Pillar, ReportFormat } from "../utils/scoring-engine";
import { scorePillars } from "../utils/scoring-engine";

export function runAgentsRubrics(_config?: AbstackConfig): Pillar[] {
	return [
		{ name: "Skills", rules: [] },
		{ name: "MCPs", rules: [] },
		{ name: "LSPs", rules: [] },
		{ name: "Plugins", rules: [] },
		{ name: "Agents", rules: [] },
		{ name: "Tools", rules: [] },
		{ name: "Formatters", rules: [] },
		{ name: "Permissions", rules: [] },
		{ name: "Sandboxes", rules: [] },
	];
}

export async function runAgentsCheck(
	format: ReportFormat,
	projectRoot: string = process.cwd(),
) {
	const config = await loadConfig(projectRoot);
	const pillars = runAgentsRubrics(config);
	const report = scorePillars(pillars);

	if (format === "json") {
		reportJson(report);
	} else {
		reportMd("Agents Check Report", report);
	}
}
