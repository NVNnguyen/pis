import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Import icon từ Expo Vector Icons

const { width, height } = Dimensions.get("window");

const PasswordUpdateScreen: React.FC = () => {
  const handleLoginPress = () => {
    // Điều hướng đến màn hình Login hoặc xử lý tương ứng
    console.log("Navigating to Login...");
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.title}>Password Update</Text>

      {/* Dòng chữ phụ */}
      <Text style={styles.subtitle}>Your password has been updated!</Text>

      {/* Biểu tượng Checkmark */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="check-circle" size={width * 0.2} color="#1C1C1E" />
      </View>

      {/* Nút Login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E", // Nền tối
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#D1D1D1",
    marginBottom: height * 0.05,
    textAlign: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    marginBottom: height * 0.05,
  },
  loginButton: {
    backgroundColor: "#444",
    width: width * 0.8,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});

export default PasswordUpdateScreen;
