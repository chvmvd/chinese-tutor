// @ts-ignore
import * as fs from "fs";
// @ts-ignore
import * as readline from "readline";

type CcCedictEntry = {
  traditional_chinese: string;
  simplified_chinese: string;
  pinyin: string;
  definitions: string[];
};

async function convertToJSON(
  filePath: string,
  outputPath: string
): Promise<void> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const entries: CcCedictEntry[] = [];

  for await (const line of rl) {
    // Skip comments and empty lines.
    if (line.startsWith("#") || !line.trim()) continue;

    const match = line.match(/(\S+)\s(\S+)\s\[(.*?)\]\s\/(.*)\//);
    if (match) {
      const [, traditional, simplified, pinyin, definitionString] = match;
      const definitions = definitionString
        .split("/")
        // @ts-ignore
        .map((definition) => definition.trim())
        // @ts-ignore
        .filter((definition) => definition.length > 0);
      entries.push({
        traditional_chinese: traditional,
        simplified_chinese: simplified,
        pinyin,
        definitions,
      });
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2), "utf-8");
  console.log(`Finished writing JSON to ${outputPath}.`);
}

const filePath = "./assets/data/cc_cedict.txt";
const outputPath = "./assets/data/cc_cedict.json";
convertToJSON(filePath, outputPath).catch(console.error);
