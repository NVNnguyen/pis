import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { OPENSANS_REGULAR } from "@/utils/const";
import { fontWeight } from "@/styles/color";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { useQueryClient } from "@tanstack/react-query";
import { emailRegex } from "@/utils/regex";
import CustomAlert from "@/components/genaral/alert/CustomAlert";

const { width, height } = Dimensions.get("window");

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  userIdProp: number;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  firstName,
  lastName,
  email,
  birthday,
  userIdProp,
}) => {
  const [firstNameEdit, setFirstNameEdit] = useState<string>(firstName);
  const [lastNameEdit, setLastNameEdit] = useState<string>(lastName);
  const [emailEdit, setEmailEdit] = useState<string>(email);
  const [birthdayEdit, setBirthdayEdit] = useState<Date | null>(birthday);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const { isDarkMode } = useTheme();
  const styles = getStyle(isDarkMode);
  const onChange = (_event: any, selectedDate: any) => {
    const currentDate = selectedDate || birthdayEdit;
    setBirthdayEdit(currentDate);
  };
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(
      {
        firstName: firstNameEdit,
        lastName: lastNameEdit,
        email: emailEdit,
        birthday: birthdayEdit || new Date(),
        userIdProp,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["userInfo", userIdProp] }); // 🚀 Invalidate userInfo query
          onClose(); // Đóng modal sau khi cập nhật
        },
      }
    );
  };
  useEffect(() => {
    if (typeof birthdayEdit === "string") {
      setBirthdayEdit(new Date(birthdayEdit));
    }
  }, [birthdayEdit]);

  const handleEnterEmail = () => {
    if (!emailRegex.test(emailEdit)) {
      setAlertVisible(true);
      setAlertTitle("Email invalid!");
      setAlertMessage("Email invalid! Please enter correct email format!");
      return false;
    }
    return true;
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
            <Text style={styles.headerTitle}>Edit profile</Text>
            <TouchableOpacity
              onPress={() => {
                if (handleEnterEmail()) {
                  handleUpdateProfile();
                  onClose();
                }
              }}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>FirstName</Text>
              <TextInput
                style={styles.input}
                value={firstNameEdit}
                onChangeText={(text) => setFirstNameEdit(text)}
                placeholder="Enter your firstname!"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>LastName</Text>
              <TextInput
                style={styles.input}
                value={lastNameEdit}
                onChangeText={(text) => setLastNameEdit(text)}
                placeholder="Enter your lastname!"
                placeholderTextColor="#999"
                multiline
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={emailEdit}
                onChangeText={(text) => setEmailEdit(text)}
                placeholder="Enter your email!"
                placeholderTextColor="#999"
                multiline
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birthday</Text>
              <DateTimePicker
                value={birthdayEdit || new Date()}
                mode="date"
                display="default"
                onChange={onChange}
              />
            </View>
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
      fontSize: height * 0.018,
    },
    headerTitle: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: height * 0.02,
      fontWeight: "bold",
    },
    doneText: {
      color: "#1E90FF",
      fontSize: height * 0.018,
    },
    profileSection: {
      marginTop: height * 0.02,
    },
    inputContainer: {
      marginBottom: height * 0.015,
    },
    label: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: height * 0.016,
      fontWeight: fontWeight,
    },
    input: {
      backgroundColor: isDarkMode ? "#2C2C2E" : "#E0E0E0",
      padding: height * 0.012,
      borderRadius: 8,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: height * 0.018,
    },
  });

export default EditProfileModal;
