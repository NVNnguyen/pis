import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Keyboard,
  Platform,
  Animated,
  Modal,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import {
  backgroundColor,
  buttonFontsize,
  Color,
  fontWeight,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { getMyUserId } from "@/hooks/getMyUserID";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { primaryColor } from "@/utils/colorPrimary";
import { PostItemType } from "@/utils/types/PostItemType";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackType } from "@/utils/types/MainStackType";
import AudioPlayer from "../AudioPlayer";

const { width, height } = Dimensions.get("window");
interface PostPrivateProps extends PostItemType {
  onTop?: (check: boolean) => void;
}
interface DetailPostPrivateModalProp extends PostPrivateProps {
  visible: boolean;
  onClose: () => void;
}
const DetailPostPrivateModal = ({
  userPostResponse,
  caption,
  images,
  type,
  createTime,
  visible,
  onClose,
}: DetailPostPrivateModalProp) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const myUserId = Number(getMyUserId());
  const iconColorMode = isDarkMode ? darkTheme.text : lightTheme.text;

  // Animated value for the comment input position
  const [inputPosition] = useState(new Animated.Value(0));
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Reference to store the original position of the input
  const inputOriginalPosition = useRef(0);

  useEffect(() => {
    // Add keyboard show and hide listeners
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        setKeyboardVisible(true);
        // Calculate center position of screen minus input height
        const screenCenter = height / 2 - 30; // 30 is approximate input height

        // Animate the input to the center of the screen
        Animated.timing(inputPosition, {
          toValue: screenCenter - inputOriginalPosition.current,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        // Animate the input back to its original position
        Animated.timing(inputPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    // Clean up listeners
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Function to measure the position of the input
  const measureInputPosition = (event: any) => {
    // Store the y position of the input
    inputOriginalPosition.current = event.nativeEvent.layout.y;
  };

  const navigation = useNavigation<NavigationProp<MainStackType>>();
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => onClose()}>
          <AntDesign
            name="close"
            size={buttonFontsize}
            color={isDarkMode ? darkTheme.text : lightTheme.text}
          />
        </TouchableOpacity>
        <View style={styles.mediaContainer}>
          {type === "Voice" && images.length > 0 && (
            <AudioPlayer audioUri={images[0]?.url} />
          )}
          {type === "Image" && images.length > 0 && (
            <Image
              source={{ uri: images[0]?.url }}
              style={styles.photo}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Caption */}
        {caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionText}>{caption}</Text>
          </View>
        )}

        <View style={styles.userHeader}>
          {userPostResponse?.avatar ? (
            <Image
              source={{ uri: userPostResponse?.avatar }}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={require("@/assets/images/userAvatar.png")}
              style={styles.avatar}
            />
          )}

          <Text style={styles.username}>{userPostResponse?.username}</Text>
          <Text style={styles.dateText}>{createTime}</Text>
        </View>

        {/* Absolute positioned animated comment input */}
        {userPostResponse?.userId !== myUserId && (
          <Animated.View
            style={[
              styles.commentInputContainer,
              {
                position: "absolute",
                zIndex: 999,
                transform: [{ translateY: inputPosition }],
                top: null, // Remove any top property that might interfere
                bottom: height * 0.05, // Position it near the bottom initially
              },
            ]}
            onLayout={measureInputPosition}
          >
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="gray"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => Keyboard.dismiss()}
            >
              <AntDesign
                name="arrowright"
                size={width * 0.05}
                color={iconColorMode}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const getStyles = (isDarkMode: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: 15,
      alignItems: "center",
      position: "relative", // Add this to allow absolute positioning of children
    },
    userHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: height * 0.02,
      justifyContent: "center",
    },
    avatar: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: width * 0.05,
    },
    userInfo: {
      flexDirection: "column",
    },
    username: {
      fontSize: width * 0.045,
      fontWeight: "600",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginHorizontal: width * 0.02,
    },
    dateText: {
      fontSize: width * 0.035,
      color: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
    },
    captionContainer: {
      marginBottom: height * 0.02,
      position: "absolute",
      top: "45%",
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0,0,0,0.05)",
      width: "80%",
      borderRadius: 10,
      minHeight: 50,
      maxHeight: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    captionText: {
      fontSize: textPostFontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    mediaContainer: {
      paddingVertical: height * 0.06,
      position: "relative",
      borderRadius: 30,
      overflow: "hidden",
      height: "60%",
      marginBottom: height * 0.02,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: width * 0.005,
    },
    photo: {
      width: "100%",
      height: "100%",
      borderRadius: 15,
    },
    emptyMedia: {
      width: "100%",
      height: "100%",
      borderRadius: 15,
      backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    multipleIndicator: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 15,
      padding: 5,
    },
    multipleIndicatorText: {
      color: "white",
      fontSize: width * 0.035,
    },
    interactionBar: {
      flexDirection: "row",
      marginBottom: height * 0.02,
    },
    interactionButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: width * 0.06,
    },
    interactionText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginLeft: width * 0.02,
      fontSize: width * 0.04,
    },
    commentInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: isDarkMode
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)",
      paddingHorizontal: width * 0.03,
      marginBottom: height * 0.35,
      width: "90%",
    },
    commentInput: {
      flex: 1,
      padding: width * 0.03,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    sendButton: {
      padding: width * 0.02,
    },

    iconButton: {
      padding: width * 0.04,
      borderRadius: width * 0.1,
    },
    captureButton: {
      width: width * 0.15,
      height: width * 0.15,
      borderRadius: width * 0.075,
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 5,
      borderColor: primaryColor,
    },
    captureInner: {
      width: width * 0.12,
      height: width * 0.12,
      borderRadius: width * 0.06,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderWidth: 5,
      borderColor: primaryColor,
    },
  });
};
export default DetailPostPrivateModal;
