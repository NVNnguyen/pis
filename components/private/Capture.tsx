import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import {
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";
import { captureImage, toggleCameraFacing } from "@/utils/friendModeHandel";
import {  Color, fontWeight } from "@/styles/stylePrimary";

const { width, height } = Dimensions.get("window");

const CapTure = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
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

  return (
    <View style={styles.container}>
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
              color={Color}
            />
          </TouchableOpacity>
        </CameraView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="mic" size={width * 0.08} color={Color} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={() => captureImage(cameraRef)}
        >
          <View style={styles.captureInner}></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="image" size={width * 0.08} color={Color} />
        </TouchableOpacity>
      </View>

      {/* Memories */}
      <TouchableOpacity style={styles.memoriesButton}>
        <Text style={styles.memoriesText}>Memories</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    justifyContent: "space-between",
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
  },
  notification: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#f00",
    color: Color,
    borderRadius: 10,
    paddingHorizontal: width * 0.01,
    fontSize: width * 0.03,
    fontWeight: fontWeight,
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
    top: height * 0.01,
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
    backgroundColor: Color,
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
    color: Color,
    fontSize: width * 0.045,
  },
});

export default CapTure;
