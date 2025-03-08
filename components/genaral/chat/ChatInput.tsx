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
import { buttonFontsize, Color, textFontSize } from "@/styles/stylePrimary";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  darkThemeInput,
  lightThemeInput,
  primaryColor,
} from "@/utils/colorPrimary";

const { width, height } = Dimensions.get("window"); // Lấy chiều rộng màn hình

interface chatInputProp {
  handleSendMessage: () => void;
}
const ChatInput = () => {
  const [message, setMessage] = useState(""); // State lưu nội dung tino nhắn
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
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
              <AntDesign
                name="right"
                size={buttonFontsize}
                color={primaryColor}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome
                  name="plus-circle"
                  size={buttonFontsize}
                  color={primaryColor}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Entypo
                  name="camera"
                  size={buttonFontsize}
                  color={primaryColor}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome6
                  name="image"
                  size={buttonFontsize}
                  color={primaryColor}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <FontAwesome
                  name="microphone"
                  size={buttonFontsize}
                  color={primaryColor}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Ô nhập tin nhắn */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Aa"
              style={styles.textInput}
              placeholderTextColor={
                isDarkMode ? darkTheme.text : lightTheme.text
              }
              value={message}
              onChangeText={(text) => setMessage(text)} // Cập nhật state khi nhập
            />
            <TouchableOpacity>
              <FontAwesome
                name="smile-o"
                size={buttonFontsize}
                color={primaryColor}
              />
            </TouchableOpacity>
          </View>

          {/* Nút Send/Like */}
          <TouchableOpacity
            style={styles.likeButton}
            onPress={handleSendMessage}
          >
            {message.trim().length > 0 ? (
              <Ionicons
                name="send"
                size={buttonFontsize}
                color={primaryColor}
              />
            ) : (
              <FontAwesome
                name="thumbs-up"
                size={buttonFontsize}
                color={primaryColor}
              />
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
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
      backgroundColor: isDarkMode ? darkThemeInput : lightThemeInput,
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: width * 0.01,
      marginHorizontal: width * 0.005,
    },
    textInput: {
      flex: 1,
      fontSize: textFontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      paddingVertical: height * 0.005,
    },
    likeButton: {
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.01,
    },
  });

export default ChatInput;
