// https://github.com/elkmovie/hsk30
import { createReadStream } from "fs";
import readline from "readline";
import { drizzle } from "drizzle-orm/libsql";
import { headCharactersTable, headwordsTable } from "../db/schema/hsk.js";

const hskCharacterFilePath = "./data/hsk/character.txt";
const hskWordFilePath = "./data/hsk/word.txt";
const outputFilePath = "file:./output/hsk/hsk.db";

const db = drizzle({ connection: outputFilePath, casing: "snake_case" });

async function main() {
  let totalLineNumber = 0;

  {
    const fileStream = createReadStream(hskCharacterFilePath, {
      encoding: "utf-8",
    });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;

    let hskLevel: number | null = null;

    await db.transaction(async (tx) => {
      for await (const line of rl) {
        totalLineNumber++;
        lineNumber++;

        if (line.startsWith("#") || line.trim() === "") continue;

        if (line.trim() === "一级汉字表") {
          hskLevel = 1;
          continue;
        } else if (line.trim() === "二级汉字表") {
          hskLevel = 2;
          continue;
        } else if (line.trim() === "三级汉字表") {
          hskLevel = 3;
          continue;
        } else if (line.trim() === "四级汉字表") {
          hskLevel = 4;
          continue;
        } else if (line.trim() === "五级汉字表") {
          hskLevel = 5;
          continue;
        } else if (line.trim() === "六级汉字表") {
          hskLevel = 6;
          continue;
        } else if (line.trim() === "七一九级汉字表") {
          hskLevel = 7;
          continue;
        } else if (line.trim() === "初等手写字表" || line.trim() === "中等手写字表" || line.trim() === "高等手写字表") {
          hskLevel = null;
          continue;
        }

        const match = line.match(/^\d+\t(\S)$/u);
        if (!match) {
          throw new Error(`❌️ Format error at line ${lineNumber} in ${hskCharacterFilePath}: ${line}`);
        }
        const [, character] = match;

        if (hskLevel !== null) {
          await tx.insert(headCharactersTable).values({
            character,
            level: hskLevel,
          });
        }
      }
    });
  }

  {
    const fileStream = createReadStream(hskWordFilePath, {
      encoding: "utf-8",
    });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineNumber = 0;

    let hskLevel: number | null = null;

    await db.transaction(async (tx) => {
      for await (const line of rl) {
        totalLineNumber++;
        lineNumber++;

        if (line.startsWith("#") || line.trim() === "") continue;

        if (line.trim() === "一级词汇表") {
          hskLevel = 1;
          continue;
        } else if (line.trim() === "二级词汇表") {
          hskLevel = 2;
          continue;
        } else if (line.trim() === "三级词汇表") {
          hskLevel = 3;
          continue;
        } else if (line.trim() === "四级词汇表") {
          hskLevel = 4;
          continue;
        } else if (line.trim() === "五级词汇表") {
          hskLevel = 5;
          continue;
        } else if (line.trim() === "六级词汇表") {
          hskLevel = 6;
          continue;
        } else if (line.trim() === "七一九级词汇表") {
          hskLevel = 7;
          continue;
        }

        if (hskLevel === null) {
          throw new Error(
            `❌️ HSK level not set at line ${lineNumber} in ${hskWordFilePath}: ${line}`,
          );
        }

        const match = line.match(/^\d+\s(\S+)$/u);
        if (!match) {
          throw new Error(`❌️ Format error at line ${lineNumber} in ${hskWordFilePath}: ${line}`);
        }
        const [, word] = match;

        await tx.insert(headwordsTable).values({
          word,
          level: hskLevel,
        });
      }
    });
  }

  console.log(
    `✅️ Done: processed ${totalLineNumber} lines (written to ${outputFilePath})`,
  );
}

main();
