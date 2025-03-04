import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Color } from "../../../styles/stylePrimary";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const NewCredentialsScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <MaterialIcons name="arrow-back-ios" size={24} color={Color} />
      </TouchableOpacity>

      {/* Icon and Title */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="lock-outline" size={80} color={Color} />
      </View>
      <Text style={styles.title}>New Credentials</Text>
      <Text style={styles.subtitle}>
        Your identity has been verified! Set your new password.
      </Text>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={24} color="#000" />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!isNewPasswordVisible}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholderTextColor="#9E9E9E"
        />
        <TouchableOpacity
          onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
        >
          <FontAwesome
            name={isNewPasswordVisible ? "eye" : "eye-slash"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={24} color="#000" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#9E9E9E"
        />
        <TouchableOpacity
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <FontAwesome
            name={isConfirmPasswordVisible ? "eye" : "eye-slash"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
    padding: width * 0.05, // Responsive padding
  },
  backButton: {
    marginTop: height * 0.05,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: height * 0.05,
  },
  title: {
    fontSize: width * 0.07, // Responsive font size
    color: Color,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: "#B0B0B0",
    textAlign: "center",
    marginTop: height * 0.01,
    marginBottom: height * 0.05,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0", // Light gray background
    borderRadius: width * 0.03,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
  },
  input: {
    flex: 1,
    fontSize: width * 0.045,
    marginLeft: width * 0.03,
    color: "#000",
  },
  updateButton: {
    backgroundColor: "#666666", // Button background color
    borderRadius: width * 0.03,
    paddingVertical: height * 0.02,
    alignItems: "center",
    marginTop: height * 0.03,
  },
  updateButtonText: {
    color: Color,
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});

export default NewCredentialsScreen;
