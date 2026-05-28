import type { AbstackConfig } from "../../utils/config/types";
import type { Pillar } from "../../utils/scoring-engine";

export function runRubrics(_config?: AbstackConfig): Pillar[] {
	return [
		{ name: "Style & Validation", rules: [] },
		{ name: "Build & Tasks", rules: [] },
		{ name: "Testing", rules: [] },
		{ name: "Documentation", rules: [] },
		{ name: "Dev Environment", rules: [] },
		{ name: "Code Quality", rules: [] },
		{ name: "Git, GitHub & Version Control", rules: [] },
		{ name: "Observability", rules: [] },
		{ name: "Security & Governance", rules: [] },
		{ name: "Agent Compatibility", rules: [] },
	];
}
