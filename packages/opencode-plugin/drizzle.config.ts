import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: "./abstack.db",
  },
  dialect: "sqlite",
  out: "./drizzle",
  schema: "./src/db-schema/index.ts",
});
