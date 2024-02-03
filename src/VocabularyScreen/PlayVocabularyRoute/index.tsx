import { useState } from "react";
import { ImageBackground, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import * as Speech from "expo-speech";
import { Vocabulary } from "../../types";
import BottomDrawer from "../../components/common/BottomDrawer";
import PracticeModal from "../../components/specific/PracticeModal";
import PreviewModal from "../../components/specific/PreviewModal";
import { convertNumericPinyinToAccentPinyin } from "../../utils/convertPinyin";

function PreviewModalButton(props: { vocabularies: Vocabulary[] }) {
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
        items={props.vocabularies}
        renderContent={(vocabulary) => (
          <View style={{ rowGap: 6 }}>
            <Text style={{ fontSize: 20, fontFamily: "NotoSansSC_400Regular" }}>
              {convertNumericPinyinToAccentPinyin(vocabulary.pinyin)}
            </Text>
            <Text style={{ fontSize: 24, fontFamily: "NotoSansSC_400Regular" }}>
              {vocabulary.chinese}
            </Text>
            <Text style={{ fontSize: 20 }}>{vocabulary.translation}</Text>
          </View>
        )}
        playAudio={(vocabulary) => {
          Speech.speak(vocabulary.chinese, {
            language: "zh-Hans",
          });
        }}
      />
    </>
  );
}

function PracticeModalButton(props: { vocabularies: Vocabulary[] }) {
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
        questions={props.vocabularies}
        keyExtractor={(vocabulary) => vocabulary.id}
        titleExtractor={(vocabulary) => vocabulary.chinese}
        renderQuestion={(vocabulary) => {
          switch (selectedInputType) {
            case "chinese":
              return (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: "NotoSansSC_400Regular",
                  }}
                >
                  {vocabulary.chinese}
                </Text>
              );
            case "english":
              return (
                <Text style={{ fontSize: 28 }}>{vocabulary.translation}</Text>
              );
            case "pinyin":
              return (
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: "NotoSansSC_400Regular",
                  }}
                >
                  {convertNumericPinyinToAccentPinyin(vocabulary.pinyin)}
                </Text>
              );
            case "audio":
              return (
                <IconButton
                  icon="volume-high"
                  size={80}
                  onPress={() => {
                    Speech.speak(vocabulary.chinese, {
                      language: "zh-Hans",
                    });
                  }}
                />
              );
          }
        }}
        renderAnswer={(vocabulary) => (
          <View
            style={{
              rowGap: 6,
            }}
          >
            <Text style={{ fontSize: 20, fontFamily: "NotoSansSC_400Regular" }}>
              {convertNumericPinyinToAccentPinyin(vocabulary.pinyin)}
            </Text>
            <Text style={{ fontSize: 24, fontFamily: "NotoSansSC_400Regular" }}>
              {vocabulary.chinese}
            </Text>
            <Text style={{ fontSize: 20 }}>{vocabulary.translation}</Text>
          </View>
        )}
      />
    </>
  );
}

export default function PlayVocabulalyRoute(props: {
  vocabularies: Vocabulary[];
  setVocabularies: (vocabularies: Vocabulary[]) => void;
}) {
  return (
    <ImageBackground
      source={{
        uri: "https://unsplash.com/photos/k-P2ow0S6o4/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dm9jYWJ1bGFyeXxqYXwwfHx8fDE3MDgyNDUyNjB8MA&force=true&w=640",
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
        <PreviewModalButton vocabularies={props.vocabularies} />
        <PracticeModalButton vocabularies={props.vocabularies} />
      </View>
    </ImageBackground>
  );
}
