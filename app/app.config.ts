import { ExpoConfig, ConfigContext } from "expo/config";

const date = new Date();
const buildNumber = `${date.getFullYear()}${date
  .getMonth()
  .toString()
  .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
  .getHours()
  .toString()
  .padStart(2, "0")}`;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "chinese-tutor",
  slug: "chinese-tutor",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffde00",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.chvmvd.chinesetutor",
    buildNumber: buildNumber,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffde00",
    },
    versionCode: parseInt(buildNumber),
    package: "com.chvmvd.chinesetutor",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  experiments: {
    baseUrl: "/chinese-tutor/app",
  },
  extra: {
    eas: {
      projectId: "f56ffe8d-e4fc-47e2-a9d3-9331b8992059",
    },
  },
});
