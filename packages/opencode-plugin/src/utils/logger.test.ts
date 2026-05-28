import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let tempDir: string;
let originalCwd: string;
let logger: any;

beforeAll(async () => {
  originalCwd = process.cwd();
  tempDir = mkdtempSync(join(tmpdir(), "harness-logger-test-"));
  process.chdir(tempDir);
  const mod = await import("./logger");
  logger = mod.logger;
});

afterAll(() => {
  process.chdir(originalCwd);
  rmSync(tempDir, { force: true, recursive: true });
});

beforeEach(() => {
  const logPath = join(tempDir, "abstack.jsonl");
  if (existsSync(logPath)) {
    rmSync(logPath);
  }
});

function readLogEntries() {
  const logPath = join(tempDir, "abstack.jsonl");
  if (!existsSync(logPath)) return [];
  const content = readFileSync(logPath, "utf-8");
  return content
    .trim()
    .split("\n")
    .filter((l) => l)
    .map((line) => JSON.parse(line));
}

describe("logger", () => {
  test("startup writes session start marker", () => {
    logger.startup();
    const entries = readLogEntries();
    const startup = entries.find((e) => e.message === "--- session start ---");
    expect(startup).toBeDefined();
    expect(startup.level).toBe("info");
    expect(startup).toHaveProperty("timestamp");
  });

  test("info logs with level and message", () => {
    logger.info("test:message", { key: "value" });
    const entries = readLogEntries();
    const entry = entries.find((e) => e.message === "test:message");
    expect(entry).toBeDefined();
    expect(entry?.level).toBe("info");
    expect(entry?.key).toBe("value");
    expect(entry).toHaveProperty("timestamp");
  });

  test("debug logs with level and message", () => {
    logger.debug("debug:msg");
    const entries = readLogEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.level).toBe("debug");
    expect(entries[0]?.message).toBe("debug:msg");
    expect(entries[0]).toHaveProperty("timestamp");
  });

  test("warn logs with level and message", () => {
    logger.warn("warn:msg", { code: 123 });
    const entries = readLogEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.level).toBe("warn");
    expect(entries[0]?.message).toBe("warn:msg");
    expect(entries[0]?.code).toBe(123);
    expect(entries[0]).toHaveProperty("timestamp");
  });

  test("error logs with level and message", () => {
    logger.error("error:msg");
    const entries = readLogEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.level).toBe("error");
    expect(entries[0]?.message).toBe("error:msg");
    expect(entries[0]).toHaveProperty("timestamp");
  });

  test("meta is spread into output", () => {
    logger.info("msg", { a: 1, b: "two", c: true });
    const entries = readLogEntries();
    expect(entries[0]?.a).toBe(1);
    expect(entries[0]?.b).toBe("two");
    expect(entries[0]?.c).toBe(true);
  });

  test("log without meta only has level, message, and timestamp", () => {
    logger.info("no-meta");
    const entries = readLogEntries();
    expect(Object.keys(entries[0]).sort()).toEqual([
      "level",
      "message",
      "timestamp",
    ]);
  });

  test("each call appends a newline-terminated JSON line", () => {
    logger.info("first");
    logger.info("second");
    const entries = readLogEntries();
    expect(entries).toHaveLength(2);
    expect(entries[0]?.message).toBe("first");
    expect(entries[1]?.message).toBe("second");
  });

  test("writes to abstack.jsonl in cwd", () => {
    logger.info("path-check");
    expect(existsSync(join(tempDir, "abstack.jsonl"))).toBe(true);
  });
});
