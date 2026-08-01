import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const headCharactersTable = sqliteTable(
  "head_characters",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    character: text().notNull().unique(),
    radical: text().notNull(),
    strokeCount: integer().notNull(),
    nonRadicalStrokeCount: integer().notNull(),
  },
  (table) => [index("idx_head_characters_character").on(table.character)],
);

export const headCharactersRelations = relations(
  headCharactersTable,
  ({ many }) => ({
    senses: many(characterSensesTable),
  }),
);

export const characterSensesTable = sqliteTable(
  "character_senses",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    bopomofo: text(),
    pinyin: text(),
    headCharacterId: integer()
      .notNull()
      .references(() => headCharactersTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_character_senses_head_character_id").on(table.headCharacterId),
  ],
);

export const characterSensesRelations = relations(
  characterSensesTable,
  ({ many, one }) => ({
    headCharacter: one(headCharactersTable, {
      fields: [characterSensesTable.headCharacterId],
      references: [headCharactersTable.id],
    }),
    definitions: many(characterDefinitionsTable),
  }),
);

export const characterDefinitionsTable = sqliteTable(
  "character_definitions",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    text: text().notNull(),
    pos: text(),
    antonyms: text(),
    characterSenseId: integer()
      .notNull()
      .references(() => characterSensesTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_character_definitions_character_sense_id").on(
      table.characterSenseId,
    ),
  ],
);

export const characterDefinitionsRelations = relations(
  characterDefinitionsTable,
  ({ many, one }) => ({
    sense: one(characterSensesTable, {
      fields: [characterDefinitionsTable.characterSenseId],
      references: [characterSensesTable.id],
    }),
    examples: many(characterExamplesTable),
    links: many(characterLinksTable),
    quotes: many(characterQuotesTable),
  }),
);

export const characterExamplesTable = sqliteTable(
  "character_examples",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    text: text().notNull(),
    characterDefinitionId: integer()
      .notNull()
      .references(() => characterDefinitionsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_character_examples_character_definition_id").on(
      table.characterDefinitionId,
    ),
  ],
);

export const characterExamplesRelations = relations(
  characterExamplesTable,
  ({ one }) => ({
    definition: one(characterDefinitionsTable, {
      fields: [characterExamplesTable.characterDefinitionId],
      references: [characterDefinitionsTable.id],
    }),
  }),
);

export const characterLinksTable = sqliteTable(
  "character_links",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    text: text().notNull(),
    characterDefinitionId: integer()
      .notNull()
      .references(() => characterDefinitionsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_character_links_character_definition_id").on(
      table.characterDefinitionId,
    ),
  ],
);

export const characterLinksRelations = relations(
  characterLinksTable,
  ({ one }) => ({
    definition: one(characterDefinitionsTable, {
      fields: [characterLinksTable.characterDefinitionId],
      references: [characterDefinitionsTable.id],
    }),
  }),
);

export const characterQuotesTable = sqliteTable(
  "character_quotes",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    text: text().notNull(),
    characterDefinitionId: integer()
      .notNull()
      .references(() => characterDefinitionsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_character_quotes_character_definition_id").on(
      table.characterDefinitionId,
    ),
  ],
);

export const characterQuotesRelations = relations(
  characterQuotesTable,
  ({ one }) => ({
    definition: one(characterDefinitionsTable, {
      fields: [characterQuotesTable.characterDefinitionId],
      references: [characterDefinitionsTable.id],
    }),
  }),
);

export const headwordsTable = sqliteTable(
  "headwords",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    word: text().notNull().unique(),
  },
  (table) => [index("idx_headwords_character").on(table.word)],
);

export const headwordsRelations = relations(
  headwordsTable,
  ({ many }) => ({
    senses: many(wordSensesTable),
  }),
);

export const wordSensesTable = sqliteTable(
  "word_senses",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    bopomofo: text().notNull(),
    pinyin: text().notNull(),
    headwordId: integer()
      .notNull()
      .references(() => headwordsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_word_senses_headword_id").on(table.headwordId),
  ],
);

export const wordSensesRelations = relations(
  wordSensesTable,
  ({ many, one }) => ({
    headword: one(headwordsTable, {
      fields: [wordSensesTable.headwordId],
      references: [headwordsTable.id],
    }),
    definitions: many(wordDefinitionsTable),
  }),
);

export const wordDefinitionsTable = sqliteTable(
  "word_definitions",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    text: text().notNull(),
    pos: text(),
    synonyms: text(),
    antonyms: text(),
    wordSenseId: integer()
      .notNull()
      .references(() => wordSensesTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_word_definitions_word_sense_id").on(
      table.wordSenseId,
    ),
  ],
);

export const wordDefinitionsRelations = relations(
  wordDefinitionsTable,
  ({ many, one }) => ({
    sense: one(wordSensesTable, {
      fields: [wordDefinitionsTable.wordSenseId],
      references: [wordSensesTable.id],
    }),
    examples: many(wordExamplesTable),
    links: many(wordLinksTable),
    quotes: many(wordQuotesTable),
  }),
);

export const wordExamplesTable = sqliteTable(
  "word_examples",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    text: text().notNull(),
    wordDefinitionId: integer()
      .notNull()
      .references(() => wordDefinitionsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_word_examples_word_definition_id").on(
      table.wordDefinitionId,
    ),
  ],
);

export const wordExamplesRelations = relations(
  wordExamplesTable,
  ({ one }) => ({
    definition: one(wordDefinitionsTable, {
      fields: [wordExamplesTable.wordDefinitionId],
      references: [wordDefinitionsTable.id],
    }),
  }),
);

export const wordLinksTable = sqliteTable(
  "word_links",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    text: text().notNull(),
    wordDefinitionId: integer()
      .notNull()
      .references(() => wordDefinitionsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_word_links_word_definition_id").on(
      table.wordDefinitionId,
    ),
  ],
);

export const wordLinksRelations = relations(
  wordLinksTable,
  ({ one }) => ({
    definition: one(wordDefinitionsTable, {
      fields: [wordLinksTable.wordDefinitionId],
      references: [wordDefinitionsTable.id],
    }),
  }),
);

export const wordQuotesTable = sqliteTable(
  "word_quotes",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    text: text().notNull(),
    wordDefinitionId: integer()
      .notNull()
      .references(() => wordDefinitionsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_word_quotes_word_definition_id").on(
      table.wordDefinitionId,
    ),
  ],
);

export const wordQuotesRelations = relations(
  wordQuotesTable,
  ({ one }) => ({
    definition: one(wordDefinitionsTable, {
      fields: [wordQuotesTable.wordDefinitionId],
      references: [wordDefinitionsTable.id],
    }),
  }),
);
