import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Switch,
  Modal,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
}) => {
  const [name, setName] = useState("Nn (@vieetnguyeen02)");
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

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
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={styles.input}
                value={bio}
                onChangeText={setBio}
                placeholder="+ Write bio"
                placeholderTextColor="#999"
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Link</Text>
              <TextInput
                style={styles.input}
                value={link}
                onChangeText={setLink}
                placeholder="+ Add link"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Toggle Settings */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Show your replies</Text>
                <Text style={styles.toggleDesc}>
                  When turned off, your replies will be hidden from your
                  profile.
                </Text>
              </View>
              <Switch
                value={showReplies}
                onValueChange={setShowReplies}
                thumbColor="#FFF"
                trackColor={{ false: "#666", true: "#1E90FF" }}
              />
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Private profile</Text>
                <Text style={styles.toggleDesc}>
                  If you switch to private, only followers can see your threads.
                </Text>
              </View>
              <Switch
                value={privateProfile}
                onValueChange={setPrivateProfile}
                thumbColor="#FFF"
                trackColor={{ false: "#666", true: "#1E90FF" }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.9,
    backgroundColor: "#1C1C1E",
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
    color: "#FFFFFF",
    fontSize: height * 0.018,
  },
  headerTitle: {
    color: "#FFFFFF",
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
    color: "#AAA",
    fontSize: height * 0.016,
  },
  input: {
    backgroundColor: "#2C2C2E",
    padding: height * 0.012,
    borderRadius: 8,
    color: "#FFFFFF",
    fontSize: height * 0.018,
  },
  toggleContainer: {
    marginTop: height * 0.02,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  toggleLabel: {
    color: "#FFFFFF",
    fontSize: height * 0.018,
    fontWeight: "bold",
  },
  toggleDesc: {
    color: "#AAA",
    fontSize: height * 0.014,
    width: width * 0.65,
  },
});

export default EditProfileModal;
