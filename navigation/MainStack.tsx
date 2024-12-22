import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions, Image, StyleSheet } from "react-native";
import LoginScreen from "../app/screens/generalMode/LoginScreen";
import RegisterScreen from "../app/screens/generalMode/RegisterScreen";
import ForgotPasswordSelectionScreen from "@/app/screens/generalMode/ForgotPasswordSelectionScreen";
import { Color, fontWeight } from "../styles/color";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPasswordSelection: undefined;
  NewCredentials: undefined; // Add ForgotNavigation as a route
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const { width, height } = Dimensions.get("window");
const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitle: () => (
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
        ),
        headerStyle: {
          backgroundColor: "#1C1C1E",
        },
        headerShown: true,
        headerTintColor: Color,
        headerTitleStyle: {
          fontWeight: fontWeight,
          fontSize: 20,
        },
        headerTitleAlign: "center", // Canh giữa tiêu đề
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPasswordSelection"
        component={ForgotPasswordSelectionScreen}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100, // Chiều rộng của logo
    height: 60, // Chiều cao của logo
    resizeMode: "contain", // Đảm bảo logo không bị méo
  },
});

export default MainStack;
