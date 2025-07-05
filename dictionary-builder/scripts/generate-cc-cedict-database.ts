// https://cc-cedict.org/wiki/
import { createReadStream } from "fs";
import readline from "readline";
import { drizzle } from "drizzle-orm/libsql";
import {
  headwordsTable,
  glossesTable,
  sensesTable,
} from "../db/schema/cc-cedict.js";

const inputFilePath = "./data/cc-cedict.txt";
const outputFilePath = "file:./output/cc-cedict/cc-cedict.db";

type Entry = {
  traditionalWord: string;
  simplifiedWord: string;
  pinyin: string;
  senses: {
    sortOrder: number;
    glosses: {
      sortOrder: number;
      text: string;
    }[];
  }[];
};

const db = drizzle({ connection: outputFilePath, casing: "snake_case" });

async function main() {
  const fileStream = createReadStream(inputFilePath, { encoding: "utf-8" });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;

  const buffer: Entry[] = [];

  const flushBuffer = async () => {
    await db.transaction(async (tx) => {
      for (const entry of buffer) {
        const headwordInsertResult = await tx
          .insert(headwordsTable)
          .values({
            traditionalWord: entry.traditionalWord,
            simplifiedWord: entry.simplifiedWord,
            pinyin: entry.pinyin,
          })
          .returning();
        const headwordId = headwordInsertResult[0].id;

        for (const sense of entry.senses) {
          const senseInsertResult = await tx
            .insert(sensesTable)
            .values({ sortOrder: sense.sortOrder, headwordId: headwordId })
            .returning();
          const senseId = senseInsertResult[0].id;

          await tx.insert(glossesTable).values(
            sense.glosses.map((gloss) => ({
              sortOrder: gloss.sortOrder,
              text: gloss.text,
              senseId,
            })),
          );
        }
      }
    });
    buffer.length = 0;
  };

  for await (const line of rl) {
    lineNumber++;
    if (lineNumber % 10000 === 0) {
      console.log(`Processed ${lineNumber} lines...`);
    }

    if (line.startsWith("#") || line.trim() === "") continue;

    // Line Format: Traditional Simplified [pin1 yin1] /gloss; gloss; .../gloss; gloss; .../
    const match = line.match(/^(\S+)\s(\S+)\s\[(.+?)\]\s\/(.+)\//);
    if (!match) {
      throw new Error(`❌️ Format error at line ${lineNumber}: ${line}`);
    }
    const [, traditionalWord, simplifiedWord, pinyin, rawSensesText] = match;
    const entry = {
      traditionalWord,
      simplifiedWord,
      pinyin,
      senses: rawSensesText
        .split("/")
        .map((sense) => sense.trim())
        .filter(Boolean)
        .map((sense, senseSortOrder) => ({
          sortOrder: senseSortOrder,
          glosses: sense
            .split(";")
            .map((gloss) => gloss.trim())
            .filter(Boolean)
            .map((gloss, glossSortOrder) => ({
              sortOrder: glossSortOrder,
              text: gloss,
            })),
        })),
    };
    buffer.push(entry);

    if (buffer.length > 10000) {
      await flushBuffer();
    }
  }

  await flushBuffer();

  console.log(
    `✅️ Done: processed ${lineNumber} lines (written to ${outputFilePath})`,
  );
}

main();
