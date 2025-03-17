import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  buttonFontsize,
  fontWeight,
  textFontSize,
  titleFontsize,
} from "../../../styles/stylePrimary";
import CustomAlert from "@/components/genaral/alert/CustomAlert";
import { emailRegex } from "@/utils/regex";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainStackType } from "@/utils/types/MainStackType";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { FontAwesome } from "@expo/vector-icons";
import { darkThemeInput, grey, lightThemeInput } from "@/utils/colorPrimary";
import useLogin from "@/hooks/useLogin";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };
  const login = useLogin(navigation);
  const handleLogin = async () => {
    const trimmedEmail = email.toLowerCase().trim();
    if (!trimmedEmail) {
      showAlert("Please enter email or phone number!");
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      showAlert("Invalid email format! Please enter a valid email.");
      return;
    }
    if (email && password) {
      login.login({ email: trimmedEmail, password: password });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={grey}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor={grey}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FontAwesome
              name={isPasswordVisible ? "eye" : "eye-slash"}
              size={20}
              color={grey}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, login.isLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={login.isLoading}
        >
          {login.isLoading ? (
            <ActivityIndicator
              size="small"
              color={isDarkMode ? lightTheme.text : darkTheme.text}
            />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Register an account</Text>
        </TouchableOpacity>

        <CustomAlert
          visible={alertVisible}
          title="Error"
          message={alertMessage}
          onConfirm={() => setAlertVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      padding: width * 0.05,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: titleFontsize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.02,
      fontWeight: fontWeight,
    },
    label: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      alignSelf: "flex-start",
      marginLeft: width * 0.05,
      marginBottom: height * 0.01,
      fontSize: textFontSize,
    },
    input: {
      backgroundColor: isDarkMode ? darkThemeInput : lightThemeInput,
      width: "100%",
      height: height * 0.065,
      borderRadius: 10,
      paddingHorizontal: width * 0.015,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.02,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? darkThemeInput : lightThemeInput,
      width: "100%",
      height: height * 0.065,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: height * 0.02,
    },
    inputPassword: {
      flex: 1,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    button: {
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      width: "100%",
      height: height * 0.065,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: height * 0.02,
    },
    buttonText: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontSize: buttonFontsize,
      fontWeight: fontWeight,
    },
    forgotPassword: {
      color: grey,
      marginBottom: height * 0.03,
      fontSize: textFontSize,
      textDecorationLine: "underline",
    },
    registerText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
      textDecorationLine: "underline",
      marginBottom: height * 0.14,
    },
  });

export default LoginScreen;
