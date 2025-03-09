// FollowProfileSkeleton.tsx
import React from "react";
import { View, Dimensions } from "react-native";
import Skeleton from "expo-skeleton-loader";
import { useTheme } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

const FollowProfileSkeleton = () => {
  const { isDarkMode } = useTheme();

  const boneColor = isDarkMode ? "#3c3c3c" : "#E1E9EE";
  const highlightColor = isDarkMode ? "#4a4a4a" : "#F2F8FC";

  return (
    <Skeleton boneColor={boneColor} highlightColor={highlightColor}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: height * 0.01,
        }}
      >
        {/* Avatar Skeleton */}
        <View
          style={{
            width: width * 0.1,
            height: width * 0.1,
            borderRadius: (width * 0.1) / 2,
            marginRight: width * 0.03,
            backgroundColor: boneColor,
          }}
        />

        {/* Text Info Skeleton */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              width: width * 0.4,
              height: height * 0.02,
              borderRadius: 4,
              marginBottom: 5,
              backgroundColor: boneColor,
            }}
          />
          <View
            style={{
              width: width * 0.3,
              height: height * 0.015,
              borderRadius: 4,
              backgroundColor: boneColor,
            }}
          />
        </View>

        {/* Follow Button Skeleton */}
        <View
          style={{
            width: width * 0.2,
            height: height * 0.03,
            borderRadius: 8,
            backgroundColor: boneColor,
          }}
        />
      </View>
    </Skeleton>
  );
};

export default FollowProfileSkeleton;
