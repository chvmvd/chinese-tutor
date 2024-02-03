import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Appbar, BottomNavigation } from "react-native-paper";
import { RootStackParamList } from "../App";
import { Conversation, Speaker } from "../types";
import EditConversationRoute from "./EditConversationRoute";
import PlayConversationRoute from "./PlayConversationRoute";
import useAsyncStorage from "../hooks/useAsyncStorage";

const defaultSpeakers: Speaker[] = [
  {
    id: "018832b2-6efb-4874-9acc-090c9c143ce1",
    chineseName: "张三",
    pinyinName: "Zhang1 San1",
    translationName: "Zhang San",
  },
  {
    id: "cf144fb3-f778-432e-9a37-eab26f1d428d",
    chineseName: "李四",
    pinyinName: "Li3 Si4",
    translationName: "Li Si",
  },
];

const defaultConversations: Conversation[] = [
  {
    id: "6f352674-6fdf-4742-a72d-7099d50b82d3",
    speakerIds: ["018832b2-6efb-4874-9acc-090c9c143ce1"],
    chineseContent: "你好，李四，最近怎么样？",
    pinyinContent: "Ni3 hao3, Li3 Si4, zui4 jin4 zen3 me yang4？",
    translationContent: "Hello, Li Si, how have you been recently?",
  },
  {
    id: "72c474d1-aabc-4526-bb36-b710aed0237d",
    speakerIds: ["cf144fb3-f778-432e-9a37-eab26f1d428d"],
    chineseContent: "你好，张三。最近挺忙的，但是我很好。你呢？",
    pinyinContent:
      "Ni3 hao3, Zhang1 San1. Zui4 jin4 ting3 mang2 de, dan4 shi4 wo3 hen3 hao3. Ni3 ne？",
    translationContent:
      "Hello, Zhang San. I've been quite busy recently, but I'm doing well. How about you?",
  },
];

type ConversationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Conversation"
>;

export default function ConversationScreen({
  navigation,
  route,
}: ConversationScreenProps) {
  const [speakers, setSpeakers] = useAsyncStorage(
    `module_${route.params.moduleId}_speakers`,
    defaultSpeakers
  );
  const [conversations, setConversations] = useAsyncStorage(
    `module_${route.params.moduleId}_conversations`,
    defaultConversations
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
      <PlayConversationRoute
        speakers={speakers}
        conversations={conversations}
      />
    ),
    edit: () => (
      <EditConversationRoute
        speakers={speakers}
        setSpeakers={setSpeakers}
        conversations={conversations}
        setConversations={setConversations}
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
        <Appbar.Content title="Conversation" />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
}
