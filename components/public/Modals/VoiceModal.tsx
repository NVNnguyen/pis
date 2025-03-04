import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { useState } from "react";
import { Audio } from "expo-av";
import {
  buttonFontsize,
  fontWeight,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { Recording } from "expo-av/build/Audio";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import AudioWaveform from "../AudioWaveform";
import AudioPlayer from "../AudioPlayer";
import { AntDesign } from "@expo/vector-icons";

interface VoiceModalProp {
  visible: boolean;
  onClose: () => void;
  onDone: (uri: string | null) => void;
}
const { width, height } = Dimensions.get("window");

const VoiceModal = ({ visible, onDone, onClose }: VoiceModalProp) => {
  const [recording, setRecording] = useState<Recording>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordUri, setRecordUri] = useState<string | null>();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    if (recording) {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      setRecordUri(recording.getURI());
    }
  }

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.viewContainer}>
        {/* Header */}

        <View style={styles.header}>
          {recordUri && (
            <TouchableOpacity onPress={() => setRecordUri(null)}>
              <AntDesign
                name="back"
                size={buttonFontsize}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
          {recordUri && (
            <TouchableOpacity
              style={styles.btnDone}
              onPress={() => {
                onDone(recordUri);
                onClose();
              }}
            >
              <Text style={styles.txtDone}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Nội dung chính */}
        <View style={styles.content}>
          {recordUri ? (
            <AudioPlayer audioUri={recordUri} />
          ) : (
            <AudioWaveform isRecording={recording} />
          )}
        </View>

        {/* Nút ghi âm */}
        {!recordUri ? (
          <View style={styles.recordContainer}>
            <TouchableOpacity
              onPress={recording ? stopRecording : startRecording}
            >
              <View style={styles.recordBtn}>
                <View style={styles.recordInnerBtn}></View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </Modal>
  );
};

const getStyles = (isDarkMode: boolean) => {
  return StyleSheet.create({
    viewContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between", // Chia đều 3 phần
      alignItems: "center",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingVertical: height * 0.05,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 20,
      position: "absolute",
      top: 50,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      width: "100%",
      height: 1000, // Thêm chiều cao để `AudioPlayer` có không gian hiển thị
      paddingHorizontal: width * 0.05,
    },
    recordContainer: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      marginBottom: height * 0.05,
    },
    recordBtn: {
      width: width * 0.17,
      height: width * 0.17,
      borderRadius: (width * 0.17) / 2,
      backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
    },
    recordInnerBtn: {
      width: width * 0.15,
      height: width * 0.15,
      borderRadius: (width * 0.15) / 2,
      backgroundColor: "red",
      borderWidth: 5,
      borderColor: isDarkMode ? lightTheme.text : darkTheme.text,
    },
    btnDone: {
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      width: width * 0.15,
      height: height * 0.03,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    cancelTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      fontWeight: fontWeight,
    },
    txtDone: {
      fontSize: textPostFontSize,
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontWeight: fontWeight,
    },
  });
};

export default VoiceModal;
