// import { describe, test, expect, beforeAll, afterAll } from "bun:test";
// import { existsSync, rmSync, mkdtempSync } from "node:fs";
// import { join } from "node:path";
// import { tmpdir } from "node:os";

// let tempDir: string;
// let originalCwd: string;
// let dbModule: typeof import("./db");

// beforeAll(async () => {
// 	originalCwd = process.cwd();
// 	tempDir = mkdtempSync(join(tmpdir(), "harness-db-test-"));
// 	process.chdir(tempDir);
// 	dbModule = await import("./db");
// 	dbModule.closeDb();
// 	void (dbModule.db as any).$client;
// });

// afterAll(() => {
// 	dbModule.closeDb();
// 	process.chdir(originalCwd);
// 	rmSync(tempDir, { recursive: true, force: true });
// });

// describe("db initialization", () => {
// 	test("creates abstack.db in cwd", () => {
// 		expect(existsSync(join(tempDir, "abstack.db"))).toBe(true);
// 	});

// 	test("sets WAL journal mode", () => {
// 		const client = (dbModule.db as any).$client;
// 		const result = client.prepare("PRAGMA journal_mode").get() as Record<
// 			string,
// 			string
// 		>;
// 		expect(result.journal_mode).toBe("wal");
// 	});

// 	test("sets NORMAL synchronous mode", () => {
// 		const client = (dbModule.db as any).$client;
// 		const result = client.prepare("PRAGMA synchronous").get() as Record<
// 			string,
// 			number
// 		>;
// 		expect(result.synchronous).toBe(1);
// 	});

// 	test("drizzle wrapper exposes $client", () => {
// 		expect(dbModule.db).toHaveProperty("$client");
// 	});
// });
