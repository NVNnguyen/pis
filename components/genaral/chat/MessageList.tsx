import conversationAPI from "@/api/conversationAPI";
import Message from "@/components/genaral/chat/Message";
import { useTheme } from "@/contexts/ThemeContext";
import useMessage from "@/hooks/useMessage";
import { useMyUserId } from "@/hooks/useMyUserId";
import useNewestMessage from "@/hooks/useNewestMessage";
import { textPostFontSize } from "@/styles/stylePrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Dimensions,
  View,
  Image,
  Text,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface MessageProps {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
}

const MessageList: React.FC<MessageProps> = (userInfo: MessageProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const myUserid = useMyUserId() ?? 0;

  const flatListRef = useRef<FlatList<any>>(null);
  const [messageList, setMessageList] = useState<any[]>([]);

  const { message } = useMessage(myUserid, userInfo?.id);
  const { newMessage } = useNewestMessage(myUserid, userInfo?.id);
  useEffect(() => {
    if (message && message.length > 0) {
      setMessageList(message);
    }
  }, [message]);

  // 👉 Scroll xuống cuối khi messageList thay đổi
  useEffect(() => {
    if (messageList.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // delay 100ms đảm bảo layout đã render xong
    }
  }, [messageList]);

  return (
    <>
      {messageList.length > 0 ? (
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          data={messageList || newMessage}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={
                item?.userId === myUserid
                  ? styles.ownerMessage
                  : styles.theirMessage
              }
            >
              <Message
                {...item}
                style={
                  item?.userId === myUserid
                    ? styles.ownerMessage
                    : styles.theirMessage
                }
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: height * 0.05 }}
        />
      ) : (
        <View style={styles.noMsgContainer}>
          <Image
            source={
              userInfo.avatar === null
                ? require("@/assets/images/userAvatar.png")
                : { uri: userInfo?.avatar }
            }
            style={styles.avatar}
          />
          <Text style={styles.nameText}>
            {userInfo?.firstName} {userInfo?.lastName}
          </Text>
          <Text style={styles.infoText}>{userInfo?.username}</Text>
        </View>
      )}
    </>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    ownerMessage: {
      alignSelf: "flex-end",
      flexDirection: "row-reverse",
      marginVertical: height * 0.01,
      marginRight: width * 0.01,
    },
    theirMessage: {
      alignSelf: "flex-start",
      marginVertical: height * 0.01,
      marginLeft: width * 0.01,
    },
    noMsgContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingHorizontal: width * 0.1,
      paddingVertical: height * 0.05,
    },
    avatar: {
      width: width * 0.3,
      height: width * 0.3,
      borderRadius: (width * 0.3) / 2,
      marginBottom: height * 0.02,
    },
    nameText: {
      fontSize: width * 0.05,
      fontWeight: "600",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.01,
      textAlign: "center",
    },
    infoText: {
      fontSize: width * 0.04,
      color: isDarkMode ? "#aaa" : "#555",
      marginBottom: height * 0.005,
      textAlign: "center",
    },
  });

export default MessageList;
