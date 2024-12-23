import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Color } from "../../../styles/color";
import CustomAlert from "@/components/alert/CustomAlert";

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleLogin = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    if (username.trim() === "") {
      setAlertMessage("Username cannot be empty!");
      setAlertVisible(true);
      return;
    }

    if (emailOrPhone.trim() === "") {
      setAlertMessage("Please enter email or phone number!");
      setAlertVisible(true);
      return;
    }
    if (!emailRegex.test(emailOrPhone.trim())) {
      setAlertMessage("Invalid email format! Please enter a valid email.");
      setAlertVisible(true);
      return;
    }

    if (!passwordRegex.test(password)) {
      setAlertMessage(
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character!"
      );
      setAlertVisible(true);
      return;
    }
    if (password.trim() === "") {
      setAlertMessage("Please enter password!");
      setAlertVisible(true);
      return;
    }
    if (rePassword.trim() === null) {
      setAlertMessage("Please enter re-enter password!");
      setAlertVisible(true);
      return;
    }
    if (rePassword != password) {
      setAlertMessage("Passwords do not match! Please re-enter!");
      setAlertVisible(true);
      return;
    }
  };
  const handleOnConfirm = () => {
    setAlertVisible(false);
    // Cho phép tiếp tục nhập thông tin
    console.log("User confirmed the alert!");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.registerBox}>
          <Text style={styles.title}>Register an account</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#bdbdbd"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Email or Phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="Email or Phone number"
            placeholderTextColor="#bdbdbd"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#bdbdbd"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Re-enter password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter password"
            placeholderTextColor="#bdbdbd"
            secureTextEntry
            value={rePassword}
            onChangeText={setRePassword}
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          {/* Custom Alert */}
          <CustomAlert
            visible={alertVisible}
            title="Error"
            message={alertMessage}
            onConfirm={handleOnConfirm}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  registerBox: {
    width: "100%",
    maxWidth: width * 0.85,
    backgroundColor: Color,
    borderRadius: width * 0.05,
    padding: width * 0.05,
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: "#000",
  },
  label: {
    fontSize: width * 0.045,
    alignSelf: "flex-start",
    color: "#000",
    marginBottom: height * 0.01,
  },
  input: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    marginBottom: height * 0.02,
    color: "#000",
    fontSize: width * 0.045,
  },
  registerButton: {
    backgroundColor: "#000",
    paddingVertical: height * 0.02,
    borderRadius: width * 0.03,
    width: "100%",
    alignItems: "center",
    marginTop: height * 0.03,
  },
  registerButtonText: {
    color: Color,
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
});

export default RegisterScreen;
