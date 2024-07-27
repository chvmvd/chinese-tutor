import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Character, Vocabulary } from "../../types";
import FullScreenDialog from "../../components/common/FullScreenDialog";
import ItemListEditor from "../../components/specific/ItemListEditor";
import createUUID from "../../utils/createUUID";
import {
  convertNumericPinyinToAccentPinyin,
  convertToNumericPinyin,
} from "../../utils/convertPinyin";
import makeMeAHanzi from "../../data/makeMeAHanzi";

const characterDictionary = makeMeAHanzi.map((entry) => ({
  chinese: entry.character,
  pinyin: entry.pinyin.join(", "),
  translation: entry.definition,
}));

export default function EditCharacterRoute(props: {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
}) {
  return (
    <ItemListEditor
      items={props.characters}
      setItems={props.setCharacters}
      keyExtractor={(character) => character.id}
      renderItem={({ item: character }) => (
        <View>
          <Text
            variant="bodyMedium"
            style={{ fontFamily: "NotoSansSC_400Regular" }}
          >
            {convertNumericPinyinToAccentPinyin(character.pinyin)}
          </Text>
          <Text
            variant="bodyLarge"
            style={{ fontFamily: "NotoSansSC_400Regular" }}
          >
            {character.chinese}
          </Text>
          <Text variant="bodyMedium">{character.translation}</Text>
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
            title="Add Character"
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
                    const character = characterDictionary.find(
                      (entry) => entry.chinese === chinese,
                    );
                    if (character !== undefined) {
                      setPinyin(character.pinyin);
                      setTranslation(character.translation);
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
        item: character,
        onSave,
      }) => {
        const [chinese, setChinese] = useState(character.chinese);
        const [pinyin, setPinyin] = useState(character.pinyin);
        const [translation, setTranslation] = useState(character.translation);

        return (
          <FullScreenDialog
            visible={visible}
            onDismiss={onDismiss}
            title="Edit Character"
            actionLabel="Confirm"
            onActionPress={() => {
              onSave({
                id: character.id,
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
                    setPinyin(convertToNumericPinyin(chinese));
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
