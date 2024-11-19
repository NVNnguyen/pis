import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./app/screens/LoginScreen";
const Stack = createStackNavigator();
const App = () => {
  return <LoginScreen navigation={undefined} />;
};

export default App;

