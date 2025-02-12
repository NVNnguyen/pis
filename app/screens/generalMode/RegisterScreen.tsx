import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
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
import { Color } from "../../../styles/color";
import CustomAlert from "@/components/alert/CustomAlert";
import authApi from "@/api/authAPI/authAPI";
import { RootStackParamList } from "@/navigation/MainStack";

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handelRegister = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

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

    // if (!passwordRegex.test(password)) {
    //   setAlertMessage(
    //     "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character!"
    //   );
    //   setAlertVisible(true);
    //   return;
    // }
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
      const response = await authApi.register(
        email,
        firstName,
        lastName,
        password
      );
      Alert.alert("Register successfully", "Please login to continue!");
      navigation.navigate("Login"); // Chuyển hướng sau khi đăng ký thành công
    } catch (error) {
      Alert.alert("Register error", "Email or password is incorrect!");
      console.log(error);
    }
  };

  const handleOnConfirm = () => {
    setAlertVisible(false);
    // Cho phép tiếp tục nhập thông tin
    console.log("User confirmed the alert!");
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
            onConfirm={handleOnConfirm}
          />
        </View>
      </View>
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
