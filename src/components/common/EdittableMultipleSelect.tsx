import { ReactNode, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  List,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function EdittableMultipleSelect<Item>(props: {
  names: string;
  name: string;
  items: Item[];
  setItems: (items: Item[]) => void;
  selectedItems: Item[];
  setSelectedItems: (selectedItems: Item[]) => void;
  keyExtractor: (item: Item) => string;
  titleExtractor: (item: Item) => string;
  renderEditItemModal: (props: {
    visible: boolean;
    onDismiss: () => void;
    onSave: (item: Item) => void;
    item: Item;
  }) => ReactNode;
  renderAddItemModal: (props: {
    visible: boolean;
    onDismiss: () => void;
    onSave: (item: Item) => void;
  }) => ReactNode;
}) {
  const theme = useTheme();

  const [items, setItems] = useState<Item[]>(props.items);

  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const showSelectModal = () => setIsSelectModalVisible(true);
  const hideSelectModal = () => setIsSelectModalVisible(false);
  const [selectedItems, setSelectedItems] = useState<Item[]>(
    props.selectedItems
  );
  const handleToggleSelection = (item: Item) => {
    if (
      selectedItems.find(
        (selectedItem) =>
          props.keyExtractor(selectedItem) === props.keyExtractor(item)
      )
    ) {
      setSelectedItems(
        selectedItems.filter(
          (selectedItem) =>
            props.keyExtractor(selectedItem) !== props.keyExtractor(item)
        )
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const [isCreateItemModalVisible, setIsCreateItemModalVisible] =
    useState(false);
  const showCreateItemModal = () => setIsCreateItemModalVisible(true);
  const hideCreateItemModal = () => setIsCreateItemModalVisible(false);
  const handleCreateItem = (item: Item) => {
    setItems([...items, item]);
    hideCreateItemModal();
  };

  const handleConfirm = () => {
    props.setItems(items);
    props.setSelectedItems(selectedItems);
    hideSelectModal();
  };

  return (
    <>
      <TextInput
        mode="outlined"
        label={props.names}
        value={selectedItems
          .map((item) => props.titleExtractor(item))
          .join(", ")}
        editable={false}
        right={<TextInput.Icon icon="menu-down" onPress={showSelectModal} />}
        onPressIn={showSelectModal}
      />
      <Portal>
        <Modal
          visible={isSelectModalVisible}
          onDismiss={hideSelectModal}
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            padding: 12,
            margin: 10,
            borderRadius: 20,
          }}
        >
          <IconButton icon="close" size={20} onPress={hideSelectModal} />
          <View style={{ gap: 12 }}>
            <ScrollView style={{ maxHeight: 500 }}>
              <List.Section>
                {items.map((item) => (
                  <List.Item
                    key={props.keyExtractor(item)}
                    title={props.titleExtractor(item)}
                    onPress={() => handleToggleSelection(item)}
                    left={(_props) => (
                      <List.Icon
                        {..._props}
                        icon={
                          selectedItems.find(
                            (selectedItem) =>
                              props.keyExtractor(selectedItem) ===
                              props.keyExtractor(item)
                          )
                            ? "checkbox-marked"
                            : "checkbox-blank-outline"
                        }
                      />
                    )}
                    right={() => {
                      const [
                        isEditItemModalVisible,
                        setIsEditItemModalVisible,
                      ] = useState(false);
                      const showEditItemModal = () =>
                        setIsEditItemModalVisible(true);
                      const hideEditItemModal = () =>
                        setIsEditItemModalVisible(false);
                      const handleUpdateItem = (newItem: Item) => {
                        setItems(
                          items.map((item) =>
                            props.keyExtractor(item) ===
                            props.keyExtractor(newItem)
                              ? newItem
                              : item
                          )
                        );
                        hideEditItemModal();
                      };

                      const [
                        isDeleteConfirmDialogVisible,
                        setIsDeleteConfirmDialogVisible,
                      ] = useState(false);
                      const showDeleteConfirmDialog = () =>
                        setIsDeleteConfirmDialogVisible(true);
                      const hideDeleteConfirmDialog = () =>
                        setIsDeleteConfirmDialogVisible(false);

                      const handleDeleteItem = () => {
                        setItems(
                          items.filter(
                            (previousItem) =>
                              props.keyExtractor(previousItem) !==
                              props.keyExtractor(item)
                          )
                        );
                        setSelectedItems(
                          selectedItems.filter(
                            (selectedItem) =>
                              props.keyExtractor(selectedItem) !==
                              props.keyExtractor(item)
                          )
                        );
                        hideDeleteConfirmDialog();
                      };

                      return (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            icon="pencil"
                            size={20}
                            onPress={showEditItemModal}
                          />
                          {props.renderEditItemModal({
                            visible: isEditItemModalVisible,
                            onDismiss: hideEditItemModal,
                            onSave: handleUpdateItem,
                            item,
                          })}
                          <IconButton
                            icon="delete"
                            size={20}
                            onPress={showDeleteConfirmDialog}
                          />
                          <Portal>
                            <Dialog
                              visible={isDeleteConfirmDialogVisible}
                              onDismiss={hideDeleteConfirmDialog}
                            >
                              <Dialog.Title>Delete {props.name}</Dialog.Title>
                              <Dialog.Content>
                                <Text variant="bodyMedium">
                                  Are you sure you want to delete this{" "}
                                  {props.name}?
                                </Text>
                              </Dialog.Content>
                              <Dialog.Actions>
                                <Button onPress={hideDeleteConfirmDialog}>
                                  Cancel
                                </Button>
                                <Button onPress={handleDeleteItem}>
                                  Delete
                                </Button>
                              </Dialog.Actions>
                            </Dialog>
                          </Portal>
                        </View>
                      );
                    }}
                  />
                ))}
                <List.Item
                  title={`Add ${props.name}`}
                  onPress={showCreateItemModal}
                  left={(_props) => <List.Icon {..._props} icon="plus" />}
                />
                {props.renderAddItemModal({
                  visible: isCreateItemModalVisible,
                  onDismiss: hideCreateItemModal,
                  onSave: handleCreateItem,
                })}
              </List.Section>
            </ScrollView>
            <Button onPress={handleConfirm}>Confirm</Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}
