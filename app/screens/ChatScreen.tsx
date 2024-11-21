import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const ChatScreen = () => {
  const friends = [
    { id: "1", name: "Ali", avatar: "https://via.placeholder.com/40" },
    { id: "2", name: "Jessica", avatar: "https://via.placeholder.com/40" },
    { id: "3", name: "Mary", avatar: "https://via.placeholder.com/40" },
    { id: "4", name: "Sarah", avatar: "https://via.placeholder.com/40" },
    { id: "5", name: "Michael", avatar: "https://via.placeholder.com/40" },
  ];
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }} // User profile picture
            style={styles.profilePicture}
          />
          <Text style={styles.statusText}>Online</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Content */}
      <ScrollView contentContainerStyle={styles.chatContent}>
        {/* Incoming Message */}
        <View style={styles.messageContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatar}
          />
          <View style={styles.messageBubble}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Voice Message */}
        <View style={[styles.messageContainer, styles.voiceMessage]}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatar}
          />
          <View style={styles.voiceBubble}>
            <View style={styles.voiceWaveform}>
              <Text style={styles.waveformText}>[Waveform]</Text>
            </View>
            <Text style={styles.timestamp}>date month time am/pm</Text>
          </View>
        </View>
      </ScrollView>

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Sent message..."
          placeholderTextColor="#888"
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  icon: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
  },
  profilePicture: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
  },
  statusText: {
    color: "#34C759",
    fontSize: width * 0.035,
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  chatContent: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: height * 0.02,
  },
  messageAvatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    marginRight: 8,
  },
  messageBubble: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 16,
    maxWidth: "70%",
  },
  emojiIcon: {
    width: 24,
    height: 24,
  },
  voiceMessage: {
    alignItems: "center",
  },
  voiceBubble: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
    justifyContent: "center",
  },
  voiceWaveform: {
    backgroundColor: "#444",
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  waveformText: {
    color: "#fff",
    fontSize: 12,
  },
  timestamp: {
    color: "#888",
    fontSize: width * 0.035,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: width * 0.04,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#34C759",
    borderRadius: 24,
    padding: 12,
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
});

export default ChatScreen;
