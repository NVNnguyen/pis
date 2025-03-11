import { useTheme } from "@/contexts/ThemeContext";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { darkTheme, lightTheme } from "@/utils/themes"; // Giả định có import này
import { FriendType } from "@/utils/types/FriendType";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackType } from "@/utils/types/MainStackType";
import {
  buttonFontsize,
  fontWeight,
  text10FontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import useUnfriend from "@/hooks/useUnfriend";
import { useMyUserId } from "@/hooks/useMyUserId";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const Friend = ({
  id,
  username,
  firstName,
  lastName,
  avatar,
  isActive,
}: FriendType) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const unfriend = useUnfriend();
  const myUserId = Number(useMyUserId());
  console.log("unfiend with ");
  const handleUnfriend = () => {
    if (myUserId && id) {
      Alert.alert(
        `Are you sure unfriend with ${username}`,
        `You will not see any posts from ${username}`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: () =>
              unfriend.unfriend({ myUserId: myUserId, userId: id }),
            style: "destructive",
          },
        ]
      );
    }
  };
  return (
    <View style={styles.container}>
      {/* Avatar Container */}

      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("HistoryPost", {
              userId: id,
              username: username,
              avatar: avatar,
            })
          }
        >
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("@/assets/images/userAvatar.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("HistoryPost", {
              userId: id,
              username: username,
              avatar: avatar,
            })
          }
        >
          <Text style={styles.fullName}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.username}>{username}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chatCtn}>
        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => navigation.navigate("Messages", { userId: id })}
        >
          <Ionicons
            name="chatbubble-ellipses-sharp"
            size={buttonFontsize}
            color={isDarkMode ? darkTheme.text : darkTheme.text}
          />
          <Text style={styles.msgTxt}>Message</Text>
        </TouchableOpacity>
      </View>
      {/* Profile Button */}
    </View>
  );
};

const getStyles = (isDarkMode: any) => {
  const avatarSize = width * 0.14; // Responsive avatar size

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.01,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)",
    },
    avatarContainer: {
      position: "relative",
      marginRight: width * 0.03,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2, // Make it circular
      borderWidth: 0.5,
      borderColor: "#3399FF", // Accent color for border
    },
    infoContainer: {
      flex: 1,
      justifyContent: "center",
    },
    fullName: {
      fontSize: width * 0.04,
      fontWeight: "600",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: 2,
    },
    username: {
      fontSize: width * 0.035,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    buttonContainer: {},

    chatCtn: {
      alignItems: "center",
      marginVertical: 10,
    },
    chatBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#007AFF", // màu xanh chuẩn iOS (hoặc dùng #2196F3 nếu muốn giống Messenger)
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 25,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    msgTxt: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
  });
};

export default Friend;
