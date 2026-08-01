import { TouchableOpacity } from "react-native";
import { type IconName, Icon } from "@/components/ui/icon-symbol";
import { useTheme } from "@/hooks/use-theme";

type IconButtonProps = {
  name: IconName;
  onPress: () => void;
};

export function IconButton({ name, onPress }: IconButtonProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 48,
        width: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={name} size={40} color={theme.colors.primary} />
    </TouchableOpacity>
  );
}
