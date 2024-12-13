import React from "react";
import { View, StyleSheet } from "react-native";


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
    backgroundColor: "#fff",
  },
});

export default LoadingScreen;
