// https://www.unicode.org/reports/tr38/
import { createReadStream } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";
import readline from "readline";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { headCharactersTable } from "../db/schema/unihan.js";

const inputDirPath = "./data/unihan";
const outputFilePath = "file:./output/unihan/unihan.db";

const db = drizzle({ connection: outputFilePath, casing: "snake_case" });

async function main() {
  const files = await readdir(inputDirPath);

  let totalLineNumber = 0;

  const buffer: { character: string; field: string; value: string }[] = [];

  const flushBuffer = async () => {
    await db.transaction(async (tx) => {
      for (const entry of buffer) {
        const existingEntries = await tx
          .select()
          .from(headCharactersTable)
          .where(eq(headCharactersTable.character, entry.character));
        if (existingEntries.length === 0) {
          await tx
            .insert(headCharactersTable)
            .values({ character: entry.character, [entry.field]: entry.value });
        } else {
          await tx
            .update(headCharactersTable)
            .set({ [entry.field]: entry.value })
            .where(eq(headCharactersTable.character, entry.character));
        }
      }
    });
    buffer.length = 0;
  };

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
      totalLineNumber++;
      lineNumber++;

      if (totalLineNumber % 100000 === 0) {
        console.log(`Processed ${totalLineNumber} lines...`);
      }

      if (line.startsWith("#") || line.trim() === "") continue;

      // Line Format: the Unicode Scalar Value<TAB>the property name<TAB>the value for the property for the given Unicode Scalar Value
      const match = line.match(/^(U\+[0-9A-F]{4,6})\t(\S+)\t([^\t]+)$/);
      if (!match) {
        throw new Error(
          `❌️ Format error at line ${lineNumber} in ${file}: ${line}`,
        );
      }
      const [, codepoint, field, value] = match;
      const fields = Object.keys(headCharactersTable);
      if (!fields.includes(field)) {
        throw new Error(
          `❌️ Unknown field "${field}" at line ${lineNumber} in ${file}`,
        );
      }
      buffer.push({
        character: String.fromCodePoint(parseInt(codepoint.slice(2), 16)),
        field,
        value,
      });

      if (buffer.length > 10000) {
        await flushBuffer();
      }
    }
  }

  await flushBuffer();

  console.log(
    `✅️ Done: processed ${totalLineNumber} lines (written to ${outputFilePath})`,
  );
}

main();
