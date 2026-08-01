import type MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type SymbolViewProps } from "expo-symbols";
import { type ComponentProps } from "react";

export const MAPPING = {
  study: {
    android: "school",
    ios: "graduationcap",
  },
  search: {
    android: "search",
    ios: "magnifyingglass",
  },
  settings: {
    android: "settings",
    ios: "gear",
  },
  mic: {
    android: "mic",
    ios: "microphone",
  },
  "left-arrow": {
    android: "chevron-left",
    ios: "chevron.left",
  },
  "right-arrow": {
    android: "chevron-right",
    ios: "chevron.right",
  },
  close: {
    android: "close",
    ios: "xmark",
  },
  history: {
    android: "history",
    ios: "clock",
  },
  speaker: {
    android: "volume-up",
    ios: "speaker.wave.3",
  },
  "unfold-more": {
    android: "unfold-more",
    ios: "chevron.up.chevron.down",
  },
  more: {
    android: "more-vert",
    ios: "ellipsis.circle",
  },
  check: {
    android: "check",
    ios: "checkmark",
  },
  import: {
    android: "download",
    ios: "square.and.arrow.down",
  },
  export: {
    android: "upload",
    ios: "square.and.arrow.up",
  },
  keyboard: {
    android: "keyboard",
    ios: "keyboard",
  },
  "create-new-folder": {
    android: "create-new-folder",
    ios: "folder.badge.plus",
  },
  add: {
    android: "add",
    ios: "graduationcap",
  },
  edit: {
    android: "edit",
    ios: "graduationcap",
  },
  delete: {
    android: "delete",
    ios: "graduationcap",
  },
  repeat: {
    android: "repeat",
    ios: "graduationcap",
  },
  cards: {
    android: "web-stories",
    ios: "graduationcap",
  },
  backup: {
    android: "archive",
    ios: "tray.and.arrow.up",
  },
  restore: {
    android: "unarchive",
    ios: "tray.and.arrow.down",
  },
  folder: {
    android: "folder",
    ios: "folder",
  },
} satisfies Record<
  string,
  {
    android: ComponentProps<typeof MaterialIcons>["name"];
    ios: SymbolViewProps["name"];
  }
>;
