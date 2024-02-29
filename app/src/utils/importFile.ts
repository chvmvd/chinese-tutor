import { Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

export default async function importFile(fileType: string) {
  const result = await DocumentPicker.getDocumentAsync({
    type: fileType,
    copyToCacheDirectory: true,
  });

  if (!result.canceled && result.assets[0].uri) {
    if (Platform.OS === "web") {
      const response = await fetch(result.assets[0].uri);
      const content = await response.text();
      return content;
    } else {
      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
      return content;
    }
  }
}
