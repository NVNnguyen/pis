import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import CheckBox from "expo-checkbox";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isRememberMe, setRememberMe] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.loginBox}>
          <Text style={styles.title}>Login</Text>

          {/* Username Input */}
          <Text style={styles.label}>User name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="User name"
              placeholderTextColor="#bdbdbd"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#bdbdbd"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!isPasswordVisible)}
            >
              <FontAwesome5
                name={isPasswordVisible ? "eye" : "eye-slash"}
                size={width * 0.045}
                color="#bdbdbd"
              />
            </TouchableOpacity>
          </View>

          {/* Remember Me Checkbox */}
          <View style={styles.rememberContainer}>
            <CheckBox
              value={isRememberMe}
              onValueChange={setRememberMe}
              style={styles.checkbox}
            />
            <Text style={styles.rememberText}>Remember me?</Text>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Social Login */}
          <Text style={styles.socialSignInText}>Sign in with</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={width * 0.06} color="black" />
              <Text style={styles.socialButtonText}>Apple ID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="google" size={width * 0.06} color="black" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>Register an account</Text>
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
  },
  loginBox: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: width * 0.05,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: height * 0.03,
    color: "#000",
  },
  label: {
    fontSize: width * 0.045,
    alignSelf: "flex-start",
    color: "#000",
    marginBottom: height * 0.01,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: width * 0.03,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
  },
  input: {
    flex: 1,
    paddingVertical: height * 0.015,
    color: "#000",
    fontSize: width * 0.045,
  },
  eyeIcon: {
    marginLeft: width * 0.02,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.03,
  },
  checkbox: {
    marginRight: width * 0.03,
    width: width * 0.045,
    height: width * 0.045,
  },
  rememberText: {
    color: "#000",
    fontSize: width * 0.045,
  },
  signInButton: {
    backgroundColor: "#000",
    paddingVertical: height * 0.02,
    borderRadius: width * 0.03,
    width: "100%",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  forgotText: {
    color: "#000",
    marginBottom: height * 0.03,
    fontSize: width * 0.045,
    textDecorationLine: "underline",
  },
  socialSignInText: {
    color: "#666",
    marginBottom: height * 0.015,
    fontSize: width * 0.045,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: height * 0.03,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: width * 0.03,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    width: "45%",
    justifyContent: "center",
  },
  socialButtonText: {
    marginLeft: width * 0.03,
    color: "#000",
    fontSize: width * 0.04,
  },
  registerText: {
    color: "#000",
    fontSize: width * 0.045,
    textDecorationLine: "underline",
    marginTop: height * 0.02,
  },
});

export default LoginScreen;
