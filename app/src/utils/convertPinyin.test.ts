import { convertNumericPinyinToAccentPinyin } from "./convertPinyin";

describe("convertNumericPinyinToAccentPinyin", () => {
  it('given "wo3" returns "wǒ"', () => {
    expect(convertNumericPinyinToAccentPinyin("wo3")).toBe("wǒ");
  });
});
