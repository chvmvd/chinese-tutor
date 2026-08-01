import { writeFile } from "fs/promises";

const licenseFilePath = "./output/moedict/LICENSE.txt";

const licenseText = `
This data is derived from MoeDict, which is based on the original work:
中華民國教育部（Ministry of Education, R.O.C.）。《重編國語辭典修訂本》（版本編號：2015_20250627）網址：http://dict.revised.moe.edu.tw/
Original source: https://github.com/g0v/moedict-data

License: CC BY-ND 3.0 TW
Full license: https://creativecommons.org/licenses/by-nd/3.0/tw/legalcode

Changes made: Converted to SQLite format. No changes to content.
Converted by: chvmvd (https://github.com/chvmvd/)
`;

async function main() {
  await writeFile(licenseFilePath, licenseText.trim() + "\n", "utf-8");
  console.log(`✅️ Done: written to ${licenseFilePath}`);
}

main();
