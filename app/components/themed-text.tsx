import { StyleSheet, Text, type TextProps } from "react-native";
import { useTheme } from "@/hooks/use-theme";

type ThemedTextProps = TextProps & {
  type?: "body" | "heading" | "caption";
  lang?: "en" | "zh-Hans" | "zh-Hant";
};

export function ThemedText({
  type = "body",
  lang = "en",
  style,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    body: {
      fontSize: 16,
      lineHeight: 20,
      color: theme.colors.text,
    },
    heading: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      color: theme.colors.textSecondary,
    },

    en: {
      fontFamily: theme.fonts.sans,
    },
    "zh-Hans": {
      fontFamily: theme.fonts.sansSC,
    },
    "zh-Hant": {
      fontFamily: theme.fonts.sansTC,
    },
  });

  return (
    <Text
      style={[
        type === "body" ? styles.body : undefined,
        type === "heading" ? styles.heading : undefined,
        type === "caption" ? styles.caption : undefined,
        lang === "en" ? styles.en : undefined,
        lang === "zh-Hans" ? styles["zh-Hans"] : undefined,
        lang === "zh-Hant" ? styles["zh-Hant"] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
