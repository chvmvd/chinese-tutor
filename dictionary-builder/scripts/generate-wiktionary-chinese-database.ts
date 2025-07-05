// https://kaikki.org/dictionary/rawdata.html
// Format: https://github.com/tatuylonen/wiktextract?tab=readme-ov-file#format-of-the-extracted-word-entries
import { createReadStream } from "fs";
import readline from "readline";
import { z } from "zod/v4";
import { notInArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import {
  derivationsTable,
  examplesTable,
  formsTable,
  glossesTable,
  headwordsTable,
  oneToManyRedirectsTable,
  oneToManyRedirectTargetsTable,
  oneToOneRedirectsTable,
  sensesTable,
  synonymsTable,
  translationsTable,
} from "../db/schema/wiktionary-chinese.js";

const inputFilePath = "./data/wiktionary-chinese.jsonl";
const outputFilePath = "file:./output/wiktionary/wiktionary-chinese.db";

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

const SoftRedirectEntry = z
  .object({
    word: z.string(),
    lang_code: z.literal("zh"),
    pos: z.literal("soft-redirect"),
    redirects: z.array(z.string()).min(1),
  })
  .transform((entry) => ({
    type: "soft-redirect-entry" as const,
    sourceWord: entry.word,
    targetWords: entry.redirects,
  }));

const Glosses = z.array(z.string()).transform((glosses) =>
  glosses.map((glossText, sortOrder) => ({
    sortOrder,
    glossText,
  })),
);

const Examples = z
  .array(
    z.object({
      text: z.string(),
      roman: z.optional(z.string()),
      tags: z.optional(z.array(z.string())),
    }),
  )
  .transform((examples) =>
    examples.map((example, sortOrder) => ({
      sortOrder,
      languageVariant: example.tags?.includes("Traditional Chinese")
        ? ("Traditional Chinese" as const)
        : example.tags?.includes("Simplified Chinese")
          ? ("Simplified Chinese" as const)
          : null,
      exampleText: example.text,
      pinyin: example.roman ?? null,
    })),
  );

const Senses = z
  .array(
    z.object({
      glosses: z.optional(Glosses),
      examples: z.optional(Examples),
    }),
  )
  .transform((senses) =>
    senses.map((sense, sortOrder) => ({
      sortOrder,
      glosses: sense.glosses ?? [],
      examples: sense.examples ?? [],
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

const Sounds = z
  .array(
    z.union([
      z
        .object({
          zh_pron: z.string(),
          tags: z.optional(z.array(z.string())),
        })
        .transform((sound) =>
          sound.tags?.includes("Standard Chinese") &&
          sound.tags.includes("Pinyin")
            ? {
                type: "Pinyin" as const,
                pinyin: sound.zh_pron,
              }
            : sound.tags?.includes("Standard Chinese") &&
                sound.tags.includes("Bopomofo")
              ? {
                  type: "Bopomofo" as const,
                  bopomofo: sound.zh_pron,
                }
              : null,
        ),
      z
        .object({
          audio: z.string(),
          ogg_url: z.string(),
          mp3_url: z.string(),
        })
        .transform((sound) => ({
          type: "Audio" as const,
          audioUrl: sound.ogg_url,
        })),
      z
        .object({
          audio: z.string(),
          oga_url: z.string(),
          mp3_url: z.string(),
        })
        .transform((sound) => ({
          type: "Audio" as const,
          audioUrl: sound.oga_url,
        })),
      z
        .object({
          ipa: z.string(),
        })
        .transform(() => null),
      z
        .object({
          enpr: z.string(),
        })
        .transform(() => null),
      z
        .object({
          homophone: z.string(),
        })
        .transform(() => null),
      z
        .object({
          other: z.string(),
        })
        .transform(() => null),
    ]),
  )
  .transform((sounds) => sounds.filter((sound) => sound !== null))
  .transform((sounds) => ({
    pinyin: sounds.find((sound) => sound.type === "Pinyin")?.pinyin ?? null,
    bopomofo:
      sounds.find((sound) => sound.type === "Bopomofo")?.bopomofo ?? null,
    audioUrl: sounds.find((sound) => sound.type === "Audio")?.audioUrl ?? null,
  }));

const Translations = z
  .array(
    z.object({
      lang_code: z.optional(z.string()),
      word: z.string(),
    }),
  )
  .transform((translations) =>
    translations
      .filter(
        (
          translation,
        ): translation is typeof translation & { lang_code: "en" | "ja" } =>
          translation.lang_code === "en" || translation.lang_code === "ja",
      )
      .map((translation, sortOrder) => ({
        sortOrder,
        languageCode: translation.lang_code,
        translationText: translation.word,
      })),
  );

const Synonyms = z
  .array(
    z.object({
      word: z.string(),
      tags: z.optional(z.array(z.string())),
      roman: z.optional(z.string()),
    }),
  )
  .transform((synonyms) =>
    synonyms
      .filter(
        (synonym) =>
          synonym.tags?.includes("Traditional Chinese") ||
          synonym.tags?.includes("Simplified Chinese"),
      )
      .map((synonym, sortOrder) => ({
        sortOrder,
        languageVariant: synonym.tags?.includes("Traditional Chinese")
          ? ("Traditional Chinese" as const)
          : ("Simplified Chinese" as const),
        synonymText: synonym.word,
        pinyin: synonym.roman ?? null,
      })),
  );

const Derivations = z
  .array(
    z.object({
      word: z.string(),
      tags: z.optional(z.array(z.string())),
      roman: z.optional(z.string()),
    }),
  )
  .transform((derivations) =>
    derivations
      .filter(
        (derivation) =>
          derivation.tags?.includes("Traditional Chinese") ||
          derivation.tags?.includes("Simplified Chinese"),
      )
      .map((derivation, sortOrder) => ({
        sortOrder,
        languageVariant: derivation.tags?.includes("Traditional Chinese")
          ? ("Traditional Chinese" as const)
          : ("Simplified Chinese" as const),
        derivationText: derivation.word,
        pinyin: derivation.roman ?? null,
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
    sounds: z.optional(Sounds),
    translations: z.optional(Translations),
    synonyms: z.optional(Synonyms),
    derived: z.optional(Derivations),
  })
  .transform((entry) => ({
    type: "normal-entry" as const,
    word: entry.word,
    pos: entry.pos,
    etymologyText: entry.etymology_text ?? null,
    pinyin: entry.sounds?.pinyin ?? null,
    bopomofo: entry.sounds?.bopomofo ?? null,
    audioUrl: entry.sounds?.audioUrl ?? null,
    senses: entry.senses,
    forms: entry.forms ?? [],
    translations: entry.translations ?? [],
    synonyms: entry.synonyms ?? [],
    derivations: entry.derived ?? [],
  }));

const OtherLanguageEntry = z
  .object({
    lang_code: z.string().refine((lang_code) => lang_code !== "zh"),
  })
  .transform(() => ({
    type: "other-language-entry" as const,
  }));

const Entry = z.union([
  HardRedirectEntry,
  SoftRedirectEntry,
  NormalEntry,
  OtherLanguageEntry,
]);

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
        } else if (entry.type === "soft-redirect-entry") {
          const oneToManyRedirectInsertResult = await tx
            .insert(oneToManyRedirectsTable)
            .values({
              sourceWord: entry.sourceWord,
            })
            .returning();
          const oneToManyRedirectId = oneToManyRedirectInsertResult[0].id;

          for (const targetWord of entry.targetWords) {
            await tx.insert(oneToManyRedirectTargetsTable).values({
              targetWord,
              oneToManyRedirectId,
            });
          }
        } else if (entry.type === "normal-entry") {
          const headwordInsertResult = await tx
            .insert(headwordsTable)
            .values({
              word: entry.word,
              pos: entry.pos,
              etymologyText: entry.etymologyText,
              pinyin: entry.pinyin,
              bopomofo: entry.bopomofo,
              audioUrl: entry.audioUrl,
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

            for (const example of sense.examples) {
              await tx.insert(examplesTable).values({
                sortOrder: example.sortOrder,
                languageVariant: example.languageVariant,
                exampleText: example.exampleText,
                pinyin: example.pinyin,
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

          for (const translation of entry.translations) {
            await tx.insert(translationsTable).values({
              sortOrder: translation.sortOrder,
              languageCode: translation.languageCode,
              translationText: translation.translationText,
              headwordId,
            });
          }

          for (const synonym of entry.synonyms) {
            await tx.insert(synonymsTable).values({
              sortOrder: synonym.sortOrder,
              languageVariant: synonym.languageVariant,
              synonymText: synonym.synonymText,
              pinyin: synonym.pinyin,
              headwordId,
            });
          }

          for (const derivation of entry.derivations) {
            await tx.insert(derivationsTable).values({
              sortOrder: derivation.sortOrder,
              languageVariant: derivation.languageVariant,
              derivationText: derivation.derivationText,
              pinyin: derivation.pinyin,
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
  await db
    .delete(oneToManyRedirectTargetsTable)
    .where(notInArray(oneToManyRedirectTargetsTable.targetWord, query));
  const existingRedirectIds = db
    .selectDistinct({
      oneToManyRedirectId: oneToManyRedirectTargetsTable.oneToManyRedirectId,
    })
    .from(oneToManyRedirectTargetsTable);
  await db
    .delete(oneToManyRedirectsTable)
    .where(notInArray(oneToManyRedirectsTable.id, existingRedirectIds));

  console.log(
    `✅️ Done: processed ${lineNumber} lines (written to ${outputFilePath})`,
  );
}

main();
