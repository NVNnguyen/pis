import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
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
  ScrollView,
  Alert,
} from "react-native";
import { backgroundColor, Color, fontWeight } from "../../../styles/color";
import CustomAlert from "@/components/genaral/alert/CustomAlert";
import { emailRegex } from "@/utils/regex";
import { RootStackParamList } from "@/utils/types/MainStackType";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import authApi from "@/api/authAPI";

type RouteParams = {
  params: {
    email: string;
  };
};

const { width, height } = Dimensions.get("window");

const ResetPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const route = useRoute<RouteProp<RouteParams>>();
  const emailProp = route.params?.email;
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const handleResetPassword = async () => {
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
    if (rePassword.trim() != password.trim()) {
      setAlertMessage("Passwords do not match! Please re-enter!");
      setAlertVisible(true);
      return;
    }
    try {
      if (!isLoading) {
        const response = await authApi.updatePassword(emailProp, password);
        navigation.navigate("Login");
      }
    } catch (error) {
      setAlertMessage("Reset-password failed");
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
              value={emailProp.trim()}
              editable={false} // Ngăn không cho nhập
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
              onPress={handleResetPassword}
            >
              <Text style={styles.registerButtonText}>Next</Text>
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
      fontSize: width * 0.06,
      fontWeight: fontWeight,
      marginBottom: height * 0.02,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    label: {
      fontSize: width * 0.045,
      alignSelf: "flex-start",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.01,
    },
    input: {
      width: "100%",
      backgroundColor: isDarkMode ? "#2C2C2E" : "#E0E0E0",
      borderRadius: width * 0.03,
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.015,
      marginBottom: height * 0.02,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.045,
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
      fontSize: width * 0.045,
    },
  });

export default ResetPasswordScreen;
