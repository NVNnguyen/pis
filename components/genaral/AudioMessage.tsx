import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { primaryColor } from "@/utils/colorPrimary";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { darkThemeInput, lightThemeInput } from "@/utils/colorPrimary";

const { width, height } = Dimensions.get("window");
interface AudioPreviewProps {
  voiceUri: string;
}

const AudioMessage: React.FC<AudioPreviewProps> = ({ voiceUri }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundDuration, setSoundDuration] = useState<number>(0);
  const [playbackPosition, setPlaybackPosition] = useState<number>(0);
  const [audioWaveforms, setAudioWaveforms] = useState<number[]>([]);

  const soundRef = useRef<Audio.Sound | null>(null);
  const { isDarkMode } = useTheme();

  // Tạo mảng waveform giả lập
  const generateRandomWaveform = () => {
    const waveformPoints = [];
    for (let i = 0; i < 20; i++) {
      waveformPoints.push(0.2 + Math.random() * 0.8);
    }
    return waveformPoints;
  };

  // Xử lý khi URI audio thay đổi
  useEffect(() => {
    setAudioWaveforms(generateRandomWaveform());

    const loadAudio = async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: voiceUri },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );

        soundRef.current = sound;
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setSoundDuration(status.durationMillis || 0);
        }
      } catch (error) {
        console.error("Không thể tải file âm thanh:", error);
      }
    };

    loadAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [voiceUri]);

  // Cập nhật trạng thái playback
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlaybackPosition(0);
        if (soundRef.current) {
          soundRef.current.setPositionAsync(0);
        }
      }
    }
  };

  // Phát hoặc dừng audio
  const togglePlayback = async () => {
    if (!soundRef.current) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Lỗi khi phát/dừng âm thanh:", error);
    }
  };

  // Format thời gian
  const formatTime = (timeMs: number) => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.voicePreviewWrapper(isDarkMode)}>
      <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
        {isPlaying ? (
          <FontAwesome name="pause" size={16} color="white" />
        ) : (
          <FontAwesome name="play" size={16} color="white" />
        )}
      </TouchableOpacity>

      <View style={styles.waveformContainer}>
        {audioWaveforms.map((height, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: height * 30,
                backgroundColor:
                  index / audioWaveforms.length <
                  playbackPosition / soundDuration
                    ? primaryColor
                    : isDarkMode
                    ? darkTheme.text
                    : lightTheme.text,
              },
            ]}
          />
        ))}
      </View>

      <Text style={styles.durationText(isDarkMode)}>
        {formatTime(soundDuration)}
      </Text>
    </View>
  );
};

const styles = {
  voicePreviewWrapper: (isDarkMode: boolean) =>
    ({
      width: width * 0.5, // Đặt chiều rộng 50% màn hình
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? darkThemeInput : lightThemeInput,
      borderRadius: 12,
      padding: 10,
      marginBottom: 8,
      position: "relative",
      alignSelf: "flex-start", // Đảm bảo không chiếm toàn bộ chiều ngang
    } as const),
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  } as const,
  waveformContainer: {
    flex: 1,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 10,
  } as const,
  waveformBar: {
    width: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
  } as const,
  durationText: (isDarkMode: boolean) =>
    ({
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: 12,
      marginRight: 5,
    } as const),
  removePreviewButton: {
    position: "absolute",
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  } as const,
};

export default AudioMessage;
