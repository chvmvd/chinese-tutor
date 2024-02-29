import { convert, pinyin } from "pinyin-pro";
// @ts-ignore
import { Segment, useDefault, cnPOSTag } from "segmentit";

export function convertToNumericPinyin(
  chineseText: string,
  options?: { mode: "normal" | "surname" },
): string {
  const segmentit = useDefault(new Segment());
  const segmentResults: { p: number; w: string }[] =
    segmentit.doSegment(chineseText);
  const wordPosPairs = segmentResults.map((segmentResult) => ({
    word: pinyin(segmentResult.w, {
      toneType: "num",
      mode: options?.mode ?? "normal",
      nonZh: "consecutive",
      v: true,
    }),
    pos: cnPOSTag(segmentResult.p),
  }));

  const pinyinWithCapitalizedNouns = ((wordPosPairs) => {
    let result = "";
    for (const wordPosPair of wordPosPairs) {
      if (wordPosPair.word.length < 1) {
        continue;
      }
      if (["，", "。", "！", "？"].includes(wordPosPair.word)) {
        result += wordPosPair.word;
      } else {
        if (
          result !== "" &&
          !["，", "。", "！", "？"].includes(result[result.length - 1])
        ) {
          result += " ";
        }
        if (
          ["人名", "地名", "机构团体", "其他专名"].includes(wordPosPair.pos)
        ) {
          result +=
            wordPosPair.word[0].toUpperCase() + wordPosPair.word.slice(1);
        } else {
          result += wordPosPair.word;
        }
      }
    }
    return result;
  })(wordPosPairs);

  const capitalizedPinyin = ((pinyinWithCapitalizedNouns) => {
    let sentence = "";
    let result = "";
    for (const character of pinyinWithCapitalizedNouns) {
      if (["，", "。", "！", "？"].includes(character)) {
        sentence += character;
        if (sentence.length <= 1) {
          result += sentence;
          sentence = "";
          continue;
        }
        result += sentence[0].toUpperCase() + sentence.slice(1);
        sentence = "";
      } else {
        sentence += character;
      }
    }
    if (sentence.length <= 1) {
      result += sentence;
    } else {
      result += sentence[0].toUpperCase() + sentence.slice(1);
    }
    return result;
  })(pinyinWithCapitalizedNouns);

  return capitalizedPinyin;
}

export function convertNumericPinyinToAccentPinyin(
  numericPinyin: string,
): string {
  return convert(numericPinyin);
}
