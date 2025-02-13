import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./navigation/MainStack";
import { ThemeProvider } from "./contexts/ThemeContext";
import EnterOtpScreen from "./app/screens/generalMode/EnterOtpScreen";
import ChatScreen from "./app/screens/generalMode/ChatScreen";
import ChatListScreen from "./app/screens/generalMode/ChatListScreen";
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
