import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations/unihan",
  dialect: "sqlite",
  schema: "./db/schema/unihan.ts",

  dbCredentials: {
    url: "file:./output/unihan/unihan.db",
  },

  casing: 'snake_case',
});
