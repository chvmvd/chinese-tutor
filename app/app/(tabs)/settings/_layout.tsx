import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Settings",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="writing-system"
        options={{
          headerTitle: "Writing System",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="phonetic-system"
        options={{
          headerTitle: "Phonetic System",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
