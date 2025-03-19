import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  buttonFontsize,
  fontWeight,
  textFontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import useImagePicker from "@/hooks/useImagePicker";
import { useQueryClient } from "@tanstack/react-query";
import CameraModal from "./CameraModal";
import VoiceModal from "./VoiceModal";
import AudioPlayer from "../AudioPlayer";
import { useCreatePost } from "@/hooks/useCreatePost";
import * as FileSystem from "expo-file-system";
import { useMyUserId } from "@/hooks/useMyUserId";
interface CreatePostModelProps {
  openModel: {
    visible: boolean;
    key: string | null;
  };
  onClose: () => { visible: boolean; key: string | null };
  isLoading: (isLoading: boolean) => void;
}

const { width, height } = Dimensions.get("window");
const CreatePostModel: React.FC<CreatePostModelProps> = ({
  openModel,
  onClose,
  isLoading,
}) => {
  const [content, setContent] = useState<string>("");
  const [isVisibleCameraModal, setIsVisibleCameraModal] =
    useState<boolean>(false);
  const [capturedImages, setCapturedImages] = useState<string | null>(null);
  const [isOpenVoiceModal, setIsOpenVoiceModal] = useState<boolean>(false);
  const [recordUri, setRecordUri] = useState<string | null>(null);
  const [isLoadingCreatePost, setIsLoadingCreatePost] =
    useState<boolean>(false);
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const myUserId = useMyUserId() ?? 0;
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData<{
    avatar: string;
    username: string;
  }>(["userInfo", myUserId]);

  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const handleImageCaptured = (imageUri: string) => {
    setCapturedImages(imageUri);
    Image.getSize(imageUri, (imgWidth, imgHeight) => {
      const aspectRatio = imgWidth / imgHeight;
      setImageSizes((prevSizes) => ({
        ...prevSizes,
        [imageUri]: {
          width: width * 0.6,
          height: (width * 0.7) / aspectRatio,
          borderRadius: 10,
          marginRight: 10,
          resizeMode: "cover",
        },
      }));
    });
  };
  const { images, removeImage, openImagePicker, removeAllImages } =
    useImagePicker();
  const [imageSizes, setImageSizes] = useState<{
    [key: string]: { width: number; height: number };
  }>({});
  useEffect(() => {
    images.forEach((uri) => {
      if (!imageSizes[uri]) {
        // Chỉ cập nhật nếu chưa có kích thước
        Image.getSize(uri, (imgWidth, imgHeight) => {
          const aspectRatio = imgWidth / imgHeight;
          setImageSizes((prevSizes) => ({
            ...prevSizes,
            [uri]: {
              width: width * 0.4,
              height: (width * 0.4) / aspectRatio,
              borderRadius: 10,
              marginRight: 10,
            },
          }));
        });
      }
    });
  }, [images]);
  const handleOpenRecord = () => {
    setCapturedImages(null);
    removeAllImages();
    setIsOpenVoiceModal(true);
  };
  useEffect(() => {
    if (openModel.key === "photo") {
      openImagePicker();
    }
    if (openModel.key === "camera") {
      setIsVisibleCameraModal(true);
    }
    if (openModel.key === "record") {
      handleOpenRecord();
    }
  }, [openModel.key]);
  const createPostMutation = useCreatePost();
  const handleCreatePost = () => {
    if (isLoadingCreatePost) return;

    setIsLoadingCreatePost(true);
    isLoading(true);

    const files = [];

    if (capturedImages) {
      files.push({
        uri: capturedImages,
        type: "image/jpeg",
        name: "captured_image.jpg",
      });
    }

    if (images.length > 0) {
      files.push(
        ...images.map((image, index) => ({
          uri: image,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        }))
      );
    }

    if (recordUri) {
      files.push({
        uri: recordUri,
        type: "audio/mpeg",
        name: "audio.mp3",
      });
    }

    createPostMutation.mutate(
      {
        userId: myUserId,
        type: recordUri ? "Voice" : "Image",
        content: content || "",
        mode: "Public",
        files: files.length > 0 ? files : undefined,
      },
      {
        onError: (error) => {
          Alert.alert(
            "Create post error",
            "Can't create post. Please try again!"
          );
          setIsLoadingCreatePost(false);
          isLoading(false);
        },
      }
    );
    setIsLoadingCreatePost(false);
    isLoading(false);
    onClose();
    setRecordUri(null);
    setContent("");
    setCapturedImages(null);
    removeAllImages();
  };

  const handleCloseModal = () => {
    if (recordUri) {
      Alert.alert(
        "Discard new post?",
        "This post type can't be saved as a draft.",
        [
          {
            text: "Keep Editing",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Discard",
            onPress: () => {
              setRecordUri(null);
              onClose();
            },
            style: "destructive",
          },
        ]
      );
    }
  };

  const handleOpenMode = (mode: string) => {
    if (mode === "photo") {
      setCapturedImages(null);
      setIsOpenVoiceModal(false);
      setRecordUri(null);
      openImagePicker();
    }
    if (mode === "camera") {
      setIsOpenVoiceModal(false);
      setRecordUri(null);
      setIsVisibleCameraModal(true);
    }
    if (mode === "record") {
      setCapturedImages(null);
      removeAllImages();
      setIsOpenVoiceModal(true);
    }
  };
  return (
    <Modal animationType="slide" transparent visible={openModel.visible}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  if (recordUri) {
                    handleCloseModal();
                  } else {
                    onClose();
                  }
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>New Post</Text>
              <TouchableOpacity
                style={[
                  styles.postButton,
                  !images?.length &&
                    !capturedImages?.length &&
                    !recordUri &&
                    !content &&
                    styles.disabledPost,
                ]}
                onPress={handleCreatePost}
                disabled={
                  !content &&
                  !images?.length &&
                  !capturedImages?.length &&
                  !recordUri
                }
              >
                <Text style={styles.postText}>Post</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              {userInfo?.avatar ? (
                <Image
                  source={{ uri: userInfo.avatar }}
                  style={styles.avatar}
                  onLoadStart={() => setAvatarLoading(true)}
                  onLoadEnd={() => setAvatarLoading(false)}
                />
              ) : (
                <Image
                  source={require("@/assets/images/userAvatar.png")}
                  style={styles.avatar}
                />
              )}
              {avatarLoading && !userInfo?.avatar && (
                <ActivityIndicator
                  size="small"
                  color="#9E9E9E"
                  style={styles.avatar}
                />
              )}
              <View style={styles.inputContainer}>
                <Text style={styles.usernameTxt}>{userInfo?.username}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What's new?"
                  placeholderTextColor="#9E9E9E"
                  multiline
                  value={content}
                  onChangeText={setContent}
                  autoFocus={true}
                />
              </View>
            </View>
            {(images.length > 0 || capturedImages) && (
              <FlatList
                data={
                  capturedImages ? [capturedImages, ...images] : [...images]
                }
                keyExtractor={(item, index) => `${item}-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View>
                    <Image source={{ uri: item }} style={imageSizes[item]} />
                    <TouchableOpacity
                      style={styles.clearImage}
                      onPress={() => {
                        if (item === capturedImages) {
                          setCapturedImages(null);
                        } else {
                          removeImage(item);
                        }
                      }}
                    >
                      <MaterialIcons
                        name="clear"
                        size={buttonFontsize}
                        color="grey"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}

            {recordUri && <AudioPlayer audioUri={recordUri} />}

            <View style={styles.actionRow}>
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleOpenMode("camera")}
                >
                  <SimpleLineIcons
                    name="camera"
                    size={buttonFontsize}
                    color="#9E9E9E"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleOpenMode("photo")}
                >
                  <Ionicons
                    name="images-outline"
                    size={buttonFontsize}
                    color="#9E9E9E"
                  />
                </TouchableOpacity>
              </>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleOpenMode("record")}
              >
                <MaterialIcons
                  name="keyboard-voice"
                  size={buttonFontsize}
                  color="#9E9E9E"
                />
              </TouchableOpacity>
            </View>
          </View>
          <CameraModal
            visible={isVisibleCameraModal}
            onClose={() => setIsVisibleCameraModal(false)}
            onCapture={handleImageCaptured}
          />
          <VoiceModal
            visible={isOpenVoiceModal}
            onClose={() => setIsOpenVoiceModal(false)}
            onDone={(uri) => setRecordUri(uri)}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: width,
      height: "80%",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: 15,
      padding: width * 0.03,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: StyleSheet.hairlineWidth, // Use hairlineWidth for consistent border across platforms
      borderBottomColor: isDarkMode ? "#444" : "#ddd",
      paddingBottom: 10,
      paddingHorizontal: 5,
      height: 50, // Fixed height for consistency
    },
    cancelText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
      fontFamily: Platform.OS === "ios" ? "System" : "normal",
      padding: 5, // Add padding for better touch target
    },
    headerTitle: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
      fontWeight: "bold",
      fontFamily: Platform.OS === "ios" ? "System" : "normal",
    },
    postButton: {
      backgroundColor: "#1E90FF",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      minWidth: 60, // Ensure consistent width
      alignItems: "center", // Center text
    },
    disabledPost: {
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(0, 0, 0, 0.2)",
      // Use opacity instead of different colors for consistency
    },
    postText: {
      color: "#FFFFFF", // Use white for both platforms
      fontWeight: fontWeight,
      fontFamily: Platform.OS === "ios" ? "System" : "normal",
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "flex-start", // Align to top for consistency
      marginVertical: 15,
      width: "100%",
      paddingHorizontal: 5,
    },
    avatar: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: (width * 0.1) / 2,
      marginRight: width * 0.02,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    inputContainer: {
      flex: 1,
      alignItems: "flex-start",
    },
    usernameTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      fontWeight: fontWeight,
      fontFamily: Platform.OS === "ios" ? "System" : "normal",
      marginBottom: 5,
    },
    input: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
      width: "100%",
      paddingVertical: 0, // Remove padding to match across platforms
      paddingHorizontal: 0,
      fontFamily: Platform.OS === "ios" ? "System" : "normal",
      textAlignVertical: "top", // Consistent text alignment
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 15,
      paddingVertical: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDarkMode ? "#444" : "#ddd",
    },
    actionButton: {
      padding: 10, // Add padding for better touch target
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: width * 0.5,
      height: width * 0.5,
      margin: 5,
      borderRadius: 10,
      resizeMode: "cover",
    },
    clearImage: {
      position: "absolute",
      backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background for both platforms
      borderRadius: 15,
      right: 5,
      top: 5,
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    captureImageContainer: {
      position: "relative",
      width: width * 0.6,
      height: width * 0.7,
      alignItems: "center",
      justifyContent: "center",
    },
    imageCapture: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
      resizeMode: "cover",
    },
    clearImageCapture: {
      position: "absolute",
      top: 5,
      right: 5,
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
    loadingText: {
      color: "#FFFFFF", // White text for both platforms
      marginTop: 10,
      fontSize: textFontSize,
      fontFamily: Platform.OS === "ios" ? "System" : "normal",
    },
  });

export default CreatePostModel;
