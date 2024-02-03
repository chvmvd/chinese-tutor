import { ReactNode, useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  IconButton,
  List,
  ProgressBar,
  Text,
  useTheme,
} from "react-native-paper";

export default function PracticeModal<Question>(props: {
  visible: boolean;
  onDismiss: () => void;
  questions: Question[];
  keyExtractor: (question: Question) => string;
  titleExtractor: (question: Question) => string;
  renderQuestion: (question: Question) => ReactNode;
  renderAnswer: (question: Question) => ReactNode;
  renderInfo?: (question: Question) => ReactNode;
}) {
  const theme = useTheme();

  const [viewMode, setViewMode] = useState<"question" | "answer" | "result">(
    "question"
  );

  const [questions, setQuestions] = useState<Question[]>(props.questions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [incorrectQuestions, setIncorrectQuestions] = useState<Question[]>([]);

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const showInfoModal = () => setIsInfoModalVisible(true);
  const hideInfoModal = () => setIsInfoModalVisible(false);

  const handleReset = () => {
    setViewMode("question");
    setCurrentQuestionIndex(0);
    setIncorrectQuestions([]);
  };

  const handleDismiss = () => {
    handleReset();
    setQuestions(props.questions);
    props.onDismiss();
  };

  const handleCorrect = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setViewMode("result");
    } else {
      setViewMode("question");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleIncorrect = () => {
    setIncorrectQuestions([
      ...incorrectQuestions,
      questions[currentQuestionIndex],
    ]);
    if (currentQuestionIndex === questions.length - 1) {
      setViewMode("result");
    } else {
      setViewMode("question");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleNext = () => {
    setViewMode("answer");
  };

  if (viewMode === "question") {
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
          <View style={{ width: "100%", padding: 10 }}>
            <ProgressBar
              progress={(currentQuestionIndex + 1) / questions.length}
            />
          </View>
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
                    padding: 10,
                  }}
                >
                  {props.renderQuestion(questions[currentQuestionIndex])}
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
            <View style={{ display: "flex", flex: 1 }} />
            <View style={{ display: "flex", flex: 1, alignItems: "center" }}>
              <IconButton
                icon="arrow-right-circle-outline"
                size={64}
                onPress={handleNext}
              />
            </View>
            <View style={{ display: "flex", flex: 1 }} />
          </View>
        </View>
      </Modal>
    );
  } else if (viewMode === "answer") {
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
          <View style={{ width: "100%", padding: 10 }}>
            <ProgressBar
              progress={(currentQuestionIndex + 1) / questions.length}
            />
          </View>
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
                    padding: 10,
                  }}
                >
                  {props.renderAnswer(questions[currentQuestionIndex])}
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
            <View style={{ display: "flex", flex: 1 }} />
            <View style={{ display: "flex", flex: 1, alignItems: "center" }}>
              <IconButton
                icon="thumb-down-outline"
                size={48}
                onPress={handleIncorrect}
              />
            </View>
            <View style={{ display: "flex", flex: 1, alignItems: "center" }}>
              <IconButton
                icon="thumb-up-outline"
                size={48}
                onPress={handleCorrect}
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
                          {props.renderInfo(questions[currentQuestionIndex])}
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
  } else {
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
            padding: 20,
            paddingBottom: 40,
            rowGap: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: 20,
              columnGap: 30,
            }}
          >
            <View style={{ display: "flex", flex: 1 }}>
              <ProgressBar
                progress={
                  (questions.length - incorrectQuestions.length) /
                  questions.length
                }
              />
            </View>
            <Text variant="displaySmall">
              {questions.length - incorrectQuestions.length} /{" "}
              {questions.length}
            </Text>
          </View>
          <ScrollView>
            <List.Section>
              <List.Subheader style={{ fontSize: 20 }}>Results</List.Subheader>
              {questions.map((question) => (
                <List.Item
                  key={props.keyExtractor(question)}
                  title={props.titleExtractor(question)}
                  right={() =>
                    incorrectQuestions.find(
                      (incorrectQuestion) =>
                        props.keyExtractor(incorrectQuestion) ===
                        props.keyExtractor(question)
                    ) ? (
                      <List.Icon icon="thumb-down-outline" />
                    ) : (
                      <List.Icon icon="thumb-up-outline" />
                    )
                  }
                />
              ))}
            </List.Section>
          </ScrollView>
          <Button
            mode="contained"
            style={{ padding: 6, borderRadius: 30 }}
            labelStyle={{ fontSize: 20 }}
            onPress={() => {
              if (incorrectQuestions.length > 0) {
                setQuestions(incorrectQuestions);
                handleReset();
              } else {
                handleDismiss();
              }
            }}
          >
            Review Incorrect
          </Button>
          <Button
            mode="contained"
            style={{ padding: 6, borderRadius: 30 }}
            labelStyle={{ fontSize: 20 }}
            onPress={() => {
              setQuestions(props.questions);
              handleReset();
            }}
          >
            Review All
          </Button>
        </View>
      </Modal>
    );
  }
}
