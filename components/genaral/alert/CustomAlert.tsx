import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

type CustomAlertProps = {
  visible: boolean; // Hiển thị Alert hay không
  title: string; // Tiêu đề của Alert
  message: string; // Nội dung thông báo
  //   onClose: (event: GestureResponderEvent) => void; // Hàm xử lý khi nhấn Cancel
  onConfirm?: (event: GestureResponderEvent) => void; // Hàm xử lý khi nhấn Confirm (tùy chọn)
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  //   onClose,
  onConfirm,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      //   onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            {/* <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity> */}
            {onConfirm && (
              <TouchableOpacity style={styles.button} onPress={onConfirm}>
                <Text style={styles.buttonText}>Ok</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CustomAlert;
