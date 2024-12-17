import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ChatHeader from "../components/Chat/ChatHeader";
import MessageList from "../components/Chat/MessageList";
import ChatInput from "../components/Chat/ChatInput";
import { backgroundColor } from "../styles/color";

const { width, height } = Dimensions.get("window");
const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { sender: "me", text: "Hello!" },
    { sender: "other", text: "Hi, how are you?" },
  ]);

  const handleSendMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "me", text }]);
  };

  return (
    <View style={styles.container}>
      <ChatHeader />
      <MessageList messages={messages} />
      <ChatInput onSend={handleSendMessage} />
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
