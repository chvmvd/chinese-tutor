import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default async function saveFile(fileName: string, json: string) {
  const directoryUri = FileSystem.documentDirectory;
  if (directoryUri !== null) {
    const files = await FileSystem.readDirectoryAsync(directoryUri);
    await Promise.all(
      files.map(async (file) => {
        if (file.startsWith("chinese_tutor_")) {
          await FileSystem.deleteAsync(`${directoryUri}${file}`);
        }
      })
    );

    const fileUri = `${directoryUri}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, json);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }
  }
}
