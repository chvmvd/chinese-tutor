import { useState } from "react";
import { View } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import EdittableMultipleSelect from "../../components/common/EdittableMultipleSelect";
import FullScreenDialog from "../../components/common/FullScreenDialog";
import ItemListEditor from "../../components/specific/ItemListEditor";
import createUUID from "../../utils/createUUID";
import {
  convertNumericPinyinToAccentPinyin,
  convertToNumericPinyin,
} from "../../utils/convertPinyin";
import { Conversation, Speaker } from "../../types";

function SpeakerSelect(props: {
  speakers: Speaker[];
  setSpeakers: (speakers: Speaker[]) => void;
  selectedSpeakers: Speaker[];
  setSelectedSpeakers: (speakers: Speaker[]) => void;
}) {
  return (
    <EdittableMultipleSelect
      name="Speaker"
      names="Speakers"
      items={props.speakers}
      setItems={props.setSpeakers}
      selectedItems={props.selectedSpeakers}
      setSelectedItems={props.setSelectedSpeakers}
      keyExtractor={(conversation) => conversation.id}
      titleExtractor={(conversation) => conversation.chineseName}
      renderAddItemModal={({ visible, onDismiss, onSave }) => {
        const [chinese, setChinese] = useState("");
        const [pinyin, setPinyin] = useState("");
        const [translation, setTranslation] = useState("");

        return (
          <FullScreenDialog
            visible={visible}
            onDismiss={onDismiss}
            title="Add Speaker"
            actionLabel="Add"
            onActionPress={() => {
              onSave({
                id: createUUID(),
                chineseName: chinese,
                pinyinName: pinyin,
                translationName: translation,
              });
              onDismiss();
            }}
          >
            <View style={{ gap: 6 }}>
              <Text variant="titleMedium">Name</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 6,
                }}
              >
                <TextInput
                  label="Chinese"
                  value={chinese}
                  onChangeText={setChinese}
                  style={{ flex: 1, fontFamily: "NotoSansSC_400Regular" }}
                />
                <Button
                  onPress={() => {
                    setPinyin(
                      convertToNumericPinyin(chinese, { mode: "surname" })
                    );
                  }}
                >
                  Auto Fill
                </Button>
              </View>
              <TextInput
                label="Pinyin"
                value={pinyin}
                onChangeText={setPinyin}
                style={{ fontFamily: "NotoSansSC_400Regular" }}
              />
              <TextInput
                label="Translation"
                value={translation}
                onChangeText={setTranslation}
              />
            </View>
          </FullScreenDialog>
        );
      }}
      renderEditItemModal={({
        visible,
        onDismiss,
        onSave,
        item: conversation,
      }) => {
        const [chinese, setChinese] = useState(conversation.chineseName);
        const [pinyin, setPinyin] = useState(conversation.pinyinName);
        const [translation, setTranslation] = useState(
          conversation.translationName
        );

        return (
          <FullScreenDialog
            visible={visible}
            onDismiss={onDismiss}
            title="Edit Speaker"
            actionLabel="Confirm"
            onActionPress={() => {
              onSave({
                id: conversation.id,
                chineseName: chinese,
                pinyinName: pinyin,
                translationName: translation,
              });
              onDismiss();
            }}
          >
            <View style={{ gap: 6 }}>
              <Text variant="titleMedium">Name</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 6,
                }}
              >
                <TextInput
                  label="Chinese"
                  value={chinese}
                  onChangeText={setChinese}
                  style={{ flex: 1, fontFamily: "NotoSansSC_400Regular" }}
                />
                <Button
                  onPress={() => {
                    setPinyin(
                      convertToNumericPinyin(chinese, { mode: "surname" })
                    );
                  }}
                >
                  Auto Fill
                </Button>
              </View>
              <TextInput
                label="Pinyin"
                value={pinyin}
                onChangeText={setPinyin}
                style={{ fontFamily: "NotoSansSC_400Regular" }}
              />
              <TextInput
                label="Translation"
                value={translation}
                onChangeText={setTranslation}
                style={{ fontFamily: "NotoSansSC_400Regular" }}
              />
            </View>
          </FullScreenDialog>
        );
      }}
    />
  );
}

