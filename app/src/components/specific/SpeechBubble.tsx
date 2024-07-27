import { View } from "react-native";
import { Avatar, IconButton, MD3Colors, Text } from "react-native-paper";
import * as Speech from "expo-speech";

export default function SpeechBubble(props: {
  avatarLabel: string;
  message: string;
  isOwnMessage: boolean;
}) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: props.isOwnMessage ? "row-reverse" : "row",
        alignSelf: props.isOwnMessage ? "flex-end" : "flex-start",
        maxWidth: "90%",
        columnGap: 8,
      }}
    >
      <Avatar.Text
        size={48}
        label={props.avatarLabel}
        labelStyle={{ fontFamily: "NotoSansSC_400Regular" }}
      />
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          padding: 16,
          paddingRight: 8,
          backgroundColor: MD3Colors.primary95,
          borderRadius: 20,
        }}
      >
        <Text
          style={{ flex: 1, fontSize: 20, fontFamily: "NotoSansSC_400Regular" }}
        >
          {props.message}
        </Text>
        <IconButton
          icon="volume-high"
          size={28}
          style={{ margin: 0, marginLeft: props.isOwnMessage ? "auto" : 0 }}
          onPress={() => {
            Speech.speak(props.message, {
              language: "zh-Hans",
            });
          }}
        />
      </View>
    </View>
  );
}
