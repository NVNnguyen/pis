import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import PublicOrPrivate from "@/components/genaral/PublicOrPrivate";
import TabBar from "@/components/public/TabBar/TabBar";
import { backgroundColor } from "@/styles/color";
import Home from "@/components/public/Home";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfilePublicScreen from "./ProfilePublicScreen";
import { getDecodedToken } from "@/utils/decodeToken";
import { getMyUserId } from "@/hooks/getMyUserID";

const { width, height } = Dimensions.get("window");

const PublicModeScreen = () => {
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const currentTranslateY = useRef(0);
  const lastScrollY = useRef(0);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const route = useRoute();
  console.log(route.name);
  const myUserId = getMyUserId() ?? 0;
  useEffect(() => {
    const listener = tabBarTranslateY.addListener((value) => {
      currentTranslateY.current = value.value;
    });
    return () => {
      tabBarTranslateY.removeListener(listener);
    };
  }, [tabBarTranslateY]);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDifference = currentScrollY - lastScrollY.current;

    if (scrollDifference > 0) {
      // Cuộn xuống (ẩn dần TabBar)
      const newTranslateY = Math.min(
        height * 0.09,
        currentTranslateY.current + scrollDifference / 2
      );
      Animated.timing(tabBarTranslateY, {
        toValue: newTranslateY,
        duration: 50,
        useNativeDriver: true,
      }).start();
    } else if (scrollDifference < 0) {
      // Cuộn lên (hiện dần TabBar)
      const newTranslateY = Math.max(
        0,
        currentTranslateY.current + scrollDifference / 2
      );
      Animated.timing(tabBarTranslateY, {
        toValue: newTranslateY,
        duration: 50,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentScrollY; // Cập nhật vị trí cuộn hiện tại
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <PublicOrPrivate />
      </View>
      {route.name === "PublicMode" && (
        <Home handleScroll={handleScroll} userIdProp={myUserId} />
      )}
      <Animated.View
        style={[
          styles.tabBar,
          { transform: [{ translateY: tabBarTranslateY }] },
        ]}
      >
        <TabBar />
      </Animated.View>
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background, // Màu nền
    },
    toggleContainer: {
      alignItems: "center", // Căn giữa theo chiều ngang
      justifyContent: "center", // Căn giữa theo chiều dọc
      paddingTop: height * 0.04, // Responsive padding (2% chiều cao)
      paddingBottom: height * 0.02, // Responsive padding (1% chiều cao)
    },
    tabBar: {
      backgroundColor: backgroundColor, // Màu nền
      position: "absolute", // Đặt TabBar cố định
      bottom: 0,
      left: 0,
      right: 0,
      overflow: "hidden", // Ẩn phần nội dung vượt quá chiều cao
    },
  });

export default PublicModeScreen;
