import { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function BottomDrawer(props: {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
}) {
  const theme = useTheme();

  return (
    <Modal
      visible={props.visible}
      onRequestClose={props.onDismiss}
      transparent={true}
    >
      <Pressable
        onPress={props.onDismiss}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          onStartShouldSetResponder={() => true}
          style={{
            backgroundColor: theme.colors.background,
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          {props.children}
        </View>
      </Pressable>
    </Modal>
  );
}
