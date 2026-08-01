// https://tatoeba.org/
import { createReadStream } from "fs";
import readline from "readline";
import path from "path";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema/tatoeba.js";
import { headSentencesTable, translationsTable } from "../db/schema/tatoeba.js";

const tatoebaSentencesPath = "./data/tatoeba-sentences.csv";
const tatoebaSentencesBasePath = "./data/tatoeba-sentences-base.csv";
const tatoebaSentencesWithAudioPath = "./data/tatoeba-sentences-with-audio.csv";
const outputFilePath = "file:./output/tatoeba/tatoeba.db";

const ALLOWED_LICENSES = ["CC BY 4.0", "CC BY-SA 4.0"];
const DISALLOWED_LICENSES = ["", "\\N", "CC BY-NC 4.0", "CC BY-NC-ND 3.0"];

const db = drizzle({
  connection: outputFilePath,
  casing: "snake_case",
  schema,
});

async function main() {
  const sentenceIdToBaseFieldMap = new Map<number, number | null>();
  {
    const fileStream = createReadStream(tatoebaSentencesBasePath, {
      encoding: "utf-8",
    });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;

    for await (const line of rl) {
      lineNumber++;

      const [sentenceIdString, baseFieldString] = line.split("\t");
      if (sentenceIdString.trim() === "" || baseFieldString.trim() === "") {
        throw new Error(
          `❌️ Format error at line ${lineNumber} in ${path.basename(tatoebaSentencesBasePath)}: ${line}`,
        );
      }
      const sentenceId = parseInt(sentenceIdString);
      const baseField =
        baseFieldString === "\\N" ? null : parseInt(baseFieldString);

      sentenceIdToBaseFieldMap.set(sentenceId, baseField);
    }
  }

  {
    const fileStream = createReadStream(tatoebaSentencesPath, {
      encoding: "utf-8",
    });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;

    await db.transaction(async (tx) => {
      for await (const line of rl) {
        lineNumber++;

        const [sentenceIdString, languageCode, sentenceText] = line.split("\t");
        if (
          sentenceIdString.trim() === "" ||
          languageCode.trim() === "" ||
          sentenceText.trim() === ""
        ) {
          throw new Error(
            `❌️ Format error at line ${lineNumber} in ${path.basename(tatoebaSentencesPath)}: ${line}`,
          );
        }
        const sentenceId = parseInt(sentenceIdString);
        const baseField = sentenceIdToBaseFieldMap.get(sentenceId) ?? null;

        if (languageCode !== "cmn") continue;
        if (baseField !== 0) continue;

        await tx.insert(headSentencesTable).values({
          chineseSentenceId: sentenceId,
          chineseSentenceText: sentenceText,
        });
      }
    });
  }

  {
    await db.transaction(async (tx) => {
      const fileStream = createReadStream(tatoebaSentencesPath, {
        encoding: "utf-8",
      });
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let lineNumber = 0;

      for await (const line of rl) {
        lineNumber++;

        const [sentenceIdString, languageCode, sentenceText] = line.split("\t");
        if (
          sentenceIdString.trim() === "" ||
          languageCode.trim() === "" ||
          sentenceText.trim() === ""
        ) {
          throw new Error(
            `❌️ Format error at line ${lineNumber} in ${path.basename(tatoebaSentencesPath)}: ${line}`,
          );
        }
        const sentenceId = parseInt(sentenceIdString);
        const baseField = sentenceIdToBaseFieldMap.get(sentenceId) ?? null;
        if (baseField === null) continue;

        if (languageCode !== "eng" && languageCode !== "jpn") continue;

        const baseChineseSentence = await tx.query.headSentencesTable.findFirst(
          {
            where: eq(headSentencesTable.id, baseField),
          },
        );
        if (!baseChineseSentence) continue;

        await tx.insert(translationsTable).values({
          sentenceId,
          languageCode: languageCode === "eng" ? "en" : "ja",
          sentenceText,
          headSentenceId: baseChineseSentence.id,
        });
      }
    });
  }

  {
    await db.transaction(async (tx) => {
      const fileStream = createReadStream(tatoebaSentencesWithAudioPath, {
        encoding: "utf-8",
      });
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let lineNumber = 0;

      for await (const line of rl) {
        lineNumber++;

        const [sentenceIdString, audioIdString, , license] = line.split("\t");
        if (sentenceIdString.trim() === "" || audioIdString.trim() === "") {
          throw new Error(
            `❌️ Format error at line ${lineNumber} in ${path.basename(tatoebaSentencesWithAudioPath)}: ${line}`,
          );
        }
        const sentenceId = parseInt(sentenceIdString);
        const audioId = parseInt(audioIdString);

        if (DISALLOWED_LICENSES.includes(license.trim())) continue;
        if (!ALLOWED_LICENSES.includes(license.trim())) {
          throw new Error(`Unknown license: ${license}`);
        }

        await tx
          .update(headSentencesTable)
          .set({ chineseSentenceAudioId: audioId })
          .where(eq(headSentencesTable.chineseSentenceId, sentenceId));

        await tx
          .update(translationsTable)
          .set({ sentenceAudioId: audioId })
          .where(eq(translationsTable.sentenceId, sentenceId));
      }
    });
  }

  console.log(`✅️ Done: written to ${outputFilePath}`);
}

main();
