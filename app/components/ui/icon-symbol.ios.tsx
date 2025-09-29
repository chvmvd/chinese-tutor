import { SymbolView } from "expo-symbols";
import { type StyleProp, type ViewStyle } from "react-native";
import { MAPPING } from "./mapping";

export function Icon({
  name,
  size = 24,
  color,
  style,
}: {
  name: keyof typeof MAPPING;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SymbolView
      name={MAPPING[name].ios}
      tintColor={color}
      weight="regular"
      resizeMode="scaleAspectFit"
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
