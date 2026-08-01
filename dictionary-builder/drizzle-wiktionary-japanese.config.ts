import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations/wiktionary-japanese",
  dialect: "sqlite",
  schema: "./db/schema/wiktionary-japanese.ts",

  dbCredentials: {
    url: "file:./output/wiktionary/wiktionary-japanese.db",
  },

  casing: 'snake_case',
});
