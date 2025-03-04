import React, { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import {
  backgroundColor,
  buttonFontsize,
  Color,
  fontWeight,
  textFontSize,
  titleFontsize,
} from "../../../styles/stylePrimary";
import CustomAlert from "@/components/genaral/alert/CustomAlert";
import { emailRegex } from "@/utils/regex";
import { MainStackType } from "@/utils/types/MainStackType";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import authAPI from "@/api/authAPI";
import { RFValue } from "react-native-responsive-fontsize";
import { darkThemeInput, lightThemeInput } from "@/utils/colorPrimary";

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isDarkMode } = useTheme();

  const styles = getStyles(isDarkMode);
  const handelRegister = async () => {
    if (email.trim() === "") {
      setAlertMessage("Please enter email or phone number!");
      setAlertVisible(true);
      return;
    }
    if (!emailRegex.test(email.toLowerCase().trim())) {
      setAlertMessage("Invalid email format! Please enter a valid email.");
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
    try {
      if (!isLoading) {
        const response = await authAPI.register(
          email,
          password,
          firstName,
          lastName
        );
        navigation.navigate("Login");
      }
    } catch (error) {
      setAlertMessage("Register failed!");
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.registerBox}>
          <Text style={styles.title}>Register an account</Text>
          <ScrollView
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#bdbdbd"
              value={email.trim()}
              onChangeText={setEmail}
            />
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              placeholderTextColor="#bdbdbd"
              value={firstName.trim()}
              onChangeText={setFirstName}
            />
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              placeholderTextColor="#bdbdbd"
              value={lastName.trim()}
              onChangeText={setLastName}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#bdbdbd"
              secureTextEntry
              value={password.trim()}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>Re-enter password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor="#bdbdbd"
              secureTextEntry
              value={rePassword.trim()}
              onChangeText={setRePassword}
            />

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handelRegister}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </ScrollView>
          {/* Custom Alert */}
          <CustomAlert
            visible={alertVisible}
            title="Error"
            message={alertMessage}
            onConfirm={() => {
              setAlertVisible(false);
            }}
          />
        </View>
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
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: width * 0.05,
    },
    registerBox: {
      width: "100%",
      maxWidth: width * 0.85,
      backgroundColor: isDarkMode ? "#202020" : "#F5F5F5",
      borderRadius: width * 0.05,
      padding: width * 0.05,
      alignItems: "center",
    },
    title: {
      fontSize: Math.min(RFValue(18, 680), 30),
      fontWeight: fontWeight,
      marginBottom: height * 0.02,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    label: {
      fontSize: textFontSize,
      alignSelf: "flex-start",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.01,
    },
    input: {
      width: "100%",
      backgroundColor: isDarkMode ? darkThemeInput : lightThemeInput,
      borderRadius: width * 0.03,
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.015,
      marginBottom: height * 0.02,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
    },
    registerButton: {
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      paddingVertical: height * 0.02,
      borderRadius: width * 0.03,
      width: "100%",
      alignItems: "center",
      marginTop: height * 0.03,
    },
    registerButtonText: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontWeight: fontWeight,
      fontSize: buttonFontsize,
    },
  });

export default RegisterScreen;
