import { writeFile } from "fs/promises";
import { join } from "path";
import { OUTPUT_DIR_PATH } from "./path.js";

const outputPath = join(OUTPUT_DIR_PATH, "version.json");

const versions = {
  cc_cedict: "0.1.0",
  unihan: "0.1.0",
};

async function run() {
  await writeFile(outputPath, JSON.stringify(versions, null, 2), "utf-8");
  console.log(`✅️ version.json written to ${outputPath}`);
}

run();
