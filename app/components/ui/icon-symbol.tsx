import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  type OpaqueColorValue,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { MAPPING } from "./mapping";

export type IconName = keyof typeof MAPPING;

export function Icon({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  const theme = useTheme();

  return (
    <MaterialIcons
      name={MAPPING[name].android}
      size={size}
      color={color || theme.colors.icon}
      style={style}
    />
  );
}
