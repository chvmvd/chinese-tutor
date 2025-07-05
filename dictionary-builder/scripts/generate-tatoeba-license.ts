import { writeFile } from "fs/promises";

const licenseFilePath = "./output/tatoeba/LICENSE.txt";

const licenseText = `
This data is derived from Tatoeba.
Original source: https://tatoeba.org/

License: CC BY 2.0 FR
Full license: https://creativecommons.org/licenses/by/2.0/fr/legalcode

Changes made: Converted to SQLite format. No changes to content.
Converted by: chvmvd (https://github.com/chvmvd/)
`;

async function main() {
  await writeFile(licenseFilePath, licenseText.trim() + "\n", "utf-8");
  console.log(`✅️ Done: written to ${licenseFilePath}`);
}

main();
