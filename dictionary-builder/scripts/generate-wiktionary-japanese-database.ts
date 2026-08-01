// https://kaikki.org/dictionary/rawdata.html
// Format: https://github.com/tatuylonen/wiktextract?tab=readme-ov-file#format-of-the-extracted-word-entries
import { createReadStream } from "fs";
import readline from "readline";
import { z } from "zod/v4";
import { notInArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import {
  formsTable,
  glossesTable,
  headwordsTable,
  oneToOneRedirectsTable,
  sensesTable,
} from "../db/schema/wiktionary-japanese.js";

const inputFilePath = "./data/wiktionary-japanese.jsonl";
const outputFilePath = "file:./output/wiktionary/wiktionary-japanese.db";

const HardRedirectEntry = z
  .strictObject({
    title: z.string(),
    redirect: z.string(),
    pos: z.literal("hard-redirect"),
  })
  .transform((entry) => ({
    type: "hard-redirect-entry" as const,
    sourceWord: entry.title,
    targetWord: entry.redirect,
  }));

const Glosses = z.array(z.string()).transform((glosses) =>
  glosses.map((glossText, sortOrder) => ({
    sortOrder,
    glossText,
  })),
);

const Senses = z
  .array(
    z.object({
      glosses: z.optional(Glosses),
    }),
  )
  .transform((senses) =>
    senses.map((sense, sortOrder) => ({
      sortOrder,
      glosses: sense.glosses ?? [],
    })),
  );

const Forms = z
  .array(
    z.object({
      form: z.string(),
      tags: z.optional(z.array(z.string())),
    }),
  )
  .transform((forms) =>
    forms.map((form, sortOrder) => ({
      sortOrder,
      languageVariant: form.tags?.includes("Traditional Chinese")
        ? ("Traditional Chinese" as const)
        : form.tags?.includes("Simplified Chinese")
          ? ("Simplified Chinese" as const)
          : null,
      formText: form.form,
    })),
  );

const NormalEntry = z
  .object({
    word: z.string(),
    lang_code: z.literal("zh"),
    pos: z
      .string()
      .refine((pos) => pos !== "hard-redirect" && pos !== "soft-redirect"),
    etymology_text: z.optional(z.string()),
    senses: Senses,
    forms: z.optional(Forms),
  })
  .transform((entry) => ({
    type: "normal-entry" as const,
    word: entry.word,
    pos: entry.pos,
    etymologyText: entry.etymology_text ?? null,
    senses: entry.senses,
    forms: entry.forms ?? [],
  }));

const OtherLanguageEntry = z
  .object({
    lang_code: z.string().refine((lang_code) => lang_code !== "zh"),
  })
  .transform(() => ({
    type: "other-language-entry" as const,
  }));

const Entry = z.union([HardRedirectEntry, NormalEntry, OtherLanguageEntry]);

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
        if (entry.type === "hard-redirect-entry") {
          await tx.insert(oneToOneRedirectsTable).values({
            sourceWord: entry.sourceWord,
            targetWord: entry.targetWord,
          });
        } else if (entry.type === "normal-entry") {
          const headwordInsertResult = await tx
            .insert(headwordsTable)
            .values({
              word: entry.word,
              pos: entry.pos,
              etymologyText: entry.etymologyText,
            })
            .returning();
          const headwordId = headwordInsertResult[0].id;

          for (const sense of entry.senses) {
            const senseInsertResult = await tx
              .insert(sensesTable)
              .values({
                sortOrder: sense.sortOrder,
                headwordId,
              })
              .returning();
            const senseId = senseInsertResult[0].id;

            for (const gloss of sense.glosses) {
              await tx.insert(glossesTable).values({
                sortOrder: gloss.sortOrder,
                glossText: gloss.glossText,
                senseId,
              });
            }
          }

          for (const form of entry.forms) {
            await tx.insert(formsTable).values({
              sortOrder: form.sortOrder,
              languageVariant: form.languageVariant,
              formText: form.formText,
              headwordId,
            });
          }
        } else {
          continue;
        }
      }
    });
    buffer.length = 0;
  };

  for await (const line of rl) {
    lineNumber++;
    if (lineNumber % 100000 === 0) {
      console.log(`Processed ${lineNumber} lines...`);
    }

    if (line.trim() === "") continue;

    const result = Entry.safeParse(JSON.parse(line));
    if (result.success) {
      buffer.push(result.data);
      if (buffer.length > 10000) {
        await flushBuffer();
      }
    } else {
      throw new Error(
        `❌️ Format error at line ${lineNumber}: ${result.error}`,
      );
    }
  }

  await flushBuffer();

  const query = db.select({ word: headwordsTable.word }).from(headwordsTable);
  await db
    .delete(oneToOneRedirectsTable)
    .where(notInArray(oneToOneRedirectsTable.targetWord, query));

  console.log(
    `✅️ Done: processed ${lineNumber} lines (written to ${outputFilePath})`,
  );
}

main();
