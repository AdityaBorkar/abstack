import { Database } from "bun:sqlite";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { createId as cuid2 } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { events } from "@/db-schema";

describe("integration: full event pipeline", () => {
  let sqlite: Database;
  let db: ReturnType<typeof drizzle>;

  beforeAll(() => {
    sqlite = new Database(":memory:");
    db = drizzle(sqlite);
    const migrationsFolder = new URL("../drizzle", import.meta.url).pathname;
    migrate(db, { migrationsFolder });
  });

  afterAll(() => {
    sqlite.close();
  });

  test("insert event and verify via raw SQL", () => {
    const id = cuid2();
    const type = "session.created";
    const properties = { session: "abc", user: "test" };
    const timestamp = new Date();

    db.insert(events).values({ id, properties, timestamp, type }).run();

    const row = sqlite.prepare("SELECT * FROM events WHERE id = ?").get(id) as
      | Record<string, string>
      | undefined;
    expect(row).toBeDefined();
    expect(row?.id).toBe(id);
    expect(row?.type).toBe(type);
    expect(JSON.parse(row?.properties as string)).toEqual(properties);
  });

  test("insert multiple event types and query by index", () => {
    const types = [
      "session.created",
      "file.edited",
      "session.created",
      "tool.execute.before",
    ];
    for (let i = 0; i < types.length; i++) {
      db.insert(events)
        .values({
          id: cuid2(),
          properties: { idx: i },
          timestamp: new Date(),
          type: types[i] as string,
        })
        .run();
    }

    const sessionEvents = db
      .select()
      .from(events)
      .where(eq(events.type, "session.created"))
      .all();
    expect(sessionEvents.length).toBeGreaterThanOrEqual(2);
    for (const e of sessionEvents) {
      expect(e.type).toBe("session.created");
    }
  });

  test("CUID2 IDs are valid format and work as primary keys", () => {
    const id = cuid2();
    expect(id).toMatch(/^[a-z0-9]+$/);
    expect(id.length).toBeGreaterThan(10);

    db.insert(events)
      .values({
        id,
        properties: {},
        timestamp: new Date(),
        type: "session.created",
      })
      .run();

    const [row] = db.select().from(events).where(eq(events.id, id)).all();
    expect(row).toBeDefined();
    expect(row?.id).toBe(id);
  });

  test("timestamp preserves second-level precision", () => {
    const id = cuid2();
    const now = Date.now();
    const timestamp = new Date(now);

    db.insert(events)
      .values({ id, properties: {}, timestamp, type: "test" })
      .run();

    const [row] = db.select().from(events).where(eq(events.id, id)).all();
    expect(row).toBeDefined();
    expect(Math.floor(row?.timestamp.getTime() / 1000)).toBe(
      Math.floor(now / 1000),
    );
  });

  test("large properties are stored and retrieved correctly", () => {
    const id = cuid2();
    const largeProps = {
      data: "x".repeat(10000),
      nested: { deep: { value: true } },
    };

    db.insert(events)
      .values({
        id,
        properties: largeProps,
        timestamp: new Date(),
        type: "test",
      })
      .run();

    const [row] = db.select().from(events).where(eq(events.id, id)).all();
    expect(row).toBeDefined();
    expect(row?.properties).toEqual(largeProps);
  });

  test("DB schema matches migration SQL", () => {
    const columns = sqlite.prepare("PRAGMA table_info(events)").all() as Array<{
      name: string;
      type: string;
      notnull: number;
      pk: number;
    }>;

    const columnMap = new Map(columns.map((c) => [c.name, c]));
    expect(columnMap.get("id")?.pk).toBe(1);
    expect(columnMap.get("type")).toBeDefined();
    expect(columnMap.get("properties")).toBeDefined();
    expect(columnMap.get("timestamp")).toBeDefined();
  });

  test("empty properties object is stored and retrieved", () => {
    const id = cuid2();
    db.insert(events)
      .values({
        id,
        properties: {},
        timestamp: new Date(),
        type: "test",
      })
      .run();

    const [row] = db.select().from(events).where(eq(events.id, id)).all();
    expect(row?.properties).toEqual({});
  });

  test("null property values in JSON are handled", () => {
    const id = cuid2();
    const props = { key: null, other: "value" };
    db.insert(events)
      .values({
        id,
        properties: props,
        timestamp: new Date(),
        type: "test",
      })
      .run();

    const [row] = db.select().from(events).where(eq(events.id, id)).all();
    expect(row?.properties).toEqual(props);
  });
});
