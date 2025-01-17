import React, { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";

const { width, height } = Dimensions.get("window");

interface GetColorType {
  currentScreen: string;
  screenName: string;
}

const TabBar = () => {
  const navigation = useNavigation();
  const [currentScreen, setCurrentScreen] = useState("Home");
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  // Điều hướng tới màn hình tương ứng
  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen);
    navigation.navigate(screen as never);
  };

  // Lấy màu sắc cho biểu tượng và nền
  const getColor = ({ currentScreen, screenName }: GetColorType) => {
    if (currentScreen === screenName) {
      return isDarkMode ? darkTheme.text : lightTheme.text;
    }
    return "grey";
  };

  const getBackgroundColor = ({ currentScreen, screenName }: GetColorType) => {
    if (currentScreen === screenName) {
      return isDarkMode ? darkTheme.background : lightTheme.background;
    }
    return "transparent";
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => navigateToScreen("Home")}
          style={[
            styles.navItem,
            {
              backgroundColor: getBackgroundColor({
                currentScreen,
                screenName: "Home",
              }),
            },
          ]}
        >
          <MaterialCommunityIcons
            name={
              currentScreen === "Home" ? "home-variant" : "home-variant-outline"
            }
            size={height * 0.03}
            color={getColor({ currentScreen, screenName: "Home" })}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateToScreen("Search")}
          style={[
            styles.navItem,
            {
              backgroundColor: getBackgroundColor({
                currentScreen,
                screenName: "Search",
              }),
            },
          ]}
        >
          <Ionicons
            name="search"
            size={height * 0.03}
            color={getColor({ currentScreen, screenName: "Search" })}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateToScreen("Register")}
          style={styles.navItem}
        >
          <View style={styles.addButton}>
            <MaterialIcons name="add" size={30} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateToScreen("Favorites")}
          style={[
            styles.navItem,
            {
              backgroundColor: getBackgroundColor({
                currentScreen,
                screenName: "Favorites",
              }),
            },
          ]}
        >
          <FontAwesome
            name={currentScreen === "Favorites" ? "heart" : "heart-o"}
            size={height * 0.03}
            color={getColor({ currentScreen, screenName: "Favorites" })}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateToScreen("Profile")}
          style={[
            styles.navItem,
            {
              backgroundColor: getBackgroundColor({
                currentScreen,
                screenName: "Profile",
              }),
            },
          ]}
        >
          <Ionicons
            name={currentScreen === "Profile" ? "person" : "person-outline"}
            size={height * 0.03}
            color={getColor({ currentScreen, screenName: "Profile" })}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    bottomNav: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      height: height * 0.09,
    },
    navItem: {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10, // Tạo viền bo tròn cho nền
      padding: 10, // Tạo khoảng cách xung quanh biểu tượng
    },
    addButton: {
      width: width * 0.12,
      height: width * 0.12,
      backgroundColor: isDarkMode ? "gray" : "#F5F5F5",
      borderRadius: (width * 0.12) / 2,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: height * 0.02,
    },
  });

export default TabBar;
