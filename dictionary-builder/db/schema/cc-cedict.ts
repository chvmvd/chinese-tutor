import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const headwordsTable = sqliteTable(
  "headwords",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    traditionalWord: text().notNull(),
    simplifiedWord: text().notNull(),
    pinyin: text().notNull(),
  },
  (table) => [
    index("idx_headwords_traditional_word").on(table.traditionalWord),
    index("idx_headwords_simplified_word").on(table.simplifiedWord),
    index("idx_headwords_pinyin").on(table.pinyin),
  ],
);

export const headwordsRelations = relations(headwordsTable, ({ many }) => ({
  senses: many(sensesTable),
}));

export const sensesTable = sqliteTable(
  "senses",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    headwordId: integer()
      .notNull()
      .references(() => headwordsTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("idx_senses_headword_id").on(table.headwordId)],
);

export const sensesRelations = relations(sensesTable, ({ many, one }) => ({
  headword: one(headwordsTable, {
    fields: [sensesTable.headwordId],
    references: [headwordsTable.id],
  }),
  glosses: many(glossesTable),
}));

export const glossesTable = sqliteTable(
  "glosses",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    text: text().notNull(),
    senseId: integer()
      .notNull()
      .references(() => sensesTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("idx_glosses_sense_id").on(table.senseId)],
);

export const glossesRelations = relations(glossesTable, ({ one }) => ({
  sense: one(sensesTable, {
    fields: [glossesTable.senseId],
    references: [sensesTable.id],
  }),
}));
