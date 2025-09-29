import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { DynamicColorIOS, Platform } from "react-native";
import { Theme } from "@/constants/theme";

export default function TabLayout() {
  return (
    <NativeTabs
      iconColor={DynamicColorIOS({
        dark: Theme.colors.dark.primary,
        light: Theme.colors.light.primary,
      })}
    >
      <NativeTabs.Trigger name="study">
        <Label>Study</Label>
        {Platform.select({
          ios: <Icon sf="graduationcap.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="school" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(search)" /* role="search" */>
        <Label>Search</Label>
        {Platform.select({
          ios: <Icon sf="magnifyingglass" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="search" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        {Platform.select({
          ios: <Icon sf="gear" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="settings" />} />
          ),
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
    // <Tabs
    //   screenOptions={{
    //     tabBarButton: HapticTab,
    //     headerShown: false,
    //   }}
    // >
    //   <Tabs.Screen
    //     name="study"
    //     options={{
    //       title: "Study",
    //       tabBarIcon: ({ color }) => (
    //         <Icon size={28} name="study" color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: "Search",
    //       tabBarIcon: ({ color }) => (
    //         <Icon size={28} name="search" color={color} />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="settings"
    //     options={{
    //       title: "Settings",
    //       tabBarIcon: ({ color }) => (
    //         <Icon size={28} name="settings" color={color} />
    //       ),
    //     }}
    //   />
    // </Tabs>
  );
}
