import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Vocabulary } from "../types";
import { RootStackParamList } from "../App";
import useAsyncStorage from "../hooks/useAsyncStorage";
import { useState } from "react";
import { Appbar, BottomNavigation } from "react-native-paper";
import PlayVocabulalyRoute from "./PlayVocabularyRoute";
import EditVocabularyRoute from "./EditVocabularyRoute";

const defaultVocabularies: Vocabulary[] = [
  {
    id: "6345c5d4-16c6-46ec-bce5-3990d510d611",
    chinese: "你好",
    pinyin: "ni3 hao3",
    translation: "Hello",
  },
  {
    id: "a467e139-11a6-4b79-bad5-db0e394e8ab1",
    chinese: "谢谢",
    pinyin: "xie4 xie4",
    translation: "Thank you",
  },
];

type VocabularyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Vocabulary"
>;

export default function VocabularyScreen({
  navigation,
  route,
}: VocabularyScreenProps) {
  const [vocabularies, setVocabularies] = useAsyncStorage(
    `module_${route.params.moduleId}_vocabularies`,
    defaultVocabularies
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
    play: () => (
      <PlayVocabulalyRoute
        vocabularies={vocabularies}
        setVocabularies={setVocabularies}
      />
    ),
    edit: () => (
      <EditVocabularyRoute
        vocabularies={vocabularies}
        setVocabularies={setVocabularies}
      />
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
        <Appbar.Content title="Vocabulary" />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
}
