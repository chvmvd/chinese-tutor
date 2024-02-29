import ccCedictJSONData from "./../../assets/data/cc_cedict.json";

const ccCedict = ccCedictJSONData as {
  simplified_chinese: string;
  traditional_chinese: string;
  pinyin: string;
  definitions: string[];
}[];

export default ccCedict;
