export type Module = {
  id: string;
  title: string;
};

export type Speaker = {
  id: string;
  chineseName: string;
  pinyinName: string;
  translationName: string;
};

export type Conversation = {
  id: string;
  speakerIds: string[];
  chineseContent: string;
  pinyinContent: string;
  translationContent: string;
};

export type Sentence = {
  id: string;
  chineseContent: string;
  pinyinContent: string;
  translationContent: string;
};

export type Vocabulary = {
  id: string;
  chinese: string;
  pinyin: string;
  translation: string;
};

export type Character = {
  id: string;
  chinese: string;
  pinyin: string;
  translation: string;
};

export type ExportedJSON = {
  id: string;
  title: string;
  speakers: Speaker[];
  conversations: Conversation[];
  sentences: Sentence[];
  vocabularies: Vocabulary[];
  characters: Character[];
}[];
