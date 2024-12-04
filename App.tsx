import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FriendModeScreen from "./app/screens/FriendModeScreen";


export type StackParamList = {
  FriendModeScreen: undefined;
  PostImage: { imagePath: string };
};

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  return (
    <FriendModeScreen />
    //   <NavigationContainer>
    //     <Stack.Navigator initialRouteName="FriendModeScreen">
    //       <Stack.Screen
    //         name="FriendModeScreen"
    //         component={FriendModeScreen}
    //         options={{ headerShown: false }}
    //       />
    //       <Stack.Screen
    //         name="PostImage"
    //         component={PostImage}
    //         options={{ headerShown: false }}
    //       />
    //     </Stack.Navigator>
    //   </NavigationContainer>
  );
};

export default App;
