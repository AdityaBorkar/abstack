import { Database } from "bun:sqlite";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { Plugin } from "@opencode-ai/plugin";

let tempDir: string;
let originalCwd: string;
let AbstackPlugin: Plugin;
let hooks: Awaited<ReturnType<Plugin>>;

beforeAll(async () => {
  originalCwd = process.cwd();
  tempDir = mkdtempSync(join(tmpdir(), "harness-plugin-test-"));
  process.chdir(tempDir);
  const mod = await import("./index");
  AbstackPlugin = mod.AbstackPlugin;
  hooks = await AbstackPlugin({
    directory: "/test/dir",
    project: { id: "test-project" } as any,
    serverUrl: new URL("http://localhost:3000"),
    worktree: "main",
  } as any);
});

afterAll(async () => {
  await hooks.dispose?.();
  process.chdir(originalCwd);
  rmSync(tempDir, { force: true, recursive: true });
});

function readLogEntries(): any[] {
  const logPath = join(tempDir, "abstack.jsonl");
  if (!existsSync(logPath)) return [];
  const content = readFileSync(logPath, "utf-8");
  return content
    .trim()
    .split("\n")
    .filter((l) => l)
    .map((line) => JSON.parse(line));
}

function queryEvents(): any[] {
  const sqlite = new Database(join(tempDir, "abstack.db"));
  const rows = sqlite.prepare("SELECT * FROM events").all();
  sqlite.close();
  return rows;
}

describe("AbstackPlugin (integration)", () => {
  test("creates abstack.db in cwd", () => {
    expect(existsSync(join(tempDir, "abstack.db"))).toBe(true);
  });

  test("creates abstack.jsonl log file", () => {
    expect(existsSync(join(tempDir, "abstack.jsonl"))).toBe(true);
  });

  test("returns event handler and dispose function", () => {
    expect(hooks.event).toBeDefined();
    expect(typeof hooks.event).toBe("function");
    expect(hooks.dispose).toBeDefined();
    expect(typeof hooks.dispose).toBe("function");
  });

  test("logs startup and plugin init", () => {
    const entries = readLogEntries();
    const startup = entries.find((e) => e.message === "--- session start ---");
    expect(startup).toBeDefined();

    const init = entries.find((e) => e.message === "plugin:init");
    expect(init).toBeDefined();
    expect(init.serverUrl).toBeDefined();
  });

  test("event handler inserts event into DB", async () => {
    await hooks.event?.({
      event: {
        properties: { key: "value" },
        type: "session.created",
      } as any,
    });

    const events = queryEvents();
    const inserted = events.find((e) => e.type === "session.created");
    expect(inserted).toBeDefined();
    expect(inserted.id).toBeDefined();
    expect(inserted.timestamp).toBeDefined();
    expect(JSON.parse(inserted.properties as string)).toEqual({
      key: "value",
    });
  });

  test("event handler filters out message.part.delta events", async () => {
    const countBefore = queryEvents().length;

    await hooks.event?.({
      event: {
        properties: { text: "hello" },
        type: "message.part.delta",
      } as any,
    });

    const countAfter = queryEvents().length;
    expect(countAfter).toBe(countBefore);
  });

  test("event handler generates unique CUID2 IDs", async () => {
    await hooks.event?.({
      event: {
        properties: {},
        type: "session.idle",
      } as any,
    });
    await hooks.event?.({
      event: {
        properties: { file: "a.ts" },
        type: "file.edited",
      } as any,
    });

    const events = queryEvents();
    const idle = events.filter((e) => e.type === "session.idle");
    const edited = events.filter((e) => e.type === "file.edited");
    expect(idle.length).toBe(1);
    expect(edited.length).toBe(1);
    expect(idle[0]?.id).not.toBe(edited[0]?.id);
  });

  test("event handler logs events", async () => {
    await hooks.event?.({
      event: {
        properties: {},
        type: "server.connected",
      } as any,
    });

    const entries = readLogEntries();
    const eventLog = entries.find(
      (e) => e.message === "event" && e.type === "server.connected",
    );
    expect(eventLog).toBeDefined();
  });

  test("handles various OpenCode event types", async () => {
    const types = [
      "installation.updated",
      "lsp.updated",
      "message.updated",
      "permission.asked",
    ];
    for (const type of types) {
      await hooks.event?.({
        event: { properties: {}, type } as any,
      });
    }

    const events = queryEvents();
    for (const type of types) {
      expect(events.some((e) => e.type === type)).toBe(true);
    }
  });
});
