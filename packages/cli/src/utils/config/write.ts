import type { AbstackConfig } from "./types";

const SCHEMA_REF = "./node_modules/abstack/schema.json";
const CONFIG_FILENAME = "abstack.json";

export async function writeConfig(
	projectRoot: string,
	config: AbstackConfig,
): Promise<void> {
	const output: Record<string, unknown> = {
		$schema: SCHEMA_REF,
		...config,
	};
	const filePath = `${projectRoot}/${CONFIG_FILENAME}`;
	await Bun.write(filePath, `${JSON.stringify(output, null, 2)}\n`);
}
