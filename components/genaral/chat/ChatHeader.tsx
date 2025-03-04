import infoAPI from "@/api/infoAPI";
import { useTheme } from "@/contexts/ThemeContext";
import useUserInfo from "@/hooks/useUserInfo";
import { Color, fontWeight } from "@/styles/stylePrimary";
import { primaryColor } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
interface ChatHeaderProps {
  userIdProp: number;
}
const { width, height } = Dimensions.get("window");
const ChatHeader: React.FC<ChatHeaderProps> = ({ userIdProp }) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation();
  const { userInfo, isUserLoading, userError } = useUserInfo(userIdProp);
  return (
    <View style={styles.header}>
      <View style={styles.backIcon}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-sharp"
            size={24}
            style={styles.iconColor}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.avatarContainer}>
        {userInfo?.avatar === null ? (
          <Image
            source={require("@/assets/images/userAvatar.png")}
            style={styles.avatar}
          />
        ) : (
          <Image source={{ uri: userInfo?.avatar }} style={styles.avatar} />
        )}
      </View>
      <View style={styles.textView}>
        <Text style={styles.name}>
          {userInfo?.firstName} {userInfo?.lastName}
        </Text>
        <Text style={styles.status}>Online</Text>
      </View>
      <View style={styles.callIcons}>
        <View style={styles.audioIcon}>
          <Ionicons
            name="call"
            size={24}
            color={Color}
            style={styles.iconColor}
          />
        </View>
        <View style={styles.videoIcon}>
          <FontAwesome name="video-camera" size={24} style={styles.iconColor} />
        </View>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    header: {
      height: height * 0.05,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      marginTop: height * 0.05,
    },
    backIcon: {},
    avatarContainer: {
      marginLeft: width * 0.02,
    },
    avatar: {
      width: width * 0.09,
      height: width * 0.09, // Đảm bảo avatar luôn là hình tròn
      borderRadius: (width * 0.09) / 2, // Bán kính bằng một nửa width
      marginRight: width * 0.02,
    },
    name: {
      fontWeight: fontWeight,
      fontSize: width * 0.04,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    textView: {},
    status: {
      color: "green",
      marginLeft: width * 0.01,
      fontWeight: fontWeight,
    },
    callIcons: {
      flexDirection: "row",
      marginLeft: width * 0.4,
    },
    audioIcon: {},
    videoIcon: {
      marginLeft: width * 0.04,
    },
    iconColor: {
      color: primaryColor,
    },
  });

export default ChatHeader;
