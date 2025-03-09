import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import {
  MaterialIcons,
  Feather,
  FontAwesome,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import {
  buttonFontsize,
  Color,
  fontWeight,
  textPostFontSize,
  titleFontsize,
} from "@/styles/stylePrimary";
import VoiceModal from "../public/Modals/VoiceModal";
import AudioPlayer from "../public/AudioPlayer";
import useImagePickerChooseOne from "@/hooks/useImagePickerChooseOne";
import { useCreatePost } from "@/hooks/useCreatePost";
import { getMyUserId } from "@/hooks/getMyUserID";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { primaryColor } from "@/utils/colorPrimary";

const { width, height } = Dimensions.get("window");

const CapTure = () => {
  const [isOpenVoice, setIsOpenVoice] = useState<boolean>(false);
  const [uriVoice, setUriVoice] = useState<string | null>(null);
  const { image, openImagePicker } = useImagePickerChooseOne();
  const [photo, setPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [resultImage, setResultImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [content, setContent] = useState<string>("");
  const [isLoadingCreatePost, setIsLoadingCreatePost] =
    useState<boolean>(false);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const iconColorMode = isDarkMode ? darkTheme.text : lightTheme.text;
  const textInputRef = useRef<TextInput | null>(null);
  const myUserId = Number(getMyUserId());
  const createPostMutation = useCreatePost();

  const handleToggleCameraFacing = () => {
    setFacing((prevFacing) => (prevFacing === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash(flash === "off" ? "on" : "off");
  };

  const captureImageHandler = async () => {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
          skipProcessing: true,
        });
        if (result?.uri) {
          setResultImage(result.uri);
        }
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    }
  };

  const focusTextInput = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (image) {
      setPhoto(image);
      setUriVoice(null);
      setResultImage(null);
    }
  }, [image]);

  useEffect(() => {
    if (uriVoice) {
      setPhoto(null);
      setResultImage(null);
    }
  }, [uriVoice]);

  useEffect(() => {
    if (resultImage) {
      setPhoto(null);
      setUriVoice(null);
    }
  }, [resultImage]);

  const handleCreatePost = () => {
    setIsLoadingCreatePost(true);
    const files = [];

    if (resultImage) {
      files.push({
        uri: resultImage,
        type: "image/jpeg",
        name: "captured_image.jpg",
      });
    }

    if (photo) {
      files.push({
        uri: image!,
        type: "image/jpeg",
        name: `image_${Date.now()}.jpg`,
      });
    }

    if (uriVoice) {
      files.push({
        uri: uriVoice!,
        type: "audio/mpeg",
        name: "audio.mp3",
      });
    }

    createPostMutation.mutate(
      {
        userId: myUserId,
        type: uriVoice ? "Voice" : "Image",
        content: content,
        mode: "Private",
        files: files.length > 0 ? files : undefined,
      },
      {
        onSuccess: () => {
          setIsLoadingCreatePost(false);
          setUriVoice(null);
          setResultImage(null);
          setPhoto(null);
          setContent("");
        },
        onError: (error) => {
          Alert.alert(
            "Create post error",
            "Can't create post. Please try again!"
          );
          setIsLoadingCreatePost(false);
        },
      }
    );
  };

  if (!permission) {
    return <Text>Requesting camera permissions...</Text>;
  }

  if (!permission.granted) {
    return <Text>Camera permissions are required to use this app.</Text>;
  }
  const handleClear = () => {
    setUriVoice(null);
    setResultImage(null);
    setPhoto(null);
    setContent("");
  };

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {uriVoice ? (
          <AudioPlayer audioUri={uriVoice} />
        ) : photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : resultImage ? (
          <Image source={{ uri: resultImage }} style={styles.photo} />
        ) : (
          <CameraView
            style={styles.cameraView}
            facing={facing}
            ref={cameraRef}
            flash={flash}
          >
            <TouchableOpacity style={styles.flashBtn} onPress={toggleFlash}>
              <MaterialIcons
                name={flash === "on" ? "flash-on" : "flash-off"}
                size={buttonFontsize}
                color={Color}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleToggleCameraFacing}
            >
              <MaterialIcons
                name="flip-camera-ios"
                size={width * 0.08}
                color={Color}
              />
            </TouchableOpacity>
          </CameraView>
        )}
      </View>

      {/* Content input field */}
      {(uriVoice || photo || resultImage) && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "position" : "height"}
          style={styles.keyboardAvoidingInput}
          keyboardVerticalOffset={Platform.OS === "ios" ? -height * 0.2 : 0}
        >
          <TouchableWithoutFeedback onPress={focusTextInput}>
            <View style={styles.contentContainer}>
              <View style={styles.contentInputContainer}>
                <TextInput
                  ref={textInputRef}
                  style={styles.contentInput}
                  placeholder="What's on your mind?"
                  placeholderTextColor="#999"
                  value={content}
                  onChangeText={setContent}
                  multiline
                  maxLength={150}
                />
              </View>
              <View style={styles.sendContainer}>
                <TouchableOpacity onPress={() => handleCreatePost()}>
                  {isLoadingCreatePost ? (
                    <ActivityIndicator />
                  ) : (
                    content.length > 0 && (
                      <FontAwesome
                        style={styles.btnSentContent}
                        name="send"
                        size={width * 0.08}
                        color={isDarkMode ? darkTheme.text : lightTheme.text}
                      />
                    )
                  )}
                </TouchableOpacity>
                <Text style={styles.charCount}>{content.length}/150</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        {uriVoice || resultImage || photo ? (
          <TouchableOpacity
            onPress={() => {
              handleClear();
            }}
          >
            <MaterialIcons
              name="clear"
              size={width * 0.08}
              color={iconColorMode}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsOpenVoice(true)}
          >
            <FontAwesome5
              name="microphone"
              size={width * 0.08}
              color={iconColorMode}
            />
          </TouchableOpacity>
        )}

        {uriVoice || resultImage || photo ? (
          <TouchableOpacity
            style={[
              styles.btnSend,
              isLoadingCreatePost && styles.disabledButton,
            ]}
            onPress={handleCreatePost}
            disabled={isLoadingCreatePost}
          >
            {isLoadingCreatePost ? (
              <ActivityIndicator />
            ) : (
              <FontAwesome
                name="send"
                size={width * 0.08}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={captureImageHandler}
          >
            <View style={styles.captureInner}></View>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.iconButton} onPress={openImagePicker}>
          <Entypo name="images" size={width * 0.08} color={iconColorMode} />
        </TouchableOpacity>
      </View>

      <VoiceModal
        visible={isOpenVoice}
        onDone={(uri) => setUriVoice(uri)}
        onClose={() => setIsOpenVoice(false)}
      />
    </View>
  );
};

const getStyles = (isDarkMode: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: width * 0.05,
      paddingVertical: height * 0.02,
      justifyContent: "space-between",
    },
    avatar: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: width * 0.05,
    },
    notification: {
      position: "relative",
    },
    notificationBadge: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: "#f00",
      color: Color,
      borderRadius: 10,
      paddingHorizontal: width * 0.01,
      fontSize: width * 0.03,
      fontWeight: fontWeight,
    },
    cameraContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      borderRadius: 30,
    },
    cameraView: {
      width: width,
      height: "80%",
      borderRadius: 30,
      overflow: "hidden",
      position: "relative",
    },
    photo: {
      width: width,
      height: "80%",
      borderRadius: 30,
      overflow: "hidden",
    },
    flashBtn: {
      position: "absolute",
      top: height * 0.01,
      left: width * 0.05,
      padding: 10,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: 30,
      zIndex: 100,
    },
    refreshButton: {
      position: "absolute",
      top: height * 0.01,
      right: width * 0.05,
      padding: 10,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: 30,
      zIndex: 100,
    },
    keyboardAvoidingInput: {
      position: "absolute",
      width: "100%",
      alignItems: "center",
      zIndex: 10,
    },
    contentContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "rgba(240, 240, 240, 0.9)",
      borderRadius: 15,
      padding: 10,
      width: width * 0.9,
      marginVertical: 10,
      left: "5%",
      right: "5%",
      transform: [{ translateY: -50 }],
      top: height * 0.45,
      zIndex: 10,
      minHeight: 80,
    },
    contentInputContainer: {
      flex: 1,
      width: "80%",
    },
    contentInput: {
      fontSize: textPostFontSize,
      width: "100%",
    },
    sendContainer: {
      width: "20%",
      alignItems: "center",
    },
    charCount: {
      fontSize: 12,
      color: "#999",
      marginTop: 5,
    },
    btnSentContent: {
      // No positioning needed anymore
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: width * 0.08,
      marginBottom: height * 0.17,
      paddingBottom: 40,
      zIndex: 5,
    },
    iconButton: {
      padding: width * 0.04,
      borderRadius: width * 0.1,
    },
    captureButton: {
      width: width * 0.18,
      height: width * 0.18,
      borderRadius: width * 0.09,
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 5,
      borderColor: primaryColor,
    },
    captureInner: {
      width: width * 0.12,
      height: width * 0.12,
      borderRadius: width * 0.06,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderWidth: 5,
      borderColor: primaryColor,
    },
    btnSend: {
      width: width * 0.18,
      height: width * 0.18,
      borderRadius: width * 0.09,
      backgroundColor: darkTheme ? darkTheme.background : lightTheme.background,
      justifyContent: "center",
      alignItems: "center",
    },

    memoriesButton: {
      alignSelf: "center",
      padding: height * 0.01,
    },
    memoriesText: {
      color: Color,
      fontSize: width * 0.045,
    },
    disabledButton: {
      opacity: 0.7,
    },
  });
};

export default CapTure;
