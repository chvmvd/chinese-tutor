import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations/moedict",
  dialect: "sqlite",
  schema: "./db/schema/moedict.ts",

  dbCredentials: {
    url: "file:./output/moedict/moedict.db",
  },

  casing: 'snake_case',
});
