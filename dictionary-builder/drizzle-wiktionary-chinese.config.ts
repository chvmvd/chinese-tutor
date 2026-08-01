import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations/wiktionary-chinese",
  dialect: "sqlite",
  schema: "./db/schema/wiktionary-chinese.ts",

  dbCredentials: {
    url: "file:./output/wiktionary/wiktionary-chinese.db",
  },

  casing: 'snake_case',
});
