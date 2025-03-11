import { backgroundColor, Color } from "@/styles/stylePrimary";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { MainStackType } from "@/utils/types/MainStackType";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const PublicOrPrivate = () => {
  const toggleOptionRef = useRef<boolean>(true); // Mặc định là Public
  const [toggleOption, setToggleOption] = useState<boolean | null>(null); // Sử dụng null để chờ dữ liệu
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const loadToggleOption = async () => {
      try {
        const savedOption = await AsyncStorage.getItem("toggleOption");
        const option = savedOption !== null ? JSON.parse(savedOption) : true; // Mặc định Public nếu null
        toggleOptionRef.current = option;
        setToggleOption(option);
        navigation.navigate(option ? "PublicMode" : "PrivateMode");
      } catch (error) {
        console.error("Lỗi khi tải toggleOption:", error);
        setToggleOption(true); // Mặc định Public nếu có lỗi
        navigation.navigate("PublicMode");
      }
    };
    loadToggleOption();
  }, [navigation]);

  const handleToggle = useCallback(
    async (option: boolean) => {
      if (toggleOptionRef.current === option) return; // Ngăn chặn cập nhật trùng lặp
      toggleOptionRef.current = option;
      setToggleOption(option);
      await AsyncStorage.setItem("toggleOption", JSON.stringify(option));
      navigation.navigate(option ? "PublicMode" : "PrivateMode");
    },
    [navigation]
  );

  // Nếu toggleOption chưa load xong, không render giao diện tránh lỗi UI
  if (toggleOption === null) {
    return null;
  }

  return (
    <View style={styles.toggleSwitch}>
      <TouchableOpacity
        style={[styles.toggleButton, toggleOption && styles.activeButton]}
        onPress={() => handleToggle(true)}
      >
        <Text
          style={[
            styles.toggleText,
            toggleOption
              ? styles.activeText
              : {
                  color: isDarkMode
                    ? darkTheme.background
                    : lightTheme.background,
                },
          ]}
        >
          Public
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleButton, !toggleOption && styles.activeButton]}
        onPress={() => handleToggle(false)}
      >
        <Text
          style={[
            styles.toggleText,
            !toggleOption
              ? styles.activeText
              : {
                  color: isDarkMode
                    ? darkTheme.background
                    : lightTheme.background,
                },
          ]}
        >
          Friends
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    toggleSwitch: {
      flexDirection: "row",
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      borderRadius: 16,
      paddingHorizontal: width * 0.02,
      paddingVertical: height * 0.005,
      alignItems: "center",
    },
    toggleButton: {
      paddingHorizontal: width * 0.03,
      paddingVertical: height * 0.01,
      borderRadius: 12,
    },
    toggleText: {
      color: Color,
      fontSize: Math.min(RFValue(16, 680), 30),
    },
    activeButton: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    activeText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });

export default PublicOrPrivate;
