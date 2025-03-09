import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import SkeletonLoader from "expo-skeleton-loader";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";

const { width, height } = Dimensions.get("window");

const PostSkeletonItem = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const boneColor = isDarkMode ? "#3c3c3c" : "#E1E9EE";
  const highlightColor = isDarkMode ? "#4a4a4a" : "#F2F8FC";

  return (
    <SkeletonLoader boneColor={boneColor} highlightColor={highlightColor}>
      <View style={styles.postContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.username} />
            <View style={styles.time} />
          </View>
        </View>

        {/* Caption */}
        <View style={styles.caption} />
        <View style={styles.captionShort} />

        {/* Media */}
        <View style={styles.media} />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.icon} />
          <View style={styles.icon} />
        </View>
      </View>
    </SkeletonLoader>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    postContainer: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.04,
      marginBottom: height * 0.015,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#3c3c3c" : "#E1E9EE",
      borderRadius: 12,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: height * 0.02,
    },
    avatar: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: (width * 0.1) / 2,
    },
    userInfo: {
      flex: 1,
      marginLeft: width * 0.04,
    },
    username: {
      width: width * 0.4,
      height: height * 0.02,
      borderRadius: 8,
      marginBottom: 4,
    },
    time: {
      width: width * 0.2,
      height: height * 0.015,
      borderRadius: 8,
    },
    caption: {
      width: width * 0.9,
      height: height * 0.02,
      borderRadius: 8,
      marginBottom: height * 0.008,
    },
    captionShort: {
      width: width * 0.7,
      height: height * 0.02,
      borderRadius: 8,
      marginBottom: height * 0.01,
    },
    media: {
      width: "100%",
      height: height * 0.3,
      borderRadius: 12,
      marginBottom: height * 0.02,
    },
    footer: {
      flexDirection: "row",
      marginTop: height * 0.01,
    },
    icon: {
      width: width * 0.1,
      height: height * 0.025,
      borderRadius: 6,
      marginRight: width * 0.04,
    },
  });

export default PostSkeletonItem;
