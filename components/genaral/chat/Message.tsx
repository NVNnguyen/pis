import { useTheme } from "@/contexts/ThemeContext";
import { getMyUserId } from "@/hooks/getMyUserID";
import { textPostFontSize } from "@/styles/stylePrimary";
import { grey, primaryColor } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
const { width, height } = Dimensions.get("window");
const Message = (item: any) => {
  const myyUserid = getMyUserId();
  const isOwnMessage = item?.userId === myyUserid;
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <View style={styles.avatarContainer}>
          {!isOwnMessage && item?.avatar === null && (
            <Image
              source={require("@/assets/images/userAvatar.png")}
              style={styles.avatar}
            />
          )}
          {!isOwnMessage && item?.avatar !== null && (
            <Image source={{ uri: item?.avatar }} style={styles.avatar} />
          )}
        </View>
        <View
          style={
            isOwnMessage ? styles.textOwnContainer : styles.textTheirContainer
          }
        >
          <Text
            style={isOwnMessage ? styles.ownMessageCt : styles.theirMessageCt}
          >
            {item?.content}
          </Text>
          <Text style={styles.messageTime}>{item?.createTime}</Text>
        </View>
      </View>

      <View style={styles.seenMs}>
        {isOwnMessage && item?.status === "SEEN" && (
          <Text style={styles.seenText}>Seen</Text>
        )}
        {isOwnMessage && item?.status === "NOT SEEN" && (
          <Text style={styles.seenText}>Delivered</Text>
        )}
      </View>
    </View>
  );
};
const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "column",
      margin: width * 0.01,
    },
    messageContainer: {
      flexDirection: "row",
    },
    avatarContainer: {},
    textOwnContainer: {
      maxWidth: "80%",
      padding: width * 0.01,
      borderRadius: 10,
      backgroundColor: primaryColor,
      marginLeft: "auto",
    },
    textTheirContainer: {
      maxWidth: "80%",
      padding: 10,
      borderRadius: 10,
      backgroundColor: grey,
      marginRight: "auto",
    },
    messageTime: {
      fontSize: Math.min(RFValue(12, 680), 20),
      color: "#ddd",
      marginTop: height * 0.002,
    },
    seenMs: {
      alignSelf: "flex-end",
    },
    seenText: {
      fontSize: Math.min(RFValue(12, 680), 20),
      color: "#a0a0a0",
      marginTop: height * 0.002,
    },
    avatar: {
      width: width * 0.08, // Tăng kích thước một chút để rõ hơn
      height: width * 0.08, // Dùng width thay vì height để avatar luôn cân đối
      borderRadius: (width * 0.08) / 2, // Đảm bảo hình tròn hoàn hảo
      marginRight: width * 0.02,
    },
    ownMessageCt: {
      color: "#fff",
      fontSize: textPostFontSize,
    },
    theirMessageCt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
    },
  });
export default Message;
