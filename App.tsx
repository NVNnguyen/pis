import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./navigation/MainStack";
import PublicModeScreen from "./app/screens/publicMode/PublicModeScreen";
import SearchScreen from "./app/screens/publicMode/SearchScreen";
const App: React.FC = () => {
  return (
    // <NavigationContainer>
    //   <MainStack />
    // </NavigationContainer>
    <SearchScreen />
  );
};

export default App;
