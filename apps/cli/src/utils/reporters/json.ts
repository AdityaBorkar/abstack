import type { Report } from "../scoring-engine";

export function reportJson(report: Report): void {
	console.log(JSON.stringify(report, null, 2));
}
