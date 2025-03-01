import { useTheme } from "@/contexts/ThemeContext";
import { getMyUserId } from "@/hooks/getMyUserID";
import styles from "@/styles/styles";
import { darkTheme, lightTheme } from "@/utils/themes";
import { View, StyleSheet, Image, Text } from "react-native";

const Chat = ({ item }: { item: any }) => {
  const myyUserid = getMyUserId();
  const isOwnMessage = item?.userId === myyUserid; // ✅ Kiểm tra đúng userId
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  return (
    <View
      style={[
        styles.messageContainer,
        isOwnMessage ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {!isOwnMessage && (
        <Image source={{ uri: item?.avatar }} style={styles.avatar} />
      )}

      <View
        style={[
          styles.textContainer,
          isOwnMessage ? styles.myTextContainer : styles.theirTextContainer,
        ]}
      >
        <Text style={styles.messageText}>{item?.content}</Text>
        <Text style={styles.messageTime}>{item?.createTime}</Text>
        {isOwnMessage && item.status === "SEEN" && (
          <Text style={styles.seenText}>✔ Đã xem</Text>
        )}
      </View>
    </View>
  );
};
const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    messageContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    myMessage: {
      alignSelf: "flex-end",
      flexDirection: "row-reverse",
    },
    theirMessage: {
      alignSelf: "flex-start",
      flexDirection: "row",
    },
    textContainer: {
      maxWidth: "75%",
      padding: 10,
      borderRadius: 10,
    },
    myTextContainer: {
      backgroundColor: "#0866ff",
      alignSelf: "flex-end",
    },
    theirTextContainer: {
      backgroundColor: "#f0f2f5",
      alignSelf: "flex-start",
    },
    messageText: {
      fontSize: 16,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    messageTime: {
      fontSize: 12,
      color: "#ddd",
      marginTop: 2,
    },
    seenText: {
      fontSize: 12,
      color: "#a0a0a0",
      marginTop: 2,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
    },
  });
export default Chat;
