import { StyleSheet, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";

type RadioButtonProps = {
  isSelected: boolean;
};

export function RadioButton({ isSelected }: RadioButtonProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    outer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isSelected ? theme.colors.primary : theme.colors.disabled,
      alignItems: "center",
      justifyContent: "center",
    },
    inner: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.colors.primary,
    },
  });

  return (
    <View style={styles.outer}>
      {isSelected && <View style={styles.inner} />}
    </View>
  );
}
