// https://cc-cedict.org/wiki/
import { createReadStream } from "fs";
import { join } from "path";
import readline from "readline";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { INPUT_DIR_PATH, OUTPUT_DIR_PATH } from "./path.js";

const inputFilePath = join(INPUT_DIR_PATH, "cc_cedict.txt");
const outputFilePath = join(OUTPUT_DIR_PATH, "cc_cedict/cc_cedict.db");

const db = await open({
  filename: outputFilePath,
  driver: sqlite3.Database,
});

try {
  await db.exec(`
    DROP TABLE IF EXISTS glosses;
    DROP TABLE IF EXISTS senses;
    DROP TABLE IF EXISTS entries;

    CREATE TABLE entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      traditional_headword TEXT NOT NULL,
      simplified_headword TEXT NOT NULL,
      pinyin TEXT NOT NULL
    );

    CREATE TABLE senses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL,
      sense_order INTEGER NOT NULL,
      FOREIGN KEY(entry_id) REFERENCES entries(id)
    );

    CREATE TABLE glosses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sense_id INTEGER NOT NULL,
      gloss_order INTEGER NOT NULL,
      gloss TEXT NOT NULL,
      FOREIGN KEY(sense_id) REFERENCES senses(id)
    );

    CREATE INDEX idx_entries_simplified_headword ON entries(simplified_headword);
    CREATE INDEX idx_entries_traditional_headword ON entries(traditional_headword);
    CREATE INDEX idx_entries_pinyin ON entries(pinyin);
    CREATE INDEX idx_senses_entry_id ON senses(entry_id);
    CREATE INDEX idx_glosses_sense_id ON glosses(sense_id);
  `);

  const fileStream = createReadStream(inputFilePath, { encoding: "utf-8" });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;

  await db.exec("BEGIN TRANSACTION");

  for await (const line of rl) {
    lineNumber++;
    if (line.startsWith("#") || line.trim() === "") continue;
    // Line Format: Traditional Simplified [pin1 yin1] /gloss; gloss; .../gloss; gloss; .../
    const match = line.match(/^(\S+)\s(\S+)\s\[(.+?)\]\s\/(.+)\//);
    if (!match) {
      throw new Error(`❌️ Format error at line ${lineNumber}: ${line}`);
    }

    const [, traditionalHeadword, simplifiedHeadword, pinyin, rawSensesText] =
      match;

    const entryInsertResult = await db.run(
      "INSERT INTO entries (traditional_headword, simplified_headword, pinyin) VALUES (?, ?, ?)",
      traditionalHeadword,
      simplifiedHeadword,
      pinyin,
    );
    const entryId = entryInsertResult.lastID;

    const senses = rawSensesText
      .split("/")
      .map((sense) => sense.trim())
      .filter(Boolean);

    for (const [senseOrder, sense] of senses.entries()) {
      const senseInsertResult = await db.run(
        "INSERT INTO senses (entry_id, sense_order) VALUES (?, ?)",
        entryId,
        senseOrder,
      );
      const senseId = senseInsertResult.lastID;

      const glosses = sense
        .split(";")
        .map((gloss) => gloss.trim())
        .filter(Boolean);
      for (const [glossOrder, gloss] of glosses.entries()) {
        await db.run(
          "INSERT INTO glosses (sense_id, gloss_order, gloss) VALUES (?, ?, ?)",
          senseId,
          glossOrder,
          gloss,
        );
      }
    }

    if (lineNumber % 10000 === 0) {
      await db.exec("COMMIT");
      await db.exec("BEGIN TRANSACTION");
      console.log(`Processed ${lineNumber} lines...`);
    }
  }

  await db.exec("COMMIT");

  console.log(
    `✅️ Done: processed ${lineNumber} lines (written to ${outputFilePath})`,
  );
} catch (error) {
  await db.exec("ROLLBACK");
  console.error(error);
} finally {
  await db.close();
}
