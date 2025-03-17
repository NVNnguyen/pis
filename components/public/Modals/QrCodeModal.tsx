import React, { useCallback, useMemo, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { MaterialIcons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system"; // Thêm để xử lý tệp
import QRCode from "react-native-qrcode-svg"; // Thêm thư viện QR code

const { width, height } = Dimensions.get("window");

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  qrValue: string;
}

const QrCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
  username,
  firstName,
  lastName,
  avatar,
  qrValue,
}) => {
  const { isDarkMode } = useTheme();
  const styles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);
  const qrRef = useRef<any>(null); // Ref cho QRCode component

  // Tính toán kích thước responsive
  const qrSize = Math.min(width * 0.7, height * 0.4);
  const avatarSize = qrSize * 0.3;

  // Chia sẻ QR Code dưới dạng hình ảnh
  const handleShareQR = useCallback(async () => {
    try {
      if (!qrRef.current) {
        Alert.alert("Error", "QR Code is not ready.");
        return;
      }

      // Kiểm tra khả năng chia sẻ
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "Sharing is not available on this device");
        return;
      }

      // Lấy dữ liệu base64 từ QR code
      qrRef.current.toDataURL(async (base64: string) => {
        const fileUri = `${FileSystem.cacheDirectory}qrcode.png`;
        // Ghi dữ liệu base64 thành tệp tạm thời
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Chia sẻ tệp
        await Sharing.shareAsync(fileUri, {
          mimeType: "image/png",
          dialogTitle: "Share QR Code",
        });
      });
    } catch (error) {
      console.error("Error sharing QR Code:", error);
      Alert.alert("Error", "Failed to share QR Code");
    }
  }, []);

  // Sao chép và chia sẻ liên kết hoặc ảnh
  const handleCopyLink = useCallback(async () => {
    try {
      if (!qrRef.current) {
        Alert.alert("Error", "QR Code is not ready.");
        return;
      }

      // Lấy dữ liệu base64 từ QR code
      qrRef.current.toDataURL(async (base64: string) => {
        const fileUri = `${FileSystem.cacheDirectory}qrcode.png`;
        await FileSystem.writeAsStringAsync(fileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Chia sẻ qua ứng dụng khác
        await Share.share({
          url: fileUri,
          message: "Here is my QR Code to add friend on pis app!",
        });

        Alert.alert("Success", "QR Code image copied and ready to share!");
      });
    } catch (error) {
      console.error("Error copying QR Code image:", error);
      Alert.alert("Error", "Failed to copy QR Code image");
    }
  }, []);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Nút đóng */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons
              name="close"
              size={width * 0.06}
              color={isDarkMode ? darkTheme.text : lightTheme.text}
            />
          </TouchableOpacity>

          {/* Thông tin người dùng */}
          <Text style={styles.fullname}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.username}>@{username}</Text>

          {/* QR Code với Avatar ở giữa */}
          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue} // Giá trị QR code (URL hoặc dữ liệu)
              size={height * 0.25} // Kích thước QR code
              getRef={(ref) => (qrRef.current = ref)} // Lấy ref để xử lý
            />
            <Image
              source={{ uri: avatar }}
              style={styles.smallImage}
              resizeMode="cover"
            />
          </View>

          {/* Nút Share và Copy */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShareQR}
            >
              <MaterialIcons
                name="share"
                size={width * 0.06}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCopyLink}
            >
              <MaterialIcons
                name="content-copy"
                size={width * 0.06}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
              <Text style={styles.buttonText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: width * 0.85,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: 15,
      padding: width * 0.05,
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    closeButton: {
      position: "absolute",
      top: width * 0.02,
      right: width * 0.02,
    },
    fullname: {
      fontSize: width * 0.05,
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.01,
    },
    username: {
      fontSize: width * 0.04,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: height * 0.03,
    },
    qrContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: height * 0.03,
    },
    smallImage: {
      position: "absolute",
      width: height * 0.1,
      height: height * 0.1,
      borderRadius: height * 0.05, // Bo tròn avatar
      borderWidth: 2,
      borderColor: isDarkMode ? darkTheme.background : lightTheme.background,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: width * 0.03,
      backgroundColor: isDarkMode ? "#444" : "#EEE",
      borderRadius: 8,
    },
    buttonText: {
      fontSize: width * 0.04,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginLeft: width * 0.02,
    },
  });

export default QrCodeModal;
