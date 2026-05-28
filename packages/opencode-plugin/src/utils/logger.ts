import { appendFileSync } from "node:fs";
import { join } from "node:path";

function getLogPath() {
  return join(process.cwd(), "abstack.jsonl");
}

type Level = "debug" | "info" | "warn" | "error";

function writeLine(data: Record<string, unknown>) {
  appendFileSync(getLogPath(), `${JSON.stringify(data)}\n`);
}

function log(level: Level, message: string, meta?: Record<string, unknown>) {
  writeLine({ level, message, timestamp: Date.now(), ...meta });
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) =>
    log("debug", message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    log("error", message, meta),
  info: (message: string, meta?: Record<string, unknown>) =>
    log("info", message, meta),
  startup: () => {
    writeLine({
      level: "info",
      message: "--- session start ---",
      timestamp: Date.now(),
    });
  },
  warn: (message: string, meta?: Record<string, unknown>) =>
    log("warn", message, meta),
};
