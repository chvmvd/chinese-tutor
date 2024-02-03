import { ReactNode } from "react";
import { View } from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

export default function FullScreenDialog(props: {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  title: string;
  actionLabel: string;
  onActionPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={props.onDismiss}
        contentContainerStyle={{
          height: "100%",
          width: "100%",
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={{ flex: 1, padding: 10 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton icon="close" onPress={props.onDismiss} />
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              {props.title}
            </Text>
            <Button onPress={props.onActionPress}>{props.actionLabel}</Button>
          </View>
          <View
            style={{
              flex: 1,
              padding: 10,
            }}
          >
            {props.children}
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
