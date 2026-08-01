// https://github.com/skishore/makemeahanzi
// Format: https://github.com/skishore/makemeahanzi?tab=readme-ov-file#graphicstxt-keys
import { createReadStream } from "fs";
import readline from "readline";
import { z } from "zod/v4";
import { drizzle } from "drizzle-orm/libsql";
import {
  headCharactersTable,
  strokeMedianPointsTable,
  strokesTable,
} from "../db/schema/make-me-a-hanzi.js";

const inputFilePath = "./data/make-me-a-hanzi.jsonl";
const outputFilePath = "file:./output/make-me-a-hanzi/make-me-a-hanzi.db";

const Entry = z
  .strictObject({
    character: z.string(),
    strokes: z.array(z.string()),
    medians: z.array(
      z.array(
        z.tuple([z.number().gte(0).lte(1024), z.number().lte(900).gte(-124)]),
      ),
    ),
  })
  .refine((entry) => entry.strokes.length === entry.medians.length)
  .transform((entry) => ({
    character: entry.character,
    strokes: entry.strokes.map((svgPathData, strokeOrder) => ({
      strokeOrder,
      svgPathData,
      strokeMedianPoints: entry.medians[strokeOrder].map(
        (strokeMedianPoint, sortOrder) => ({
          sortOrder,
          xCoordinate: strokeMedianPoint[0],
          yCoordinate: strokeMedianPoint[1],
        }),
      ),
    })),
  }));

const db = drizzle({ connection: outputFilePath, casing: "snake_case" });

async function main() {
  const fileStream = createReadStream(inputFilePath, { encoding: "utf-8" });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;

  const buffer: z.infer<typeof Entry>[] = [];

  const flushBuffer = async () => {
    await db.transaction(async (tx) => {
      for (const entry of buffer) {
        const headCharacterInsertResult = await tx
          .insert(headCharactersTable)
          .values({
            character: entry.character,
          })
          .returning();
        const headCharacterId = headCharacterInsertResult[0].id;

        for (const stroke of entry.strokes) {
          const strokeInsertResult = await tx
            .insert(strokesTable)
            .values({
              strokeOrder: stroke.strokeOrder,
              svgPathData: stroke.svgPathData,
              headCharacterId,
            })
            .returning();
          const strokeId = strokeInsertResult[0].id;

          await tx.insert(strokeMedianPointsTable).values(
            stroke.strokeMedianPoints.map((strokeMedianPoint) => ({
              sortOrder: strokeMedianPoint.sortOrder,
              xCoordinate: strokeMedianPoint.xCoordinate,
              yCoordinate: strokeMedianPoint.yCoordinate,
              strokeId,
            })),
          );
        }
      }
    });
    buffer.length = 0;
  };

  for await (const line of rl) {
    lineNumber++;
    if (lineNumber % 1000 === 0) {
      console.log(`Processed ${lineNumber} lines...`);
    }

    if (line.trim() === "") continue;

    const result = Entry.safeParse(JSON.parse(line));
    if (result.success) {
      buffer.push(result.data);
      if (buffer.length > 1000) {
        await flushBuffer();
      }
    } else {
      throw new Error(
        `❌️ Format error at line ${lineNumber}: ${result.error}`,
      );
    }
  }

  await flushBuffer();

  console.log(
    `✅️ Done: processed ${lineNumber} lines (written to ${outputFilePath})`,
  );
}

main();
