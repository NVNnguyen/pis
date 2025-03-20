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
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { MaterialIcons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

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

  const handleShare = useCallback(async () => {
    try {
      if (!qrValue) {
        Alert.alert("Error", "QR code image is missing.");
        return;
      }

      // Tải ảnh QR về bộ nhớ tạm của thiết bị
      const fileUri = `${FileSystem.cacheDirectory}qr_code.png`;
      const { uri } = await FileSystem.downloadAsync(qrValue, fileUri);

      // Kiểm tra xem thiết bị có hỗ trợ chia sẻ không
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Sharing is not available on this device.");
        return;
      }

      // Chia sẻ ảnh QR
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error sharing QR code:", error);
      Alert.alert("Error", "Failed to share QR code.");
    }
  }, [qrValue]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons
              name="close"
              size={width * 0.06}
              color={isDarkMode ? darkTheme.text : lightTheme.text}
            />
          </TouchableOpacity>

          <Text style={styles.fullname}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.username}>@{username}</Text>

          <View style={styles.qrContainer}>
            <Image source={{ uri: qrValue }} style={styles.qrImage} />
            <Image
              source={{ uri: avatar }}
              style={styles.smallImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <MaterialIcons
                name="share"
                size={width * 0.06}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
              <Text style={styles.buttonText}>Share</Text>
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
      width: height * 0.05,
      height: height * 0.05,
      borderRadius: height * 0.025,
      borderWidth: 2,
      borderColor: isDarkMode ? darkTheme.background : lightTheme.background,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
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
    qrImage: {
      width: height * 0.25,
      height: height * 0.25,
    },
  });

export default QrCodeModal;
