import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ChatHeader from "../../../components/genaral/chat/ChatHeader";
import MessageList from "../../../components/genaral/chat/MessageList";
import ChatInput from "../../../components/genaral/chat/ChatInput";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";

const { width, height } = Dimensions.get("window");
const ChatScreen = () => {
  const route = useRoute();
  const userIdProp = route.params as { userId: number }; // Nhận userId từ navigation params
  const { isDarkMode } = useTheme();
  console.log("dark mode", isDarkMode);
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      {userIdProp.userId !== null && (
        <ChatHeader userIdProp={userIdProp.userId} />
      )}
      <MessageList userIdProp={userIdProp.userId} />
      <ChatInput />
    </View>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingBottom: height * 0.015,
    },
  });

export default ChatScreen;
