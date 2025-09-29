import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";

type FilledButtonProps = TouchableOpacityProps & {
  title: string;
  onPress: () => void;
};

export function FilledButton({
  title,
  onPress,
  style,
  ...rest
}: FilledButtonProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: theme.colors.primary,
          paddingHorizontal: 36,
          paddingVertical: 16,
          borderRadius: 28,
          alignItems: "center",
        },
        style,
      ]}
      {...rest}
    >
      <ThemedText style={{ color: theme.colors.background }}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}
