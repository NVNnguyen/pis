import React, { useState, useEffect } from "react";
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
import { getMyUserId } from "@/hooks/getMyUserID";
import { useCreatePost } from "@/hooks/useCreatePost";
import * as FileSystem from "expo-file-system";
interface CreatePostModelProps {
  openModel: {
    visible: boolean;
    key: string | null;
  };
  onClose: () => { visible: boolean; key: string | null };
  isLoading: (isLoading: boolean) => void; // ✅ Cập nhật kiểu trả về
}

const { width, height } = Dimensions.get("window");
const CreatePostModel: React.FC<CreatePostModelProps> = ({
  openModel,
  onClose,
  isLoading, // ✅ Nhận hàm cập nhật loading từ ngoài
}) => {
  const [content, setContent] = useState<string>("");
  const [isVisibleCameraModal, setIsVisibleCameraModal] =
    useState<boolean>(false);
  const [capturedImages, setCapturedImages] = useState<string | null>(null);
  const [isOpenVoiceModal, setIsOpenVoiceModal] = useState<boolean>(false);
  const [recordUri, setRecordUri] = useState<string | null>(null);
  const [isLoadingCreatePost, setIsLoadingCreatePost] =
    useState<boolean>(false);
  const myUserId = getMyUserId() ?? 0;
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

  console.log(userInfo);

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
    isLoading(true); // ✅ Cập nhật loading ở ngoài

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
        content: content,
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
          isLoading(false); // ✅ Dừng trạng thái loading bên ngoài khi có lỗi
        },
      }
    );
    setIsLoadingCreatePost(false);
    isLoading(false); // ✅ Dừng trạng thái loading bên ngoài
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
              onClose(); // Gọi hàm đúng cách
            },
            style: "destructive",
          },
        ]
      );
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
                    handleCloseModal(); // Gọi hàm đúng cách
                  } else {
                    onClose(); // Gọi hàm đúng cách
                  }
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>New Post</Text>
              <TouchableOpacity
                style={[styles.postButton, !content && styles.disabledPost]}
                disabled={!content}
                onPress={() => handleCreatePost()}
              >
                <Text style={styles.postText}>Post</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              {userInfo?.avatar ? (
                <Image
                  source={{ uri: userInfo.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <Image
                  source={require("@/assets/images/userAvatar.png")}
                  style={styles.avatar}
                />
              )}
              <View>
                <Text style={styles.usernameTxt}>{userInfo?.username}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What's new?"
                  placeholderTextColor="##9E9E9E"
                  multiline
                  value={content}
                  onChangeText={setContent}
                />
              </View>
            </View>
            {(images.length > 0 || capturedImages) && (
              <FlatList
                data={
                  capturedImages ? [capturedImages, ...images] : [...images]
                }
                keyExtractor={(item, index) => `${item}-${index}`} // Tránh trùng key
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View>
                    <Image source={{ uri: item }} style={imageSizes[item]} />
                    <TouchableOpacity
                      style={styles.clearImage}
                      onPress={() => {
                        if (item === capturedImages) {
                          setCapturedImages(null); // Xóa ảnh từ camera
                        } else {
                          removeImage(item); // Xóa ảnh từ thư viện
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
              {!recordUri && (
                <>
                  <TouchableOpacity
                    onPress={() => setIsVisibleCameraModal(true)}
                  >
                    <SimpleLineIcons
                      name="camera"
                      size={buttonFontsize}
                      color="#9E9E9E"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={openImagePicker}>
                    <Ionicons
                      name="images-outline"
                      size={buttonFontsize}
                      color="#9E9E9E"
                    />
                  </TouchableOpacity>
                </>
              )}
              {images.length === 0 && capturedImages === null && (
                <TouchableOpacity onPress={() => setIsOpenVoiceModal(true)}>
                  <MaterialIcons
                    name="keyboard-voice"
                    size={buttonFontsize}
                    color="#9E9E9E"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Add a loading overlay when posting */}
          {/* {isLoadingCreatePost && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#1E90FF" />
              <Text style={styles.loadingText}>Posting...</Text>
            </View>
          )} */}
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
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#999",
      paddingBottom: height * 0.01,
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
    postButton: {
      backgroundColor: "#1E90FF",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
    },
    disabledPost: {
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
    },
    postText: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontWeight: fontWeight,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 15,
    },
    avatar: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: (width * 0.1) / 2,
      marginRight: width * 0.02,
    },
    usernameTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      fontWeight: fontWeight,
    },
    input: {
      flex: 1,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textFontSize,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: height * 0.015,
    },
    image: {
      width: width * 0.5, // Mặc định
      height: width * 0.5,
      margin: 5,
      borderRadius: 10,
      resizeMode: "cover",
    },
    clearImage: {
      position: "absolute",
      backgroundColor: isDarkMode ? darkTheme.text : lightTheme.text,
      borderRadius: "50%",
      right: 0,
      margin: 10,
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
      backgroundColor: "rgba(0,0,0,0.5)", // ✅ Làm mờ nền để dễ thấy
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
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginTop: height * 0.01,
      fontSize: textFontSize,
    },
  });

export default CreatePostModel;
