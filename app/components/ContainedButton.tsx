import { Text } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import Touchable from "./Touchable";

export default function ContainedButton(props: {
  onPress: () => void;
  children: string;
}) {
  const colors = useThemeColors();

  return (
    <Touchable
      onPress={props.onPress}
      style={{
        paddingHorizontal: 36,
        paddingVertical: 12,
        borderRadius: 100,
        backgroundColor: colors.primary1,
      }}
      hoveredStyle={{}}
      pressedStyle={{}}
    >
      <Text
        style={{
          color: colors.white,
          fontSize: 20,
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        {props.children}
      </Text>
    </Touchable>
  );
}
