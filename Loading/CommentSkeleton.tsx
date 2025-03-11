import { View, StyleSheet, Dimensions } from "react-native";
import Skeleton from "expo-skeleton-loader";
import { useTheme } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

const CommentSkeleton = () => {
  const { isDarkMode } = useTheme();

  const boneColor = isDarkMode ? "#3c3c3c" : "#E1E9EE";
  const highlightColor = isDarkMode ? "#4a4a4a" : "#F2F8FC";

  return (
    <Skeleton boneColor={boneColor} highlightColor={highlightColor}>
      <View style={styles.commentContainer}>
        {/* Header with Avatar and Username */}
        <View style={styles.header}>
          {/* Avatar */}
          <View style={[styles.avatar, { backgroundColor: boneColor }]} />

          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={[styles.username, { backgroundColor: boneColor }]} />
            <View style={[styles.time, { backgroundColor: boneColor }]} />
          </View>
        </View>

        {/* Comment Content */}
        <View style={[styles.commentContent, { backgroundColor: boneColor }]} />

        {/* Footer with Like and Reply buttons */}
        <View style={styles.footer}>
          <View style={[styles.actionButton, { backgroundColor: boneColor }]} />
          <View style={[styles.actionButton, { backgroundColor: boneColor }]} />
        </View>
      </View>
    </Skeleton>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    padding: width * 0.04,
    marginBottom: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    marginRight: width * 0.03,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    width: width * 0.3,
    height: height * 0.015,
    borderRadius: 4,
    marginBottom: height * 0.005,
  },
  time: {
    width: width * 0.2,
    height: height * 0.01,
    borderRadius: 4,
  },
  commentContent: {
    width: "90%",
    height: height * 0.04,
    borderRadius: 4,
    marginBottom: height * 0.01,
    marginLeft: width * 0.13,
  },
  footer: {
    flexDirection: "row",
    marginLeft: width * 0.13,
    gap: width * 0.05,
  },
  actionButton: {
    width: width * 0.15,
    height: height * 0.02,
    borderRadius: 4,
  },
});

export default CommentSkeleton;
