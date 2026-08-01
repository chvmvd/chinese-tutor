import { Platform } from "react-native";

const Colors = {
  light: {
    primary: "#000000",
    disabled: "#CCCCCC",
    background: "#FFFFFF",
    surface: "#EEEEEE", // 800
    border: "#CCCCCC", // 600
    text: "#000000",
    textSecondary: "#888888", // 500
    icon: "#000000",
    iconSecondary: "#888888", // 500
    success: {
      light: "#C0F5CA",
      main: "#299D3E",
    },
    error: {
      light: "#FFCBC0",
      main: "#F04E2D",
    },
  },
  dark: {
    primary: "#000000",
    disabled: "#CCCCCC",
    background: "#FFFFFF",
    surface: "#EEEEEE", // 800
    border: "#CCCCCC", // 600
    text: "#000000",
    textSecondary: "#888888", // 500
    icon: "#000000",
    iconSecondary: "#888888", // 500
    success: {
      light: "#C0F5CA",
      main: "#299D3E",
    },
    error: {
      light: "#FFCBC0",
      main: "#F04E2D",
    },
  },
};

const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    sansSC: "PingFang SC",
    sansTC: "PingFang TC",
    kaitiSC: "Kaiti SC",
    kaitiTC: "Kaiti TC",
  },
  default: {
    sans: "normal",
    sansSC: "NotoSansSC_400Regular",
    sansTC: "NotoSansTC_400Regular",
    kaitiSC: "",
    kaitiTC: "",
  },
});

export const Theme = {
  colors: Colors,
  fonts: Fonts,
};
