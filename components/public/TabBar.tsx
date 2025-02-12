import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";

const { width, height } = Dimensions.get("window");

const TabBar = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation(); // Fix lỗi navigation
  

  // Điều hướng tới màn hình tương ứng
  const navigateToScreen = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => navigateToScreen("Home")}
          style={styles.navItem}
        >
          <MaterialCommunityIcons
            name="home-variant-outline"
            size={height * 0.03}
            color="grey"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateToScreen("Search")}
          style={styles.navItem}
        >
          <Ionicons name="search" size={height * 0.03} color="grey" />
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
          style={styles.navItem}
        >
          <FontAwesome name="heart-o" size={height * 0.03} color="grey" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateToScreen("ProfilePublic")}
          style={styles.navItem}
        >
          <Ionicons name="person-outline" size={height * 0.03} color="grey" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: height * 0.09,
    backgroundColor: "#000",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  addButton: {
    width: width * 0.12,
    height: width * 0.12,
    backgroundColor: "#F5F5F5",
    borderRadius: (width * 0.12) / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
});

export default TabBar;
