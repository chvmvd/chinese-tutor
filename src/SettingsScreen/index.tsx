import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Appbar, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../App";
import {
  Character,
  Conversation,
  ExportedJSON,
  Module,
  Sentence,
  Speaker,
  Vocabulary,
} from "../types";
import createUUID from "../utils/createUUID";
import importFile from "../utils/importFile";
import saveFile from "../utils/saveFile";

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const onExport = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    const fileName = `chinese_tutor_${year}-${month}-${day}_${hour}-${minute}-${second}.json`;

    const modules = await AsyncStorage.getItem("modules");
    if (modules !== null) {
      const json = JSON.stringify(
        await Promise.all(
          (JSON.parse(modules) as Module[]).map(async (module) => {
            const moduleId = module.id;
            const speakers = await AsyncStorage.getItem(
              `module_${moduleId}_speakers`
            );
            const conversations = await AsyncStorage.getItem(
              `module_${moduleId}_conversations`
            );
            const sentences = await AsyncStorage.getItem(
              `module_${moduleId}_sentences`
            );
            const vocabularies = await AsyncStorage.getItem(
              `module_${moduleId}_vocabularies`
            );
            const characters = await AsyncStorage.getItem(
              `module_${moduleId}_characters`
            );
            if (
              speakers !== null &&
              conversations !== null &&
              sentences !== null &&
              vocabularies !== null &&
              characters !== null
            ) {
              return {
                id: module.id,
                title: module.title,
                speakers: JSON.parse(speakers) as Speaker[],
                conversations: JSON.parse(conversations) as Conversation[],
                sentences: JSON.parse(sentences) as Sentence[],
                vocabularies: JSON.parse(vocabularies) as Vocabulary[],
                characters: JSON.parse(characters) as Character[],
              };
            }
          })
        )
      );
      saveFile(fileName, json);
    }
  };

  const onImport = async () => {
    const data = await importFile("application/json");
    if (data !== undefined) {
      const jsonData = JSON.parse(data) as ExportedJSON;
      const existingModules = await AsyncStorage.getItem("modules");
      const modules = jsonData
        .map((entry) => ({
          id: createUUID(),
          title: entry.title,
        }))
        .concat(existingModules !== null ? JSON.parse(existingModules) : []);
      await AsyncStorage.setItem("modules", JSON.stringify(modules));
      modules.forEach(async (entry, index) => {
        const speakers: Speaker[] = jsonData[index].speakers.map((speaker) => ({
          id: createUUID(),
          chineseName: speaker.chineseName,
          pinyinName: speaker.pinyinName,
          translationName: speaker.translationName,
        }));
        const conversations: Conversation[] = jsonData[index].conversations.map(
          (conversation) => ({
            id: createUUID(),
            speakerIds: conversation.speakerIds,
            chineseContent: conversation.chineseContent,
            pinyinContent: conversation.pinyinContent,
            translationContent: conversation.translationContent,
          })
        );
        const sentences: Sentence[] = jsonData[index].sentences.map(
          (sentence) => ({
            id: createUUID(),
            chineseContent: sentence.chineseContent,
            pinyinContent: sentence.pinyinContent,
            translationContent: sentence.translationContent,
          })
        );
        const vocabularies: Vocabulary[] = jsonData[index].vocabularies.map(
          (vocabulary) => ({
            id: createUUID(),
            chinese: vocabulary.chinese,
            pinyin: vocabulary.pinyin,
            translation: vocabulary.translation,
          })
        );
        const characters: Character[] = jsonData[index].characters.map(
          (character) => ({
            id: createUUID(),
            chinese: character.chinese,
            pinyin: character.pinyin,
            translation: character.translation,
          })
        );
        await AsyncStorage.setItem(
          `module_${entry.id}_speakers`,
          JSON.stringify(speakers)
        );
        await AsyncStorage.setItem(
          `module_${entry.id}_conversations`,
          JSON.stringify(conversations)
        );
        await AsyncStorage.setItem(
          `module_${entry.id}_sentences`,
          JSON.stringify(sentences)
        );
        await AsyncStorage.setItem(
          `module_${entry.id}_vocabularies`,
          JSON.stringify(vocabularies)
        );
        await AsyncStorage.setItem(
          `module_${entry.id}_characters`,
          JSON.stringify(characters)
        );
      });
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.navigate("ModuleSelection");
          }}
        />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <View style={{ padding: 12, rowGap: 12 }}>
        <Button icon="export" onPress={onExport}>
          Export All Data
        </Button>
        <Button icon="import" onPress={onImport}>
          Import All Data
        </Button>
      </View>
    </>
  );
}
