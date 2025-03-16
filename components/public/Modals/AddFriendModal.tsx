import useAddFriend from "@/hooks/useAddFriend";
import useProfileInformation from "@/hooks/useProfileInformation";
import AddFriendModalSkeleton from "@/Loading/AddFriendModalSkeleton";
import { fontWeight, textPostFontSize } from "@/styles/stylePrimary";
import { primaryColor } from "@/utils/colorPrimary";
import { darkTheme, lightTheme } from "@/utils/themes";
import { MainStackType } from "@/utils/types/MainStackType";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
interface AddFriendModalProps {
  visible: boolean;
  onDismiss: () => void;
  myUserId: number;
  userId: number;
}

const AddFriendModal = ({
  visible,
  onDismiss,
  myUserId,
  userId,
}: AddFriendModalProps) => {
  const isDarkMode = useColorScheme() === "dark";
  const { width, height } = Dimensions.get("window");
  const styles = getStyles(isDarkMode, width, height);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const { profileInformation, isProfileDetailLoading, postProfileError } =
    useProfileInformation(myUserId, userId);

  // Log profileInformation chỉ một lần khi dữ liệu sẵn sàng
  useEffect(() => {
    if (profileInformation) {
      console.log("profileInformation", profileInformation);
    }
  }, [profileInformation]);
  console.log("userId myUserId", userId, myUserId);
  const addFriend = useAddFriend();
  const handleAddFriend = () => {
    if (userId !== 0 && myUserId !== 0) {
      addFriend.addFriend({ myUserId, userId });
    }
  };
  if (isProfileDetailLoading) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          onDismiss();
          if (addFriend.isSuccess) {
            onDismiss();
          }
        }}
      >
        <View style={styles.modalContainer}>
          <AddFriendModalSkeleton />
        </View>
      </Modal>
    );
  }

  // Trường hợp có lỗi khi fetch dữ liệu
  if (postProfileError) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onDismiss}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.name}>Error loading profile</Text>
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  if (!profileInformation) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onDismiss}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.name}>No profile data available</Text>
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Giao diện khi dữ liệu sẵn sàng
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileInformation.avatar }}
              style={styles.profileImage}
              resizeMode="cover"
              onError={(e) =>
                console.log("Image load error:", e.nativeEvent.error)
              }
            />
          </View>
          <Text style={styles.name}>
            {profileInformation.firstName} {profileInformation.lastName}
          </Text>
          <Text style={styles.username}>{profileInformation.username}</Text>
          {profileInformation?.isFriend && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => {
                navigation.navigate("HistoryPost", { userId: userId });
                onDismiss();
              }}
            >
              <Text style={styles.profileButtonText}>Go to Profile</Text>
            </TouchableOpacity>
          )}
          {profileInformation.isSendRequest && (
            <TouchableOpacity style={styles.requestedButton}>
              <Text style={styles.requestedText}>Requested</Text>
            </TouchableOpacity>
          )}
          {!profileInformation.isSendRequest &&
            !profileInformation?.isFriend && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddFriend}
              >
                {addFriend.isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.addButtonText}>+ Add Friend</Text>
                )}
              </TouchableOpacity>
            )}

          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (
  isDarkMode: boolean,
  screenWidth: number,
  screenHeight: number
) => {
  const isSmallDevice = screenWidth < 375;
  const modalWidth = Math.min(screenWidth * 0.85, 400);
  const profileSize = isSmallDevice
    ? 80
    : screenWidth * 0.25 > 120
    ? 120
    : screenWidth * 0.25;
  const fontSize = isSmallDevice ? 20 : 24;
  const buttonPadding = isSmallDevice ? 16 : 24;

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
    },
    modalContent: {
      width: modalWidth,
      maxHeight: screenHeight * 0.7,
      backgroundColor: isDarkMode ? "#3b2e1e" : "#ffffff",
      borderRadius: 20,
      padding: screenWidth * 0.05,
      alignItems: "center",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    profileImageContainer: {
      width: profileSize,
      height: profileSize,
      borderRadius: profileSize / 2,
      borderWidth: 3,
      borderColor: primaryColor,
      overflow: "hidden",
      marginBottom: screenHeight * 0.02,
    },
    profileImage: {
      width: "100%",
      height: "100%",
      borderRadius: profileSize / 2,
    },
    name: {
      fontSize: fontSize,
      fontWeight: "600",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: screenHeight * 0.025,
      textAlign: "center",
    },
    username: {
      fontSize: textPostFontSize,
      fontWeight: fontWeight,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginBottom: screenHeight * 0.025,
      textAlign: "center",
    },
    profileButton: {
      backgroundColor: primaryColor,
      paddingHorizontal: buttonPadding,
      paddingVertical: screenHeight * 0.01,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: screenHeight * 0.02,
      minWidth: modalWidth * 0.4,
      justifyContent: "center",
      alignSelf: "center",
    },
    profileButtonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: isSmallDevice ? 14 : 16,
      fontWeight: "600",
    },
    addButton: {
      backgroundColor: "#ffba00",
      paddingHorizontal: buttonPadding,
      paddingVertical: screenHeight * 0.01,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: screenHeight * 0.02,
      minWidth: modalWidth * 0.4,
      justifyContent: "center",
    },
    addButtonText: {
      color: "#000000",
      fontSize: isSmallDevice ? 14 : 16,
      fontWeight: fontWeight,
    },
    dismissButton: {
      paddingVertical: screenHeight * 0.012,
      paddingHorizontal: buttonPadding,
      borderRadius: 20,
      backgroundColor: isDarkMode ? "#2c2c2e" : "#f2f2f2",
      minWidth: modalWidth * 0.4,
      alignItems: "center",
    },
    dismissButtonText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: isSmallDevice ? 14 : 16,
      fontWeight: fontWeight,
    },
    requestedButton: {
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      paddingHorizontal: buttonPadding,
      paddingVertical: screenHeight * 0.01,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: screenHeight * 0.02,
      minWidth: modalWidth * 0.4,
      justifyContent: "center",
    },
    requestedText: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontSize: isSmallDevice ? 14 : 16,
      fontWeight: fontWeight,
    },
  });
};

export default AddFriendModal;
