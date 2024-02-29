import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Vocabulary } from "../../types";
import FullScreenDialog from "../../components/common/FullScreenDialog";
import ItemListEditor from "../../components/specific/ItemListEditor";
import createUUID from "../../utils/createUUID";
import {
  convertNumericPinyinToAccentPinyin,
  convertToNumericPinyin,
} from "../../utils/convertPinyin";
import ccCedict from "../../data/ccCedict";

const vocabularyDictionary = ccCedict.map((entry) => ({
  chinese: entry.simplified_chinese,
  pinyin: entry.pinyin,
  translation: entry.definitions.join(", "),
}));

export default function EditVocabularyRoute(props: {
  vocabularies: Vocabulary[];
  setVocabularies: (vocabularies: Vocabulary[]) => void;
}) {
  return (
    <ItemListEditor
      items={props.vocabularies}
      setItems={props.setVocabularies}
      keyExtractor={(vocabulary) => vocabulary.id}
      renderItem={({ item: vocabulary }) => (
        <View>
          <Text
            variant="bodyMedium"
            style={{ fontFamily: "NotoSansSC_400Regular" }}
          >
            {convertNumericPinyinToAccentPinyin(vocabulary.pinyin)}
          </Text>
          <Text
            variant="bodyLarge"
            style={{ fontFamily: "NotoSansSC_400Regular" }}
          >
            {vocabulary.chinese}
          </Text>
          <Text variant="bodyMedium">{vocabulary.translation}</Text>
        </View>
      )}
      renderAddItemModal={({ visible, onDismiss, onSave }) => {
        const [chinese, setChinese] = useState("");
        const [pinyin, setPinyin] = useState("");
        const [translation, setTranslation] = useState("");

        return (
          <FullScreenDialog
            visible={visible}
            onDismiss={onDismiss}
            title="Add Vocabulary"
            actionLabel="Add"
            onActionPress={() => {
              onSave({
                id: createUUID(),
                chinese: chinese,
                pinyin: pinyin,
                translation: translation,
              });
              onDismiss();
            }}
          >
            <View style={{ gap: 6 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 6,
                }}
              >
                <TextInput
                  label="Chinese"
                  value={chinese}
                  onChangeText={setChinese}
                  style={{ flex: 1, fontFamily: "NotoSansSC_400Regular" }}
                />
                <Button
                  onPress={() => {
                    const vocabulary = vocabularyDictionary.find(
                      (entry) => entry.chinese === chinese,
                    );
                    if (vocabulary !== undefined) {
                      setPinyin(vocabulary.pinyin);
                      setTranslation(vocabulary.translation);
                    } else {
                      setPinyin(convertToNumericPinyin(chinese));
                    }
                  }}
                >
                  Auto Fill
                </Button>
              </View>
              <TextInput
                label="Pinyin"
                value={pinyin}
                onChangeText={setPinyin}
                style={{ fontFamily: "NotoSansSC_400Regular" }}
              />
              <TextInput
                label="Translation"
                value={translation}
                onChangeText={setTranslation}
              />
            </View>
          </FullScreenDialog>
        );
      }}
      renderEditItemModal={({
        visible,
        onDismiss,
        item: vocabulary,
        onSave,
      }) => {
        const [chinese, setChinese] = useState(vocabulary.chinese);
        const [pinyin, setPinyin] = useState(vocabulary.pinyin);
        const [translation, setTranslation] = useState(vocabulary.translation);

        return (
          <FullScreenDialog
            visible={visible}
            onDismiss={onDismiss}
            title="Edit Vocabulary"
            actionLabel="Confirm"
            onActionPress={() => {
              onSave({
                id: vocabulary.id,
                chinese: chinese,
                pinyin: pinyin,
                translation: translation,
              });
              onDismiss();
            }}
          >
            <View style={{ gap: 6 }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 6,
                }}
              >
                <TextInput
                  label="Chinese"
                  value={chinese}
                  onChangeText={setChinese}
                  style={{ flex: 1, fontFamily: "NotoSansSC_400Regular" }}
                />
                <Button
                  onPress={() => {
                    const vocabulary = vocabularyDictionary.find(
                      (entry) => entry.chinese === chinese,
                    );
                    if (vocabulary !== undefined) {
                      setPinyin(vocabulary.pinyin);
                      setTranslation(vocabulary.translation);
                    } else {
                      setPinyin(convertToNumericPinyin(chinese));
                    }
                  }}
                >
                  Auto Fill
                </Button>
              </View>
              <TextInput
                label="Pinyin"
                value={pinyin}
                onChangeText={setPinyin}
                style={{ fontFamily: "NotoSansSC_400Regular" }}
              />
              <TextInput
                label="Translation"
                value={translation}
                onChangeText={setTranslation}
              />
            </View>
          </FullScreenDialog>
        );
      }}
    />
  );
}
