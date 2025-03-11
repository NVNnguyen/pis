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
import conversationAPI from "@/api/conversationAPI";
import { useQueryClient } from "@tanstack/react-query";

const { height } = Dimensions.get("window");

const ChatScreen = () => {
  const route = useRoute();
  const { userId: partnerUserId } = route.params as { userId: number };

  const { isDarkMode } = useTheme();
  const myUserIdStr = useMyUserId();
  const myUserId = Number(myUserIdStr);
  const queryClient = useQueryClient();
  const { userInfo, isUserLoading } = useUserInfo(partnerUserId);

  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  const [chatState, setChatState] = useState({
    conversationId: 0,
    loading: true,
    error: "",
  });

  const initializeConversation = useCallback(async () => {
    if (!myUserId || myUserId <= 0) return;

    if (!partnerUserId || partnerUserId <= 0) {
      setChatState({
        conversationId: 0,
        loading: false,
        error: "Invalid user ID",
      });
      return;
    }

    if (myUserId === partnerUserId) {
      setChatState({
        conversationId: 0,
        loading: false,
        error: "Cannot create conversation with yourself",
      });
      return;
    }

    try {
      console.log(
        "Checking for existing conversation:",
        myUserId,
        partnerUserId
      );

      try {
        const existing = await conversationAPI.checkConversations(
          myUserId,
          partnerUserId
        );
        console.log("conversation id", existing?.data);
        const existingId = existing?.data?.conversationId;

        if (existingId) {
          console.log(
            "Update seen al msg: ",
            existing?.data?.conversationId,
            myUserId
          );
          const response = await conversationAPI.messageSeen(
            existing?.data?.conversationId,
            partnerUserId
          );
          if (response?.code === 2000) {
            queryClient.invalidateQueries({
              queryKey: ["conversation", myUserId],
            });
          }
          console.log("message seen: ", response);
          console.log("Found existing conversation:", existingId);
          setChatState({
            conversationId: existingId,
            loading: false,
            error: "",
          });
          return;
        }
      } catch (checkError: any) {
        const errorCode = checkError?.response?.data?.code;
        if (errorCode !== 4020) {
          console.error(
            "Unexpected error when checking conversations:",
            checkError
          );
        }
        console.log(
          "No existing conversation found. Proceeding to create one."
        );
      }

      try {
        const createRes = await conversationAPI.createConservations(
          myUserId,
          partnerUserId
        );
        const newConversationId = createRes?.data?.conversationId;

        if (newConversationId) {
          console.log("Created new conversation:", newConversationId);
          setChatState({
            conversationId: newConversationId,
            loading: false,
            error: "",
          });
        } else {
          console.error("Conversation created but no ID returned:", createRes);
          setChatState({
            conversationId: 0,
            loading: false,
            error: "Failed to get conversation ID",
          });
        }
      } catch (createError: any) {
        const errorMessage =
          createError?.response?.data?.message || "Unknown error";
        console.error(
          "Error creating conversation:",
          createError?.response?.data || createError
        );
        setChatState({
          conversationId: 0,
          loading: false,
          error: `Failed to create conversation: ${errorMessage}`,
        });
      }
    } catch (error) {
      setChatState({
        conversationId: 0,
        loading: false,
        error: "Failed to initialize conversation",
      });
    }
  }, [myUserId, partnerUserId]);

  useEffect(() => {
    if (chatState.conversationId || !myUserId) return;

    setChatState((prev) => ({ ...prev, loading: true, error: "" }));
    initializeConversation();
  }, [
    myUserId,
    partnerUserId,
    initializeConversation,
    chatState.conversationId,
  ]);

  if (!myUserId && chatState.loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator
          size="large"
          color={isDarkMode ? lightTheme.primary : darkTheme.primary}
        />
        <Text style={styles.loadingText}>Loading user information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userInfo && <ChatHeader {...userInfo} />}
      <MessageList {...userInfo} />
      <ChatInput
        conversationId={chatState.conversationId}
        userId={partnerUserId}
      />
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
