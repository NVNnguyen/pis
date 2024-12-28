import React, { useState } from "react";
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
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/MainStack";
import { backgroundColor, Color, fontWeight } from "../../../styles/color";
import CustomAlert from "@/components/alert/CustomAlert";
import { login } from "@/api/authAPI/loginAPI";
import { saveToken } from "@/utils/storage";
import LoadingScreen from "./LoadingScreen";

const { width, height } = Dimensions.get("window"); // Get device dimensions

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Login">>();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (username.trim() === "") {
      setAlertMessage("Username cannot be empty!");
      setAlertVisible(true);
      return;
    }

    if (!passwordRegex.test(password)) {
      setAlertMessage(
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character!"
      );
      setAlertVisible(true);
      return;
    }
    setLoading(true);
    try {
      // const credentials = { username, password };
      // const response = await login(credentials);

      // // Lưu token vào AsyncStorage
      // // await saveToken(response.token);
      navigation.replace("FriendMode");
      // Điều hướng đến trang chủ
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Invalid email or password");
    } finally {
      setLoading(false);
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
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#9E9E9E"
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor="#9E9E9E"
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FontAwesome
              name={isPasswordVisible ? "eye" : "eye-slash"}
              size={20}
              color="#9E9E9E"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
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
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPasswordSelection")}
        >
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <Text style={styles.signInWith}>Sign in with</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="apple" size={20} color={Color} />
            <Text style={styles.socialText}>Apple ID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={20} color={Color} />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>Register an account</Text>
        </TouchableOpacity>

        {/* Custom Alert */}
        <CustomAlert
          visible={alertVisible}
          title="Error"
          message={alertMessage}
          onConfirm={handleOnConfirm}
        />
        {loading ? <LoadingScreen /> : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    padding: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.08, // Dynamic font size
    color: Color,
    marginBottom: height * 0.02,
    fontWeight: fontWeight,
  },
  label: {
    color: Color,
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    marginBottom: height * 0.01,
    fontSize: width * 0.045,
  },
  input: {
    backgroundColor: "#2C2C2E",
    width: "100%",
    height: height * 0.065,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: Color,
    marginBottom: height * 0.02,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    width: "100%",
    height: height * 0.065,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: height * 0.02,
  },
  inputPassword: {
    flex: 1,
    color: Color,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  checkboxText: {
    color: Color,
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
  },
  button: {
    backgroundColor: "#000",
    width: "100%",
    height: height * 0.065,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  buttonText: {
    color: Color,
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#9E9E9E",
    marginBottom: height * 0.03,
    fontSize: width * 0.04,
    textDecorationLine: "underline",
  },
  signInWith: {
    color: "#9E9E9E",
    fontSize: width * 0.045,
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
    color: Color,
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
  },
  registerText: {
    color: Color,
    fontSize: width * 0.04,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
