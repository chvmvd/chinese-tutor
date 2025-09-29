import {
  NotoSansSC_400Regular,
  useFonts as useNotoSansScFonts,
} from "@expo-google-fonts/noto-sans-sc";
import {
  NotoSansTC_400Regular,
  useFonts as useNotoSansTcFonts,
} from "@expo-google-fonts/noto-sans-tc";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [notoSansScLoaded, notoSansScError] = useNotoSansScFonts({
    NotoSansSC_400Regular,
  });
  const [notoSansTcLoaded, notoSansTcError] = useNotoSansTcFonts({
    NotoSansTC_400Regular,
  });

  const colorScheme = useColorScheme();
  const theme = useTheme();

  useEffect(() => {
    if (
      notoSansScLoaded ||
      notoSansTcLoaded ||
      notoSansScError ||
      notoSansTcError
    ) {
      SplashScreen.hideAsync();
    }
  }, [notoSansScLoaded, notoSansTcLoaded, notoSansScError, notoSansTcError]);

  if (
    !notoSansScLoaded &&
    !notoSansTcLoaded &&
    !notoSansScError &&
    !notoSansTcError
  ) {
    return null;
  }

  return (
    <ThemeProvider
      value={{
        dark: colorScheme === "dark",
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.background,
          text: theme.colors.primary,
          border: theme.colors.border,
          notification: theme.colors.primary,
        },
        fonts: DefaultTheme.fonts,
      }}
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
