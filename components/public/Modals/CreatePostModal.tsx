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
} from "react-native";
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { fontWeight, textFontSize } from "@/styles/stylePrimary";
import useImagePicker from "@/hooks/useImagePicker";
import { useQueryClient } from "@tanstack/react-query";
import { grey } from "@/utils/colorPrimary";
import CameraModal from "./CameraModal";
import VoiceModal from "./VoiceModal";
import AudioPlayer from "../AudioPlayer";

interface CreatePostModelProps {
  openModel: {
    visible: boolean;
    key: string | null;
  };
  onClose: () => { visible: boolean; key: string | null };
  imagesProp: string[];
  removeImageProp: (uri: string) => void;
}

const { width, height } = Dimensions.get("window");

const CreatePostModel: React.FC<CreatePostModelProps> = ({
  openModel,
  onClose,
  imagesProp,
  removeImageProp,
}) => {
  const [postText, setPostText] = useState("");
  const [isVisibleCameraModal, setIsVisibleCameraModal] =
    useState<boolean>(false);
  const [capturedImages, setCapturedImages] = useState<string | null>(null);
  const [isOpenVoiceModal, setIsOpenVoiceModal] = useState<boolean>(false);
  const [recordUri, setRecordUri] = useState<string | null>(null);
  const handleImageCaptured = (imageUri: string) => {
    setCapturedImages(imageUri); // Thêm ảnh vào danh sách
  };
  const reMoveImageFromCamera = () => {
    setCapturedImages(null);
  };
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData<{ avatar: string }>(["userInfo"]);

  const { images, removeImage, permission, openImagePicker } = useImagePicker();
  const [imageSizes, setImageSizes] = useState<{
    [key: string]: { width: number; height: number };
  }>({});

  useEffect(() => {
    const allImages = [...imagesProp, ...images];
    allImages.forEach((uri) => {
      Image.getSize(uri, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        setImageSizes((prevSizes) => ({
          ...prevSizes,
          [uri]: {
            width: width * 0.4,
            height: (width * 0.4) / aspectRatio,
          },
        }));
      });
    });
  }, [imagesProp, images]);
  console.log("Open modal: ", openModel);
  useEffect(() => {
    if (openModel.key === "photo") {
      openImagePicker();
    }
    if (openModel.key === "camera") {
      setIsVisibleCameraModal(true);
    }
    if (openModel.key === "record") {
      setIsOpenVoiceModal(true);
    }
  }, [openModel.key]);

  return (
    <Modal animationType="slide" transparent visible={openModel.visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
            <TouchableOpacity
              style={[styles.postButton, !postText && styles.disabledPost]}
              disabled={!postText}
            >
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            {userInfo?.avatar && (
              <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
            )}
            <TextInput
              style={styles.input}
              placeholder="What's new?"
              placeholderTextColor="#999"
              multiline
              value={postText}
              onChangeText={setPostText}
            />
          </View>
          {(imagesProp.length > 0 || images.length > 0) && (
            <FlatList
              data={[...imagesProp, ...images]}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View>
                  <Image
                    source={{ uri: item }}
                    style={imageSizes[item] || styles.image}
                  />

                  <TouchableOpacity
                    style={styles.clearImage}
                    onPress={() => {
                      removeImage(item);
                      removeImageProp(item);
                    }}
                  >
                    <MaterialIcons name="clear" size={24} color={grey} />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          {capturedImages && (
            <View style={styles.captureImageContainer}>
              <Image
                source={{ uri: capturedImages }}
                style={styles.imageCapture}
              />
              <TouchableOpacity
                style={styles.clearImageCapture}
                onPress={() => reMoveImageFromCamera()}
              >
                <MaterialIcons name="clear" size={24} color={grey} />
              </TouchableOpacity>
            </View>
          )}

          {recordUri && <AudioPlayer audioUri={recordUri} />}

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => setIsVisibleCameraModal(true)}>
              <SimpleLineIcons name="camera" size={24} color="#9E9E9E" />
            </TouchableOpacity>
            <TouchableOpacity onPress={openImagePicker}>
              <Ionicons name="images-outline" size={24} color="#9E9E9E" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsOpenVoiceModal(true)}>
              <MaterialIcons name="keyboard-voice" size={24} color="#9E9E9E" />
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
  });

export default CreatePostModel;
