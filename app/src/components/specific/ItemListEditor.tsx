import { ReactNode, useState } from "react";
import { FlatList, View } from "react-native";
import { Card, FAB, IconButton, Menu } from "react-native-paper";

function ItemCard<Item>(props: {
  item: Item;
  renderItem: (props: { item: Item }) => ReactNode;
  handleUpdateItem: (newItem: Item) => void;
  handleDeleteItem: (item: Item) => void;
  renderEditItemModal: (props: {
    visible: boolean;
    onDismiss: () => void;
    item: Item;
    onSave: (item: Item) => void;
  }) => ReactNode;
}) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const openMenu = () => setIsMenuVisible(true);
  const closeMenu = () => setIsMenuVisible(false);

  const [isEditItemDialogVisible, setIsEditItemDialogVisible] = useState(false);
  const showEditItemDialog = () => {
    setIsEditItemDialogVisible(true);
    closeMenu();
  };
  const hideEditItemDialog = () => setIsEditItemDialogVisible(false);

  const handleDeleteItem = () => {
    props.handleDeleteItem(props.item);
    closeMenu();
  };

  return (
    <Card>
      <Card.Content>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            padding: 8,
            paddingRight: 0,
          }}
        >
          <View style={{ flex: 1 }}>
            {props.renderItem({ item: props.item })}
          </View>
          <Menu
            visible={isMenuVisible}
            onDismiss={closeMenu}
            anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}
          >
            <Menu.Item onPress={showEditItemDialog} title="Edit" />
            <Menu.Item onPress={handleDeleteItem} title="Delete" />
          </Menu>
          {props.renderEditItemModal({
            visible: isEditItemDialogVisible,
            onDismiss: hideEditItemDialog,
            item: props.item,
            onSave: props.handleUpdateItem,
          })}
        </View>
      </Card.Content>
    </Card>
  );
}

export default function ItemListEditor<Item>(props: {
  items: Item[];
  setItems: (items: Item[]) => void;
  keyExtractor: (item: Item) => string;
  renderItem: (props: { item: Item }) => ReactNode;
  renderAddItemModal: (props: {
    visible: boolean;
    onDismiss: () => void;
    onSave: (item: Item) => void;
  }) => ReactNode;
  renderEditItemModal: (props: {
    visible: boolean;
    onDismiss: () => void;
    item: Item;
    onSave: (item: Item) => void;
  }) => ReactNode;
}) {
  function handleCreateItem(item: Item): void {
    props.setItems([...props.items, item]);
  }

  function handleUpdateItem(newItem: Item): void {
    props.setItems(
      props.items.map((item) =>
        props.keyExtractor(item) === props.keyExtractor(newItem)
          ? newItem
          : item,
      ),
    );
  }

  function handleDeleteItem(item: Item): void {
    props.setItems(
      props.items.filter(
        (oldItem) => props.keyExtractor(oldItem) !== props.keyExtractor(item),
      ),
    );
  }

  const [isFABVisible, setIsFABVisible] = useState(true);
  const onScroll = ({
    nativeEvent,
  }: {
    nativeEvent: { contentOffset?: { y?: number } };
  }) => {
    const currentScrollPosition = Math.floor(
      nativeEvent?.contentOffset?.y ?? 0,
    );
    setIsFABVisible(currentScrollPosition <= 0);
  };

  const [isCreateItemDialogVisible, setIsCreateItemDialogVisible] =
    useState(false);
  const showCreateItemDialog = () => setIsCreateItemDialogVisible(true);
  const hideCreateItemDialog = () => setIsCreateItemDialogVisible(false);

  return (
    <>
      <FlatList
        data={props.items}
        style={{ padding: 12 }}
        contentContainerStyle={{ rowGap: 12 }}
        keyExtractor={props.keyExtractor}
        renderItem={({ item }) => (
          <ItemCard
            item={item}
            renderItem={props.renderItem}
            handleUpdateItem={handleUpdateItem}
            handleDeleteItem={handleDeleteItem}
            renderEditItemModal={props.renderEditItemModal}
          />
        )}
        onScroll={onScroll}
      />
      <FAB
        icon="plus"
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        onPress={showCreateItemDialog}
        visible={isFABVisible}
      />
      {props.renderAddItemModal({
        visible: isCreateItemDialogVisible,
        onDismiss: hideCreateItemDialog,
        onSave: handleCreateItem,
      })}
    </>
  );
}
