// https://www.unicode.org/reports/tr38/
import { createReadStream } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";
import readline from "readline";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { INPUT_DIR_PATH, OUTPUT_DIR_PATH } from "./path.js";

const inputDirPath = join(INPUT_DIR_PATH, "unihan");
const outputFilePath = join(OUTPUT_DIR_PATH, "unihan/unihan.db");

// https://www.unicode.org/reports/tr38/#N10260
const FIELDS = [
  "kAccountingNumeric",
  "kAlternateTotalStrokes",
  "kBigFive",
  "kCangjie",
  "kCantonese",
  "kCCCII",
  "kCheungBauer",
  "kCheungBauerIndex",
  "kCihaiT",
  "kCNS1986",
  "kCNS1992",
  "kCompatibilityVariant",
  "kCowles",
  "kDaeJaweon",
  "kDefinition",
  "kEACC",
  "kFanqie",
  "kFenn",
  "kFennIndex",
  "kFourCornerCode",
  "kGB0",
  "kGB1",
  "kGB3",
  "kGB5",
  "kGB7",
  "kGB8",
  "kGradeLevel",
  "kGSR",
  "kHangul",
  "kHanYu",
  "kHanyuPinlu",
  "kHanyuPinyin",
  "kHDZRadBreak",
  "kHKGlyph",
  "kIBMJapan",
  "kIICore",
  "kIRG_GSource",
  "kIRG_HSource",
  "kIRG_JSource",
  "kIRG_KPSource",
  "kIRG_KSource",
  "kIRG_MSource",
  "kIRG_SSource",
  "kIRG_TSource",
  "kIRG_UKSource",
  "kIRG_USource",
  "kIRG_VSource",
  "kIRGDaeJaweon",
  "kIRGHanyuDaZidian",
  "kIRGKangXi",
  "kJa",
  "kJapanese",
  "kJapaneseKun",
  "kJapaneseOn",
  "kJinmeiyoKanji",
  "kJis0",
  "kJis1",
  "kJIS0213",
  "kJoyoKanji",
  "kKangXi",
  "kKarlgren",
  "kKorean",
  "kKoreanEducationHanja",
  "kKoreanName",
  "kLau",
  "kMainlandTelegraph",
  "kMandarin",
  "kMatthews",
  "kMeyerWempe",
  "kMojiJoho",
  "kMorohashi",
  "kNelson",
  "kOtherNumeric",
  "kPhonetic",
  "kPrimaryNumeric",
  "kPseudoGB1",
  "kRSAdobe_Japan1_6",
  "kRSUnicode",
  "kSBGY",
  "kSemanticVariant",
  "kSimplifiedVariant",
  "kSMSZD2003Index",
  "kSMSZD2003Readings",
  "kSpecializedSemanticVariant",
  "kSpoofingVariant",
  "kStrange",
  "kTaiwanTelegraph",
  "kTang",
  "kTGH",
  "kTGHZ2013",
  "kTotalStrokes",
  "kTraditionalVariant",
  "kUnihanCore2020",
  "kVietnamese",
  "kVietnameseNumeric",
  "kXerox",
  "kXHC1983",
  "kZhuang",
  "kZhuangNumeric",
  "kZVariant",
];

const db = await open({
  filename: outputFilePath,
  driver: sqlite3.Database,
});

try {
  await db.exec(`
    DROP TABLE IF EXISTS entries;

    CREATE TABLE entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character TEXT NOT NULL UNIQUE,
      ${FIELDS.map((field) => `${field} TEXT`).join(",\n")}
    );

    CREATE INDEX idx_entries_character ON entries(character);
    CREATE INDEX idx_entries_kHanyuPinyin ON entries(kHanyuPinyin);
  `);

  const files = await readdir(inputDirPath);

  let counter = 0;

  await db.exec("BEGIN TRANSACTION");

  for (const file of files) {
    if (!file.startsWith("Unihan_") || !file.endsWith(".txt")) {
      throw new Error(`❌️ Unexpected file name: ${file}`);
    }

    const inputFilePath = join(inputDirPath, file);

    const fileStream = createReadStream(inputFilePath, { encoding: "utf-8" });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;

    for await (const line of rl) {
      counter++;
      lineNumber++;
      if (line.startsWith("#") || line.trim() === "") continue;
      // Line Format: the Unicode Scalar Value<TAB>the property name<TAB>the value for the property for the given Unicode Scalar Value
      const match = line.match(/^(U\+[0-9A-F]{4,6})\t(\S+)\t([^\t]+)$/);
      if (!match) {
        throw new Error(
          `❌️ Format error at line ${lineNumber} in ${file}: ${line}`,
        );
      }

      const [, codepoint, field, value] = match;
      if (!FIELDS.includes(field)) {
        throw new Error(
          `❌️ Unknown field "${field}" at line ${lineNumber} in ${file}`,
        );
      }

      await db.run(
        `
        INSERT INTO entries (character, ${field})
        VALUES (?, ?)
        ON CONFLICT(character) DO UPDATE SET
          ${field} = excluded.${field}
      `,
        String.fromCodePoint(parseInt(codepoint.slice(2), 16)),
        value,
      );

      if (counter % 10000 === 0) {
        await db.exec("COMMIT");
        await db.exec("BEGIN TRANSACTION");
        console.log(`Processed ${counter} lines...`);
      }
    }
  }

  await db.exec("COMMIT");

  console.log(
    `✅️ Done: processed ${counter} lines (written to ${outputFilePath})`,
  );
} catch (error) {
  await db.exec("ROLLBACK");
  console.error(error);
} finally {
  await db.close();
}
