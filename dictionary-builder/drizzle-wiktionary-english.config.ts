import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations/wiktionary-english",
  dialect: "sqlite",
  schema: "./db/schema/wiktionary-english.ts",

  dbCredentials: {
    url: "file:./output/wiktionary/wiktionary-english.db",
  },

  casing: 'snake_case',
});
