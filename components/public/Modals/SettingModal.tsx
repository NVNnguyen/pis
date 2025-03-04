import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { OPENSANS_REGULAR } from "@/utils/const";
import { fontWeight, textFontSize } from "@/styles/stylePrimary";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { useQueryClient } from "@tanstack/react-query";
import { emailRegex } from "@/utils/regex";
import CustomAlert from "@/components/genaral/alert/CustomAlert";
import { getToken } from "@/utils/storage";
import useLogout from "@/hooks/useLogout";

const { width, height } = Dimensions.get("window");

interface SettingModelProps {
  visible: boolean;
  onClose: () => void;
}

const SettingModel: React.FC<SettingModelProps> = ({ visible, onClose }) => {
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const { isDarkMode } = useTheme();
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
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Setting</Text>
            <TouchableOpacity>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            {/* <View style={styles.inputContainer}>
              <Text style={styles.label}>FirstName</Text>
              <TextInput
                style={styles.input}
                value={firstNameEdit}
                onChangeText={(text) => setFirstNameEdit(text)}
                placeholder="Enter your firstname!"
                placeholderTextColor="#999"
              />
            </View> */}
            <TouchableOpacity
              style={styles.btnLogout}
              onPress={handleLogout}
              disabled={isLoading} // Disable khi đang tải
            >
              <Text style={styles.txtLogout}>
                {isLoading ? "Logging out..." : "Logout"}{" "}
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
    },
    label: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
      fontWeight: fontWeight,
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
    },
    txtLogout: {
      color: "red",
      fontSize: textFontSize,
      fontWeight: fontWeight,
      textDecorationLine: "underline",
    },
  });

export default SettingModel;
