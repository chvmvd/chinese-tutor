// https://tatoeba.org/en/
import { createReadStream } from "fs";
import { join } from "path";
import readline from "readline";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { INPUT_DIR_PATH, OUTPUT_DIR_PATH } from "./path.js";

const tatoebaSentencesPath = join(INPUT_DIR_PATH, "tatoeba-sentences.csv");
const tatoebaSentencesBasePath = join(
  INPUT_DIR_PATH,
  "tatoeba-sentences-base.csv",
);
const tatoebaSentencesWithAudioPath = join(
  INPUT_DIR_PATH,
  "tatoeba-sentences-with-audio.csv",
);
const outputFilePath = join(OUTPUT_DIR_PATH, "tatoeba/tatoeba.db");

const ALLOWED_LICENSES = ["CC BY 4.0", "CC BY-SA 4.0"];
const DISALLOWED_LICENSES = [
  "\\N",
  "CC BY-NC 4.0",
  "CC BY-NC-ND 3.0",
];

const db = await open({
  filename: outputFilePath,
  driver: sqlite3.Database,
});

try {
  await db.exec(`
    DROP TABLE IF EXISTS translations;
    DROP TABLE IF EXISTS entries;

    CREATE TABLE entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chinese_sentence_id INTEGER NOT NULL UNIQUE,
      chinese_text TEXT NOT NULL,
      chinese_audio_id INTEGER
    );

    CREATE TABLE translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL,
      sentence_id INTEGER NOT NULL,
      language TEXT NOT NULL CHECK (language IN ('English', 'Japanese')),
      text TEXT NOT NULL,
      audio_id INTEGER,
      FOREIGN KEY(entry_id) REFERENCES entries(id)
    );
  `);

  const sentenceIdToBaseFieldMap = new Map<number, number | null>();
  {
    const fileStream = createReadStream(tatoebaSentencesBasePath, {
      encoding: "utf-8",
    });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.trim() === "") continue;
      const [sentenceIdString, baseFieldString] = line.split("\t");
      const sentenceId = parseInt(sentenceIdString);
      const baseField =
        baseFieldString === "\\N" ? null : parseInt(baseFieldString);
      sentenceIdToBaseFieldMap.set(sentenceId, baseField);
    }
  }

  {
    await db.exec("BEGIN TRANSACTION");
    const fileStream = createReadStream(tatoebaSentencesPath, {
      encoding: "utf-8",
    });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.trim() === "") continue;

      const [sentenceIdString, lang, text] = line.split("\t");
      const sentenceId = parseInt(sentenceIdString);
      const baseField = sentenceIdToBaseFieldMap.get(sentenceId) ?? null;

      if (lang !== "cmn") continue;
      if (baseField !== 0) continue;

      await db.run(
        "INSERT INTO entries (chinese_sentence_id, chinese_text) VALUES (?, ?)",
        sentenceId,
        text,
      );
    }
    await db.exec("COMMIT");
  }

  {
    await db.exec("BEGIN TRANSACTION");
    const fileStream = createReadStream(tatoebaSentencesPath, {
      encoding: "utf-8",
    });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.trim() === "") continue;

      const [sentenceIdString, lang, text] = line.split("\t");
      const sentenceId = parseInt(sentenceIdString);
      const baseField = sentenceIdToBaseFieldMap.get(sentenceId) ?? null;

      if (lang !== "eng" && lang !== "jpn") continue;

      await db.run(
        `
        INSERT INTO translations (entry_id, sentence_id, language, text)
        SELECT id, ?, ?, ?
        FROM entries
        WHERE chinese_sentence_id = ?
        `,
        sentenceId,
        lang === "eng" ? "English" : "Japanese",
        text,
        baseField,
      );
    }
    await db.exec("COMMIT");
  }

  {
    await db.exec("BEGIN TRANSACTION");
    const fileStream = createReadStream(tatoebaSentencesWithAudioPath, {
      encoding: "utf-8",
    });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.trim() === "") continue;

      const [sentenceIdString, audioIdString, , license] = line.split("\t");
      const sentenceId = parseInt(sentenceIdString);
      const audioId = parseInt(audioIdString);

      if (license.trim() === "") continue;
      if (DISALLOWED_LICENSES.includes(license.trim())) continue;
      if (!ALLOWED_LICENSES.includes(license.trim())) {
        throw new Error(`Unknown license: ${license}`);
      }

      await db.run(
        `
        UPDATE entries
        SET chinese_audio_id = ?
        WHERE chinese_sentence_id = ?
        `,
        audioId,
        sentenceId,
      );

      await db.run(
        `
        UPDATE translations
        SET audio_id = ?
        WHERE sentence_id = ?
        `,
        audioId,
        sentenceId,
      );
    }
    await db.exec("COMMIT");
  }

  console.log(`✅️ Done: written to ${outputFilePath}`);
} catch (error) {
  await db.exec("ROLLBACK");
  console.error(error);
} finally {
  await db.close();
}