export default function EditConversationRoute(props: {
  speakers: Speaker[];
  setSpeakers: (speakers: Speaker[]) => void;
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
}) {
  return (
    <ItemListEditor
      items={props.conversations}
      setItems={props.setConversations}
      keyExtractor={(conversation) => conversation.id}
      renderItem={({ item: conversation }) => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            columnGap: 12,
          }}
        >
          <Avatar.Text
            size={32}
            label={
              props.speakers.find((speaker) =>
                conversation.speakerIds.includes(speaker.id)
              )?.chineseName[0] ?? "？"
            }
          />
          <View style={{ display: "flex", flex: 1 }}>
            <Text
              variant="bodyMedium"
              style={{ fontFamily: "NotoSansSC_400Regular" }}
            >
              {convertNumericPinyinToAccentPinyin(conversation.pinyinContent)}
            </Text>
            <Text
              variant="bodyLarge"
              style={{ fontFamily: "NotoSansSC_400Regular" }}
            >
              {conversation.chineseContent}
            </Text>
            <Text variant="bodyMedium">{conversation.translationContent}</Text>
          </View>
        </View>
      )}
      renderAddItemModal={({ visible, onDismiss, onSave }) => {
        const [selectedSpeakers, setSelectedSpeakers] = useState<Speaker[]>([]);
        const [chinese, setChinese] = useState("");
        const [pinyin, setPinyin] = useState("");
        const [translation, setTranslation] = useState("");

        return (
          <FullScreenDialog
            visible={visible}
            onDismiss={onDismiss}
            title="Add Conversation"
            actionLabel="Add"
            onActionPress={() => {
              onSave({
                id: createUUID(),
                speakerIds: selectedSpeakers.map((speaker) => speaker.id),
                chineseContent: chinese,
                pinyinContent: pinyin,
                translationContent: translation,
              });
              onDismiss();
            }}
          >
            <View style={{ gap: 12 }}>
              <View style={{ gap: 6 }}>
                <Text variant="titleMedium">Name</Text>
              </View>
              <SpeakerSelect
                speakers={props.speakers}
                setSpeakers={props.setSpeakers}
                selectedSpeakers={selectedSpeakers}
                setSelectedSpeakers={setSelectedSpeakers}
              />
              <View style={{ gap: 6 }}>
                <Text variant="titleMedium">Content</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 6,
                  }}
                >
                  <TextInput
                    label="Chinese"
                    value={chinese}
                    multiline
                    onChangeText={setChinese}
                    style={{ flex: 1, fontFamily: "NotoSansSC_400Regular" }}
                  />
                  <Button
                    onPress={() => {
                      setPinyin(convertToNumericPinyin(chinese));
                    }}
                  >
                    Auto Fill
                  </Button>
                </View>
                <TextInput
                  label="Pinyin"
                  value={pinyin}
                  multiline
                  onChangeText={setPinyin}
                />
                <TextInput
                  label="Translation"
                  value={translation}
                  multiline
                  onChangeText={setTranslation}
                />
              </View>
            </View>
          </FullScreenDialog>
        );
      }}
      renderEditItemModal={({
        visible,
        onDismiss,
        onSave,
        item: conversation,
      }) => {
        const [selectedSpeakers, setSelectedSpeakers] = useState<Speaker[]>(
          conversation.speakerIds
            .map(
              (speakerId) =>
                props.speakers.find((speaker) => speaker.id === speakerId) ??
                null
            )
            .filter((speaker) => speaker !== null) as Speaker[]
        );
        const [chinese, setChinese] = useState(conversation.chineseContent);
        const [pinyin, setPinyin] = useState(conversation.pinyinContent);
        const [translation, setTranslation] = useState(
          conversation.translationContent
        );

        return (
          <FullScreenDialog
            visible={visible}
            onDismiss={onDismiss}
            title="Edit Conversation"
            actionLabel="Confirm"
            onActionPress={() => {
              onSave({
                id: conversation.id,
                speakerIds: selectedSpeakers.map((speaker) => speaker.id),
                chineseContent: chinese,
                pinyinContent: pinyin,
                translationContent: translation,
              });
              onDismiss();
            }}
          >
            <View style={{ gap: 12 }}>
              <View style={{ gap: 6 }}>
                <Text variant="titleMedium">Name</Text>
              </View>
              <SpeakerSelect
                speakers={props.speakers}
                setSpeakers={props.setSpeakers}
                selectedSpeakers={selectedSpeakers}
                setSelectedSpeakers={setSelectedSpeakers}
              />
              <View style={{ gap: 6 }}>
                <Text variant="titleMedium">Content</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 6,
                  }}
                >
                  <TextInput
                    label="Chinese"
                    value={chinese}
                    multiline
                    onChangeText={setChinese}
                    style={{ flex: 1, fontFamily: "NotoSansSC_400Regular" }}
                  />
                  <Button
                    onPress={() => {
                      setPinyin(convertToNumericPinyin(chinese));
                    }}
                  >
                    Auto Fill
                  </Button>
                </View>
                <TextInput
                  label="Pinyin"
                  value={pinyin}
                  multiline
                  onChangeText={setPinyin}
                  style={{ fontFamily: "NotoSansSC_400Regular" }}
                />
                <TextInput
                  label="Translation"
                  value={translation}
                  multiline
                  onChangeText={setTranslation}
                />
              </View>
            </View>
          </FullScreenDialog>
        );
      }}
    />
  );
}
