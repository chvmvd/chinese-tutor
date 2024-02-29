import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import {
  useFonts,
  NotoSansSC_400Regular,
} from "@expo-google-fonts/noto-sans-sc";
import ModuleSelectionScreen from "./ModuleSelectionScreen";
import SettingsScreen from "./SettingsScreen";
import ActivityTypeSelectionScreen from "./ActivityTypeSelectionScreen";
import ConversationScreen from "./ConversationScreen";
import SentenceScreen from "./SentenceScreen";
import VocabularyScreen from "./VocabularyScreen";
import CharacterScreen from "./CharacterScreen";

const theme = {
  ...DefaultTheme,
};

export type RootStackParamList = {
  ModuleSelection: undefined;
  Settings: undefined;
  ActivityTypeSelection: { moduleId: string };
  Conversation: { moduleId: string };
  Sentence: { moduleId: string };
  Vocabulary: { moduleId: string };
  Character: { moduleId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    NotoSansSC_400Regular,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen
            name="ModuleSelection"
            component={ModuleSelectionScreen}
          />
          <RootStack.Screen name="Settings" component={SettingsScreen} />
          <RootStack.Screen
            name="ActivityTypeSelection"
            component={ActivityTypeSelectionScreen}
          />
          <RootStack.Screen
            name="Conversation"
            component={ConversationScreen}
          />
          <RootStack.Screen name="Vocabulary" component={VocabularyScreen} />
          <RootStack.Screen name="Sentence" component={SentenceScreen} />
          <RootStack.Screen name="Character" component={CharacterScreen} />
        </RootStack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}
