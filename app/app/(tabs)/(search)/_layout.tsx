import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Search",
          headerSearchBarOptions: {
            placement: "automatic",
            placeholder: "Search",
            onChangeText: () => {},
          },
        }}
      />
    </Stack>
  );
}
