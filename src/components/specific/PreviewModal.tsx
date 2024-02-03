import { ReactNode, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Appbar, Card, IconButton, useTheme } from "react-native-paper";

export default function PreviewModal<Item>(props: {
  visible: boolean;
  onDismiss: () => void;
  items: Item[];
  renderContent: (item: Item) => ReactNode;
  playAudio: (item: Item) => void;
  renderInfo?: (item: Item) => ReactNode;
}) {
  const theme = useTheme();

  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const handleDismiss = () => {
    setCurrentItemIndex(0);
    props.onDismiss();
  };

  const handleNext = () => {
    if (currentItemIndex === props.items.length - 1) {
      handleDismiss();
    } else {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const showInfoModal = () => setIsInfoModalVisible(true);
  const hideInfoModal = () => setIsInfoModalVisible(false);

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      onRequestClose={handleDismiss}
    >
      <Appbar.Header>
        <Appbar.Action icon="close" onPress={handleDismiss} />
      </Appbar.Header>
      <View
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          padding: 20,
          paddingBottom: 40,
          rowGap: 24,
        }}
      >
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Card>
            <Card.Content>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                {props.renderContent(props.items[currentItemIndex])}
              </View>
            </Card.Content>
          </Card>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingHorizontal: 30,
          }}
        >
          <View style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <IconButton
              icon="volume-high"
              size={40}
              onPress={() => {
                props.playAudio(props.items[currentItemIndex]);
              }}
            />
          </View>
          <View style={{ display: "flex", flex: 1, alignItems: "center" }}>
            <IconButton
              icon="arrow-right-circle-outline"
              size={64}
              onPress={handleNext}
            />
          </View>
          <View style={{ display: "flex", flex: 1, alignItems: "center" }}>
            {props.renderInfo && (
              <>
                <IconButton
                  icon="information-outline"
                  size={40}
                  onPress={showInfoModal}
                />
                <Modal
                  visible={isInfoModalVisible}
                  onRequestClose={hideInfoModal}
                  transparent={true}
                >
                  <Pressable
                    onPress={hideInfoModal}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <View
                      onStartShouldSetResponder={() => true}
                      style={{
                        width: "90%",
                        height: "70%",
                        borderRadius: 20,
                        padding: 10,
                        backgroundColor: theme.colors.background,
                      }}
                    >
                      <IconButton icon="close" onPress={hideInfoModal} />
                      <View
                        style={{
                          flex: 1,
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                        }}
                      >
                        {props.renderInfo(props.items[currentItemIndex])}
                      </View>
                    </View>
                  </Pressable>
                </Modal>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
