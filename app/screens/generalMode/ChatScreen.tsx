import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ChatHeader from "../../../components/genaral/chat/ChatHeader";
import MessageList from "../../../components/genaral/chat/MessageList";
import ChatInput from "../../../components/genaral/chat/ChatInput";
import { backgroundColor } from "../../../styles/color";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const ChatScreen = () => {
  const route = useRoute();
  const userIdProp = route.params as { userId: number }; // Nhận userId từ navigation params
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {userIdProp.userId !== null && (
        <ChatHeader navigation={navigation} userIdProp={userIdProp.userId} />
      )}
      <MessageList userIdProp={userIdProp.userId} />
      <ChatInput />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    marginBottom: height * 0.015,
  },
});

export default ChatScreen;
