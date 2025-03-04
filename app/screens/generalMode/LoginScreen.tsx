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
  Alert,
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
import { useMutation } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import { darkThemeInput, grey, lightThemeInput } from "@/utils/colorPrimary";
import authAPI from "@/api/authAPI";
import { getDecodedToken } from "@/utils/decodeToken";

const { width, height } = Dimensions.get("window"); // Get device dimensions

const LoginScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
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
    loginMutation.mutate({ email: trimmedEmail, password });
  };

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await authAPI.login(credentials.email, credentials.password);
    },
    onSuccess: async (response) => {
      getDecodedToken(response?.data?.token);
      await AsyncStorage.setItem("token", response?.data?.token);

      console.log("login successfully!");
      navigation.navigate("PublicMode"); // Chuyển hướng sau khi đăng nhập thành công
    },
    onError: () => {
      showAlert("Email or password is incorrect!");
    },
  });
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
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

        {/* <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsChecked(!isChecked)}
        >
          {isChecked ? (
            <MaterialIcons name="check-box" size={24} color={Color} />
          ) : (
            <MaterialIcons
              name="check-box-outline-blank"
              size={24}
              color={Color}
            />
          )}
          <Text style={styles.checkboxText}>Remember me</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        {/* <Text style={styles.signInWith}>Sign in with</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="apple" size={20} color={Color} />
            <Text style={styles.socialText}>Apple ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={20} color={Color} />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Register an account</Text>
        </TouchableOpacity>

        {/* Custom Alert */}
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
      fontSize: titleFontsize, // Dynamic font size
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
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: height * 0.02,
    },
    checkboxText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginLeft: width * 0.02,
      fontSize: textFontSize,
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
    signInWith: {
      color: grey,
      fontSize: textFontSize,
      marginBottom: height * 0.01,
    },
    socialButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginBottom: height * 0.02,
    },
    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#000",
      borderRadius: 10,
      padding: width * 0.03,
      paddingHorizontal: width * 0.07,
    },
    socialText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginLeft: width * 0.02,
      fontSize: textFontSize,
    },
    registerText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
      textDecorationLine: "underline",
      marginBottom: height * 0.14,
    },
  });

export default LoginScreen;
