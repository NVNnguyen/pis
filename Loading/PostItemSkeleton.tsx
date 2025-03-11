import { View, StyleSheet, Dimensions } from "react-native";
import Skeleton from "expo-skeleton-loader";
import { useTheme } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

const PostItemSkeleton = () => {
  const { isDarkMode } = useTheme();

  const boneColor = isDarkMode ? "#3c3c3c" : "#E1E9EE";
  const highlightColor = isDarkMode ? "#4a4a4a" : "#F2F8FC";

  return (
    <Skeleton boneColor={boneColor} highlightColor={highlightColor}>
      <View style={styles.postContainer}>
        {/* Header */}
        <View style={styles.header}>
          {/* Avatar */}
          <View style={[styles.avatar, { backgroundColor: boneColor }]} />

          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={[styles.username, { backgroundColor: boneColor }]} />
            <View style={[styles.time, { backgroundColor: boneColor }]} />
          </View>

          {/* More Options Icon */}
          <View style={[styles.moreIcon, { backgroundColor: boneColor }]} />
        </View>

        {/* Caption */}
        <View style={[styles.caption, { backgroundColor: boneColor }]} />

        {/* Content (Image or Audio) */}
        <View style={[styles.content, { backgroundColor: boneColor }]} />

        {/* Footer */}
        <View style={styles.footer}>
          <View
            style={[styles.iconContainer, { backgroundColor: boneColor }]}
          />
          <View
            style={[styles.iconContainer, { backgroundColor: boneColor }]}
          />
        </View>
      </View>
    </Skeleton>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: width * 0.04,
    marginBottom: height * 0.02,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginRight: width * 0.03,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    width: width * 0.4,
    height: height * 0.02,
    borderRadius: 4,
    marginBottom: height * 0.01,
  },
  time: {
    width: width * 0.3,
    height: height * 0.015,
    borderRadius: 4,
  },
  moreIcon: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: width * 0.03,
  },
  caption: {
    width: "100%",
    height: height * 0.06,
    borderRadius: 4,
    marginBottom: height * 0.02,
  },
  content: {
    width: "100%",
    height: height * 0.2,
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: width * 0.2,
    height: height * 0.03,
    borderRadius: 8,
  },
});

export default PostItemSkeleton;
