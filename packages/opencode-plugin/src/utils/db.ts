import { Database } from "bun:sqlite";
import { join } from "node:path";

import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const DB_PATH = join(process.cwd(), "abstack.db");

const sqlite = new Database(DB_PATH);
sqlite.run("PRAGMA journal_mode = WAL");
sqlite.run("PRAGMA synchronous = NORMAL");

export function closeDb() {
  sqlite.close();
}

export const db = drizzle(sqlite);

const migrationsFolder = new URL("../../drizzle", import.meta.url).pathname;
migrate(db, { migrationsFolder });
