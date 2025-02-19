import React from "react";
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImagePickerModalType {
  visible: boolean;
  onClose: () => void;
  image: string | null;
}

const ImagePickerModal = ({
  visible,
  onClose,
  image,
}: ImagePickerModalType) => {
  return (
    <SafeAreaView>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Library</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Ảnh xem trước */}
          <View style={styles.previewContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="image-outline" size={50} color="#999" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  cancelText: { color: "blue", fontSize: 18 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  doneText: { color: "blue", fontSize: 18 },
  previewContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    borderRadius: 100, // Làm tròn
    borderWidth: 1,
    borderColor: "#fff",
    overflow: "hidden", // Đảm bảo ảnh không bị lấn ra ngoài
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 0,
    borderColor: "#fff",
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImagePickerModal;
