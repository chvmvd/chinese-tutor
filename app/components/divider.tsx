import { StyleSheet, View } from "react-native";
import { useTheme } from "@/hooks/use-theme";

export function Divider() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },
  });

  return <View style={styles.divider} />;
}
