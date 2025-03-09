import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { PostItemType } from "@/utils/types/PostItemType";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ITEM_MARGIN = 4;
const ITEM_SIZE = (width - ITEM_MARGIN * 4) / 3;
interface PhotoProp extends PostItemType {
  isLoading: boolean;
}

const Photo = ({
  userPostResponse,
  caption,
  images,
  type,
  createTime,
  isLoading,
}: PhotoProp) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.itemWrapper}>
      {type === "Image" && (
        <Image source={{ uri: images?.[0]?.url }} style={styles.image} />
      )}
    </View>
  );
};
const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    itemWrapper: {
      width: ITEM_SIZE,
      height: ITEM_SIZE,
      margin: ITEM_MARGIN,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: 10,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
  });

export default Photo;
