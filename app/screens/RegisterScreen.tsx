import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.registerBox}>
        <Text style={styles.title}>Register an account</Text>
        <Text style={styles.label}>User name</Text>
        <TextInput
          style={styles.input}
          placeholder="User name"
          placeholderTextColor="#bdbdbd"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email or Phone number</Text>
        <TextInput
          style={styles.input}
          placeholder="Email or Phone number"
          placeholderTextColor="#bdbdbd"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bdbdbd"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Re-enter password</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          placeholderTextColor="#bdbdbd"
          secureTextEntry
          value={rePassword}
          onChangeText={setRePassword}
        />

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1e21",
    justifyContent: "center",
    alignItems: "center",
  },
  registerBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
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
  input: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    color: "#000",
  },
  registerButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RegisterScreen;
