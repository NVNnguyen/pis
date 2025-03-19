import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { buttonFontsize, Color, textFontSize } from "@/styles/stylePrimary";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  darkThemeInput,
  lightThemeInput,
  primaryColor,
} from "@/utils/colorPrimary";
import { useMyUserId } from "@/hooks/useMyUserId";
import CameraModal from "@/components/public/Modals/CameraModal";
import VoiceModal from "@/components/public/Modals/VoiceModal";
import useImagePickerChooseOne from "@/hooks/useImagePickerChooseOne";
import AudioPreview from "../AudioPreview";
import { useRoute } from "@react-navigation/native";
import { useHandleSendMessage } from "@/hooks/useHandleSendMessage";
import { useQueryClient } from "@tanstack/react-query";

const { width, height } = Dimensions.get("window");

const ChatInput = () => {
  const [message, setMessage] = useState<string>("");
  const [isVisibleVoice, setIsVisibleVoice] = useState<boolean>(false);
  const [isVisibleCamera, setIsVisibleCamera] = useState<boolean>(false);
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoadingSendMessage, setIsLoadingSendMessage] =
    useState<boolean>(false);
  const route = useRoute();
  const { userId: partnerUserId } = route.params as { userId: number };
  const myUserId = useMyUserId() ?? 0;
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const {
    image,
    openImagePicker,
    isModalVisible,
    setIsModalVisible,
    removeImage,
  } = useImagePickerChooseOne();

  useEffect(() => {
    if (image) {
      setImageUri(image);
    }
  }, [image]);

  const queryClient = useQueryClient();

  const clearMediaPreview = () => {
    setVoiceUri(null);
    setImageUri(null);
  };

  const { handleSendMessage } = useHandleSendMessage();
  const onSendMessage = async () => {
    // Đặt message về "" ngay khi bắt đầu gửi tin nhắn
    if (message.trim().length > 0) {
      setMessage(""); // Reset message ngay lập tức khi gửi
    }

    const result = await handleSendMessage({
      myUserId,
      partnerUserId,
      voiceUri: voiceUri || "",
      imageUri: imageUri || "",
      message,
    });
    console.log("result", result);

    if (result?.isPending) {
      setIsLoadingSendMessage(true);
    }
    if (result?.isSuccess) {
      setIsLoadingSendMessage(false);
      clearMediaPreview();
      setIsVisibleVoice(false); // Đóng modal voice
      setVoiceUri(null); // Reset voiceUri
      setIsVisibleCamera(false);
      setImageUri(null);
      queryClient.invalidateQueries({
        queryKey: ["message", myUserId, partnerUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversation", myUserId, partnerUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["newMessage", myUserId, partnerUserId],
      });
    }
    if (result?.isError) {
      console.log("result", result);
    }
  };

  const onSendThumbsUp = async () => {
    const result = await handleSendMessage({
      myUserId,
      partnerUserId,
      voiceUri: voiceUri || "",
      imageUri: imageUri || "",
      message: "thumbs-up",
    });
    console.log("result", result);
    if (result?.isSuccess) {
      setMessage("");
      clearMediaPreview();
      queryClient.invalidateQueries({
        queryKey: ["message", myUserId, partnerUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversation", myUserId, partnerUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["newMessage", myUserId, partnerUserId],
      });
    }
    if (result?.isError) {
      console.log("result", result);
    }
  };

  const handleOpenModal = (mode: string) => {
    if (mode === "camera") {
      setIsVisibleCamera(true);
      setVoiceUri(null);
    } else if (mode === "voice") {
      setIsVisibleVoice(true);
      setImageUri(null);
    } else if (mode === "image") {
      openImagePicker();
      setVoiceUri(null);
    }
  };

  const isPreviewVisible = voiceUri || imageUri;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
          {isPreviewVisible && (
            <View style={styles.previewContainer}>
              {imageUri && (
                <View style={styles.imagePreviewWrapper}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removePreviewButton}
                    onPress={clearMediaPreview}
                  >
                    <MaterialIcons name="close" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              )}

              {voiceUri && (
                <AudioPreview
                  voiceUri={voiceUri}
                  onRemove={clearMediaPreview}
                />
              )}
            </View>
          )}

          <View style={styles.container}>
            {message.trim().length !== 0 ? (
              <TouchableOpacity onPress={() => setMessage("")}>
                <AntDesign
                  name="right"
                  size={buttonFontsize}
                  color={primaryColor}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconsContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleOpenModal("camera")}
                >
                  <Entypo
                    name="camera"
                    size={buttonFontsize}
                    color={primaryColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleOpenModal("image")}
                >
                  <FontAwesome6
                    name="image"
                    size={buttonFontsize}
                    color={primaryColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleOpenModal("voice")}
                >
                  <FontAwesome
                    name="microphone"
                    size={buttonFontsize}
                    color={primaryColor}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Aa"
                style={styles.textInput}
                placeholderTextColor={
                  isDarkMode ? darkTheme.text : lightTheme.text
                }
                value={message}
                onChangeText={(text) => setMessage(text)}
              />
            </View>

            {message.trim().length > 0 || isPreviewVisible ? (
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => onSendMessage()}
              >
                {isLoadingSendMessage ? (
                  <ActivityIndicator size="small" color={primaryColor} />
                ) : (
                  <Ionicons
                    name="send"
                    size={buttonFontsize}
                    color={primaryColor}
                  />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => onSendThumbsUp()}
              >
                {isLoadingSendMessage ? (
                  <ActivityIndicator size="small" color={primaryColor} />
                ) : (
                  <FontAwesome
                    name="thumbs-up"
                    size={buttonFontsize}
                    color={primaryColor}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      <CameraModal
        visible={isVisibleCamera}
        onCapture={(uri) => {
          setImageUri(uri);
          setIsVisibleCamera(false);
        }}
        onClose={() => setIsVisibleCamera(false)}
      />
      <VoiceModal
        visible={isVisibleVoice}
        onDone={(uri) => {
          setVoiceUri(uri);
          setIsVisibleVoice(false);
        }}
        onClose={() => setIsVisibleVoice(false)}
        onReset={() => setVoiceUri(null)}
      />
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      width: "100%",
    },
    mainContainer: {
      width: "100%",
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      width: "100%",
      paddingVertical: height * 0.01,
    },
    previewContainer: {
      width: "100%",
      paddingHorizontal: width * 0.02,
      paddingVertical: height * 0.01,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    imagePreviewWrapper: {
      position: "relative",
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 8,
    },
    imagePreview: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
    },
    removePreviewButton: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    iconsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      width: "40%",
    },
    iconButton: {
      paddingHorizontal: width * 0.005,
      paddingVertical: height * 0.005,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? darkThemeInput : lightThemeInput,
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: width * 0.01,
      marginHorizontal: width * 0.005,
    },
    textInput: {
      flex: 1,
      fontSize: textFontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      paddingVertical: height * 0.005,
    },
    likeButton: {
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.01,
    },
  });

export default ChatInput;
