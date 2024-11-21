import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./app/screens/FriendModeScreen";
import PremiumScreen from "./app/screens/PremiumScreen";
import SettingsScreen from "./app/screens/SettingScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import ChangePasswordScreen from "./app/screens/ChangePassword";
import LoadingScreen from "./app/screens/LoadingScreen";
import FriendModeScreen from "./app/screens/FriendModeScreen";
import PostCaptureScreen from "./app/screens/PostCaptureScreen";
import ChatScreen from "./app/screens/ChatScreen";
const Stack = createStackNavigator();
const App = () => {
  return <ChatScreen />;
};

export default App;
