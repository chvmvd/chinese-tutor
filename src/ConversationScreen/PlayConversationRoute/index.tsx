import { useState } from "react";
import {
  ImageBackground,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar, Avatar, Button, IconButton, Text } from "react-native-paper";
import * as Speech from "expo-speech";
import BottomDrawer from "../../components/common/BottomDrawer";
import SpeechBubble from "../../components/specific/SpeechBubble";
import PracticeModal from "../../components/specific/PracticeModal";
import { convertNumericPinyinToAccentPinyin } from "../../utils/convertPinyin";
import { Conversation, Speaker } from "../../types";

function PreviewModalButton(props: {
  conversations: Conversation[];
  speakers: Speaker[];
}) {
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const showPreviewModal = () => setIsPreviewModalVisible(true);
  const hidePreviewModal = () => setIsPreviewModalVisible(false);

  return (
    <>
      <Button
        mode="contained"
        style={{ padding: 6, borderRadius: 30 }}
        labelStyle={{ fontSize: 20 }}
        onPress={showPreviewModal}
      >
        Preview
      </Button>
      <Modal
        animationType="slide"
        visible={isPreviewModalVisible}
        onRequestClose={hidePreviewModal}
      >
        <Appbar.Header>
          <Appbar.Action icon="close" onPress={hidePreviewModal} />
        </Appbar.Header>
        <ScrollView contentContainerStyle={{ padding: 12, rowGap: 12 }}>
          {props.conversations.map((conversation) => {
            const speaker = props.speakers.find((speaker) =>
              conversation.speakerIds.includes(speaker.id)
            );
            if (!speaker) {
              return null;
            }
            return (
              <SpeechBubble
                key={conversation.id}
                avatarLabel={speaker.chineseName[0]}
                message={conversation.chineseContent}
                isOwnMessage={false}
              />
            );
          })}
        </ScrollView>
      </Modal>
    </>
  );
}

