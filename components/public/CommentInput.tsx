import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ActivityIndicator,
  Text,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  buttonFontsize,
  text12FontSize,
  textFontSize,
} from "@/styles/stylePrimary";
import {
  darkThemeInput,
  grey,
  lightThemeInput,
  primaryColor,
} from "@/utils/colorPrimary";
import useImagePickerChooseOne from "@/hooks/useImagePickerChooseOne";
import { getMyUserId } from "@/hooks/getMyUserID";
import { useCreateComment } from "@/hooks/useCreateComment";
import AudioPlayer from "./AudioPlayer";
import VoiceModal from "./Modals/VoiceModal";
import CameraModal from "./Modals/CameraModal";
import { UseCreateCommentType } from "@/utils/types/UseCreateCommentType";

const { width, height } = Dimensions.get("window");



interface CommentInputProps {
  userName: string;
  postId: number;
  parentCommentId: number;
  inputRef?: React.RefObject<TextInput>;
}

// Enum để quản lý loại media được chọn
enum MediaType {
  None = "None",
  Voice = "Voice",
  Image = "Image",
  Camera = "Camera",
}

const CommentInput = ({
  userName,
  postId,
  parentCommentId,
  inputRef,
}: CommentInputProps) => {
  const [message, setMessage] = useState("");
  const [recordUri, setRecordUri] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isOpenVoiceModal, setIsOpenVoiceModal] = useState(false);
  const [isOpenCameraModal, setIsOpenCameraModal] = useState<boolean>(false);
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType>(
    MediaType.None
  );

  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, parentCommentId);
  const myUserId = getMyUserId();
  const { images, openImagePicker, removeImage } = useImagePickerChooseOne();
  const createCommentMutation = useCreateComment();

  // Xử lý khi chọn media type
  const handleSelectMediaType = (mediaType: MediaType) => {
    // Reset tất cả dữ liệu media
    resetAllMedia();

    // Đặt loại media được chọn
    setSelectedMediaType(mediaType);

    // Mở modal hoặc picker tương ứng
    switch (mediaType) {
      case MediaType.Voice:
        setIsOpenVoiceModal(true);
        break;
      case MediaType.Image:
        openImagePicker();
        break;
      case MediaType.Camera:
        setIsOpenCameraModal(true);
        break;
      default:
        break;
    }
  };

  // Reset tất cả dữ liệu media
  const resetAllMedia = () => {
    setRecordUri(null);
    setImageUri(null);
    removeImage();
  };

  // Xóa media đang chọn và reset về trạng thái ban đầu
  const clearSelectedMedia = () => {
    resetAllMedia();
    setSelectedMediaType(MediaType.None);
  };

  const handleSendMessage = () => {
    if (createCommentMutation.isPending || myUserId === null) return;

    let detectedType: "Voice" | "Image" | "Text" = "Text";
    let filePayload: { uri: string } | null = null;

    if (recordUri) {
      detectedType = "Voice";
      filePayload = { uri: recordUri };
    } else if (imageUri) {
      detectedType = "Image";
      filePayload = { uri: imageUri };
    } else if (images.length > 0) {
      detectedType = "Image";
      filePayload = { uri: images[0] };
    }

    const payload: UseCreateCommentType = {
      file: filePayload,
      userId: myUserId,
      parentCommentId: parentCommentId !== 0 ? parentCommentId : null,
      postId,
      content: message.trim(),
      type: detectedType,
    };

    createCommentMutation.mutate(payload, {
      onSuccess: () => {
        setMessage("");
        clearSelectedMedia();
      },
    });
  };

  // Kiểm tra nếu có bất kỳ media nào được chọn
  const hasMediaSelected =
    recordUri !== null || imageUri !== null || images.length > 0;

  // Xử lý khi hoàn thành ghi âm
  const handleVoiceRecordComplete = (uri: string | null) => {
    setRecordUri(uri);
    setIsOpenVoiceModal(false);
  };

  // Xử lý khi chụp ảnh xong
  const handleCaptureComplete = (uri: string) => {
    setImageUri(uri);
    setIsOpenCameraModal(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {hasMediaSelected && (
          <View style={styles.mediaPreview}>
            {(images.length > 0 || imageUri !== null) && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUri !== null ? imageUri : images[0] }}
                  style={styles.image}
                />
                <TouchableOpacity
                  style={styles.clearImage}
                  onPress={clearSelectedMedia}
                >
                  <MaterialIcons
                    name="clear"
                    size={buttonFontsize}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            )}
            {recordUri && (
              <View style={styles.audioContainer}>
                <AudioPlayer audioUri={recordUri} />
                <TouchableOpacity
                  style={styles.clearAudio}
                  onPress={clearSelectedMedia}
                >
                  <MaterialIcons
                    name="clear"
                    size={buttonFontsize}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <View style={styles.inputRow}>
          {message?.trim().length !== 0 ? (
            <TouchableOpacity onPress={() => setMessage("")}>
              <AntDesign
                name="right"
                size={buttonFontsize}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.leftInput}>
              {/* Hiển thị các button media chỉ khi không có media nào được chọn */}
              {!hasMediaSelected && (
                <>
                  <TouchableOpacity
                    onPress={() => handleSelectMediaType(MediaType.Image)}
                    style={styles.iconButton}
                  >
                    <Entypo
                      name="image"
                      size={buttonFontsize}
                      color={isDarkMode ? darkTheme.text : lightTheme.text}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSelectMediaType(MediaType.Camera)}
                    style={styles.iconButton}
                  >
                    <Entypo
                      name="camera"
                      size={buttonFontsize}
                      color={isDarkMode ? darkTheme.text : lightTheme.text}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSelectMediaType(MediaType.Voice)}
                    style={styles.iconButton}
                  >
                    <MaterialIcons
                      name="keyboard-voice"
                      size={buttonFontsize}
                      color={isDarkMode ? darkTheme.text : lightTheme.text}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          <View style={styles.inputContainer}>
            {parentCommentId !== 0 && (
              <Text style={styles.userName}>{userName + " "} </Text>
            )}

            <TextInput
              ref={inputRef}
              placeholder={
                parentCommentId === 0 ? `Comment on ${userName} post...` : ""
              }
              style={styles.textInput}
              placeholderTextColor={grey}
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={createCommentMutation.isPending}
          >
            {createCommentMutation.isPending ? (
              <ActivityIndicator
                size="small"
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
            ) : (
              <Ionicons
                name="send"
                size={buttonFontsize}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
            )}
          </TouchableOpacity>
        </View>

        <VoiceModal
          visible={isOpenVoiceModal}
          onClose={() => {
            setIsOpenVoiceModal(false);
            setSelectedMediaType(MediaType.None);
          }}
          onDone={handleVoiceRecordComplete}
        />
        <CameraModal
          visible={isOpenCameraModal}
          onClose={() => {
            setIsOpenCameraModal(false);
            setSelectedMediaType(MediaType.None);
          }}
          onCapture={handleCaptureComplete}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const getStyles = (isDarkMode: boolean, parentCommentId: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.02,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? "#333" : "#ddd",
    },
    leftInput: {
      flexDirection: "row",
    },
    mediaPreview: {
      marginBottom: height * 0.01,
    },
    imageContainer: {
      position: "relative",
    },
    image: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: 10,
    },
    clearImage: {
      position: "absolute",
      top: 5,
      right: 5,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    audioContainer: {
      position: "relative",
      flexDirection: "row",
      alignItems: "center",
    },
    clearAudio: {
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    iconButton: {
      paddingHorizontal: width * 0.02,
      paddingVertical: height * 0.01,
    },
    inputContainer: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: isDarkMode ? darkThemeInput : lightThemeInput,
      borderRadius: 20,
      paddingHorizontal: width * 0.03,
      paddingVertical: height * 0.005,
      marginRight: width * 0.02,
      alignItems: "flex-start",
    },
    userName: {
      color: primaryColor,
      fontSize: text12FontSize,
      fontWeight: "bold",
      alignSelf: "flex-start",
    },
    textInput: {
      alignSelf: "stretch",
      fontSize: text12FontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      maxHeight: height * 0.2,
      textAlignVertical: "top",
    },
    sendButton: {
      paddingHorizontal: width * 0.02,
      paddingVertical: height * 0.01,
    },
  });

export default CommentInput;
