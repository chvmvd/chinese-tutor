import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations/make-me-a-hanzi",
  dialect: "sqlite",
  schema: "./db/schema/make-me-a-hanzi.ts",

  dbCredentials: {
    url: "file:./output/make-me-a-hanzi/make-me-a-hanzi.db",
  },

  casing: 'snake_case',
});
