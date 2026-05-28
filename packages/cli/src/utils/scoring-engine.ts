export type RuleStatus = "pass" | "partial" | "fail";

export interface Rule {
	name: string;
	status: RuleStatus;
	message: string;
}

export interface Pillar {
	name: string;
	rules: Rule[];
}

export interface PillarScore {
	pillar: string;
	score: number;
	maxScore: number;
}

export interface Report {
	pillars: Pillar[];
	scores: PillarScore[];
	overall: number;
}

function scoreRule(status: RuleStatus): number {
	switch (status) {
		case "pass":
			return 1;
		case "partial":
			return 0.5;
		case "fail":
			return 0;
	}
}

export function scorePillars(pillars: Pillar[]): Report {
	const scores: PillarScore[] = [];

	for (const pillar of pillars) {
		const maxScore = pillar.rules.length;
		const earned = pillar.rules.reduce(
			(sum, r) => sum + scoreRule(r.status),
			0,
		);
		const score = maxScore > 0 ? earned / maxScore : 0;
		scores.push({ pillar: pillar.name, score, maxScore });
	}

	const pillarsWithRules = scores.filter((s) => s.maxScore > 0);
	const overall =
		pillarsWithRules.length > 0
			? pillarsWithRules.reduce((sum, s) => sum + s.score, 0) /
				pillarsWithRules.length
			: 0;

	return { pillars, scores, overall };
}

export type ReportFormat = "json" | "md";