function RolePlayModalButton(props: {
  conversations: Conversation[];
  speakers: Speaker[];
}) {
  const [isSelectSpeakerDrawerVisible, setIsSelectSpeakerDrawerVisible] =
    useState(false);
  const showSelectSpeakerDrawer = () => setIsSelectSpeakerDrawerVisible(true);
  const hideSelectSpeakerDrawer = () => setIsSelectSpeakerDrawerVisible(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const handleSelectSpeaker = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    hideSelectSpeakerDrawer();
    showRolePlayModal();
  };

  const [isRolePlayModalVisible, setIsRolePlayModalVisible] = useState(false);
  const showRolePlayModal = () => setIsRolePlayModalVisible(true);
  const hideRolePlayModal = () => {
    setIsRolePlayModalVisible(false);
    setCurrentConversationIndex(0);
    setSelectedSpeaker(null);
  };
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const currentSpeaker =
    selectedSpeaker === null
      ? null
      : props.conversations[currentConversationIndex].speakerIds.includes(
          selectedSpeaker.id
        )
      ? "user"
      : "partner";
  const handleNextConversation = () => {
    if (currentConversationIndex < props.conversations.length - 1) {
      setCurrentConversationIndex(currentConversationIndex + 1);
    } else {
      hideRolePlayModal();
    }
  };

  return (
    <>
      <Button
        mode="contained"
        style={{ padding: 6, borderRadius: 30 }}
        labelStyle={{ fontSize: 20 }}
        onPress={showSelectSpeakerDrawer}
      >
        Role Play
      </Button>
      <BottomDrawer
        visible={isSelectSpeakerDrawerVisible}
        onDismiss={hideSelectSpeakerDrawer}
      >
        <View style={{ minHeight: 250 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              columnGap: 6,
            }}
          >
            <IconButton
              icon="close"
              onPress={hideSelectSpeakerDrawer}
              style={{ margin: 0 }}
            />
            <Text variant="bodyLarge">
              Select the speaker you want to role.
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              padding: 16,
              gap: 20,
            }}
          >
            {props.speakers.map((speaker) => (
              <TouchableOpacity
                key={speaker.id}
                onPress={() => {
                  handleSelectSpeaker(speaker);
                }}
              >
                <Avatar.Text
                  label={speaker.chineseName[0]}
                  labelStyle={{ fontFamily: "NotoSansSC_400Regular" }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BottomDrawer>
      <Modal
        animationType="slide"
        visible={isRolePlayModalVisible}
        onRequestClose={hideRolePlayModal}
      >
        <Appbar.Header>
          <Appbar.Action icon="close" onPress={hideRolePlayModal} />
        </Appbar.Header>
        <View
          style={{
            display: "flex",
            flex: 1,
            padding: 20,
            paddingBottom: 40,
            rowGap: 24,
          }}
        >
          <ScrollView
            contentContainerStyle={{ flex: 1, padding: 12, rowGap: 12 }}
          >
            {props.conversations.map((conversation, conversationIndex) => {
              const speaker = props.speakers.find((speaker) =>
                conversation.speakerIds.includes(speaker.id)
              );
              if (!speaker) {
                return null;
              }
              if (currentConversationIndex < conversationIndex) {
                return null;
              }
              return (
                <SpeechBubble
                  key={conversation.id}
                  avatarLabel={speaker.chineseName[0]}
                  message={conversation.chineseContent}
                  isOwnMessage={speaker.id === selectedSpeaker?.id}
                />
              );
            })}
          </ScrollView>
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
              {currentSpeaker === "user" ? (
                <IconButton
                  icon="arrow-right-circle-outline"
                  size={64}
                  onPress={handleNextConversation}
                />
              ) : (
                <IconButton
                  icon="volume-high"
                  size={64}
                  onPress={() => {
                    Speech.speak(
                      props.conversations[currentConversationIndex]
                        .chineseContent,
                      {
                        language: "zh-Hans",
                        onDone: handleNextConversation,
                      }
                    );
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function PracticeModalButton(props: { conversations: Conversation[] }) {
  const [isSelectInputTypeDrawerVisible, setIsSelectInputTypeDrawerVisible] =
    useState(false);
  const showSelectInputTypeDrawer = () =>
    setIsSelectInputTypeDrawerVisible(true);
  const hideSelectInputTypeDrawer = () =>
    setIsSelectInputTypeDrawerVisible(false);
  const [selectedInputType, setSelectedInputType] = useState<
    "chinese" | "english" | "pinyin" | "audio"
  >("chinese");
  const handleSelectInputType = (inputType: typeof selectedInputType) => {
    setSelectedInputType(inputType);
    hideSelectInputTypeDrawer();
    showPracticeModal();
  };

  const [isPracticeModalVisible, setIsPracticeModalVisible] = useState(false);
  const showPracticeModal = () => setIsPracticeModalVisible(true);
  const hidePracticeModal = () => setIsPracticeModalVisible(false);

  return (
    <>
      <Button
        mode="contained"
        style={{ padding: 6, borderRadius: 30 }}
        labelStyle={{ fontSize: 20 }}
        onPress={showSelectInputTypeDrawer}
      >
        Practice
      </Button>
      <BottomDrawer
        visible={isSelectInputTypeDrawerVisible}
        onDismiss={hideSelectInputTypeDrawer}
      >
        <View style={{ height: 250 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              columnGap: 6,
            }}
          >
            <IconButton
              icon="close"
              onPress={hideSelectInputTypeDrawer}
              style={{ margin: 0 }}
            />
            <Text variant="bodyLarge">Select what you want to practice.</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 16,
              gap: 20,
            }}
          >
            {(
              [
                {
                  key: "chinese",
                  label: "Chinese",
                  iconName: "translate",
                },
                {
                  key: "english",
                  label: "English",
                  iconName: "account-voice",
                },
                {
                  key: "pinyin",
                  label: "Pinyin",
                  iconName: "alphabet-latin",
                },
                {
                  key: "audio",
                  label: "Audio",
                  iconName: "volume-high",
                },
              ] as {
                key: typeof selectedInputType;
                label: string;
                iconName: string;
              }[]
            ).map((inputItem) => (
              <View
                key={inputItem.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  icon={inputItem.iconName}
                  size={48}
                  onPress={() => {
                    handleSelectInputType(inputItem.key);
                  }}
                  style={{
                    margin: 0,
                  }}
                />
                <Text variant="labelMedium">{inputItem.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </BottomDrawer>
      <PracticeModal
        visible={isPracticeModalVisible}
        onDismiss={hidePracticeModal}
        questions={props.conversations}
        keyExtractor={(conversation) => conversation.id}
        titleExtractor={(conversation) => conversation.chineseContent}
        renderQuestion={(conversation) => {
          switch (selectedInputType) {
            case "chinese":
              return (
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: "NotoSansSC_400Regular",
                  }}
                >
                  {conversation.chineseContent}
                </Text>
              );
            case "english":
              return (
                <Text style={{ fontSize: 24 }}>
                  {conversation.translationContent}
                </Text>
              );
            case "pinyin":
              return (
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: "NotoSansSC_400Regular",
                  }}
                >
                  {convertNumericPinyinToAccentPinyin(
                    conversation.pinyinContent
                  )}
                </Text>
              );
            case "audio":
              return (
                <IconButton
                  icon="volume-high"
                  size={80}
                  onPress={() => {
                    Speech.speak(conversation.chineseContent, {
                      language: "zh-Hans",
                    });
                  }}
                />
              );
          }
        }}
        renderAnswer={(conversation) => (
          <View
            style={{
              rowGap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "NotoSansSC_400Regular",
              }}
            >
              {convertNumericPinyinToAccentPinyin(conversation.pinyinContent)}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "NotoSansSC_400Regular",
              }}
            >
              {conversation.chineseContent}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {conversation.translationContent}
            </Text>
          </View>
        )}
      />
    </>
  );
}

export default function PlayConversationRoute(props: {
  speakers: Speaker[];
  conversations: Conversation[];
}) {
  return (
    <>
      <ImageBackground
        source={{
          uri: "https://unsplash.com/photos/W3Jl3jREpDY/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y29udmVyc2F0aW9ufGphfDB8fHx8MTcwNzIwNjcxN3ww&force=true&w=1920",
        }}
        style={{ flex: 1 }}
      >
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            margin: 12,
            rowGap: 24,
          }}
        >
          <PreviewModalButton
            conversations={props.conversations}
            speakers={props.speakers}
          />
          <RolePlayModalButton
            conversations={props.conversations}
            speakers={props.speakers}
          />
          <PracticeModalButton conversations={props.conversations} />
        </View>
      </ImageBackground>
    </>
  );
}
