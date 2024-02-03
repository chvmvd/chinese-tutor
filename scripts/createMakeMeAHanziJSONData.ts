// @ts-ignore
import * as fs from "fs";
// @ts-ignore
import * as readline from "readline";

interface CharacterData {
  character: string;
  definition: string;
  pinyin: string[];
  decomposition: string;
  radical: string;
  matches: (number[] | null)[];
  strokes: string[];
  medians: number[][][];
}

async function readJsonLines(filePath: string): Promise<CharacterData[]> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const entries: CharacterData[] = [];
  for await (const line of rl) {
    try {
      const entry: CharacterData = JSON.parse(line);
      entries.push(entry);
    } catch (error) {
      console.error(
        `Error parsing JSON from line in file ${filePath}: ${error}`
      );
    }
  }
  return entries;
}

async function mergeData(
  filePath1: string,
  filePath2: string,
  outputPath: string
): Promise<void> {
  const data1 = await readJsonLines(filePath1);
  const data2 = await readJsonLines(filePath2);

  // Create a map from data2 for easy lookup
  const data2Map = new Map(data2.map((item) => [item.character, item]));

  const mergedData = data1.map((item) => {
    const match = data2Map.get(item.character);
    if (match) {
      return {
        ...item,
        ...match,
      };
    }
    return item;
  });

  // Save merged data to JSON file
  fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), "utf-8");
  console.log(`Merged JSON has been written to ${outputPath}`);
}

const filePath1 = "./assets/data/makemeahanzi_dictionary.txt";
const filePath2 = "./assets/data/makemeahanzi_graphics.txt";
const outputPath = "./assets/data/makemeahanzi.json";

mergeData(filePath1, filePath2, outputPath).catch(console.error);
