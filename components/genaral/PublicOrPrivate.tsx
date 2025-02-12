import { backgroundColor, Color } from "@/styles/color";
import { useCallback, useEffect, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { RootStackParamList } from "@/navigation/MainStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";

const { width, height } = Dimensions.get("window");

const PublicOrPrivate = () => {
  const [toggleOption, setToggleOption] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    // Lấy trạng thái từ AsyncStorage
    const loadToggleOption = async () => {
      const savedOption = await AsyncStorage.getItem("toggleOption");
      if (savedOption !== null) {
        setToggleOption(JSON.parse(savedOption));
      }
    };
    loadToggleOption();
  }, []);

  const handleToggle = useCallback(
    async (option: boolean) => {
      setToggleOption(option);
      await AsyncStorage.setItem("toggleOption", JSON.stringify(option)); // Lưu trạng thái
      navigation.navigate(option ? "PublicMode" : "FriendMode");
    },
    [navigation]
  );

  return (
    <View style={styles.toggleSwitch}>
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
