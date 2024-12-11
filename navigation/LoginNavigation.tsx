import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../app/LoginScreen";
import RegisterScreen from "../app/RegisterScreen";
import { RootStackParamList } from "../components/RootStackParamList";

// Create Stack Navigator with RootStackParamList
const Stack = createStackNavigator<RootStackParamList>();

const LoginNavigation: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerTitle: "Register",
          headerBackTitle: "Back",
        }}
      />
    </Stack.Navigator>
  );
};

export default LoginNavigation;
