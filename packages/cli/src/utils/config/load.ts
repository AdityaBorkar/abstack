import type { AbstackConfig } from "./types";

const CONFIG_FILES = ["abstack.jsonc", "abstack.json"] as const;

function stripJsonc(text: string): string {
	let result = "";
	let i = 0;
	let inString = false;

	while (i < text.length) {
		const ch = text[i];

		if (inString) {
			result += ch;
			if (ch === "\\" && i + 1 < text.length) {
				i++;
				result += text[i];
			} else if (ch === '"') {
				inString = false;
			}
			i++;
			continue;
		}

		if (ch === '"') {
			inString = true;
			result += ch;
			i++;
			continue;
		}

		if (ch === "/" && i + 1 < text.length) {
			const next = text[i + 1];
			if (next === "/") {
				while (i < text.length && text[i] !== "\n") i++;
				continue;
			}
			if (next === "*") {
				i += 2;
				while (
					i < text.length &&
					!(text[i] === "*" && i + 1 < text.length && text[i + 1] === "/")
				) {
					i++;
				}
				i += 2;
				continue;
			}
		}

		result += ch;
		i++;
	}

	return result;
}

export async function loadConfig(projectRoot: string): Promise<AbstackConfig> {
	for (const filename of CONFIG_FILES) {
		const filePath = `${projectRoot}/${filename}`;
		const file = Bun.file(filePath);
		const exists = await file.exists();
		if (!exists) continue;

		const text = await file.text();
		const json = stripJsonc(text);
		return JSON.parse(json) as AbstackConfig;
	}

	return {};
}
