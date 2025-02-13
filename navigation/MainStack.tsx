import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions, Image, StyleSheet } from "react-native";
import LoginScreen from "@/app/screens/generalMode/LoginScreen";
import RegisterScreen from "@/app/screens/generalMode/RegisterScreen";
import ForgotPasswordSelectionScreen from "@/app/screens/generalMode/ForgotPasswordSelectionScreen";
import FriendModeScreen from "@/app/screens/privateMode/FriendModeScreen";
import PublicModeScreen from "@/app/screens/publicMode/PublicModeScreen";
import SearchScreen from "@/app/screens/publicMode/SearchScreen";
import ProfilePublicScreen from "@/app/screens/publicMode/ProfilePublicScreen";
import TabBar from "@/components/public/TabBar";
import CommentScreen from "@/components/public/CommentScreen";
import ChatScreen from "@/app/screens/generalMode/ChatScreen";
import ChatListScreen from "@/app/screens/generalMode/ChatListScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPasswordSelection: undefined;
  FriendMode: undefined;
  PublicMode: undefined;
  Search: undefined;
  ProfilePublic: { id: string }; // Profile có id
  TabBar: undefined;
  Comments: { id: number; userId: number };
  ChatList: undefined;
  Messages: { userId: number };
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
        headerStyle: { backgroundColor: "#1C1C1E" },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="ForgotPasswordSelection"
        component={ForgotPasswordSelectionScreen}
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
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 60,
    resizeMode: "contain",
  },
});

export default MainStack;
