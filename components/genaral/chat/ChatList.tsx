import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  fontWeight,
  textFontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { MainStackType } from "@/utils/types/MainStackType";

const { width, height } = Dimensions.get("window");
interface Chat {
  id: number;
  avatar: string;
  username: string;
  lastMsg: string;
  lastMsgTime: string;
  read: boolean;
}

interface ChatListItemProps {
  chat: Chat;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat }) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile", { userId: chat?.id })}
      >
        {/* Avatar */}
        {chat?.avatar === null ? (
          <Image
            source={require("@/assets/images/userAvatar.png")}
            style={styles.avatar}
          />
        ) : (
          <Image source={{ uri: chat?.avatar }} style={styles.avatar} />
        )}
      </TouchableOpacity>
      {/* Chat Info */}
      <TouchableOpacity
        style={styles.messageCtn}
        onPress={() => navigation.navigate("Messages", { userId: chat?.id })}
      >
        <View style={styles.chatInfo}>
          <Text style={styles.username}>{chat?.username}</Text>
          {!chat?.read && (
            <View style={styles.lastMessageContainer}>
              <Text style={styles.lastMessageUnRead}>{chat?.lastMsg}</Text>
              <Text style={styles.lastMsgTimeUnRead}>
                . {chat?.lastMsgTime}
              </Text>
            </View>
          )}
          {chat?.read && (
            <View style={styles.lastMessageContainer}>
              <Text style={styles.lastMessageRead}>{chat?.lastMsg}</Text>
              <Text style={styles.lastMsgTimeRead}>. {chat?.lastMsgTime}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Dynamic Styles
const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: width * 0.04,
      borderBottomWidth: 1,
      borderBottomColor: "#A0A0A0",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    avatar: {
      width: height * 0.08,
      height: height * 0.08,
      borderRadius: height * 0.04,
      borderWidth: 2,
      borderColor: "#A0A0A0",
    },
    chatInfo: {
      flex: 1,
      marginLeft: width * 0.04,
    },
    username: {
      fontSize: textFontSize,
      fontWeight: fontWeight,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    messageCtn: {
      flexDirection: "row",
    },
    lastMessageContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    lastMessageUnRead: {
      fontSize: width * 0.045,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontWeight: fontWeight,
    },
    lastMessageRead: {
      fontSize: textFontSize,
      color: "#A0A0A0",
    },
    lastMsgTimeUnRead: {
      fontSize: textPostFontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontWeight: fontWeight,
    },
    lastMsgTimeRead: {
      fontSize: textPostFontSize,
      color: "#A0A0A0",
    },
  });

export default ChatListItem;
