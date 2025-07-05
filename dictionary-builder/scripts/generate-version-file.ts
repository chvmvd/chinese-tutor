import { writeFile } from "fs/promises";

const outputFilePath = "./output/version.json";

const versions = {
  cccedict: "0.1.0",
  unihan: "0.1.0",
  wiktionary: "0.1.0",
  tatoeba: "0.1.0",
  makemeahanzi: "0.1.0",
  moedict: "0.1.0",
  hsk: "0.1.0",
};

async function main() {
  await writeFile(outputFilePath, JSON.stringify(versions, null, 2), "utf-8");
  console.log(`✅️ Done: written to ${outputFilePath}`);
}

main();
