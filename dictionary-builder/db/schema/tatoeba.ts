import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const headSentencesTable = sqliteTable("head_sentences", {
  id: integer().primaryKey({ autoIncrement: true }),
  chineseSentenceId: integer().notNull().unique(),
  chineseSentenceText: text().notNull(),
  chineseSentenceAudioId: integer(),
});
export const headSentencesRelations = relations(
  headSentencesTable,
  ({ many }) => ({
    translations: many(translationsTable),
  }),
);

export const translationsTable = sqliteTable(
  "translations",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    languageCode: text().notNull(),
    sentenceId: integer().notNull().unique(),
    sentenceText: text().notNull(),
    sentenceAudioId: integer(),
    headSentenceId: integer()
      .notNull()
      .references(() => headSentencesTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    check(
      "check_translations_language_code",
      sql`${table.languageCode} IN ('en', 'ja')`,
    ),
    index("idx_translations_head_sentence_id").on(table.headSentenceId),
  ],
);
export const translationsRelations = relations(
  translationsTable,
  ({ one }) => ({
    headSentence: one(headSentencesTable, {
      fields: [translationsTable.headSentenceId],
      references: [headSentencesTable.id],
    }),
  }),
);
