import { View, StyleSheet, Dimensions } from "react-native";
import Skeleton from "expo-skeleton-loader";
import { useTheme } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

const AddFriendModalSkeleton = () => {
  const { isDarkMode } = useTheme();

  const boneColor = isDarkMode ? "#5a4a3a" : "#e0e0e0"; // Màu nền skeleton
  const highlightColor = isDarkMode ? "#6b5a4a" : "#f0f0f0"; // Màu nhấp nháy

  const isSmallDevice = width < 375;
  const modalWidth = Math.min(width * 0.85, 400);
  const profileSize = isSmallDevice
    ? 80
    : width * 0.25 > 120
    ? 120
    : width * 0.25;

  return (
    <Skeleton boneColor={boneColor} highlightColor={highlightColor}>
      <View style={styles.modalContent}>
        {/* Skeleton cho ảnh đại diện */}
        <View
          style={[
            styles.profileImageContainer,
            {
              backgroundColor: boneColor,
              width: profileSize,
              height: profileSize,
              borderRadius: profileSize / 2,
            },
          ]}
        />

        {/* Skeleton cho tên đầy đủ */}
        <View
          style={[
            styles.name,
            {
              backgroundColor: boneColor,
              width: width * 0.6,
              height: 24,
              borderRadius: 4,
            },
          ]}
        />

        {/* Skeleton cho username */}
        <View
          style={[
            styles.name,
            {
              backgroundColor: boneColor,
              width: width * 0.4,
              height: 24,
              borderRadius: 4,
            },
          ]}
        />

        {/* Skeleton cho nút Add */}
        <View
          style={[
            styles.addButton,
            {
              backgroundColor: boneColor,
              width: modalWidth * 0.4,
              height: 40,
              borderRadius: 20,
            },
          ]}
        />

        {/* Skeleton cho nút Dismiss */}
        <View
          style={[
            styles.dismissButton,
            {
              backgroundColor: boneColor,
              width: modalWidth * 0.4,
              height: 40,
              borderRadius: 20,
            },
          ]}
        />
      </View>
    </Skeleton>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: Math.min(width * 0.85, 400),
    maxHeight: height * 0.7,
    borderRadius: 20,
    padding: width * 0.05,
    alignItems: "center",
    backgroundColor: "transparent", // Để skeleton hiển thị trên nền trong suốt
  },
  profileImageContainer: {
    borderWidth: 3,
    borderColor: "transparent", // Không cần border vì skeleton đã có màu nền
    overflow: "hidden",
    marginBottom: height * 0.02,
  },
  name: {
    marginBottom: height * 0.025,
  },
  addButton: {
    marginBottom: height * 0.02,
  },
  dismissButton: {},
});

export default AddFriendModalSkeleton;
