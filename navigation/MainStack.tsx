import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions, Image, StyleSheet } from "react-native";
import LoginScreen from "@/app/screens/generalMode/LoginScreen";
import RegisterScreen from "@/app/screens/generalMode/RegisterScreen";
import FriendModeScreen from "@/app/screens/privateMode/FriendModeScreen";
import PublicModeScreen from "@/app/screens/publicMode/PublicModeScreen";
import SearchScreen from "@/app/screens/publicMode/SearchScreen";
import ProfilePublicScreen from "@/app/screens/publicMode/ProfilePublicScreen";
import TabBar from "@/components/public/TabBar/TabBar";
import CommentScreen from "@/app/screens/publicMode/CommentScreen";
import ChatScreen from "@/app/screens/generalMode/ChatScreen";
import ChatListScreen from "@/app/screens/generalMode/ChatListScreen";
import LoadingScreen from "@/app/screens/generalMode/LoadingScreen";
import { RootStackParamList } from "@/utils/types/MainStackType";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { fontWeight } from "@/styles/color";
import ForgotPasswordScreen from "@/app/screens/generalMode/ForgotPasswordScreen";
import OtpScreen from "@/app/screens/generalMode/OtpScreen";
import ResetPasswordScreen from "@/app/screens/generalMode/ResetPasswordScreen";

const { width, height } = Dimensions.get("window");
const Stack = createNativeStackNavigator<RootStackParamList>();
const MainStack: React.FC = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
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
          backgroundColor: isDarkMode
            ? darkTheme.background
            : lightTheme.background,
        },
        headerTintColor: isDarkMode ? darkTheme.text : lightTheme.text,
        headerTitleStyle: { fontWeight: fontWeight, fontSize: 20 },
      }}
    >
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen
        name="Login"
        options={{ headerBackTitle: "" }}
        component={LoginScreen}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPassword"
        options={{ headerShown: true, headerBackTitle: "" }}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="FriendMode"
        component={FriendModeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PublicMode"
        component={PublicModeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilePublic"
        component={ProfilePublicScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="TabBar"
        component={TabBar}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Comments"
        component={CommentScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Messages"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    logo: {
      width: width * 0.1,
      height: height * 0.06,
      resizeMode: "contain",
      tintColor: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });

export default MainStack;
