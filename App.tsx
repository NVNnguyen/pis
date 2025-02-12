import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./navigation/MainStack";
import { ThemeProvider } from "./contexts/ThemeContext";
import EnterOtpScreen from "./app/screens/generalMode/EnterOtpScreen";
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
