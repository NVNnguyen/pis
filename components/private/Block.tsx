import { useTheme } from "@/contexts/ThemeContext";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { darkTheme, lightTheme } from "@/utils/themes"; // Giả định có import này
import { FriendType } from "@/utils/types/FriendType";
import useAcceptFriendRequest from "@/hooks/useAcceptFriendRequest";
import { useMyUserId } from "@/hooks/useMyUserId";
import { primaryColor } from "@/utils/colorPrimary";
import { fontWeight, textPostFontSize } from "@/styles/stylePrimary";
import useRejectFriendRequest from "@/hooks/useRejectFriendRequest";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackType } from "@/utils/types/MainStackType";
import { useQueryClient } from "@tanstack/react-query";
import useUnblock from "@/hooks/useUnblock";

const { width, height } = Dimensions.get("window");

const FriendRequest = ({
  id,
  username,
  firstName,
  lastName,
  avatar,
  isActive,
}: FriendType) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const myUserId = Number(useMyUserId());
  const unblock = useUnblock();
  const queryclient = useQueryClient();
  const handleUnblock = () => {
    if (myUserId && id) {
      unblock.unblock({ myUserId: myUserId, userId: id });
    }
    if (unblock.isSuccess) {
      queryclient.invalidateQueries({ queryKey: ["listBlock", myUserId] });
    }
  };
  return (
    <View style={styles.container}>
      {/* Avatar Container */}
      <View style={styles.avatarContainer}>
        <Image
          source={
            avatar ? { uri: avatar } : require("@/assets/images/userAvatar.png")
          }
          style={styles.avatar}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.fullName}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleUnblock} style={styles.profileButton}>
          {unblock.isLoading && (
            <ActivityIndicator
              color={isDarkMode ? darkTheme.text : lightTheme.text}
            />
          )}
          {!unblock.isSuccess && <Text style={styles.buttonText}>Unblock</Text>}
          {unblock.isSuccess &&  <Text style={styles.fiendTxt}>Friend</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: any) => {
  const avatarSize = width * 0.14; // Responsive avatar size

  return StyleSheet.create({
    container: {
      flex: 1,
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
    buttonContainer: {
      margin: width * 0.01,
      flexDirection: "row",
    },
    profileButton: {
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.04,
      borderRadius: 20,
    },
    buttonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.035,
      fontWeight: fontWeight,
    },
    acceptBtn: {
      backgroundColor: primaryColor,
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.04,
      borderRadius: 20,
      marginLeft: width * 0.01,
    },
    acceptTxt: {
      color: darkTheme.text,
      fontSize: textPostFontSize,
      fontWeight: fontWeight,
    },
    profileCtn: {
      marginLeft: width * 0.02,
    },
    profileTxt: {
      backgroundColor: isDarkMode ? "#2C2C2E" : "#F2F2F7",
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.04,
      borderRadius: 20,
    },
    btnProfile: {
      color: isDarkMode ? "#3399FF" : "#3399FF",
      fontSize: width * 0.035,
      fontWeight: fontWeight,
    },
    rejectedTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      fontWeight: fontWeight,
    },
    fiendTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });
};

export default FriendRequest;
