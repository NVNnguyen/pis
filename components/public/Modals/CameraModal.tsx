import {
  backgroundColor,
  Color,
  fontWeight,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { captureImage, toggleCameraFacing } from "@/utils/friendModeHandel";
import {
  Entypo,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  Camera,
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
  PixelRatio,
} from "react-native";

interface CameraModalProp {
  visible: boolean;
  onClose: () => void;
  onCapture: (imageUri: string) => void;
}

const { width, height } = Dimensions.get("window");
const CameraModal = ({ visible, onCapture, onClose }: CameraModalProp) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [isFlash, setIsFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [resultImage, setResultImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission?.granted]);
  const toggleCameraFacing = (currentFacing: CameraType): CameraType =>
    currentFacing === "back" ? "front" : "back";
  const captureImageContainer = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        skipProcessing: true,
      });
      if (result?.uri) {
        setResultImage(result.uri);
        onCapture(result.uri); // 📸 Truyền ảnh ngay khi chụp
      }
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      style={styles.container}
    >
      <View style={styles.viewContainer}>
        <View style={styles.header}>
          {resultImage === null && isFlash === "off" && (
            <TouchableOpacity onPress={() => setIsFlash("on")}>
              <MaterialIcons
                name="flash-on"
                size={width * 0.08}
                color={Color}
              />
            </TouchableOpacity>
          )}
          {resultImage === null && isFlash === "on" && (
            <TouchableOpacity onPress={() => setIsFlash("off")}>
              <MaterialIcons
                name="flash-off"
                size={width * 0.08}
                color={Color}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.cameraContainer}>
          {resultImage === null && (
            <CameraView
              style={styles.cameraView}
              facing={facing}
              ref={cameraRef}
              flash={isFlash}
            ></CameraView>
          )}
          {resultImage && (
            <Image style={styles.cameraView} source={{ uri: resultImage }} />
          )}
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          {resultImage === null ? (
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setResultImage(null)}
              style={styles.iconButton}
            >
              <Text style={styles.cancelTxt}>Retake</Text>
            </TouchableOpacity>
          )}
          {resultImage === null && (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={captureImageContainer}
            >
              <View style={styles.captureInner}></View>
            </TouchableOpacity>
          )}
          {resultImage === null ? (
            <TouchableOpacity
              onPress={() => setFacing((prev) => toggleCameraFacing(prev))}
              style={styles.iconButton}
            >
              <MaterialCommunityIcons
                name="rotate-3d-variant"
                size={width * 0.08}
                color={Color}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (resultImage) {
                  onCapture(resultImage); // Gửi ảnh ra ngoài
                  onClose();
                }
              }}
              style={styles.iconButton}
            >
              <Text style={styles.cancelTxt}>Use Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  viewContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    justifyContent: "space-between",
    backgroundColor: "black",
  },
  header: {
    backgroundColor: "black",
    marginTop: height * 0.03,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cameraView: {
    width: width,
    height: "80%",
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
    paddingBottom: height * 0.05,
  },
  iconButton: {
    padding: width * 0.04,
    borderRadius: width * 0.1,
  },
  cancelTxt: {
    color: Color,
    fontSize: textPostFontSize,
  },
  captureButton: {
    width: width * 0.17,
    height: width * 0.17,
    borderRadius: (width * 0.17) / 2, // Đảm bảo hình tròn
    backgroundColor: Color,
    justifyContent: "center",
    alignItems: "center",
  },

  captureInner: {
    width: width * 0.15, // Nhỏ hơn một chút so với captureButton
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2, // Đảm bảo hình tròn
    backgroundColor: Color, // Sử dụng biến màu đúng
    borderColor: "black",
    borderWidth: 5,
  },
});

export default CameraModal;
