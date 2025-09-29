import { useRouter } from "expo-router";
import { Fragment } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "@/components/divider";
import { ThemedText } from "@/components/themed-text";
import { type IconName, Icon } from "@/components/ui/icon-symbol";
import { useTheme } from "@/hooks/use-theme";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView edges={["left", "right"]}>
      {((): {
        id: string;
        title: string;
        items: {
          id: string;
          iconName: IconName;
          label: string;
          value?: string;
          onPress: () => void;
        }[];
      }[] => [
        {
          id: "chinese-style",
          title: "Chinese style",
          items: [
            {
              id: "writing-system",
              iconName: "add",
              label: "Writing system",
              value: "Simplified",
              onPress: () => router.navigate("/settings/writing-system"),
            },
            {
              id: "phonetic-system",
              iconName: "add",
              label: "Phonetic system",
              value: "Pinyin",
              onPress: () => router.navigate("/settings/phonetic-system"),
            },
          ],
        },
        {
          id: "backup-and-restore",
          title: "Backup & Restore",
          items: [
            {
              id: "backup",
              iconName: "backup",
              label: "Backup",
              onPress: () => {},
            },
            {
              id: "restore",
              iconName: "restore",
              label: "Restore",
              onPress: () => {},
            },
          ],
        },
      ])().map((section) => (
        <Fragment key={section.id}>
          <View style={{ paddingVertical: 12, paddingHorizontal: 24 }}>
            <ThemedText type="heading" style={{ paddingVertical: 12 }}>
              {section.title}
            </ThemedText>
            <View>
              {section.items.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={item.onPress}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    gap: 8,
                  }}
                >
                  <Icon name={item.iconName} color={theme.colors.icon} />
                  <ThemedText type="body" style={{ flex: 1 }}>
                    {item.label}
                  </ThemedText>
                  {item.value && (
                    <ThemedText type="caption">{item.value}</ThemedText>
                  )}
                  <Icon
                    name="right-arrow"
                    size={16}
                    color={theme.colors.iconSecondary}
                  />
                </Pressable>
              ))}
            </View>
          </View>
          <Divider />
        </Fragment>
      ))}
    </SafeAreaView>
  );
}
