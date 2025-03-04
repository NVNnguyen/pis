import authApi from "@/api/authAPI";
import CustomAlert from "@/components/genaral/alert/CustomAlert";
import { useTheme } from "@/contexts/ThemeContext";
import {
  buttonFontsize,
  fontWeight,
  textFontSize,
  titleFontsize,
} from "@/styles/stylePrimary";
import { grey } from "@/utils/colorPrimary";
import { emailRegex } from "@/utils/regex";
import { darkTheme, lightTheme } from "@/utils/themes";
import { MainStackType } from "@/utils/types/MainStackType";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

type ForgotPasswordScreenNavigationProp =
  StackNavigationProp<MainStackType>;

const { width, height } = Dimensions.get("window"); // Get screen dimensions
const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [isLoading, setIsLoading] = useState(false);
  const handleVerifyEmail = async () => {
    if (email.trim() === "") {
      setAlertMessage("Please enter email!");
      setAlertVisible(true);
      return;
    }
    if (!emailRegex.test(email.toLowerCase().trim())) {
      setAlertMessage("Invalid email format! Please enter a valid email.");
      setAlertVisible(true);
      return;
    }
    setIsLoading(true);
    try {
      if (!isLoading) {
        const response = await authApi.forgotPassword(
          email.trim().toLocaleLowerCase()
        );
        if (response?.data?.existAccount == true) {
          navigation.navigate("Otp", {
            email: email.trim().toLocaleLowerCase(),
          });
        }
        if (!response.data)
          throw new Error("This email has not been created account yet");
      }
    } catch (error) {
      setAlertMessage("This email has not been created account yet!");
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Enter Email</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Please enter email to receive OTP!</Text>
        {/* Email Option */}
        <View style={styles.optionButton}>
          <MaterialIcons
            name="email"
            size={24}
            color={isDarkMode ? lightTheme.text : darkTheme.text}
          />
          <TextInput
            style={styles.optionText}
            placeholder="Enter email!"
            onChangeText={(text) => setEmail(text)}
            placeholderTextColor={grey}
            keyboardType="email-address"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss} // Ẩn bàn phím khi nhấn "Done"
          />
        </View>

        {/* Custom Alert */}
        <TouchableOpacity style={styles.nextButton} onPress={handleVerifyEmail}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>

        <CustomAlert
          visible={alertVisible}
          title="Error"
          message={alertMessage}
          onConfirm={() => {
            setAlertVisible(false);
          }}
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
      alignItems: "center",
    },
    title: {
      fontSize: titleFontsize, // Responsive font size
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontWeight: fontWeight,
      textAlign: "center",
      marginTop: height * 0.15,
    },
    subtitle: {
      fontSize: textFontSize,
      color: grey,
      textAlign: "center",
      marginTop: height * 0.04,
      marginBottom: height * 0.07,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      width: width * 0.95,
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background, // Light gray background
      borderRadius: width * 0.03,
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.04,
      marginBottom: height * 0.04,
    },
    optionText: {
      fontSize: textFontSize,
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      marginLeft: width * 0.03,
      width: width,
    },
    nextButton: {
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      height: height * 0.05,
      width: width * 0.4,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: width * 0.03,
    },
    nextButtonText: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontWeight: fontWeight,
      fontSize: buttonFontsize,
    },
  });

export default ForgotPasswordScreen;
