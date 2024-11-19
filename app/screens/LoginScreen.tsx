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
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import CheckBox from "expo-checkbox";
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
                size={18}
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
            <Text style={styles.rememberText}>Remember me ?</Text>
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
              <FontAwesome name="apple" size={24} color="black" />
              <Text style={styles.socialButtonText}>Apple ID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="google" size={24} color="black" />
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
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    color: "#000",
    marginBottom: 5,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: "#000",
  },
  eyeIcon: {
    padding: 5,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 8,
  },
  rememberText: {
    color: "#000",
  },
  signInButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  forgotText: {
    color: "#000",
    marginBottom: 15,
    textDecorationLine: "underline",
  },
  socialSignInText: {
    color: "#666",
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "45%",
    justifyContent: "center",
  },
  socialButtonText: {
    marginLeft: 8,
    color: "#000",
  },
  registerText: {
    color: "#000",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
