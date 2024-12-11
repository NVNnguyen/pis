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

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.registerBox}>
          <Text style={styles.title}>Register an account</Text>

          <Text style={styles.label}>User name</Text>
          <TextInput
            style={styles.input}
            placeholder="User name"
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

          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1e21",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  registerBox: {
    width: "100%",
    maxWidth: width * 0.85,
    backgroundColor: "#fff",
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
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
});

export default RegisterScreen;
