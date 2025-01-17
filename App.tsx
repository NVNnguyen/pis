import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./navigation/MainStack";
import TabBar from "./components/public/TabBar";
import ProfilePrivateScreen from "./app/screens/privateMode/ProfilePrivateScreen";
import ProfileHeader from "./components/public/profileComponent/ProfileHeader";
import ProfilePublicScreen from "./app/screens/publicMode/ProfilePublicScreen";
import { ThemeProvider } from "./contexts/ThemeContext";
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </ThemeProvider>

    //   <ThemeProvider>
    //     <ProfilePublicScreen />
    //   </ThemeProvider>
  );
};

export default App;
