import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable(
  "events",
  {
    id: text().primaryKey(),
    properties: text({ mode: "json" }).notNull(),
    timestamp: integer({ mode: "timestamp" }).notNull(),
    type: text().notNull(),
  },
  (table) => [index("events_type_idx").on(table.type)],
);
