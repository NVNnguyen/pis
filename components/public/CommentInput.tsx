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
import { Color, textFontSize } from "@/styles/stylePrimary";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  darkThemeInput,
  lightThemeInput,
  primaryColor,
} from "@/utils/colorPrimary";

const { width, height } = Dimensions.get("window"); // Lấy chiều rộng màn hình

interface CommentInputProp {
  handleSendMessage: () => void;
}
const CommentInput = () => {
  const [message, setMessage] = useState(""); // State lưu nội dung tino nhắn
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const iconColor = isDarkMode ? darkTheme.text : lightTheme.text;
  const handleSendMessage = () => {
    if (message.trim().length > 0) {
      console.log("Sent message:", message);
      setMessage(""); // Reset tin nhắn sau khi gửi
    } else {
      console.log("Thumbs up!");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {message.trim().length != 0 ? (
          <TouchableOpacity onPress={() => setMessage("")}>
            <AntDesign name="right" size={24} color={iconColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.iconButton}></TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Entypo name="camera" size={24} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome6 name="image" size={24} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome name="microphone" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Aa"
            style={styles.textInput}
            placeholderTextColor={isDarkMode ? darkTheme.text : lightTheme.text}
            value={message}
            onChangeText={(text) => setMessage(text)} // Cập nhật state khi nhập
          />
        </View>

        <TouchableOpacity style={styles.likeButton} onPress={handleSendMessage}>
          {message.trim().length > 0 && (
            <Ionicons name="send" size={24} color={iconColor} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
      paddingVertical: height * 0.02,
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

export default CommentInput;
