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
import CreatePostModel from "../Modals/CreatePostModal";
import { MainStackType } from "@/utils/types/MainStackType";
import { getMyUserId } from "@/hooks/getMyUserID";

const { width, height } = Dimensions.get("window");

const TabBar = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const [modalState, setModalState] = useState<{
    visible: boolean;
    key: string | null;
  }>({
    visible: false,
    key: null, // Lưu key tùy chọn
  });
  const route = useRoute();
  const screenName = route.name;
  const myUserId = getMyUserId();
  return (
    <View style={styles.container}>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PublicMode")}
          style={[
            styles.navItem,
            {
              borderTopColor:
                screenName === "PublicMode"
                  ? isDarkMode
                    ? lightTheme.background
                    : darkTheme.background
                  : "grey",
              borderTopWidth: screenName === "PublicMode" ? 1 : 0,
            },
          ]}
        >
          <Ionicons
            name="home"
            size={height * 0.03}
            color={
              screenName === "PublicMode"
                ? isDarkMode
                  ? lightTheme.background
                  : darkTheme.background
                : "grey"
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          style={[
            styles.navItem,
            {
              borderTopColor:
                screenName === "Search"
                  ? isDarkMode
                    ? lightTheme.background
                    : darkTheme.background
                  : "grey",
              borderTopWidth: screenName === "Search" ? 1 : 0,
            },
          ]}
        >
          <FontAwesome
            name="search"
            size={height * 0.03}
            color={
              screenName === "Search"
                ? isDarkMode
                  ? lightTheme.background
                  : darkTheme.background
                : "grey"
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setModalState({
              visible: true,
              key: "camera",
            })
          }
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
              borderTopColor:
                screenName === "ChatList"
                  ? isDarkMode
                    ? lightTheme.background
                    : darkTheme.background
                  : "grey",
              borderTopWidth: screenName === "ChatList" ? 1 : 0,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="chat"
            size={height * 0.03}
            color={
              screenName === "ChatList"
                ? isDarkMode
                  ? lightTheme.background
                  : darkTheme.background
                : "grey"
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (myUserId !== null) {
              navigation.navigate("Profile", { userId: myUserId });
            }
          }}
          style={[
            styles.navItem,
            {
              borderTopColor:
                screenName === "Profile"
                  ? isDarkMode
                    ? lightTheme.background
                    : darkTheme.background
                  : "grey",
              borderTopWidth: screenName === "Profile" ? 1 : 0,
            },
          ]}
        >
          <FontAwesome
            name="user"
            size={height * 0.03}
            color={
              screenName === "Profile"
                ? isDarkMode
                  ? lightTheme.background
                  : darkTheme.background
                : "grey"
            }
          />
        </TouchableOpacity>
        <CreatePostModel
          openModel={modalState}
          onClose={() => {
            setModalState({ visible: false, key: null });
            return { visible: false, key: null };
          }}
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
