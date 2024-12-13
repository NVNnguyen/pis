import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../app/LoginScreen";
import RegisterScreen from "../app/RegisterScreen";
import ForgotPasswordSelectionScreen from "@/app/ForgotPasswordSelectionScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPasswordSelection: undefined;
  NewCredentials: undefined; // Add ForgotNavigation as a route
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitle: "", // Remove title
        headerStyle: {
          backgroundColor: "#1C1C1E", // Header background color
        },
        headerShown: true,
        headerTintColor: "#FFF", // Header text color
        headerTitleStyle: {
          fontWeight: "bold", // Bold header text
          fontSize: 20, // Header text size
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPasswordSelection"
        component={ForgotPasswordSelectionScreen}
      />
      {/* Add ForgotNavigation as a separate screen */}
    </Stack.Navigator>
  );
};

export default MainStack;
