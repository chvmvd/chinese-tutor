import { StyleProp, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import Touchable from "./Touchable";

export default function Fab(props: {
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const colors = useThemeColors();

  return (
    <Touchable
      onPress={props.onPress}
      style={[
        {
          width: 60,
          height: 60,
          borderRadius: 16,
          padding: 20,
          backgroundColor: colors.primary2,
          shadowColor: colors.black,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        props.style,
      ]}
      hoveredStyle={{
        backgroundColor: colors.primary2,
      }}
      pressedStyle={{
        backgroundColor: colors.primary2,
      }}
    >
      {props.children}
    </Touchable>
  );
}
