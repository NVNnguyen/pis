import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./app/navigation/MainStack";
import ChangePasswordScreen from "./app/screens/ChangePassword";
import ChatScreen from "./app/screens/ChatScreen";

const App: React.FC = () => {
  return (
    // <NavigationContainer>
    //   <MainStack />
    // </NavigationContainer>
    <ChatScreen />
  );
};

export default App;
