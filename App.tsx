import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./app/screens/LoginScreen";
import PremiumScreen from "./app/screens/PremiumScreen";
import SettingsScreen from "./app/screens/SettingScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import ChangePasswordScreen from "./app/screens/ChangePassword";
const Stack = createStackNavigator();
const App = () => {
  return <ChangePasswordScreen />;
};

export default App;
