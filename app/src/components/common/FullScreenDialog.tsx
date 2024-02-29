import { ReactNode } from "react";
import { Modal, View } from "react-native";
import { Appbar, Button } from "react-native-paper";

export default function FullScreenDialog(props: {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  title: string;
  actionLabel: string;
  onActionPress: () => void;
}) {
  return (
    <Modal visible={props.visible} onRequestClose={props.onDismiss}>
      <Appbar.Header>
        <Appbar.Action icon="close" onPress={props.onDismiss} />
        <Appbar.Content title={props.title} />
        <Button onPress={props.onActionPress}>{props.actionLabel}</Button>
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        {props.children}
      </View>
    </Modal>
  );
}
