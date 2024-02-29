import { useCallback, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  FAB,
  IconButton,
  Menu,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { RootStackParamList } from "../App";
import { Module } from "../types";
import useAsyncStorage from "../hooks/useAsyncStorage";
import createUUID from "../utils/createUUID";
import { useFocusEffect } from "@react-navigation/native";

function AddOrEditModuleDialog(props: {
  visible: boolean;
  onDismiss: () => void;
  module: Module;
  onSave: (module: Module) => void;
}) {
  const theme = useTheme();

  const isCreate = props.module.title === "";
  const [moduleName, setModuleName] = useState(props.module.title);

  const handleSave = () => {
    props.onSave({ ...props.module, title: moduleName });
    props.onDismiss();
  };

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
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onStartShouldSetResponder={() => true}
            onTouchStart={(event) => {
              if (Platform.OS === "web") {
                event.stopPropagation();
              }
            }}
            style={{
              width: "90%",
              backgroundColor: theme.colors.background,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <View style={{ padding: 10 }}>
              <Text variant="titleLarge">
                {isCreate ? "Add Module" : "Edit Module"}
              </Text>
            </View>
            <View style={{ padding: 10 }}>
              <TextInput
                label="Name"
                value={moduleName}
                onChangeText={setModuleName}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Button onPress={props.onDismiss}>Cancel</Button>
              <Button onPress={handleSave}>
                {isCreate ? "Add" : "Confirm"}
              </Button>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
    // <Portal>
    //   <Dialog visible={props.visible} onDismiss={props.onDismiss}>
    //     <Dialog.Title>{isCreate ? "Add Module" : "Edit Module"}</Dialog.Title>
    //     <Dialog.Content>
    //       <TextInput
    //         label="Name"
    //         value={moduleName}
    //         onChangeText={setModuleName}
    //       />
    //     </Dialog.Content>
    //     <Dialog.Actions>
    //       <Button onPress={props.onDismiss}>Cancel</Button>
    //       <Button onPress={handleSave}>{isCreate ? "Add" : "Confirm"}</Button>
    //     </Dialog.Actions>
    //   </Dialog>
    // </Portal>
  );
}

function ModuleCard(props: {
  module: Module;
  handleUpdateModule: (newModule: Module) => void;
  handleDeleteModule: (module: Module) => void;
  onCardPress: () => void;
}) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const openMenu = () => setIsMenuVisible(true);
  const closeMenu = () => setIsMenuVisible(false);

  const [isEditModuleDialogVisible, setIsEditModuleDialogVisible] =
    useState(false);
  const showEditModuleDialog = () => {
    setIsEditModuleDialogVisible(true);
    closeMenu();
  };
  const hideEditModuleDialog = () => setIsEditModuleDialogVisible(false);

  const handleDeleteModule = () => {
    props.handleDeleteModule(props.module);
    closeMenu();
  };

  return (
    <Card onPress={props.onCardPress}>
      <Card.Title
        title={props.module.title}
        titleStyle={{ fontSize: 20 }}
        left={(_props) => <Avatar.Icon {..._props} icon="book" />}
        right={(_props) => (
          <>
            <Menu
              visible={isMenuVisible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  {..._props}
                  icon="dots-vertical"
                  onPress={openMenu}
                />
              }
            >
              <Menu.Item onPress={showEditModuleDialog} title="Edit" />
              <Menu.Item onPress={handleDeleteModule} title="Delete" />
            </Menu>
            <AddOrEditModuleDialog
              visible={isEditModuleDialogVisible}
              onDismiss={hideEditModuleDialog}
              onSave={props.handleUpdateModule}
              module={props.module}
            />
          </>
        )}
      />
    </Card>
  );
}

const defaultModules: Module[] = [
  {
    id: "6f378824-babc-4289-901b-f2a31b4f9272",
    title: "sample module",
  },
];

type ModuleSelectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ModuleSelection"
>;

export default function ModuleSelectionScreen({
  navigation,
}: ModuleSelectionScreenProps) {
  const [modules, setModules, refetch] = useAsyncStorage(
    "modules",
    defaultModules,
  );

  if (Platform.OS !== "web") {
    useFocusEffect(
      useCallback(() => {
        refetch();
      }, [refetch]),
    );
  }

  function handleCreateModule(module: Module): void {
    setModules([...modules, module]);
  }

  function handleUpdateModule(newModule: Module): void {
    setModules(
      modules.map((module) =>
        module.id === newModule.id ? newModule : module,
      ),
    );
  }

  function handleDeleteModule(module: Module): void {
    setModules(modules.filter((oldModule) => oldModule.id !== module.id));
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

  const [isCreateModuleDialogVisible, setIsCreateModuleDialogVisible] =
    useState(false);
  const showCreateModuleDialog = () => setIsCreateModuleDialogVisible(true);
  const hideCreateModuleDialog = () => setIsCreateModuleDialogVisible(false);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Modules" />
        <Appbar.Action
          icon="cog"
          onPress={() => {
            navigation.navigate("Settings");
          }}
        />
      </Appbar.Header>
      <FlatList
        data={modules}
        style={{ padding: 12 }}
        contentContainerStyle={{ rowGap: 12 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ModuleCard
            module={item}
            handleUpdateModule={handleUpdateModule}
            handleDeleteModule={handleDeleteModule}
            onCardPress={() => {
              navigation.navigate("ActivityTypeSelection", {
                moduleId: item.id,
              });
            }}
          />
        )}
        onScroll={onScroll}
      />
      <FAB
        icon="plus"
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        onPress={showCreateModuleDialog}
        visible={isFABVisible}
      />
      <AddOrEditModuleDialog
        visible={isCreateModuleDialogVisible}
        onDismiss={hideCreateModuleDialog}
        onSave={handleCreateModule}
        module={{ id: createUUID(), title: "" }}
      />
    </>
  );
}
