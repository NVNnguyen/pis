import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { Color } from "@/styles/color";

const { width, height } = Dimensions.get("window"); // Lấy chiều rộng màn hình

const ChatInput = () => {
  const [message, setMessage] = useState(""); // State lưu nội dung tin nhắn

  const handleSendMessage = () => {
    if (message.trim().length > 0) {
      console.log("Sent message:", message);
      setMessage(""); // Reset tin nhắn sau khi gửi
    } else {
      console.log("Thumbs up!");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Dãy biểu tượng */}
          {/* Dãy biểu tượng - Chỉ hiển thị khi message rỗng */}
          {message.trim().length != 0 ? (
            <TouchableOpacity onPress={() => setMessage("")}>
              <AntDesign name="right" size={24} color={Color} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="plus-circle" size={24} color={Color} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Entypo name="camera" size={24} color={Color} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome6 name="image" size={24} color={Color} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome name="microphone" size={24} color={Color} />
              </TouchableOpacity>
            </View>
          )}

          {/* Ô nhập tin nhắn */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Aa"
              style={styles.textInput}
              placeholderTextColor="#9E9E9E"
              value={message}
              onChangeText={(text) => setMessage(text)} // Cập nhật state khi nhập
            />
            <TouchableOpacity>
              <FontAwesome name="smile-o" size={24} color={Color} />
            </TouchableOpacity>
          </View>

          {/* Nút Send/Like */}
          <TouchableOpacity
            style={styles.likeButton}
            onPress={handleSendMessage}
          >
            {message.trim().length > 0 ? (
              <Ionicons name="send" size={24} color={Color} />
            ) : (
              <FontAwesome name="thumbs-up" size={24} color={Color} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000", // Màu nền đen
    width: "100%",
    paddingVertical: height * 0.01,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "40%",
  },
  iconButton: {
    paddingHorizontal: width * 0.005,
    paddingVertical: height * 0.005,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: width * 0.01,
    marginHorizontal: width * 0.005,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Color,
    paddingVertical: height * 0.005,
  },
  likeButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.01,
  },
});

export default ChatInput;
