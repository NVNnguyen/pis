import React from "react";
import { View, StyleSheet } from "react-native";
import { Color } from "../styles/color";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      {/* <SvgLogo width={100} height={100} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color,
  },
});

export default LoadingScreen;
