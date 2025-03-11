"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";

const { width, height } = Dimensions.get("window");

const AddFriendScreen = () => {
  const { isDarkMode } = useTheme();
  const [isFriend, setIsFriend] = useState(false);
  const buttonScale = new Animated.Value(1);

  const handleAddFriend = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsFriend(!isFriend);
  };

  const styles = getStyles(isDarkMode);

  return (
    <LinearGradient
      colors={isDarkMode ? ["#1a1a2e", "#16213e"] : ["#f0f2f5", "#e6e9f0"]}
      style={styles.container}
    >
      {/* <TouchableOpacity style={styles.themeToggle}>
        <Ionicons
          name={isDarkMode ? "sunny" : "moon"}
          size={24}
          color={isDarkMode ? darkTheme.text : lightTheme.text}
        />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
        <Text style={styles.username}>@{username}</Text>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.addFriendButton, isFriend && styles.friendedButton]}
            onPress={handleAddFriend}
          >
            <Text style={styles.buttonText}>
              {isFriend ? "Friends" : "Add Friend"}
            </Text>
          </TouchableOpacity> */}
      {/* </Animated.View>
      </View> */}
    </LinearGradient>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    profileContainer: {
      alignItems: "center",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: 20,
      padding: width * 0.08,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    avatar: {
      width: width * 0.4,
      height: width * 0.4,
      borderRadius: width * 0.2,
      marginBottom: height * 0.02,
      borderWidth: 4,
      borderColor: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    name: {
      fontSize: width * 0.06,
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.01,
    },
    username: {
      fontSize: width * 0.04,
      color: isDarkMode ? "#ccc" : "#666",
      marginBottom: height * 0.03,
    },
    addFriendButton: {
      backgroundColor: "#4CAF50",
      paddingHorizontal: width * 0.08,
      paddingVertical: height * 0.015,
      borderRadius: 25,
    },
    friendedButton: {
      backgroundColor: "#2196F3",
    },
    buttonText: {
      color: "#fff",
      fontSize: width * 0.04,
      fontWeight: "bold",
    },
    themeToggle: {
      position: "absolute",
      top: height * 0.05,
      right: width * 0.05,
    },
  });

export default AddFriendScreen;
