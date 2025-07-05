import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const INPUT_DIR_PATH = join(__dirname, "../data");
export const OUTPUT_DIR_PATH = join(__dirname, "../dictionaries");
