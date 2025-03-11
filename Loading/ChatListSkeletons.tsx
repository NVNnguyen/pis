import { View, StyleSheet, Dimensions } from "react-native";
import Skeleton from "expo-skeleton-loader";
import { useTheme } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

const ChatListSkeleton = () => {
  const { isDarkMode } = useTheme();

  const boneColor = isDarkMode ? "#3c3c3c" : "#E1E9EE";
  const highlightColor = isDarkMode ? "#4a4a4a" : "#F2F8FC";

  return (
    <Skeleton boneColor={boneColor} highlightColor={highlightColor}>
      <View style={styles.container}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: boneColor }]} />

        {/* Chat Info */}
        <View style={styles.chatInfo}>
          {/* Username */}
          <View style={[styles.username, { backgroundColor: boneColor }]} />

          {/* Last Message */}
          <View style={styles.lastMessageContainer}>
            <View
              style={[styles.lastMessage, { backgroundColor: boneColor }]}
            />
            <View
              style={[styles.lastMsgTime, { backgroundColor: boneColor }]}
            />
          </View>
        </View>
      </View>
    </Skeleton>
  );
};

// Multiple skeletons for a list
export const ChatListSkeletons = ({ count = 5 }) => {
  return (
    <View>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <ChatListSkeleton key={index} />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "#A0A0A0",
    flex: 2,
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
    width: width * 0.5,
    height: height * 0.025,
    borderRadius: 4,
    marginBottom: height * 0.015,
  },
  lastMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    width: width * 0.4,
    height: height * 0.02,
    borderRadius: 4,
    marginRight: width * 0.02,
  },
  lastMsgTime: {
    width: width * 0.15,
    height: height * 0.02,
    borderRadius: 4,
  },
});

export default ChatListSkeleton;
