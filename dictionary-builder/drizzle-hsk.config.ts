import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations/hsk",
  dialect: "sqlite",
  schema: "./db/schema/hsk.ts",

  dbCredentials: {
    url: "file:./output/hsk/hsk.db",
  },

  casing: 'snake_case',
});
