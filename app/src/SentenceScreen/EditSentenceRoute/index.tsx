import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Sentence } from "../../types";
import {
  convertNumericPinyinToAccentPinyin,
  convertToNumericPinyin,
} from "../../utils/convertPinyin";
import createUUID from "../../utils/createUUID";
import FullScreenDialog from "../../components/common/FullScreenDialog";
import ItemListEditor from "../../components/specific/ItemListEditor";

export default function EditSentenceRoute(props: {
  sentences: Sentence[];
  setSentences: (sentences: Sentence[]) => void;
}) {
  return (
    <ItemListEditor
      items={props.sentences}
      setItems={props.setSentences}
      keyExtractor={(sentence) => sentence.id}
      renderItem={({ item: sentence }) => (
        <View>
          <Text
            variant="bodyMedium"
            style={{ fontFamily: "NotoSansSC_400Regular" }}
          >
            {convertNumericPinyinToAccentPinyin(sentence.pinyinContent)}
          </Text>
          <Text
            variant="bodyLarge"
            style={{ fontFamily: "NotoSansSC_400Regular" }}
          >
            {sentence.chineseContent}
          </Text>
          <Text variant="bodyMedium">{sentence.translationContent}</Text>
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
            title="Add Sentence"
            actionLabel="Add"
            onActionPress={() => {
              onSave({
                id: createUUID(),
                chineseContent: chinese,
                pinyinContent: pinyin,
                translationContent: translation,
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
                  multiline
                  onChangeText={setChinese}
                  style={{ flex: 1, fontFamily: "NotoSansSC_400Regular" }}
                />
                <Button
                  onPress={() => {
                    setPinyin(convertToNumericPinyin(chinese));
                  }}
                >
                  Auto Fill
                </Button>
              </View>
              <TextInput
                label="Pinyin"
                value={pinyin}
                multiline
                onChangeText={setPinyin}
                style={{ fontFamily: "NotoSansSC_400Regular" }}
              />
              <TextInput
                label="Translation"
                value={translation}
                multiline
                onChangeText={setTranslation}
              />
            </View>
          </FullScreenDialog>
        );
      }}
      renderEditItemModal={({ visible, onDismiss, item: sentence, onSave }) => {
        const [chinese, setChinese] = useState(sentence.chineseContent);
        const [pinyin, setPinyin] = useState(sentence.pinyinContent);
        const [translation, setTranslation] = useState(
          sentence.translationContent,
        );

        return (
          <FullScreenDialog
            visible={visible}
            onDismiss={onDismiss}
            title="Edit Sentence"
            actionLabel="Confirm"
            onActionPress={() => {
              onSave({
                id: sentence.id,
                chineseContent: chinese,
                pinyinContent: pinyin,
                translationContent: translation,
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
                  multiline
                  onChangeText={setChinese}
                  style={{ flex: 1, fontFamily: "NotoSansSC_400Regular" }}
                />
                <Button
                  onPress={() => {
                    setPinyin(convertToNumericPinyin(chinese));
                  }}
                >
                  Auto Fill
                </Button>
              </View>
              <TextInput
                label="Pinyin"
                value={pinyin}
                multiline
                onChangeText={setPinyin}
                style={{ fontFamily: "NotoSansSC_400Regular" }}
              />
              <TextInput
                label="Translation"
                value={translation}
                multiline
                onChangeText={setTranslation}
              />
            </View>
          </FullScreenDialog>
        );
      }}
    />
  );
}
