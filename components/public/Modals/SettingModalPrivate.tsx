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
import CustomAlert from "@/components/genaral/alert/CustomAlert";
import useLogout from "@/hooks/useLogout";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackType } from "@/utils/types/MainStackType";

const { width, height } = Dimensions.get("window");

interface SettingModalPrivateProps {
  visible: boolean;
  onClose: () => void;
}

const SettingModalPrivate = ({
  visible,
  onClose,
}: SettingModalPrivateProps) => {
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const styles = getStyle(isDarkMode);
  const { logout, isLoading } = useLogout();
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => logout() }, // Gọi hàm logout khi nhấn
      ],
      { cancelable: true }
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      style={{ zIndex: 1000 }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Setting</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
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
              disabled={isLoading} // Disable khi đang tải
            >
              <FontAwesome
                name="sign-out"
                size={buttonFontsize}
                color={"rgb(253, 0, 0)"}
              />
              <Text style={styles.txtLogout}>
                {isLoading ? "Logging out..." : "Logout"}
                {/* Hiển thị trạng thái */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onConfirm={() => setAlertVisible(false)}
        />
      </View>
    </Modal>
  );
};

const getStyle = (isDarkMode: any) =>
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
    input: {
      backgroundColor: isDarkMode ? "#2C2C2E" : "#E0E0E0",
      padding: height * 0.012,
      borderRadius: 8,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
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
