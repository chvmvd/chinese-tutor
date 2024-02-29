import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default async function saveFile(fileName: string, json: string) {
  if (Platform.OS === "web") {
    const blob = new Blob([json], {
      type: "application/json",
      lastModified: Date.now(),
    });
    const url = URL.createObjectURL(blob);
    // @ts-ignore
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    const directoryUri = FileSystem.documentDirectory;
    if (directoryUri !== null) {
      const files = await FileSystem.readDirectoryAsync(directoryUri);
      await Promise.all(
        files.map(async (file) => {
          if (file.startsWith("chinese_tutor_")) {
            await FileSystem.deleteAsync(`${directoryUri}${file}`);
          }
        }),
      );

      const fileUri = `${directoryUri}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, json);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    }
  }
}
