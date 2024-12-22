import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./navigation/MainStack";
import ChangePasswordScreen from "./app/screens/generalMode/ChangePasswordScreen";
import ChatScreen from "./app/screens/generalMode/ChatScreen";
import ForgotPasswordSelectionScreen from "./app/screens/generalMode/ForgotPasswordSelectionScreen";
import FriendModeScreen from "./app/screens/privateMode/FriendModeScreen";
import LoadingScreen from "./app/screens/generalMode/LoadingScreen";
import LoginScreen from "./app/screens/generalMode/LoginScreen";
import NewCredentialsScreen from "./app/screens/generalMode/NewCredentialsScreen";
import PostCaptureScreen from "./app/screens/privateMode/PostCaptureScreen";
import PremiumScreen from "./app/screens/generalMode/PremiumScreen";
import ProfileScreen from "./app/screens/generalMode/ProfileScreen";
import SettingsScreen from "./app/screens/generalMode/SettingScreen";
import BlockedAccountListScreen from "./app/screens/generalMode/BlockedAccountListScreen";

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
    // <BlockedAccountListScreen />
  );
};

export default App;
