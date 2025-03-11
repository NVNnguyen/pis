import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
  Pressable,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { OPENSANS_REGULAR } from "@/utils/const";
import {
  buttonFontsize,
  fontWeight,
  textFontSize,
} from "@/styles/stylePrimary";
import useBlockFriend from "@/hooks/useBlockUser";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import useUnfriend from "@/hooks/useUnfriend";
import { useQueryClient } from "@tanstack/react-query";

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
  const { isDarkMode } = useTheme();
  const styles = getStyle(isDarkMode);
  const block = useBlockFriend();
  const unfriend = useUnfriend();
  const queryClient = useQueryClient();
  const handleBlockFriend = () => {
    Alert.alert(
      `Block ${username}`,
      `If you block ${username}, you will not see ${username}'s posts!`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => block.block({ myUserId, userId }),
          style: "destructive",
        },
      ]
    );
    if (block.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["listFriend", myUserId],
      });
    }
  };

  const handleUnfriend = () => {
    if (myUserId && userId) {
      Alert.alert(
        `Are you sure unfriend with ${username}`,
        `You will not see any posts from ${username}!`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: () =>
              unfriend.unfriend({ myUserId: myUserId, userId: userId }),
            style: "destructive",
          },
        ]
      );
      if (unfriend.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["listFriend", myUserId],
        });
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Chặn sự kiện onPress lan vào phần container */}
        <Pressable style={styles.container} onPress={() => {}}>
          {/* Drag Indicator */}
          <View style={styles.dragIndicator} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Block Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.btnLogout}
              onPress={handleBlockFriend}
              disabled={block.isLoading}
            >
              <TouchableOpacity style={styles.icon}>
                <FontAwesome5
                  name="user-alt-slash"
                  size={buttonFontsize}
                  color={isDarkMode ? darkTheme.text : lightTheme.text}
                />
              </TouchableOpacity>
              {!block.isSuccess && (
                <Text style={styles.txtLogout}>
                  {block.isLoading ? `Block...` : `Block`}
                </Text>
              )}

              {block.isSuccess && <Text style={styles.txtLogout}>Blocked</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <TouchableOpacity
              style={styles.btnLogout}
              onPress={handleUnfriend}
              disabled={unfriend.isLoading}
            >
              <TouchableOpacity style={styles.icon}>
                <FontAwesome
                  name="user-times"
                  size={buttonFontsize}
                  color={isDarkMode ? darkTheme.text : lightTheme.text}
                />
              </TouchableOpacity>
              {!unfriend.isSuccess && (
                <Text style={styles.txtLogout}>
                  {unfriend.isLoading ? `Unfriend...` : `Unfriend`}
                </Text>
              )}
              {unfriend.isSuccess && (
                <Text style={styles.txtLogout}>Not Friend</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const getStyle = (isDarkMode: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "flex-end",
    },
    container: {
      height: height * 0.4,
      width: "100%",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: width * 0.05,
      paddingTop: height * 0.015,
      paddingBottom: height * 0.03,
    },
    dragIndicator: {
      alignSelf: "center",
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: "#aaa",
      marginBottom: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingBottom: height * 0.015,
    },
    cancelText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
    },
    profileSection: {
      marginTop: height * 0.03,
    },
    icon: {
      backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: width * 0.05,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    btnLogout: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: height * 0.012,
      paddingHorizontal: width * 0.04,
      backgroundColor: isDarkMode ? "#222" : "#eee",
      borderRadius: 12,
      marginBottom: height * 0.015,
    },
    txtLogout: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
    },
  });

export default BlockUserModal;
