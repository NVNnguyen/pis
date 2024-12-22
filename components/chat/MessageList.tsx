import { Color } from "@/styles/color";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const MessageList = ({ messages }) => {
  const renderMessage = ({ item }) => {
    const isOwnMessage = item.sender === "me";

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={messages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderMessage}
      contentContainerStyle={{ padding: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    color: Color,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
    color: "#000",
  },
  messageText: {
    fontSize: 16,
  },
});

export default MessageList;
