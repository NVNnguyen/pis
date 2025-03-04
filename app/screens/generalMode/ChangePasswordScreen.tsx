import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  backgroundColor,
  Color,
  fontWeight,
} from "../../../styles/stylePrimary";

const { width, height } = Dimensions.get("window");

const ChangePasswordScreen = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Change Password</Text>

        {/* Current Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Password..."
              placeholderTextColor="#888"
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            >
              <FontAwesome5
                name={isPasswordVisible ? "eye" : "eye-slash"}
                size={18}
                color="#bdbdbd"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="New Password..."
              placeholderTextColor="#888"
              secureTextEntry={!isNewPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setNewPasswordVisible(!isNewPasswordVisible)}
            >
              <FontAwesome5
                name={isNewPasswordVisible ? "eye" : "eye-slash"}
                size={18}
                color="#bdbdbd"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Re-enter New Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Re-Enter New Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="New Password..."
              placeholderTextColor="#888"
              secureTextEntry={!isNewPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setNewPasswordVisible(!isNewPasswordVisible)}
            >
              <FontAwesome5
                name={isNewPasswordVisible ? "eye" : "eye-slash"}
                size={18}
                color="#bdbdbd"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    paddingHorizontal: width * 0.05,
    justifyContent: "center",
  },
  headerText: {
    fontSize: width * 0.06,
    color: Color,
    fontWeight: fontWeight,
    textAlign: "center",
    marginBottom: height * 0.04,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.045,
    color: Color,
    marginBottom: height * 0.01,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.04,
    borderWidth: 1,
    borderColor: "#333",
  },
  input: {
    flex: 1,
    color: Color,
    fontSize: width * 0.04,
    paddingVertical: height * 0.015,
  },
  eyeIcon: {
    marginLeft: width * 0.02,
  },
  forgotPasswordText: {
    color: "#888",
    fontSize: width * 0.04,
    textAlign: "right",
    marginTop: height * 0.01,
    marginBottom: height * 0.04,
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    alignItems: "center",
  },
  saveButtonText: {
    color: Color,
    fontSize: width * 0.045,
    fontWeight: fontWeight,
  },
});

export default ChangePasswordScreen;
