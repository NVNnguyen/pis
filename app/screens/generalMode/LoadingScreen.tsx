import { useTheme } from "@/contexts/ThemeContext";
import { fontWeight } from "@/styles/color";
import { darkTheme, lightTheme } from "@/utils/themes";
import { RootStackParamList } from "@/utils/types/MainStackType";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Text } from "react-native";

const { width, height } = Dimensions.get("window");

const LoadingScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Loading">>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); // Chuyển đến màn hình Login sau 3 giây
    }, 3000);

    return () => clearTimeout(timer); // Xóa timer nếu component bị unmount
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo với hiệu ứng nhấp nháy */}
      <Animated.Image
        source={require("../../../assets/images/logo.png")} // Thay đường dẫn bằng đường dẫn ảnh của bạn
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            tintColor: isDarkMode ? darkTheme.text : lightTheme.text,
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0.3, 1],
              outputRange: [0.6, 1], // Đảm bảo luôn hiển thị rõ
            }),
          },
        ]}
      >
        Pis...
      </Animated.Text>
    </View>
  );
};
const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: "100%", // Chiều rộng logo (50% chiều rộng màn hình)
      height: "100%", // Chiều cao logo
    },
    text: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.016,
      marginTop: height * 0.01,
      fontWeight: fontWeight,
    },
  });

export default LoadingScreen;
