import authApi from "@/api/authAPI";
import CustomAlert from "@/components/genaral/alert/CustomAlert";
import { useTheme } from "@/contexts/ThemeContext";
import { buttonBlueColor, grey } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { RootStackParamList } from "@/utils/types/MainStackType";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
type RouteParams = {
  params: {
    email: string;
  };
};
const { width, height } = Dimensions.get("window");
const OtpScreen = () => {
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [otp, setOtp] = useState<number>(0);
  const route = useRoute<RouteProp<RouteParams>>();
  const email = route.params?.email;
  const handleChange = (text: string) => {
    // Allow only numbers and limit input to 6 digits
    const formattedText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(Number(formattedText));
  };
  const handleSendOtp = async () => {
    try {
      if (!isLoading) {
        const response = await authApi.resetPassword(email, otp);
        console.log(response?.data);
        if (response?.data?.exceedTime === true) {
          console.log(response?.data?.exceedTime);
          setAlertMessage("OTP has expired!");
          setAlertVisible(true);
        } else if (response?.data?.valid === false) {
          setAlertMessage("Invalid OTP! Please enter again!");
          setAlertVisible(true);
        } else {
          navigation.navigate("ResetPassword", { email: email });
        }
      }
    } catch (error) {
      setAlertMessage("Invalid OTP! Please enter again!");
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.suggestTxt}>Please enter OTP to continue!</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        onChangeText={handleChange}
        placeholder="Enter 6-digit OTP"
        placeholderTextColor={grey}
      />
      <TouchableOpacity
        style={styles.button}
        disabled={otp.toString().length !== 6}
        onPress={handleSendOtp}
      >
        <Text style={styles.buttonText}>Next</Text>
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
  );
};
const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: width * 0.02,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    title: {
      fontSize: width * 0.09,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    input: {
      borderWidth: 1,
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      padding: width * 0.03,
      width: "80%",
      textAlign: "center",
      fontSize: width * 0.05,
      borderRadius: width * 0.02,
      marginBottom: height * 0.02,
      color: isDarkMode ? lightTheme.text : darkTheme.text,
    },
    button: {
      backgroundColor: buttonBlueColor,
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.05,
      borderRadius: 5,
    },
    buttonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: width * 0.05,
    },
    suggestTxt: {
      color: grey,
      fontSize: width * 0.04,
      marginBottom: height * 0.02,
    },
  });

export default OtpScreen;
