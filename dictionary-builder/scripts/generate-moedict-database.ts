// https://github.com/g0v/moedict-data
import { readFile } from "fs/promises";
import { z } from "zod/v4";
import { drizzle } from "drizzle-orm/libsql";
import {
  characterDefinitionsTable,
  characterExamplesTable,
  characterLinksTable,
  characterQuotesTable,
  characterSensesTable,
  headCharactersTable,
  headwordsTable,
  wordDefinitionsTable,
  wordExamplesTable,
  wordLinksTable,
  wordQuotesTable,
  wordSensesTable,
} from "../db/schema/moedict.js";

const inputFilePath = "./data/moedict.json";
const outputFilePath = "file:./output/moedict/moedict.db";

const CharacterEntry = z
  .strictObject({
    heteronyms: z.array(
      z.strictObject({
        bopomofo: z.optional(z.string()),
        definitions: z.array(
          z.strictObject({
            antonyms: z.optional(z.string()),
            def: z.string(),
            example: z.optional(z.array(z.string())),
            link: z.optional(z.array(z.string())),
            quote: z.optional(z.array(z.string())),
            type: z.optional(z.string()),
          }),
        ),
        pinyin: z.optional(z.string()),
      }),
    ),
    non_radical_stroke_count: z.int(),
    radical: z.string(),
    stroke_count: z.int(),
    title: z.union([
      z.string().regex(/^\{\[[0-9a-f]{4}\]\}$/),
      z.string().regex(/^.$/u),
    ]),
  })
  .transform((entry) => ({
    type: "character-entry" as const,
    character: entry.title,
    radical: entry.radical,
    strokeCount: entry.stroke_count,
    nonRadicalStrokeCount: entry.non_radical_stroke_count,
    senses: entry.heteronyms.map((heteronym, heteronymOrder) => ({
      sortOrder: heteronymOrder,
      bopomofo: heteronym.bopomofo ?? null,
      pinyin: heteronym.pinyin ?? null,
      definitions: heteronym.definitions.map((definition, definitionOrder) => ({
        sortOrder: definitionOrder,
        text: definition.def,
        pos: definition.type ?? null,
        antonyms: definition.antonyms ?? null,
        examples:
          definition.example?.map((example, exampleOrder) => ({
            sortOrder: exampleOrder,
            text: example,
          })) ?? [],
        links:
          definition.link?.map((link, linkOrder) => ({
            sortOrder: linkOrder,
            text: link,
          })) ?? [],
        quotes:
          definition.quote?.map((quote, quoteOrder) => ({
            sortOrder: quoteOrder,
            text: quote,
          })) ?? [],
      })),
    })),
  }));

const WordEntry = z
  .strictObject({
    heteronyms: z.array(
      z.strictObject({
        bopomofo: z.string(),
        definitions: z.array(
          z.strictObject({
            antonyms: z.optional(z.string()),
            def: z.string(),
            example: z.optional(z.array(z.string())),
            link: z.optional(z.array(z.string())),
            quote: z.optional(z.array(z.string())),
            synonyms: z.optional(z.string()),
            type: z.optional(z.string()),
          }),
        ),
        pinyin: z.string(),
      }),
    ),
    non_radical_stroke_count: z.optional(z.literal(0)),
    radical: z.optional(z.literal("")),
    stroke_count: z.optional(z.literal(0)),
    title: z.string(),
  })
  .transform((entry) => ({
    type: "word-entry" as const,
    word: entry.title,
    senses: entry.heteronyms.map((heteronym, heteronymOrder) => ({
      sortOrder: heteronymOrder,
      bopomofo: heteronym.bopomofo,
      pinyin: heteronym.pinyin,
      definitions: heteronym.definitions.map((definition, definitionOrder) => ({
        sortOrder: definitionOrder,
        text: definition.def,
        pos: definition.type ?? null,
        synonyms: definition.synonyms ?? null,
        antonyms: definition.antonyms ?? null,
        examples:
          definition.example?.map((example, exampleOrder) => ({
            sortOrder: exampleOrder,
            text: example,
          })) ?? [],
        links:
          definition.link?.map((link, linkOrder) => ({
            sortOrder: linkOrder,
            text: link,
          })) ?? [],
        quotes:
          definition.quote?.map((quote, quoteOrder) => ({
            sortOrder: quoteOrder,
            text: quote,
          })) ?? [],
      })),
    })),
  }));

const Entry = z.union([CharacterEntry, WordEntry]);

