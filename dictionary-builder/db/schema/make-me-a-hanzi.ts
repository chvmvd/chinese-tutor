import { relations } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const headCharactersTable = sqliteTable(
  "head_characters",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    character: text().notNull().unique(),
  },
  (table) => [index("idx_head_characters_character").on(table.character)],
);

export const headCharactersRelations = relations(
  headCharactersTable,
  ({ many }) => ({
    strokes: many(strokesTable),
  }),
);

export const strokesTable = sqliteTable(
  "strokes",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    strokeOrder: integer().notNull(),
    svgPathData: text().notNull(),
    headCharacterId: integer()
      .notNull()
      .references(() => headCharactersTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("idx_strokes_head_character_id").on(table.headCharacterId)],
);

export const strokesRelations = relations(strokesTable, ({ many, one }) => ({
  headCharacter: one(headCharactersTable, {
    fields: [strokesTable.headCharacterId],
    references: [headCharactersTable.id],
  }),
  strokeMedianPoints: many(strokeMedianPointsTable),
}));

export const strokeMedianPointsTable = sqliteTable(
  "stroke_median_points",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    sortOrder: integer().notNull(),
    xCoordinate: real().notNull(),
    yCoordinate: real().notNull(),
    strokeId: integer()
      .notNull()
      .references(() => strokesTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("idx_stroke_median_points_stroke_id").on(table.strokeId)],
);

export const strokeMedianPointsRelations = relations(
  strokeMedianPointsTable,
  ({ one }) => ({
    stroke: one(strokesTable, {
      fields: [strokeMedianPointsTable.strokeId],
      references: [strokesTable.id],
    }),
  }),
);
