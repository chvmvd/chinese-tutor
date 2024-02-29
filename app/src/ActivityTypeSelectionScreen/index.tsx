import { FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Appbar, Card } from "react-native-paper";
import { RootStackParamList } from "../App";

type ActivityTypeSelectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ActivityTypeSelection"
>;

export default function ActivityTypeSelectionScreen({
  navigation,
  route,
}: ActivityTypeSelectionScreenProps) {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.navigate("ModuleSelection");
          }}
        />
        <Appbar.Content title="Activity Type" />
      </Appbar.Header>
      <FlatList
        data={[
          {
            key: "conversation",
            title: "Conversation",
            imageUrl:
              "https://unsplash.com/photos/LQ1t-8Ms5PY/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzA3MjI3OTEzfA&force=true&w=640",
          },
          {
            key: "sentence",
            title: "Sentence",
            imageUrl:
              "https://unsplash.com/photos/3IT2R0sgHaY/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzA3MjI3OTg5fA&force=true&w=640",
          },
          {
            key: "vocabulary",
            title: "Vocabulary",
            imageUrl:
              "https://unsplash.com/photos/C5SUkYZT7nU/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzA3MjI2OTMxfA&force=true&w=640",
          },
          {
            key: "character",
            title: "Character",
            imageUrl:
              "https://unsplash.com/photos/zHwWnUDMizo/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzA3MjI4MDMyfA&force=true&w=640",
          },
        ]}
        style={{ padding: 12 }}
        contentContainerStyle={{ rowGap: 12 }}
        keyExtractor={(item) => item.key}
        renderItem={({
          item,
        }: {
          item: {
            key: string;
            title: "Conversation" | "Sentence" | "Vocabulary" | "Character";
            imageUrl: string;
          };
        }) => (
          <Card
            onPress={() => {
              navigation.navigate(item.title, {
                moduleId: route.params.moduleId,
              });
            }}
          >
            <Card.Cover
              source={{
                uri: item.imageUrl,
              }}
            />
            <Card.Title title={item.title} titleStyle={{ fontSize: 20 }} />
          </Card>
        )}
      />
    </>
  );
}
