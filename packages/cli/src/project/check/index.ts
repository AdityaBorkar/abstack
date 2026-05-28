import { loadConfig } from "../../utils/config/load";
import type { AbstackConfig } from "../../utils/config/types";
import { reportJson } from "../../utils/reporters/json";
import { reportMd } from "../../utils/reporters/md";
import type { ReportFormat } from "../../utils/scoring-engine";
import { scorePillars } from "../../utils/scoring-engine";
import { runRubrics } from "./rubrics";

export async function runProjectCheck(
	format: ReportFormat,
	projectRoot: string = process.cwd(),
) {
	const config: AbstackConfig = await loadConfig(projectRoot);
	const pillars = runRubrics(config);
	const report = scorePillars(pillars);

	if (format === "json") {
		reportJson(report);
	} else {
		reportMd("Project Check Report", report);
	}
}
