import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";
import LoginScreen from "@/app/screens/generalMode/LoginScreen";
import RegisterScreen from "@/app/screens/generalMode/RegisterScreen";
import FriendModeScreen from "@/app/screens/privateMode/PrivateModeScreen";
import PublicModeScreen from "@/app/screens/publicMode/PublicModeScreen";
import ProfileScreen from "@/app/screens/generalMode/ProfileScreen";
import TabBar from "@/components/public/TabBar/TabBar";
import ChatScreen from "@/app/screens/generalMode/ChatScreen";
import ChatListScreen from "@/app/screens/generalMode/ChatListScreen";
import LoadingScreen from "@/app/screens/generalMode/LoadingScreen";
import { MainStackType } from "@/utils/types/MainStackType";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { fontWeight } from "@/styles/stylePrimary";
import ForgotPasswordScreen from "@/app/screens/generalMode/ForgotPasswordScreen";
import OtpScreen from "@/app/screens/generalMode/OtpScreen";
import ResetPasswordScreen from "@/app/screens/generalMode/ResetPasswordScreen";
import PostDetailScreen from "@/app/screens/publicMode/PostDetailScreen";
import FollowListScreen from "@/app/screens/generalMode/FollowListScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HistoryPostScreen from "@/app/screens/privateMode/HistoryPostScreen";
import SearchScreen from "@/app/screens/generalMode/SearchScreen";

const { width, height } = Dimensions.get("window");
const Stack = createNativeStackNavigator<MainStackType>();
const MainStack: React.FC = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [initialRoute, setInitialRoute] = useState<
    keyof MainStackType | undefined
  >(undefined);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const savedOption = await AsyncStorage.getItem("toggleOption");

        if (token) {
          if (savedOption === "PublicMode") {
            setInitialRoute("PublicMode");
          } else if (savedOption === "PrivateMode") {
            setInitialRoute("PrivateMode");
          } else {
            setInitialRoute("Login");
          }
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ AsyncStorage:", error);
        setInitialRoute("Login");
      }
    };

    checkAuth();
  }, []);

  if (initialRoute === null) {
    return null; // Hiển thị màn hình loading hoặc splash screen nếu cần
  }
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerTitle: () => (
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
        ),
        gestureEnabled: true, // Kích hoạt vuốt để quay lại
        gestureDirection: "horizontal", // Vuốt ngang để chuyển trang
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
        name="PrivateMode"
        component={FriendModeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PublicMode"
        component={PublicModeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TabBar"
        component={TabBar}
        options={{ headerShown: false }}
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
      <Stack.Screen
        name="PostDetails"
        component={PostDetailScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="FollowList"
        component={FollowListScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="HistoryPost"
        component={HistoryPostScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
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
