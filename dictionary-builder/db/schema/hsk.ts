import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const headCharactersTable = sqliteTable(
  "head_characters",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    character: text().notNull(),
    level: integer().notNull(),
  },
  (table) => [
    index("idx_head_characters_character").on(table.character),
  ],
);

export const headwordsTable = sqliteTable(
  "headwords",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    word: text().notNull(),
    level: integer().notNull(),
  },
  (table) => [
    index("idx_headwords_word").on(table.word),
  ],
);
