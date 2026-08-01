import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const oneToOneRedirectsTable = sqliteTable(
  "one_to_one_redirects",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sourceWord: text().notNull().unique(),
    targetWord: text().notNull(),
  },
  (table) => [
    index("idx_one_to_one_redirects_source_word").on(table.sourceWord),
  ],
);

export const oneToManyRedirectsTable = sqliteTable(
  "one_to_many_redirects",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sourceWord: text().notNull(),
  },
  (table) => [
    index("idx_one_to_many_redirects_source_word").on(table.sourceWord),
  ],
);
export const oneToManyRedirectsRelations = relations(
  oneToManyRedirectsTable,
  ({ many }) => ({
    redirectTargets: many(oneToManyRedirectTargetsTable),
  }),
);

export const oneToManyRedirectTargetsTable = sqliteTable(
  "one_to_many_redirect_targets",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    targetWord: text().notNull(),
    oneToManyRedirectId: integer()
      .notNull()
      .references(() => oneToManyRedirectsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_one_to_many_redirect_targets_one_to_many_redirect_id").on(
      table.oneToManyRedirectId,
    ),
  ],
);
export const oneToManyRedirectTargetsRelations = relations(
  oneToManyRedirectTargetsTable,
  ({ one }) => ({
    oneToManyRedirect: one(oneToManyRedirectsTable, {
      fields: [oneToManyRedirectTargetsTable.oneToManyRedirectId],
      references: [oneToManyRedirectsTable.id],
    }),
  }),
);

export const headwordsTable = sqliteTable(
  "headwords",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    word: text().notNull(),
    pos: text().notNull(),
    etymologyText: text(),
  },
  (table) => [
    index("idx_headwords_word").on(table.word),
  ],
);
export const headwordsRelations = relations(headwordsTable, ({ many }) => ({
  senses: many(sensesTable),
  forms: many(formsTable),
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
  glosses: many(glossesTable),
  headword: one(headwordsTable, {
    fields: [sensesTable.headwordId],
    references: [headwordsTable.id],
  }),
}));

export const glossesTable = sqliteTable(
  "glosses",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    glossText: text().notNull(),
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

export const formsTable = sqliteTable(
  "forms",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    languageVariant: text(),
    formText: text().notNull(),
    headwordId: integer()
      .notNull()
      .references(() => headwordsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    check(
      "check_forms_language_variant",
      sql`${table.languageVariant} IN ('Traditional Chinese', 'Simplified Chinese')`,
    ),
    index("idx_forms_headword_id").on(table.headwordId),
  ],
);
export const formsRelations = relations(formsTable, ({ one }) => ({
  headword: one(headwordsTable, {
    fields: [formsTable.headwordId],
    references: [headwordsTable.id],
  }),
}));
