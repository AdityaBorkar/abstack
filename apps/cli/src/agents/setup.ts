import { select } from "@inquirer/prompts";

type PackageManager = "bun" | "npm";

export async function runAgentsSetup(opts: { global: boolean }) {
	const scope = opts.global ? "global" : "project";

	const pkgManager = (await select({
		message: "Preferred package manager for installing opencode:",
		choices: [
			{ name: "Bun", value: "bun" },
			{ name: "npm", value: "npm" },
		],
	})) as PackageManager;

	console.log(`Setting up AI agents (${scope}, via ${pkgManager})...`);
	console.log("(stub — agents setup not yet implemented)");
}
