import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
  Button,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { buttonFontsize, fontWeight, textFontSize } from "@/styles/stylePrimary";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { emailRegex } from "@/utils/regex";
import CustomAlert from "@/components/genaral/alert/CustomAlert";
import { MaterialIcons } from "@expo/vector-icons";
import useImagePickerSelectionOne from "@/hooks/useImagePickerSelectionOne";
import infoAPI from "@/api/infoAPI";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // or the correct path to DatePicker
import useUploadAvatar from "@/hooks/useUploadAvatar";

const { width, height } = Dimensions.get("window");

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  avatar: string;
  follower: number;
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  userIdProp: number;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  avatar,
  follower,
  firstName,
  lastName,
  email,
  birthday,
  userIdProp,
}) => {
  const [firstNameEdit, setFirstNameEdit] = useState(firstName);
  const [lastNameEdit, setLastNameEdit] = useState(lastName);
  const [emailEdit, setEmailEdit] = useState(email);
  const [birthdayEdit, setBirthdayEdit] = useState<Date>(new Date(birthday));
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isOpenEditBirthday, setIsOpenEditBirthDay] = useState(false);
  const maxYearOld = new Date();
  maxYearOld.setFullYear(maxYearOld.getFullYear() - 7);
  const minYearOld = new Date();
  minYearOld.setFullYear(minYearOld.getFullYear() - 120);
  const { isDarkMode } = useTheme();
  const styles = getStyle(isDarkMode);
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();

  const handleUpdateProfile = () => {
    if (!emailRegex.test(emailEdit)) {
      setAlertVisible(true);
      setAlertTitle("Invalid Email");
      setAlertMessage("Please enter a valid email address.");
      return;
    }

    updateProfileMutation.updateProfile(
      {
        firstName: firstNameEdit,
        lastName: lastNameEdit,
        email: emailEdit,
        birthday: birthdayEdit || new Date(),
        userIdProp,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["userInfo", userIdProp] });
          queryClient.invalidateQueries({
            queryKey: ["postsProfile", userIdProp],
          });
          onClose();
        },
      }
    );
  };

  const { image, formData, openPickImage } = useImagePickerSelectionOne();
  const { upLoadAvatar, isUpLoadAvatarLoading, isUpLoadAvatarError } =
    useUploadAvatar(formData, userIdProp);

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
            {isUpLoadAvatarLoading || updateProfileMutation.isLoading ? (
              <TouchableOpacity onPress={handleUpdateProfile}>
                <Text style={styles.doneText}>Saving...</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleUpdateProfile}>
                <Text style={styles.doneText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Image
                  source={
                    image
                      ? { uri: image }
                      : avatar
                      ? { uri: avatar }
                      : require("@/assets/images/userAvatar.png")
                  }
                  style={styles.avatarImg}
                />
              </View>
              {follower > 100000 && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" style={styles.verifiedText} />
                </View>
              )}
              <TouchableOpacity onPress={openPickImage}>
                <Text style={styles.txtEditAvt}>Edit avatar</Text>
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            {[
              {
                label: "First Name",
                value: firstNameEdit,
                onChange: setFirstNameEdit,
              },
              {
                label: "Last Name",
                value: lastNameEdit,
                onChange: setLastNameEdit,
              },
              { label: "Email", value: emailEdit, onChange: setEmailEdit },
            ].map((input, index) => (
              <View key={index} style={styles.inputContainer}>
                <Text style={styles.label}>{input.label}</Text>
                <TextInput
                  style={styles.input}
                  value={input.value}
                  onChangeText={input.onChange}
                  placeholder={`Enter your ${input.label.toLowerCase()}!`}
                  placeholderTextColor="#999"
                />
              </View>
            ))}

            {/* Birthday */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Birthday</Text>
              <TouchableOpacity onPress={() => setIsOpenEditBirthDay(true)}>
                <Text style={styles.input}>
                  {birthdayEdit
                    ? new Date(birthdayEdit).toDateString() // Chuyển đổi `string` thành `Date`
                    : new Date().toDateString()}
                </Text>
              </TouchableOpacity>
              {isOpenEditBirthday && (
                <View>
                  <DateTimePickerModal
                    isVisible={isOpenEditBirthday}
                    date={birthdayEdit}
                    onCancel={() => setIsOpenEditBirthDay(false)}
                    onConfirm={() => setIsOpenEditBirthDay(false)}
                    maximumDate={maxYearOld}
                    minimumDate={minYearOld}
                    onChange={(date) => setBirthdayEdit(date)}
                  />
                </View>
              )}
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
      marginBottom: height * 0.01,
    },
    input: {
      backgroundColor: isDarkMode ? "#2C2C2E" : "#E0E0E0",
      padding: height * 0.012,
      borderRadius: 8,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: height * 0.015,
    },
    avatar: {
      width: height * 0.07, // Same height as the header
      height: height * 0.07,
      position: "relative",
      borderRadius: (height * 0.07) / 2, // Sửa thành giá trị số
    },
    avatarImg: {
      width: "100%", // Cover the entire container
      height: "100%",
      borderRadius: (height * 0.07) / 2, // Sửa thành giá trị số
      resizeMode: "cover",
    },
    verifiedBadge: {
      position: "absolute",
      width: width * 0.06, // Badge size relative to screen width
      height: width * 0.06,
      borderRadius: width * 0.03, // Sửa thành giá trị số
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      justifyContent: "center",
      alignItems: "center",
      bottom: 1,
    },
    verifiedText: {
      color: "#1da1f2",
      fontSize: buttonFontsize,
    },
    txtEditAvt: {
      color: "#1da1f2",
      fontSize: textFontSize,
      marginTop: height * 0.01,
    },
  });

export default EditProfileModal;
