import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";
import { toggleCameraFacing, captureImage } from "../utils/friendModeHandel"; // Import functions

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [toggleOption, setToggleOption] = useState("Friends");

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <Text>Requesting camera permissions...</Text>;
  }

  if (!permission.granted) {
    return <Text>Camera permissions are required to use this app.</Text>;
  }

  const handleToggle = (option: string) => setToggleOption(option);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.avatar}
          />
          <View style={styles.toggleSwitch}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                toggleOption === "Friends" && styles.activeButton,
              ]}
              onPress={() => handleToggle("Friends")}
            >
              <Text
                style={[
                  styles.toggleText,
                  toggleOption === "Friends" && styles.activeText,
                ]}
              >
                Friends
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                toggleOption === "Public" && styles.activeButton,
              ]}
              onPress={() => handleToggle("Public")}
            >
              <Text
                style={[
                  styles.toggleText,
                  toggleOption === "Public" && styles.activeText,
                ]}
              >
                Public
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notification}>
            <FontAwesome name="bell" size={width * 0.06} color="#fff" />
            <Text style={styles.notificationBadge}>4</Text>
          </TouchableOpacity>
        </View>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <CameraView style={styles.cameraView} facing={facing} ref={cameraRef}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => setFacing(toggleCameraFacing(facing))}
            >
              <MaterialIcons
                name="flip-camera-ios"
                size={width * 0.08}
                color="#fff"
              />
            </TouchableOpacity>
          </CameraView>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="mic" size={width * 0.08} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={() => captureImage(cameraRef)}
          >
            <View style={styles.captureInner}></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="image" size={width * 0.08} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Memories */}
        <TouchableOpacity style={styles.memoriesButton}>
          <Text style={styles.memoriesText}>Memories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
  },
  toggleSwitch: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    alignItems: "center",
  },
  toggleButton: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 12,
  },
  toggleText: {
    color: "#fff",
    fontSize: width * 0.04,
  },
  activeButton: {
    backgroundColor: "#fff",
  },
  activeText: {
    color: "#121212",
  },
  notification: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#f00",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: width * 0.01,
    fontSize: width * 0.03,
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 30,
  },
  cameraView: {
    width: width,
    height: "80%",
    borderRadius: 30,
    overflow: "hidden",
  },
  refreshButton: {
    position: "absolute",
    top: height * 0.1,
    right: width * 0.05,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.08,
  },
  iconButton: {
    padding: width * 0.04,
    borderRadius: width * 0.1,
  },
  captureButton: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: "#000",
  },
  memoriesButton: {
    alignSelf: "center",
    padding: height * 0.01,
  },
  memoriesText: {
    color: "#fff",
    fontSize: width * 0.045,
  },
});

export default LoginScreen;
