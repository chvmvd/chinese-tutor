import { Link, useNavigation } from "expo-router";
import {
  ActionSheetIOS,
  Alert,
  findNodeHandle,
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilledButton } from "@/components/filled-button";
import { ThemedText } from "@/components/themed-text";
import { Icon } from "@/components/ui/icon-symbol";
import { useTheme } from "@/hooks/use-theme";

export default function StudyScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const createNewButtonRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          ref={createNewButtonRef}
          onPress={() => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: ["Create New", "Import"],
                anchor: findNodeHandle(createNewButtonRef.current) ?? undefined,
              },
              (buttonIndex) => {
                if (buttonIndex === 0) {
                  Alert.alert("Create New pressed");
                } else if (buttonIndex === 1) {
                  Alert.alert("Import pressed");
                }
              },
            );
          }}
        >
          <Icon name="create-new-folder" size={36} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, marginBottom: 60, gap: 12 }}>
        <FlatList
          data={[
            {
              id: "flashcard-set-1",
              title: "Flashcard Set 1",
              itemCount: 1,
            },
            {
              id: "flashcard-set-2",
              title: "Flashcard Set 2",
              itemCount: 3,
            },
            {
              id: "flashcard-set-3",
              title: "Flashcard Set 3",
              itemCount: 5,
            },
            {
              id: "flashcard-set-4",
              title: "Flashcard Set 4",
              itemCount: 8,
            },
            {
              id: "flashcard-set-5",
              title: "Flashcard Set 5",
              itemCount: 13,
            },
            {
              id: "flashcard-set-6",
              title: "Flashcard Set 6",
              itemCount: 21,
            },
            {
              id: "flashcard-set-7",
              title: "Flashcard Set 7",
              itemCount: 22,
            },
          ]}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/study/[flashcardSetId]",
                params: { flashcardSetId: item.id },
              }}
              asChild
            >
              <Link.Trigger>
                <Pressable
                  style={{
                    flexDirection: "row",
                    padding: 16,
                    borderRadius: 20,
                    gap: 8,
                    alignItems: "center",
                    boxShadow: [
                      {
                        offsetX: 0,
                        offsetY: 0,
                        blurRadius: 2,
                        color: "rgba(0, 0, 0, 0.4)",
                      },
                    ],
                  }}
                >
                  <Icon name="folder" size={32} color={theme.colors.icon} />
                  <View style={{ gap: 4 }}>
                    <ThemedText type="heading">{item.title}</ThemedText>
                    <ThemedText type="caption">
                      {item.itemCount > 1
                        ? `${item.itemCount} items`
                        : `${item.itemCount} item`}
                    </ThemedText>
                  </View>
                </Pressable>
              </Link.Trigger>
              <Link.Menu>
                <Link.MenuAction
                  title="Rename"
                  icon="pencil"
                  onPress={() => {
                    alert("Rename pressed");
                  }}
                />
                <Link.MenuAction
                  title="Export"
                  icon="square.and.arrow.up"
                  onPress={() => {
                    alert("Export pressed");
                  }}
                />
                <Link.MenuAction
                  title="Delete"
                  icon="trash"
                  destructive
                  onPress={() => {
                    Alert.alert(
                      "Are you sure you want to delete Flashcard Set 1?",
                      "This will delete all flashcards in this flashcard set.",
                      [
                        {
                          text: "Cancel",
                          onPress: () => {},
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => {},
                          style: "destructive",
                        },
                      ],
                    );
                  }}
                />
              </Link.Menu>
              <Link.Preview />
            </Link>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          style={{ paddingVertical: 12, paddingHorizontal: 24 }}
        />
        <View
          style={{
            alignItems: "center",
            backgroundColor: theme.colors.background,
            marginHorizontal: 24,
            padding: 24,
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 2,
                color: "rgba(0, 0, 0, 0.4)",
              },
            ],
            borderRadius: 40,
            gap: 16,
          }}
        >
          <ThemedText type="body">{"Today's Practice"}</ThemedText>
          <FilledButton
            title="Start"
            onPress={() => {}}
            style={{ alignSelf: "stretch" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