const db = drizzle({ connection: outputFilePath, casing: "snake_case" });

async function main() {
  const fileContent = await readFile(inputFilePath, "utf-8");
  const entries: z.infer<typeof Entry>[] = JSON.parse(fileContent);

  let entryNumber = 0;

  const buffer: z.infer<typeof Entry>[] = [];

  const flushBuffer = async () => {
    await db.transaction(async (tx) => {
      for (const entry of buffer) {
        if (entry.type === "character-entry") {
          const headCharacterInsertResult = await tx
            .insert(headCharactersTable)
            .values({
              character: entry.character,
              radical: entry.radical,
              strokeCount: entry.strokeCount,
              nonRadicalStrokeCount: entry.nonRadicalStrokeCount,
            })
            .returning();
          const headCharacterId = headCharacterInsertResult[0].id;

          for (const sense of entry.senses) {
            const senseInsertResult = await tx
              .insert(characterSensesTable)
              .values({
                sortOrder: sense.sortOrder,
                bopomofo: sense.bopomofo,
                pinyin: sense.pinyin,
                headCharacterId,
              })
              .returning();
            const senseId = senseInsertResult[0].id;

            for (const definition of sense.definitions) {
              const definitionInsertResult = await tx
                .insert(characterDefinitionsTable)
                .values({
                  sortOrder: definition.sortOrder,
                  text: definition.text,
                  pos: definition.pos,
                  antonyms: definition.antonyms,
                  characterSenseId: senseId,
                })
                .returning();
              const definitionId = definitionInsertResult[0].id;

              for (const example of definition.examples) {
                await tx.insert(characterExamplesTable).values({
                  sortOrder: example.sortOrder,
                  text: example.text,
                  characterDefinitionId: definitionId,
                });
              }

              for (const link of definition.links) {
                await tx.insert(characterLinksTable).values({
                  sortOrder: link.sortOrder,
                  text: link.text,
                  characterDefinitionId: definitionId,
                });
              }

              for (const quote of definition.quotes) {
                await tx.insert(characterQuotesTable).values({
                  sortOrder: quote.sortOrder,
                  text: quote.text,
                  characterDefinitionId: definitionId,
                });
              }
            }
          }
        } else if (entry.type === "word-entry") {
          const headwordInsertResult = await tx
            .insert(headwordsTable)
            .values({
              word: entry.word,
            })
            .returning();
          const headwordId = headwordInsertResult[0].id;

          for (const sense of entry.senses) {
            const senseInsertResult = await tx
              .insert(wordSensesTable)
              .values({
                sortOrder: sense.sortOrder,
                bopomofo: sense.bopomofo,
                pinyin: sense.pinyin,
                headwordId,
              })
              .returning();
            const senseId = senseInsertResult[0].id;

            for (const definition of sense.definitions) {
              const definitionInsertResult = await tx
                .insert(wordDefinitionsTable)
                .values({
                  sortOrder: definition.sortOrder,
                  text: definition.text,
                  pos: definition.pos,
                  antonyms: definition.antonyms,
                  wordSenseId: senseId,
                })
                .returning();
              const definitionId = definitionInsertResult[0].id;

              for (const example of definition.examples) {
                await tx.insert(wordExamplesTable).values({
                  sortOrder: example.sortOrder,
                  text: example.text,
                  wordDefinitionId: definitionId,
                });
              }

              for (const link of definition.links) {
                await tx.insert(wordLinksTable).values({
                  sortOrder: link.sortOrder,
                  text: link.text,
                  wordDefinitionId: definitionId,
                });
              }

              for (const quote of definition.quotes) {
                await tx.insert(wordQuotesTable).values({
                  sortOrder: quote.sortOrder,
                  text: quote.text,
                  wordDefinitionId: definitionId,
                });
              }
            }
          }
        }
      }
    });
    buffer.length = 0;
  };

  for (const entry of entries) {
    entryNumber++;
    if (entryNumber % 10000 === 0) {
      console.log(`Processed ${entryNumber} entries...`);
    }

    const result = Entry.safeParse(entry);
    if (result.success) {
      buffer.push(result.data);
      if (buffer.length > 10000) {
        await flushBuffer();
      }
    } else {
      throw new Error(
        `❌️ Format error at entry ${entryNumber}: ${result.error}`,
      );
    }
  }

  await flushBuffer();

  console.log(
    `✅️ Done: processed ${entryNumber} entries (written to ${outputFilePath})`,
  );
}

main();
