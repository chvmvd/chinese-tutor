import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";

export default function FlashcardScreen() {
  const { flashcardSetId } = useLocalSearchParams();

  return (
    <SafeAreaView edges={["left", "right"]}>
      <View>
        <ThemedText type="heading" style={{ padding: 24 }}>
          Flashcard Set {flashcardSetId}
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}
