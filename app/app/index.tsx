import { Text, View } from "react-native";
import { router } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";
import Touchable from "@/components/Touchable";

export default function ActivityTypeScreen() {
  const colors = useThemeColors();

  return (
    <View
      style={{
        gap: 16,
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: 16,
      }}
    >
      <Touchable
        onPress={() => {
          router.push("/characters");
        }}
        style={{
          height: 240,
          paddingVertical: 32,
          paddingHorizontal: 28,
          borderRadius: 32,
          backgroundColor: "hsl(293, 80%, 78%)",
        }}
        hoveredStyle={{
          backgroundColor: "hsl(293, 80%, 77%)",
        }}
        pressedStyle={{
          backgroundColor: "hsl(293, 80%, 76%)",
        }}
      >
        <Text style={{ color: colors.white, fontSize: 24, fontWeight: "bold" }}>
          Characters
        </Text>
        {((): { character: string; x: `${number}%`; y: `${number}%` }[] => [
          { character: "你", x: "15%", y: "80%" },
          { character: "好", x: "75%", y: "50%" },
          { character: "谢", x: "50%", y: "90%" },
          { character: "知", x: "90%", y: "90%" },
          { character: "文", x: "40%", y: "45%" },
          { character: "乐", x: "65%", y: "20%" },
          { character: "心", x: "10%", y: "45%" },
          { character: "学", x: "95%", y: "25%" },
        ])().map((item, index) => (
          <Text
            key={item.character}
            style={{
              position: "absolute",
              top: item.y,
              left: item.x,
              color: `hsl(293, ${66 + index}%, ${66 + index * 1}%)`,
              fontSize: 72 - index * 4,
              fontFamily: "AR-PL-KaitiM-GB",
            }}
          >
            {item.character}
          </Text>
        ))}
      </Touchable>
      <Touchable
        onPress={() => {
          router.push("/characters");
        }}
        style={{
          height: 240,
          paddingVertical: 32,
          paddingHorizontal: 28,
          borderRadius: 32,
          backgroundColor: "hsl(113, 80%, 78%)",
        }}
        hoveredStyle={{
          backgroundColor: "hsl(113, 80%, 76%)",
        }}
        pressedStyle={{
          backgroundColor: "hsl(113, 80%, 74%)",
        }}
      >
        <Text style={{ color: colors.white, fontSize: 24, fontWeight: "bold" }}>
          Vocabulary
        </Text>
        {((): { character: string; x: `${number}%`; y: `${number}%` }[] => [
          { character: "你好", x: "10%", y: "80%" },
          { character: "谢谢", x: "75%", y: "50%" },
          { character: "快乐", x: "50%", y: "95%" },
          { character: "进步", x: "85%", y: "90%" },
          { character: "再见", x: "45%", y: "55%" },
          { character: "老师", x: "65%", y: "20%" },
          { character: "家人", x: "15%", y: "50%" },
          { character: "发现", x: "90%", y: "20%" },
        ])().map((item, index) => (
          <Text
            key={item.character}
            style={{
              position: "absolute",
              top: item.y,
              left: item.x,
              color: `hsl(113, ${66 + index}%, ${66 + index * 1}%)`,
              fontSize: 52 - index * 4,
              fontFamily: "AR-PL-KaitiM-GB",
            }}
          >
            {item.character}
          </Text>
        ))}
      </Touchable>
    </View>
  );
}
