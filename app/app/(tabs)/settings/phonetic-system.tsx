import { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RadioButton } from "@/components/radio-button";
import { ThemedText } from "@/components/themed-text";

export default function PhoneticSystemScreen() {
  const [selectedId, setSelectedId] =
    useState<(typeof items)[number]["id"]>("pinyin");

  const items = [
    {
      id: "pinyin" as const,
      label: "Pinyin",
    },
    {
      id: "zhuyin" as const,
      label: "Zhuyin",
    },
  ] satisfies {
    id: string;
    label: string;
  }[];

  return (
    <SafeAreaView edges={["left", "right"]}>
      <View style={{ paddingVertical: 12, paddingHorizontal: 24 }}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setSelectedId(item.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <ThemedText type="body" style={{ flex: 1 }}>
              {item.label}
            </ThemedText>
            <RadioButton isSelected={item.id === selectedId} />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
