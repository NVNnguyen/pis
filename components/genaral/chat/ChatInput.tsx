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
import { useSendMessage } from "@/hooks/useSendMessage";
import { SendMessageType } from "@/utils/types/SendMessageType";
import AudioPreview from "../AudioPreview";

const { width, height } = Dimensions.get("window");

interface ChatInputProp {
  conversationId: number;
  userId: number;
}

const ChatInput = ({ conversationId, userId }: ChatInputProp) => {
  const [message, setMessage] = useState<string>("");
  const [isVisibleVoice, setIsVisibleVoice] = useState<boolean>(false);
  const [isVisibleCamera, setIsVisibleCamera] = useState<boolean>(false);
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

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
      setPhoto(image);
      setImageUri(image);
    }
  }, [image]);

  const sendMessageMutation = useSendMessage();

  const clearMediaPreview = () => {
    setVoiceUri(null);
    setImageUri(null);
    setPhoto(null);
  };

  const handleSendMessage = () => {
    if (sendMessageMutation.isPending || myUserId === null) return;

    let detectedType: "Voice" | "Image" | "Text" = "Text";
    let filePayload: { uri: string } | null = null;

    if (voiceUri) {
      detectedType = "Voice";
      filePayload = { uri: voiceUri };
    } else if (imageUri) {
      detectedType = "Image";
      filePayload = { uri: imageUri };
    }
    if (!message.trim() && !filePayload) return;

    const payload: SendMessageType = {
      conversationId: conversationId,
      senderId: myUserId,
      content: message || "",
      file: filePayload || "",
      type: detectedType,
      userId: userId,
    };

    sendMessageMutation.mutate(payload, {
      onSuccess: () => {
        setMessage("");
        clearMediaPreview();
      },
    });
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
                  onPress={() => setIsVisibleCamera(true)}
                >
                  <Entypo
                    name="camera"
                    size={buttonFontsize}
                    color={primaryColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={openImagePicker}
                >
                  <FontAwesome6
                    name="image"
                    size={buttonFontsize}
                    color={primaryColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setIsVisibleVoice(true)}
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

            <TouchableOpacity
              style={styles.likeButton}
              onPress={handleSendMessage}
            >
              {message.trim().length > 0 || isPreviewVisible ? (
                <Ionicons
                  name="send"
                  size={buttonFontsize}
                  color={primaryColor}
                />
              ) : (
                <FontAwesome
                  name="thumbs-up"
                  size={buttonFontsize}
                  color={primaryColor}
                />
              )}
            </TouchableOpacity>
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
