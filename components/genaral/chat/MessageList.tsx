import conversationAPI from "@/api/conversationAPI";
import Message from "@/components/genaral/chat/Message";
import { useTheme } from "@/contexts/ThemeContext";
import { getMyUserId } from "@/hooks/getMyUserID";
import useMessage from "@/hooks/useMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Dimensions, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface MessageProps {
  userIdProp: number;
}

const MessageList: React.FC<MessageProps> = ({ userIdProp }) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const myUserid = getMyUserId() ?? 0;
  const { message, isMessageLoading, messageError } = useMessage(
    myUserid,
    userIdProp
  );
  console.log("📡 MessageList:", message);
  return (
    <FlatList
      data={message}
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
    />
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
  });

export default MessageList;
