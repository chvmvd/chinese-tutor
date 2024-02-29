import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Appbar, BottomNavigation } from "react-native-paper";
import { RootStackParamList } from "../App";
import PlayCharacterRoute from "./PlayCharacterRoute";
import EditCharacterRoute from "./EditCharacterRoute";
import { Character } from "../types";
import useAsyncStorage from "../hooks/useAsyncStorage";

const defaultCharacters: Character[] = [
  {
    id: "6daa67c7-94c1-4ced-8963-216b246e10d7",
    chinese: "我",
    pinyin: "wo3",
    translation: "I",
  },
  {
    id: "93218bb1-e78c-481e-942f-916628e5a3fe",
    chinese: "你",
    pinyin: "ni3",
    translation: "You",
  },
];

type CharacterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Character"
>;

export default function CharacterScreen({
  navigation,
  route,
}: CharacterScreenProps) {
  const [characters, setCharacters] = useAsyncStorage(
    `module_${route.params.moduleId}_characters`,
    defaultCharacters,
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
    play: () => <PlayCharacterRoute characters={characters} />,
    edit: () => (
      <EditCharacterRoute
        characters={characters}
        setCharacters={setCharacters}
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
        <Appbar.Content title="Character" />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
}
