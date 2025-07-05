import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations/cc-cedict",
  dialect: "sqlite",
  schema: "./db/schema/cc-cedict.ts",

  dbCredentials: {
    url: "file:./output/cc-cedict/cc-cedict.db",
  },

  casing: 'snake_case',
});
