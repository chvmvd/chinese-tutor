import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import SettingsIcon from "@/components/icons/SettingsIcon";
import { useThemeColors } from "@/hooks/useThemeColors";
import IconButton from "@/components/IconButton";
import LeftArrowIcon from "@/components/icons/LeftArrowIcon";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();

  const [loaded, error] = useFonts({
    "AR-PL-KaitiM-GB": require("./../assets/fonts/gkai00mp.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary3,
          },
          headerTitleStyle: {
            fontSize: 20,
            color: colors.text,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Activity Type",
            headerRight: () => (
              <IconButton
                onPress={() => {
                  router.push("/settings");
                }}
              >
                <SettingsIcon size={24} color={colors.app_bar_icon} />
              </IconButton>
            ),
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerLeft: () => (
              <IconButton
                onPress={() => {
                  router.back();
                }}
              >
                <LeftArrowIcon size={24} color={colors.app_bar_icon} />
              </IconButton>
            ),
          }}
        />
        <Stack.Screen
          name="characters"
          options={{
            title: "Characters",
            headerLeft: () => (
              <IconButton
                onPress={() => {
                  router.back();
                }}
              >
                <LeftArrowIcon size={24} color={colors.app_bar_icon} />
              </IconButton>
            ),
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
