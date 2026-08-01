import { writeFile } from "fs/promises";

const licenseFilePath = "./output/hsk/LICENSE.txt";

const licenseText = `
This data is derived from HSK 3.0 Vocabulary Lists.
Original source: https://github.com/elkmovie/hsk30

License: MIT License
Full license: https://github.com/elkmovie/hsk30?tab=MIT-1-ov-file
SPDX-License-Identifier: MIT

Changes made: Converted to SQLite format. No changes to content.
Converted by: chvmvd (https://github.com/chvmvd/)

---------------------------------------------------------

MIT License

Copyright (c) 2021 Pleco Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

async function main() {
  await writeFile(licenseFilePath, licenseText.trim() + "\n", "utf-8");
  console.log(`✅️ Done: written to ${licenseFilePath}`);
}

main();
