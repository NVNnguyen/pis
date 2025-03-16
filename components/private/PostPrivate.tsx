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
  ActivityIndicator,
} from "react-native";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  backgroundColor,
  buttonFontsize,
  Color,
  fontWeight,
  textPostFontSize,
} from "@/styles/stylePrimary";
import AudioPlayer from "../public/AudioPlayer";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { primaryColor } from "@/utils/colorPrimary";
import { PostItemType } from "@/utils/types/PostItemType";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackType } from "@/utils/types/MainStackType";
import { useMyUserId } from "@/hooks/useMyUserId";
import { useSendMessage } from "@/hooks/useSendMessage";
import { SendMessageType } from "@/utils/types/SendMessageType";
import conversationAPI from "@/api/conversationAPI";

const { width, height } = Dimensions.get("window");
interface PostPrivateProps extends PostItemType {
  onTop?: (check: boolean) => void;
}
const PostPrivate = ({
  userPostResponse,
  caption,
  images,
  type,
  createTime,
  onTop,
}: PostPrivateProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const myUserId = useMyUserId() ?? 0;
  const iconColorMode = isDarkMode ? darkTheme.text : lightTheme.text;
  const [inputPosition] = useState(new Animated.Value(0));
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [comment, setComment] = useState<string>();
  const [isLoadingUri, setIsLoadingUri] = useState<boolean>(true);
  const inputOriginalPosition = useRef(0);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        setKeyboardVisible(true);
        const screenCenter = height / 2 - 30;
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
        Animated.timing(inputPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);
  const measureInputPosition = (event: any) => {
    inputOriginalPosition.current = event.nativeEvent.layout.y;
  };
  const handleCapturePress = () => {
    if (onTop) {
      onTop(true);
    }
  };
  const sendComment = useSendMessage();
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const handleSendMessage = async () => {
    if (sendComment.isPending || myUserId === null || !comment?.trim()) return;

    try {
      let conversationIdToUse = 0; // Biến tạm để giữ conversationId

      if (conversationIdToUse === 0) {
        // 🛠 Nếu chưa có `conversationId`, kiểm tra và tạo mới
        const existing = await conversationAPI.checkConversations(
          myUserId,
          userPostResponse?.userId
        );
        conversationIdToUse = existing?.data?.conversationId;

        if (conversationIdToUse === 0 || !conversationIdToUse) {
          const created = await conversationAPI.createConservations(
            myUserId,
            userPostResponse?.userId
          );
          conversationIdToUse = created?.data?.conversationId;
        }

        if (!conversationIdToUse) {
          console.error("Failed to get or create conversation");
          return;
        }
      }
      const payload: SendMessageType = {
        conversationId: conversationIdToUse,
        senderId: myUserId,
        content: comment.trim(), // Chỉ gửi nội dung
        file: "", // Không gửi file
        type: "Text",
        userId: userPostResponse?.userId,
      };

      sendComment.mutate(payload, {
        onSuccess: () => {
          setComment(""); // Xóa nội dung sau khi gửi thành công
        },
      });
    } catch (error) {
      console.error("Error handling message send:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        {type === "Voice" && images.length > 0 && (
          <AudioPlayer audioUri={images[0]?.url} />
        )}
        {type === "Image" && images.length > 0 && (
          <>
            {isLoadingUri && !images && (
              <ActivityIndicator
                style={styles.imgLoader}
                color={isDarkMode ? lightTheme.text : darkTheme.text}
              />
            )}
            <Image
              source={{ uri: images[0]?.url }}
              style={styles.photo}
              resizeMode="cover"
              onLoadStart={() => setIsLoadingUri(true)}
              onLoadEnd={() => setIsLoadingUri(false)}
            />
          </>
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
              top: null,
              bottom: height * 0.05,
            },
          ]}
          onLayout={measureInputPosition}
        >
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="gray"
            value={comment}
            onChangeText={(text) => setComment(text)}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              handleSendMessage();
            }}
          >
            <AntDesign name="arrowright" size={width * 0.05} color={"black"} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            navigation.navigate("HistoryPost", {
              userId: userPostResponse?.userId,
            });
          }}
        >
          <AntDesign
            name="appstore1"
            size={width * 0.08}
            color={iconColorMode}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCapturePress}
          style={styles.captureButton}
        >
          <View style={styles.captureInner}></View>
        </TouchableOpacity>

        {myUserId !== userPostResponse?.userId && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Messages", {
                userId: userPostResponse?.userId,
              })
            }
          >
            <MaterialCommunityIcons
              name="chat"
              size={height * 0.03}
              color={primaryColor}
            />
          </TouchableOpacity>
        )}
        {myUserId === userPostResponse?.userId && (
          <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
            <MaterialCommunityIcons
              name="chat"
              size={height * 0.03}
              color={primaryColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
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
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: width * 0.08,
      paddingBottom: height * 0.02,
      width: "100%",
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
    imgLoader: {
      position: "absolute",
      zIndex: 1,
    },
  });
};

export default PostPrivate;
