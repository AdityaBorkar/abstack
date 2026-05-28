import type { Report, RuleStatus } from "../scoring-engine";

const statusIcon = (status: RuleStatus): string => {
	switch (status) {
		case "pass":
			return "✅";
		case "partial":
			return "🟡";
		case "fail":
			return "❌";
	}
};

const pct = (value: number): string => `${Math.round(value * 100)}%`;

export function reportMd(title: string, report: Report): void {
	console.log(`# ${title}\n`);
	console.log(`**Overall Score**: ${pct(report.overall)}\n`);

	for (const [pillar, score] of zip(report.pillars, report.scores)) {
		console.log(`## ${pillar.name} (${pct(score.score)})\n`);
		if (pillar.rules.length === 0) {
			console.log("_No rules defined yet._\n");
			continue;
		}
		for (const rule of pillar.rules) {
			console.log(
				`- ${statusIcon(rule.status)} **${rule.name}**: ${rule.message}`,
			);
		}
		console.log();
	}
}

function zip<T, U>(a: T[], b: U[]): Array<[T, U]> {
	return a.map((val, i) => [val, b[i]] as [T, U]);
}
