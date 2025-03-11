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
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { OPENSANS_REGULAR } from "@/utils/const";
import { fontWeight, textFontSize } from "@/styles/stylePrimary";
import useBlockFriend from "@/hooks/useBlockUser";

const { width, height } = Dimensions.get("window");

interface BlockModalProp {
  visible: boolean;
  onClose: () => void;
  username: string;
  myUserId: number;
  userId: number;
}

const BlockUserModal = ({
  visible,
  onClose,
  username,
  myUserId,
  userId,
}: BlockModalProp) => {
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const { isDarkMode } = useTheme();
  const styles = getStyle(isDarkMode);
  const { block, isLoading, isSuccess } = useBlockFriend();
  console.log("myuserId: ", myUserId, "friendId", userId);
  const handleBlockFriend = () => {
    Alert.alert(
      `Are you sure to block ${username}`,
      `If you block ${username} you will not see ${username} posts`,
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => block({ myUserId, userId }),
        },
      ]
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
            {/* <Text style={styles.headerTitle}>{username}</Text> */}
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.btnLogout}
              onPress={handleBlockFriend}
              disabled={isLoading} // Disable khi đang tải
            >
              <Text style={styles.txtLogout}>
                {isLoading ? `Blocking...` : `Block`}
              </Text>
              {isSuccess && <Text style={styles.txtLogout}>Blocked</Text>}
            </TouchableOpacity>
          </View>
        </View>
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
      alignItems: "center",
      justifyContent: "center",
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
      width: width * 0.3,
      height: height * 0.04,
      backgroundColor: "red",
      borderRadius: 20,
    },
    txtLogout: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
      fontWeight: fontWeight,
    },
  });

export default BlockUserModal;
