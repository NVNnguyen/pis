import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Skeleton from "expo-skeleton-loader";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");
const ITEM_MARGIN = 4;
const ITEM_SIZE = (width - ITEM_MARGIN * 4) / 3;

const GallerySkeleton = () => {
  const { isDarkMode } = useTheme();
  const boneColor = isDarkMode ? "#3c3c3c" : "#E1E9EE";
  const highlightColor = isDarkMode ? "#4a4a4a" : "#F2F8FC";

  return (
    <Skeleton boneColor={boneColor} highlightColor={highlightColor}>
      <View style={styles.itemWrapper}>
        <View style={[styles.item, { backgroundColor: boneColor }]} />
      </View>
    </Skeleton>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: ITEM_MARGIN,
  },
  item: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default GallerySkeleton;
