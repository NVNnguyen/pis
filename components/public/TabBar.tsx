import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserId } from "@/utils/decodeToken";

const { width, height } = Dimensions.get("window");

const TabBar = ({ navigation }: { navigation: any }) => {
  const { isDarkMode } = useTheme();
  const [userId, setUserId] = useState<number>(0);
  // Điều hướng tới màn hình tương ứng
  useEffect(() => {
    const fetchUserId = async () => {
      await getUserId();
      const decodedToken = await AsyncStorage.getItem("userID");
      setUserId(Number(decodedToken));
      console.log("User ID:", userId);
    };
    fetchUserId();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.navItem}
        >
          <MaterialCommunityIcons
            name="home-variant-outline"
            size={height * 0.03}
            color="grey"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          style={styles.navItem}
        >
          <Ionicons name="search" size={height * 0.03} color="grey" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.navItem}
        >
          <View style={styles.addButton}>
            <MaterialIcons name="add" size={30} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ChatList")}
          style={styles.navItem}
        >
          <Ionicons
            name="chatbubble-outline"
            size={height * 0.03}
            color="grey"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProfilePublic", { userId: userId })
          }
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
