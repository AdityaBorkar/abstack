import { input, select } from "@inquirer/prompts";

export async function runProjectCreate() {
	const projectName = await input({
		message: "Project name:",
		default: "my-abstack-project",
	});

	const template = await select({
		message: "Select a template:",
		choices: [
			{ name: "Minimal", value: "minimal" },
			{ name: "Full-stack", value: "fullstack" },
			{ name: "API only", value: "api" },
		],
	});

	console.log(
		`\nCreating project "${projectName}" from template "${template}"...`,
	);
	console.log("(stub — project creation not yet implemented)");
}
