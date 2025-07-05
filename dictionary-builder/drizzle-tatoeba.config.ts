import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations/tatoeba",
  dialect: "sqlite",
  schema: "./db/schema/tatoeba.ts",

  dbCredentials: {
    url: "file:./output/tatoeba/tatoeba.db",
  },

  casing: 'snake_case',
});
