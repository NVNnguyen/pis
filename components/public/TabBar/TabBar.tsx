import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  useNavigation,
  NavigationProp,
  useRoute,
} from "@react-navigation/native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDecodedToken } from "@/utils/decodeToken";
import CreatePostModel from "../Modals/CreatePostModal";
import { RootStackParamList } from "@/utils/types/MainStackType";

const { width, height } = Dimensions.get("window");

const TabBar = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [userId, setUserId] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const screenName = route.name;
  useEffect(() => {
    const fetchUserId = async () => {
      await getDecodedToken();
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
          onPress={() => navigation.navigate("PublicMode")}
          style={[
            styles.navItem,
            {
              borderTopColor: screenName === "PublicMode" ? "#fff" : "grey",
              borderTopWidth: screenName === "PublicMode" ? 1 : 0,
            },
          ]}
        >
          <Ionicons
            name="home"
            size={height * 0.03}
            color={screenName === "PublicMode" ? "#fff" : "grey"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          style={[
            styles.navItem,
            {
              borderTopColor: screenName === "Search" ? "#fff" : "grey",
              borderTopWidth: screenName === "Search" ? 1 : 0,
            },
          ]}
        >
          <FontAwesome
            name="search"
            size={height * 0.03}
            color={screenName === "Search" ? "#fff" : "grey"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.navItem}
        >
          <View style={styles.addButton}>
            <MaterialIcons name="add" size={30} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ChatList")}
          style={[
            styles.navItem,
            {
              borderTopColor: screenName === "ChatList" ? "#fff" : "grey",
              borderTopWidth: screenName === "ChatList" ? 1 : 0,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="chat"
            size={height * 0.03}
            color={screenName === "ChatList" ? "#fff" : "grey"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProfilePublic", { userId: userId })
          }
          style={[
            styles.navItem,
            {
              borderTopColor: screenName === "ProfilePublic" ? "#fff" : "grey",
              borderTopWidth: screenName === "ProfilePublic" ? 1 : 0,
            },
          ]}
        >
          <FontAwesome
            name="user"
            size={height * 0.03}
            color={screenName === "ProfilePublic" ? "#fff" : "grey"}
          />
        </TouchableOpacity>
        <CreatePostModel
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          imagesProp={[]}
          removeImageProp={() => {}}
        />
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    bottomNav: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      height: height * 0.09,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
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
