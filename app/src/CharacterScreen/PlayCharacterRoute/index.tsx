import { useState } from "react";
import { ImageBackground, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import * as Speech from "expo-speech";
import BottomDrawer from "../../components/common/BottomDrawer";
import ChineseCharacterGlyph from "../../components/common/ChineseCharacterGlyph";
import ChineseCharacterStrokeOrderDisplay from "../../components/common/ChineseCharacterStrokeOrderDisplay";
import PracticeModal from "../../components/specific/PracticeModal";
import PreviewModal from "../../components/specific/PreviewModal";
import makeMeAHanzi from "../../data/makeMeAHanzi";
import { convertNumericPinyinToAccentPinyin } from "../../utils/convertPinyin";
import { Character } from "../../types";

function PreviewModalButton(props: { characters: Character[] }) {
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const showPreviewModal = () => setIsPreviewModalVisible(true);
  const hidePreviewModal = () => setIsPreviewModalVisible(false);

  return (
    <>
      <Button
        mode="contained"
        style={{ padding: 6, borderRadius: 30 }}
        labelStyle={{ fontSize: 20 }}
        onPress={showPreviewModal}
      >
        Preview
      </Button>
      <PreviewModal
        visible={isPreviewModalVisible}
        onDismiss={hidePreviewModal}
        items={props.characters}
        renderContent={(character) => (
          <View
            style={{
              rowGap: 6,
            }}
          >
            <Text style={{ fontSize: 28, fontFamily: "NotoSansSC_400Regular" }}>
              {convertNumericPinyinToAccentPinyin(character.pinyin)}
            </Text>
            {ChineseCharacterGlyph({ character: character.chinese }) ? (
              <ChineseCharacterGlyph
                character={character.chinese}
                characterStyle={{ height: 60, width: 60 }}
              />
            ) : (
              <Text
                style={{ fontSize: 48, fontFamily: "NotoSansSC_400Regular" }}
              >
                {character.chinese}
              </Text>
            )}
            <Text style={{ fontSize: 28 }}>{character.translation}</Text>
          </View>
        )}
        playAudio={(character) => {
          Speech.speak(character.chinese, {
            language: "zh-Hans",
          });
        }}
        renderInfo={(character) => {
          const characterInfo = makeMeAHanzi.find(
            (entry) => entry.character === character.chinese,
          );

          if (characterInfo === undefined) {
            return (
              <View>
                <Text variant="bodyMedium">
                  Sorry, no information available for this character.
                </Text>
              </View>
            );
          }

          return (
            <View style={{ rowGap: 12 }}>
              <ChineseCharacterGlyph
                character={character.chinese}
                characterStyle={{ width: 60, height: 60 }}
              />
              <ChineseCharacterStrokeOrderDisplay
                character={character.chinese}
                characterStyle={{
                  width: 50,
                  height: 50,
                }}
              />
              <Text style={{ fontSize: 20 }}>
                pinyin:{" "}
                <Text style={{ fontFamily: "NotoSansSC_400Regular" }}>
                  {characterInfo.pinyin}
                </Text>
              </Text>
              <Text style={{ fontSize: 20 }}>
                definition: {characterInfo.definition}
              </Text>
            </View>
          );
        }}
      />
    </>
  );
}

function PracticeModalButton(props: { characters: Character[] }) {
  const [isSelectInputTypeDrawerVisible, setIsSelectInputTypeDrawerVisible] =
    useState(false);
  const showSelectInputTypeDrawer = () =>
    setIsSelectInputTypeDrawerVisible(true);
  const hideSelectInputTypeDrawer = () =>
    setIsSelectInputTypeDrawerVisible(false);
  const [selectedInputType, setSelectedInputType] = useState<
    "chinese" | "english" | "pinyin" | "audio"
  >("chinese");
  const handleSelectInputType = (inputType: typeof selectedInputType) => {
    setSelectedInputType(inputType);
    hideSelectInputTypeDrawer();
    showPracticeModal();
  };

  const [isPracticeModalVisible, setIsPracticeModalVisible] = useState(false);
  const showPracticeModal = () => setIsPracticeModalVisible(true);
  const hidePracticeModal = () => setIsPracticeModalVisible(false);

  return (
    <>
      <Button
        mode="contained"
        style={{ padding: 6, borderRadius: 30 }}
        labelStyle={{ fontSize: 20 }}
        onPress={showSelectInputTypeDrawer}
      >
        Practice
      </Button>
      <BottomDrawer
        visible={isSelectInputTypeDrawerVisible}
        onDismiss={hideSelectInputTypeDrawer}
      >
        <View style={{ height: 250 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              columnGap: 6,
            }}
          >
            <IconButton
              icon="close"
              onPress={hideSelectInputTypeDrawer}
              style={{ margin: 0 }}
            />
            <Text variant="bodyLarge">Select what you want to practice.</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 16,
              gap: 20,
            }}
          >
            {(
              [
                {
                  key: "chinese",
                  label: "Chinese",
                  iconName: "translate",
                },
                {
                  key: "english",
                  label: "English",
                  iconName: "account-voice",
                },
                {
                  key: "pinyin",
                  label: "Pinyin",
                  iconName: "alphabet-latin",
                },
                {
                  key: "audio",
                  label: "Audio",
                  iconName: "volume-high",
                },
              ] as {
                key: typeof selectedInputType;
                label: string;
                iconName: string;
              }[]
            ).map((inputItem) => (
              <View
                key={inputItem.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  icon={inputItem.iconName}
                  size={48}
                  onPress={() => {
                    handleSelectInputType(inputItem.key);
                  }}
                  style={{
                    margin: 0,
                  }}
                />
                <Text variant="labelMedium">{inputItem.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </BottomDrawer>
      <PracticeModal
        visible={isPracticeModalVisible}
        onDismiss={hidePracticeModal}
        questions={props.characters}
        keyExtractor={(character) => character.id}
        titleExtractor={(character) => character.chinese}
        renderQuestion={(character) => {
          switch (selectedInputType) {
            case "chinese":
              return ChineseCharacterGlyph({ character: character.chinese }) ? (
                <ChineseCharacterGlyph
                  character={character.chinese}
                  characterStyle={{ width: 60, height: 60 }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 48,
                    fontFamily: "NotoSansSC_400Regular",
                  }}
                >
                  {character.chinese}
                </Text>
              );
            case "english":
              return (
                <Text style={{ fontSize: 28 }}>{character.translation}</Text>
              );
            case "pinyin":
              return (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: "NotoSansSC_400Regular",
                  }}
                >
                  {convertNumericPinyinToAccentPinyin(character.pinyin)}
                </Text>
              );
            case "audio":
              return (
                <IconButton
                  icon="volume-high"
                  size={80}
                  onPress={() => {
                    Speech.speak(character.chinese, {
                      language: "zh-Hans",
                    });
                  }}
                />
              );
          }
        }}
        renderAnswer={(character) => (
          <View
            style={{
              rowGap: 6,
            }}
          >
            <Text style={{ fontSize: 28, fontFamily: "NotoSansSC_400Regular" }}>
              {convertNumericPinyinToAccentPinyin(character.pinyin)}
            </Text>
            {ChineseCharacterGlyph({ character: character.chinese }) ? (
              <ChineseCharacterGlyph
                character={character.chinese}
                characterStyle={{ width: 60, height: 60 }}
              />
            ) : (
              <Text
                style={{ fontSize: 48, fontFamily: "NotoSansSC_400Regular" }}
              >
                {character.chinese}
              </Text>
            )}
            <Text style={{ fontSize: 28 }}>{character.translation}</Text>
          </View>
        )}
        renderInfo={(character) => {
          const characterInfo = makeMeAHanzi.find(
            (entry) => entry.character === character.chinese,
          );

          if (characterInfo === undefined) {
            return (
              <View>
                <Text variant="bodyMedium">
                  Sorry, no information available for this character.
                </Text>
              </View>
            );
          }

          return (
            <View style={{ rowGap: 12 }}>
              <ChineseCharacterGlyph
                character={character.chinese}
                characterStyle={{ width: 60, height: 60 }}
              />
              <ChineseCharacterStrokeOrderDisplay
                character={character.chinese}
                characterStyle={{
                  width: 50,
                  height: 50,
                }}
              />
              <Text style={{ fontSize: 20 }}>
                pinyin:{" "}
                <Text style={{ fontFamily: "NotoSansSC_400Regular" }}>
                  {characterInfo.pinyin}
                </Text>
              </Text>
              <Text style={{ fontSize: 20 }}>
                definition: {characterInfo.definition}
              </Text>
            </View>
          );
        }}
      />
    </>
  );
}

export default function PlayCharacterRoute(props: { characters: Character[] }) {
  return (
    <ImageBackground
      source={{
        uri: "https://unsplash.com/photos/pMSIUfvI_18/download?force=true&w=640",
      }}
      style={{ flex: 1 }}
    >
      <View
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
          margin: 12,
          rowGap: 24,
        }}
      >
        <PreviewModalButton characters={props.characters} />
        <PracticeModalButton characters={props.characters} />
      </View>
    </ImageBackground>
  );
}
