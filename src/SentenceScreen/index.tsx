import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Appbar, BottomNavigation } from "react-native-paper";
import { RootStackParamList } from "../App";
import PlaySentenceRoute from "./PlaySentenceRoute";
import EditSentenceRoute from "./EditSentenceRoute";
import { Sentence } from "../types";
import useAsyncStorage from "../hooks/useAsyncStorage";

const defaultSentences: Sentence[] = [
  {
    id: "381f86a4-65cb-4410-8d91-4a1437580cff",
    chineseContent: "我想学习中文。",
    pinyinContent: "Wo3 xiang3 xue2 xi2 zhong1 wen2.",
    translationContent: "I want to learn Chinese.",
  },
  {
    id: "2645bf19-62fa-47e8-a278-9f5ecd502cd2",
    chineseContent: "你会说汉语吗？",
    pinyinContent: "Ni3 hui4 shuo1 han4 yu3 ma?",
    translationContent: "Can you speak Chinese?",
  },
];

type SentenceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Sentence"
>;

export default function SentenceScreen({
  navigation,
  route,
}: SentenceScreenProps) {
  const [sentences, setSentences] = useAsyncStorage(
    `module_${route.params.moduleId}_sentences`,
    defaultSentences
  );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "play",
      title: "Play",
      focusedIcon: "play-circle",
      unfocusedIcon: "play-circle-outline",
    },
    {
      key: "edit",
      title: "Edit",
      focusedIcon: "pencil",
      unfocusedIcon: "pencil-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    play: () => <PlaySentenceRoute sentences={sentences} />,
    edit: () => (
      <EditSentenceRoute sentences={sentences} setSentences={setSentences} />
    ),
  });

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.navigate("ActivityTypeSelection", {
              moduleId: route.params.moduleId,
            });
          }}
        />
        <Appbar.Content title="Sentence" />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
}
