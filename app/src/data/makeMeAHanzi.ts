import makeMeAHanziJSONData from "./../../assets/data/makemeahanzi.json";

const makeMeAHanzi = makeMeAHanziJSONData as {
  character: string;
  definition: string;
  pinyin: string[];
  decomposition: string;
  radical: string;
  matches: (number[] | null)[];
  strokes: string[];
  medians: number[][][];
}[];

export default makeMeAHanzi;
