import ContainedButton from "@/components/ContainedButton";
import Fab from "@/components/Fab";
import IconButton from "@/components/IconButton";
import AddIcon from "@/components/icons/AddIcon";
import DefinitionIcon from "@/components/icons/DefinitionIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";
import PinyinIcon from "@/components/icons/PinyinIcon";
import Touchable from "@/components/Touchable";
import { useThemeColors } from "@/hooks/useThemeColors";
import { FlatList, Text, View } from "react-native";

export default function CharactersScreen() {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        gap: 24,
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={[
            {
              id: "4a93aaa7-4aaf-4f4b-9688-08d7dbe8d831",
              character: "你",
              pinyin: "nǐ",
              definition: "you, second person pronoun",
            },
            {
              id: "cdf79eca-efac-4578-80fd-cfbb29fe40b0",
              character: "你",
              pinyin: "nǐ",
              definition: "you, second person pronoun",
            },
            {
              id: "f009151e-a7df-4d0a-bfab-fe76d2cfe5ff",
              character: "你",
              pinyin: "nǐ",
              definition: "you, second person pronoun",
            },
            {
              id: "6b8bfcec-e5fd-4c7e-be7a-8f74ffd7a8bd",
              character: "你",
              pinyin: "nǐ",
              definition: "you, second person pronoun",
            },
            {
              id: "c65bb88d-6f5d-4051-801b-1c862f69d89f",
              character: "你",
              pinyin: "nǐ",
              definition: "you, second person pronoun",
            },
            {
              id: "ef84ec7f-27ea-47c4-b7cc-a9c5089cc2d6",
              character: "你",
              pinyin: "nǐ",
              definition: "you, second person pronoun",
            },
            {
              id: "7a7ff0d6-3817-45aa-90fa-a3a0857a95ac",
              character: "你",
              pinyin: "nǐ",
              definition: "you, second person pronoun",
            },
          ]}
          renderItem={({ item }) => (
            <Touchable
              key={item.id}
              onPress={() => {}}
              style={{
                paddingVertical: 20,
                paddingHorizontal: 24,
                borderRadius: 30,
                gap: 16,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.white,
              }}
              hoveredStyle={{
                backgroundColor: "#FAFAFA",
              }}
              pressedStyle={{
                backgroundColor: "#F8F8F8",
              }}
            >
              <Text style={{ fontSize: 64, fontFamily: "AR-PL-KaitiM-GB" }}>
                {item.character}
              </Text>
              <View style={{ flex: 1, gap: 12 }}>
                <View style={{ width: "100%", flexDirection: "row", gap: 8 }}>
                  <PinyinIcon size={16} color={colors.supportive_icon} />
                  <Text style={{ flex: 1, fontSize: 16 }}>{item.pinyin}</Text>
                </View>
                <View style={{ width: "100%", flexDirection: "row", gap: 8 }}>
                  <DefinitionIcon size={16} color={colors.supportive_icon} />
                  <Text style={{ flex: 1, fontSize: 12 }}>
                    {item.definition}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <IconButton onPress={() => {}}>
                  <EditIcon size={24} color={colors.button_icon} />
                </IconButton>
                <IconButton onPress={() => {}}>
                  <DeleteIcon size={24} color={colors.button_icon} />
                </IconButton>
              </View>
            </Touchable>
          )}
          contentContainerStyle={{ gap: 12 }}
        />
        <Fab
          onPress={() => {}}
          style={{ position: "absolute", right: 0, bottom: 0 }}
        >
          <AddIcon size="100%" color={colors.white} />
        </Fab>
      </View>
      <View>
        <ContainedButton onPress={() => {}}>Start</ContainedButton>
      </View>
    </View>
  );
}
