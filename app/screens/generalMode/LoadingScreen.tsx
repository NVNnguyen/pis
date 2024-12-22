import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const LoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Giá trị mờ ban đầu (1: hiện rõ)

  useEffect(() => {
    // Hiệu ứng nhấp nháy vô hạn
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3, // Mờ dần
          duration: 1000, // Thời gian mờ
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1, // Hiện lại
          duration: 1000, // Thời gian hiện lại
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo với hiệu ứng nhấp nháy */}
      <Animated.Image
        source={require("../../assets/images/logo.png")} // Thay đường dẫn bằng đường dẫn ảnh của bạn
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E", // Nền tối
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%", // Chiều rộng logo (50% chiều rộng màn hình)
    height: "100%", // Chiều cao logo
  },
});

export default LoadingScreen;
