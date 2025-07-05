// https://kaikki.org/dictionary/rawdata.html
// Format: https://github.com/tatuylonen/wiktextract?tab=readme-ov-file#format-of-the-extracted-word-entries
import { createReadStream } from "fs";
import { join } from "path";
import readline from "readline";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { z } from "zod/v4";
import { INPUT_DIR_PATH, OUTPUT_DIR_PATH } from "./path.js";

const inputFilePath = join(INPUT_DIR_PATH, "wiktionary-chinese.jsonl");
const outputFilePath = join(
  OUTPUT_DIR_PATH,
  "wiktionary/wiktionary-chinese.db",
);

const HardRedirectEntry = z
  .strictObject({
    title: z.string(),
    redirect: z.string(),
    pos: z.literal("hard-redirect"),
  })
  .transform((entry) => ({
    type: "hard-redirect-entry" as const,
    word: entry.title,
    redirectTarget: entry.redirect,
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
    word: entry.word,
    redirectTargets: entry.redirects,
  }));

const Glosses = z.array(z.string()).transform((glosses) =>
  glosses.map((gloss, glossOrder) => ({
    glossOrder,
    gloss,
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
    examples.map((example, exampleOrder) => ({
      exampleOrder,
      languageVariant: example.tags?.includes("Traditional Chinese")
        ? ("Traditional Chinese" as const)
        : example.tags?.includes("Simplified Chinese")
          ? ("Simplified Chinese" as const)
          : null,
      text: example.text,
      roman: example.roman ?? null,
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
    senses.map((sense, senseOrder) => ({
      senseOrder,
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
    forms.map((form, formOrder) => ({
      formOrder,
      languageVariant: form.tags?.includes("Traditional Chinese")
        ? ("Traditional Chinese" as const)
        : form.tags?.includes("Simplified Chinese")
          ? ("Simplified Chinese" as const)
          : null,
      form: form.form,
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
      .map((translation, translationOrder) => ({
        translationOrder,
        langCode: translation.lang_code,
        translatedWord: translation.word,
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
      .map((synonym, synonymOrder) => ({
        synonymOrder,
        languageVariant: synonym.tags?.includes("Traditional Chinese")
          ? ("Traditional Chinese" as const)
          : ("Simplified Chinese" as const),
        word: synonym.word,
        roman: synonym.roman ?? null,
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
      .map((derivation, derivationOrder) => ({
        derivationOrder,
        languageVariant: derivation.tags?.includes("Traditional Chinese")
          ? ("Traditional Chinese" as const)
          : ("Simplified Chinese" as const),
        word: derivation.word,
        roman: derivation.roman ?? null,
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

const db = await open({
  filename: outputFilePath,
  driver: sqlite3.Database,
});

try {
  await db.exec(`
    DROP TABLE IF EXISTS hard_redirect_entries;
    DROP TABLE IF EXISTS soft_redirect_targets;
    DROP TABLE IF EXISTS soft_redirect_entries;
    DROP TABLE IF EXISTS glosses;
    DROP TABLE IF EXISTS examples;
    DROP TABLE IF EXISTS senses;
    DROP TABLE IF EXISTS forms;
    DROP TABLE IF EXISTS translations;
    DROP TABLE IF EXISTS synonyms;
    DROP TABLE IF EXISTS derivations;
    DROP TABLE IF EXISTS normal_entries;

    CREATE TABLE hard_redirect_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      redirect_target TEXT NOT NULL
    );

    CREATE TABLE soft_redirect_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL
    );

    CREATE TABLE soft_redirect_targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      soft_redirect_entry_id INTEGER NOT NULL,
      redirect_target TEXT NOT NULL,
      FOREIGN KEY (soft_redirect_entry_id) REFERENCES soft_redirect_entries(id)
    );

    CREATE TABLE normal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      pos TEXT NOT NULL,
      etymology_text TEXT,
      pinyin TEXT,
      bopomofo TEXT,
      audio_url TEXT
    );

    CREATE TABLE senses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      normal_entry_id INTEGER NOT NULL,
      sense_order INTEGER NOT NULL,
      FOREIGN KEY (normal_entry_id) REFERENCES normal_entries(id)
    );

    CREATE TABLE glosses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sense_id INTEGER NOT NULL,
      gloss_order INTEGER NOT NULL,
      gloss TEXT NOT NULL,
      FOREIGN KEY (sense_id) REFERENCES senses(id)
    );

    CREATE TABLE examples (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sense_id INTEGER NOT NULL,
      example_order INTEGER NOT NULL,
      language_variant TEXT CHECK (language_variant IN ('Traditional Chinese', 'Simplified Chinese')),
      text TEXT NOT NULL,
      roman TEXT,
      FOREIGN KEY (sense_id) REFERENCES senses(id)
    );

    CREATE TABLE forms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      normal_entry_id INTEGER NOT NULL,
      form_order INTEGER NOT NULL,
      language_variant TEXT CHECK (language_variant IN ('Traditional Chinese', 'Simplified Chinese')),
      form TEXT NOT NULL,
      FOREIGN KEY (normal_entry_id) REFERENCES normal_entries(id)
    );

    CREATE TABLE translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      normal_entry_id INTEGER NOT NULL,
      translation_order INTEGER NOT NULL,
      lang_code TEXT NOT NULL CHECK (lang_code IN ('en', 'ja')),
      translated_word TEXT NOT NULL,
      FOREIGN KEY (normal_entry_id) REFERENCES normal_entries(id)
    );

    CREATE TABLE synonyms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      normal_entry_id INTEGER NOT NULL,
      synonym_order INTEGER NOT NULL,
      language_variant TEXT NOT NULL CHECK (language_variant IN ('Traditional Chinese', 'Simplified Chinese')),
      word TEXT NOT NULL,
      roman TEXT,
      FOREIGN KEY (normal_entry_id) REFERENCES normal_entries(id)
    );

    CREATE TABLE derivations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      normal_entry_id INTEGER NOT NULL,
      derivation_order INTEGER NOT NULL,
      language_variant TEXT NOT NULL CHECK (language_variant IN ('Traditional Chinese', 'Simplified Chinese')),
      word TEXT NOT NULL,
      roman TEXT,
      FOREIGN KEY (normal_entry_id) REFERENCES normal_entries(id)
    );

    CREATE INDEX idx_hard_redirect_entries_word ON hard_redirect_entries(word);
    CREATE INDEX idx_soft_redirect_entries_word ON soft_redirect_entries(word);
    CREATE INDEX idx_soft_redirect_targets_soft_redirect_entry_id ON soft_redirect_targets(soft_redirect_entry_id);
    CREATE INDEX idx_normal_entries_word ON normal_entries(word);
    CREATE INDEX idx_normal_entries_pinyin ON normal_entries(pinyin);
    CREATE INDEX idx_normal_entries_bopomofo ON normal_entries(bopomofo);
    CREATE INDEX idx_senses_normal_entry_id ON senses(normal_entry_id);
    CREATE INDEX idx_glosses_sense_id ON glosses(sense_id);
    CREATE INDEX idx_examples_sense_id ON examples(sense_id);
    CREATE INDEX idx_forms_normal_entry_id ON forms(normal_entry_id);
    CREATE INDEX idx_translations_normal_entry_id ON translations(normal_entry_id);
    CREATE INDEX idx_synonyms_normal_entry_id ON synonyms(normal_entry_id);
    CREATE INDEX idx_derivations_normal_entry_id ON derivations(normal_entry_id);
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
    if (line.trim() === "") continue;

    const result = Entry.safeParse(JSON.parse(line));
    if (result.success) {
      if (result.data.type === "hard-redirect-entry") {
        await db.run(
          "INSERT INTO hard_redirect_entries (word, redirect_target) VALUES (?, ?)",
          result.data.word,
          result.data.redirectTarget,
        );
      } else if (result.data.type === "soft-redirect-entry") {
        const entryInsertResult = await db.run(
          "INSERT INTO soft_redirect_entries (word) VALUES (?)",
          result.data.word,
        );
        const entryId = entryInsertResult.lastID;

        for (const redirectTarget of result.data.redirectTargets) {
          await db.run(
            "INSERT INTO soft_redirect_targets (soft_redirect_entry_id, redirect_target) VALUES (?, ?)",
            entryId,
            redirectTarget,
          );
        }
      } else if (result.data.type === "normal-entry") {
        const entryInsertResult = await db.run(
          "INSERT INTO normal_entries (word, pos, etymology_text, pinyin, bopomofo, audio_url) VALUES (?, ?, ?, ?, ?, ?)",
          result.data.word,
          result.data.pos,
          result.data.etymologyText,
          result.data.pinyin,
          result.data.bopomofo,
          result.data.audioUrl,
        );
        const entryId = entryInsertResult.lastID;

        for (const sense of result.data.senses) {
          const senseInsertResult = await db.run(
            "INSERT INTO senses (normal_entry_id, sense_order) VALUES (?, ?)",
            entryId,
            sense.senseOrder,
          );
          const senseId = senseInsertResult.lastID;

          for (const gloss of sense.glosses) {
            await db.run(
              "INSERT INTO glosses (sense_id, gloss_order, gloss) VALUES (?, ?, ?)",
              senseId,
              gloss.glossOrder,
              gloss.gloss,
            );
          }

          for (const example of sense.examples) {
            await db.run(
              "INSERT INTO examples (sense_id, example_order, language_variant, text, roman) VALUES (?, ?, ?, ?, ?)",
              senseId,
              example.exampleOrder,
              example.languageVariant,
              example.text,
              example.roman,
            );
          }
        }

        for (const form of result.data.forms) {
          await db.run(
            "INSERT INTO forms (normal_entry_id, form_order, language_variant, form) VALUES (?, ?, ?, ?)",
            entryId,
            form.formOrder,
            form.languageVariant,
            form.form,
          );
        }

        for (const translation of result.data.translations) {
          await db.run(
            "INSERT INTO translations (normal_entry_id, translation_order, lang_code, translated_word) VALUES (?, ?, ?, ?)",
            entryId,
            translation.translationOrder,
            translation.langCode,
            translation.translatedWord,
          );
        }

        for (const synonym of result.data.synonyms) {
          await db.run(
            "INSERT INTO synonyms (normal_entry_id, synonym_order, language_variant, word, roman) VALUES (?, ?, ?, ?, ?)",
            entryId,
            synonym.synonymOrder,
            synonym.languageVariant,
            synonym.word,
            synonym.roman,
          );
        }

        for (const derivation of result.data.derivations) {
          await db.run(
            "INSERT INTO derivations (normal_entry_id, derivation_order, language_variant, word, roman) VALUES (?, ?, ?, ?, ?)",
            entryId,
            derivation.derivationOrder,
            derivation.languageVariant,
            derivation.word,
            derivation.roman,
          );
        }
      } else {
        continue;
      }
    } else {
      throw new Error(
        `❌️ Format error at line ${lineNumber}: ${result.error}`,
      );
    }

    if (lineNumber % 10000 === 0) {
      await db.exec("COMMIT");
      await db.exec("BEGIN TRANSACTION");
      console.log(`Processed ${lineNumber} lines...`);
    }
  }

  await db.exec(`
    DELETE FROM hard_redirect_entries
    WHERE redirect_target NOT IN (
      SELECT DISTINCT word FROM normal_entries
    );
  `);

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
