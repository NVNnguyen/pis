import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import ChatHeader from "../../../components/genaral/chat/ChatHeader";
import MessageList from "../../../components/genaral/chat/MessageList";
import ChatInput from "../../../components/genaral/chat/ChatInput";

import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import useUserInfo from "@/hooks/useUserInfo";
import { useMyUserId } from "@/hooks/useMyUserId";

const { height } = Dimensions.get("window");

const ChatScreen = () => {
  const route = useRoute();
  const { userId: partnerUserId } = route.params as { userId: number };

  const { isDarkMode } = useTheme();
  const myUserIdStr = useMyUserId();
  const { userInfo, isUserLoading } = useUserInfo(partnerUserId);
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  return (
    <View style={styles.container}>
      {userInfo && <ChatHeader {...userInfo} />}
      <MessageList {...userInfo} />
      <ChatInput />
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingBottom: height * 0.015,
    },
    centerContent: {
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 10,
      color: isDarkMode ? lightTheme.text : darkTheme.text,
    },
    errorText: {
      color: "red",
      textAlign: "center",
      margin: 20,
    },
  });

export default ChatScreen;
