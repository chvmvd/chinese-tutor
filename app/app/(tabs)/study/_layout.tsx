import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Flashcard Sets",
        }}
      />
      <Stack.Screen
        name="[flashcardSetId]"
        options={{
          headerTitle: "Flashcard Set 1",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
