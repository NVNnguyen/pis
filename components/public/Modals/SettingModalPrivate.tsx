import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  buttonFontsize,
  fontWeight,
  textFontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import useLogout from "@/hooks/useLogout";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackType } from "@/utils/types/MainStackType";
import useGenerateAndUploadQR from "@/hooks/useGenerateAndUploadQR";
import useUserInfo from "@/hooks/useUserInfo";
import QrCodeModal from "./QrCodeModal";
import QRCode from "react-native-qrcode-svg";

const { width, height } = Dimensions.get("window");

interface SettingModalPrivateProps {
  visible: boolean;
  onClose: () => void;
  userId: number;
}

const SettingModalPrivate = ({
  visible,
  onClose,
  userId,
}: SettingModalPrivateProps) => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState<boolean>(false);
  const styles = getStyle(isDarkMode);
  const { logout, isLoading } = useLogout();
  const {
    qrValue,
    setQrValue,
    isLoading: qrLoading,
    error,
    uploadedUrl,
    generateQRForUser,
    qrRef,
  } = useGenerateAndUploadQR(userId);
  const { userInfo, isUserLoading } = useUserInfo(userId);

  // Sau khi capture và upload lên server, uploadedUrl sẽ được set
  // và khi uploadedUrl thay đổi, useEffect này sẽ mở modal hiển thị QR Code.
  useEffect(() => {
    if (uploadedUrl) {
      setQrCodeModalVisible(true);
    }
  }, [uploadedUrl]);

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout() },
    ]);
  };

  const handleShareQRCode = async () => {
    // Nếu userInfo.qrCode === null, tức chưa có QR code trên server thì tạo mới.
    if (userInfo?.qrCode === null) {
      try {
        await generateQRForUser();
      } catch (err) {
        Alert.alert("Error", "Failed to generate QR Code");
      }
    } else {
      // Nếu đã có QR code từ server thì chỉ cần hiển thị modal.
      setQrCodeModalVisible(true);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        {/* View ẩn dùng để render QRCode và hỗ trợ capture qua captureRef */}
        <View style={{ position: "absolute", left: -1000, top: -1000 }}>
          <QRCode
            value={qrValue || " "}
            size={200}
            getRef={(ref) => (qrRef.current = ref)}
          />
        </View>

        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Setting</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={handleShareQRCode}
              disabled={qrLoading || isUserLoading}
            >
              <Ionicons
                name="qr-code"
                size={buttonFontsize}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
              <Text style={styles.label}>Share QR code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => {
                navigation.navigate("BlockList");
                onClose();
              }}
            >
              <FontAwesome5
                name="users-slash"
                size={buttonFontsize}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
              <Text style={styles.label}>Blocked list</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnLogout}
              onPress={handleLogout}
              disabled={isLoading}
            >
              <FontAwesome
                name="sign-out"
                size={buttonFontsize}
                color="rgb(253, 0, 0)"
              />
              <Text style={styles.txtLogout}>
                {isLoading ? "Logging out..." : "Logout"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {userInfo && (
          <QrCodeModal
            visible={qrCodeModalVisible}
            onClose={() => setQrCodeModalVisible(false)}
            qrValue={userInfo.qrCode || uploadedUrl}
            firstName={userInfo.firstName}
            lastName={userInfo.lastName}
            username={userInfo.username}
            avatar={userInfo.avatar}
          />
        )}
      </View>
    </Modal>
  );
};

const getStyle = (isDarkMode: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: width * 0.9,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: 15,
      padding: width * 0.05,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#444",
      paddingBottom: height * 0.015,
    },
    cancelText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
    },
    headerTitle: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
      fontWeight: "bold",
    },
    doneText: {
      color: "#1E90FF",
      fontSize: textFontSize,
    },
    profileSection: {
      marginTop: height * 0.02,
    },
    inputContainer: {
      marginBottom: height * 0.015,
      flexDirection: "row",
      alignItems: "center",
    },
    label: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      marginLeft: width * 0.08,
      fontWeight: fontWeight,
      textDecorationLine: "underline",
    },
    btnLogout: {
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    txtLogout: {
      color: "rgb(253, 0, 0)",
      fontSize: textFontSize,
      fontWeight: fontWeight,
      textDecorationLine: "underline",
      marginLeft: width * 0.01,
    },
  });

export default SettingModalPrivate;
