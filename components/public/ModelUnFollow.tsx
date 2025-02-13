import { useTheme } from "@/contexts/ThemeContext";
import { Color, fontWeight } from "@/styles/color";
import { darkTheme, lightTheme } from "@/utils/themes";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface UserProps {
  selectedUser: {
    id: number;
    username: string;
    avatar: string;
  };
  handleModelVisible: () => void;
  modalVisible: boolean;
  toggleFollow: (id: string) => void;
}

const ModelUnFollow: React.FC<UserProps> = (props) => {
  const { isDarkMode } = useTheme();
  // Dynamically generated styles
  const styles = getStyles(isDarkMode);
  return (
    <SafeAreaView>
      <Modal
        visible={props.modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={props.handleModelVisible}
      >
        <TouchableWithoutFeedback onPress={props.handleModelVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalContainer}>
              {/* User Avatar */}
              <Image
                source={{ uri: props.selectedUser.avatar }}
                style={styles.avatar}
              />
              {/* Unfollow Text */}
              <Text style={styles.modalText}>
                Unfollow {props.selectedUser.username}?
              </Text>
              {/* Unfollow Button */}
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={() => props.toggleFollow(props.selectedUser.id.toString())}
              >
                <Text style={styles.modalButtonTextUnFollow}>Unfollow</Text>
              </TouchableOpacity>
              {/* Cancel Button */}
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={props.handleModelVisible}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};
const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)", // Hiệu ứng làm mờ nền
      paddingBottom: height * 0.04,
    },
    modalContainer: {
      width: width * 0.9, // Responsive width
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: width * 0.03, // Rounded corners
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: height * 0.02,
    },
    avatar: {
      width: width * 0.2, // 20% of screen width
      height: width * 0.2,
      borderRadius: (width * 0.2) / 2, // Circle
      marginBottom: height * 0.02, // Margin below avatar
    },
    modalText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text, // White color
      fontSize: width * 0.045, // Responsive font size
      marginBottom: height * 0.03, // Margin below text
      textAlign: "center",
    },
    modalButton: {
      width: "100%",
      paddingVertical: height * 0.015, // Responsive padding
      borderRadius: width * 0.02,
      alignItems: "center",
      marginBottom: height * 0.015,
    },
    cancelButton: {
      backgroundColor: "#404040",
      width: "90%",
    },
    modalButtonTextUnFollow: {
      color: "#FF3B30", // White color
      fontSize: width * 0.04, // Responsive font size
    },
    modalButtonTextCancel: {
      color: darkTheme.text,
    },
  });

export default ModelUnFollow;
