import { View, StyleSheet, Dimensions } from "react-native"
import Skeleton from "expo-skeleton-loader"
import { useTheme } from "@/contexts/ThemeContext"

const { width, height } = Dimensions.get("window")

const PostPrivateSkeleton = () => {
  const { isDarkMode } = useTheme()

  const boneColor = isDarkMode ? "#3c3c3c" : "#E1E9EE"
  const highlightColor = isDarkMode ? "#4a4a4a" : "#F2F8FC"

  return (
    <View style={styles.container}>
      <Skeleton boneColor={boneColor} highlightColor={highlightColor}>
        {/* Media Container */}
        <View style={styles.mediaContainer} />

        {/* Caption */}
        <View style={styles.captionContainer} />

        {/* User Header */}
        <View style={styles.userHeader}>
          <View style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.username} />
            <View style={styles.dateText} />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.iconButton} />
          <View style={styles.captureButton} />
          <View style={styles.iconButton} />
        </View>
      </Skeleton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: height,
  },
  mediaContainer: {
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 15,
    marginBottom: height * 0.02,
  },
  captionContainer: {
    width: width * 0.8,
    height: height * 0.05,
    borderRadius: 10,
    marginBottom: height * 0.02,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    marginRight: width * 0.02,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    width: width * 0.4,
    height: height * 0.02,
    marginBottom: height * 0.01,
  },
  dateText: {
    width: width * 0.3,
    height: height * 0.015,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.9,
    marginTop: height * 0.02,
  },
  iconButton: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
  },
  captureButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
  },
})

export default PostPrivateSkeleton

