import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { backgroundColor, Color, fontWeight } from "../../../styles/color";
import { useRoute, RouteProp } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import CustomAlert from "@/components/alert/CustomAlert";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const ForgotPasswordSelectionScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleVerifyEmail = () => {
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

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
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Make Selection</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Select which contact detail should we use to reset your password?
      </Text>

      {/* Email Option */}
      <TouchableOpacity
        style={styles.optionButton}
        // onPress={() => navigation.navigate("NewCredentials")}
      >
        <MaterialIcons name="email" size={24} color="#000" />
        <TextInput style={styles.optionText} placeholder="Enter email!" />
      </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor, // Dark background
    padding: width * 0.05, // Responsive padding
  },
  title: {
    fontSize: width * 0.07, // Responsive font size
    color: Color,
    fontWeight: fontWeight,
    textAlign: "center",
    marginTop: height * 0.15,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: "#B0B0B0",
    textAlign: "center",
    marginTop: height * 0.04,
    marginBottom: height * 0.07,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0", // Light gray background
    borderRadius: width * 0.03,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.04,
  },
  optionText: {
    fontSize: width * 0.045,
    color: "#000",
    marginLeft: width * 0.03,
  },
});

export default ForgotPasswordSelectionScreen;
