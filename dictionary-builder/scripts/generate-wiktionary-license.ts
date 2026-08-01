import { writeFile } from "fs/promises";

const licenseFilePath = "./output/wiktionary/LICENSE.txt";

const licenseText = `
This data is derived from Kaikki.org.
Original source: https://kaikki.org/

License: Creative Commons Attribution Share Alike 4.0 International
Full license: https://creativecommons.org/licenses/by-sa/4.0/legalcode
SPDX-License-Identifier: CC-BY-SA-4.0

Changes made: Converted to SQLite format. No changes to content.
Converted by: chvmvd (https://github.com/chvmvd/)
`;

async function main() {
  await writeFile(licenseFilePath, licenseText.trim() + "\n", "utf-8");
  console.log(`✅️ Done: written to ${licenseFilePath}`);
}

main();
