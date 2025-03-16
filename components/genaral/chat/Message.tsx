import { useTheme } from "@/contexts/ThemeContext";
import { useMyUserId } from "@/hooks/useMyUserId";
import { buttonFontsize, textPostFontSize } from "@/styles/stylePrimary";
import { grey, primaryColor } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AudioMessage from "../AudioMessage";
import { useState } from "react";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import PostImageDetailModal from "@/components/public/Modals/PostImageDetailModal";

const { width, height } = Dimensions.get("window");

const Message = (item: any) => {
  const myUserId = useMyUserId();
  const isOwnMessage = item?.userId === myUserId;
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [isLoadingUrl, setIsLoadingUrl] = useState<boolean>(false);
  const hasMedia = item?.type === "Image" || item?.type === "Voice";
  const [isVisiblePostImageDetail, setIsVisiblePostImageDetail] =
    useState<boolean>(false);
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.messageRow,
          isOwnMessage ? styles.ownMessageRow : styles.theirMessageRow,
        ]}
      >
        {/* Avatar - only show for messages from others */}
        {!isOwnMessage && (
          <View style={styles.avatarContainer}>
            <Image
              source={
                item?.avatar
                  ? { uri: item.avatar }
                  : require("@/assets/images/userAvatar.png")
              }
              style={styles.avatar}
            />
          </View>
        )}

        <View style={styles.messageGroup}>
          {/* Media container (Image or Voice) */}
          {hasMedia && (
            <View
              style={[
                styles.mediaContainer,
                isOwnMessage
                  ? styles.ownMediaContainer
                  : styles.theirMediaContainer,
              ]}
            >
              {item?.type === "Image" && (
                <>
                  {isLoadingUrl && (
                    <ActivityIndicator
                      style={styles.imageContent}
                      color={isDarkMode ? darkTheme.text : lightTheme.text}
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => setIsVisiblePostImageDetail(true)}
                  >
                    <Image
                      source={{ uri: item?.url }}
                      style={styles.imageContent}
                      resizeMode="cover"
                      onLoadStart={() => setIsLoadingUrl(true)}
                      onLoadEnd={() => setIsLoadingUrl(false)}
                    />
                  </TouchableOpacity>
                </>
              )}

              {item?.type === "Voice" && <AudioMessage voiceUri={item?.url} />}
            </View>
          )}

          {/* Text content - only render if there's content */}
          {item?.content && (
            <>
              {item?.content === "thumbs-up" ? (
                <FontAwesome
                  name="thumbs-up"
                  size={buttonFontsize}
                  color={primaryColor}
                  style={isOwnMessage ? { transform: [{ scaleX: -1 }] } : {}}
                />
              ) : (
                <View
                  style={[
                    styles.textContainer,
                    isOwnMessage
                      ? styles.ownTextContainer
                      : styles.theirTextContainer,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isOwnMessage
                        ? styles.ownMessageText
                        : styles.theirMessageText,
                    ]}
                  >
                    {item?.content}
                  </Text>

                  <Text style={styles.messageTime}>{item?.createTime}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
      <PostImageDetailModal
        images={[
          {
            url: item?.url,
            id: 1,
          },
        ]}
        currentIndex={0}
        isModalVisible={isVisiblePostImageDetail}
        onClose={() => setIsVisiblePostImageDetail(false)}
      />
      {/* Delivery status indicators - only for own messages */}
      {isOwnMessage && (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {item?.status === "SEEN" ? "Seen" : "Delivered"}
          </Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      marginVertical: width * 0.01,
      marginHorizontal: width * 0.02,
    },
    messageRow: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    ownMessageRow: {
      justifyContent: "flex-end",
    },
    theirMessageRow: {
      justifyContent: "flex-start",
    },
    messageGroup: {
      maxWidth: "70%",
      flexDirection: "column",
      gap: 8,
    },
    avatarContainer: {
      marginRight: width * 0.02,
      alignSelf: "flex-end",
    },
    avatar: {
      width: width * 0.08,
      height: width * 0.08,
      borderRadius: width * 0.04,
    },
    mediaContainer: {
      borderRadius: 16,
      overflow: "hidden",
    },
    ownMediaContainer: {
      borderBottomRightRadius: 4,
      alignSelf: "flex-end",
    },
    theirMediaContainer: {
      borderBottomLeftRadius: 4,
      alignSelf: "flex-start",
    },
    textContainer: {
      borderRadius: 16,
      padding: 12,
      minWidth: "50%",
    },
    ownTextContainer: {
      backgroundColor: primaryColor,
      borderBottomRightRadius: 4,
      alignSelf: "flex-end",
    },
    theirTextContainer: {
      backgroundColor: isDarkMode ? "#2A2A2A" : "#D3D3D3",
      borderBottomLeftRadius: 4,
      alignSelf: "flex-start",
    },
    messageText: {
      fontSize: textPostFontSize,
      lineHeight: textPostFontSize * 1.3,
    },
    ownMessageText: {
      color: "#FFFFFF",
    },
    theirMessageText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    messageTime: {
      fontSize: Math.min(RFValue(10, 680), 16),
      color: isDarkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
      marginTop: 4,
      alignSelf: "flex-end",
    },
    imageContent: {
      width: width * 0.6,
      height: width * 0.5,
    },
    statusContainer: {
      alignSelf: "flex-end",
      marginTop: 2,
      marginRight: 4,
    },
    statusText: {
      fontSize: Math.min(RFValue(10, 680), 16),
      color: "rgba(160,160,160,0.8)",
    },
  });

export default Message;
