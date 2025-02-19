import { backgroundColor, Color } from "@/styles/color";
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
import { RootStackParamList } from "@/utils/types/MainStackType";

const { width, height } = Dimensions.get("window");

const PublicOrPrivate = () => {
  const toggleOptionRef = useRef<boolean>(false); // Tránh re-render
  const [toggleOption, setToggleOption] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    const loadToggleOption = async () => {
      const savedOption = await AsyncStorage.getItem("toggleOption");
      if (savedOption !== null) {
        toggleOptionRef.current = JSON.parse(savedOption);
        setToggleOption(toggleOptionRef.current);
      }
    };
    loadToggleOption();
  }, []);

  const handleToggle = useCallback(
    async (option: boolean) => {
      if (toggleOptionRef.current === option) return; // Ngăn chặn cập nhật trùng lặp
      toggleOptionRef.current = option;
      setToggleOption(option);
      await AsyncStorage.setItem("toggleOption", JSON.stringify(option));
      navigation.navigate(option ? "PublicMode" : "FriendMode");
    },
    [navigation]
  );

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
              : { color: isDarkMode ? "black" : Color },
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
              : { color: isDarkMode ? "black" : Color },
          ]}
        >
          Friends
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (isDarkMode: any) =>
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
      fontSize: width * 0.04,
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
