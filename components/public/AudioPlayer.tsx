import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";

const { width, height } = Dimensions.get("window");

const AudioPlayer = ({ audioUri }: { audioUri: string }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  useEffect(() => {
    if (!audioUri) {
      console.warn("No audioUri provided!");
      return;
    }
    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [audioUri]); // Load lại nếu `audioUri` thay đổi

  const loadAudio = async () => {
    try {
      // Yêu cầu quyền truy cập âm thanh
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Allow access to play audio.");
        return;
      }

      // Cấu hình chế độ phát âm thanh
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true, // Để phát khi iPhone ở chế độ im lặng
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound, status: audioStatus } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false }
      );

      setSound(sound);

      if (audioStatus.isLoaded) {
        setDuration(audioStatus.durationMillis || 0);
      }

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);

          // Nếu bài hát phát xong, quay lại đầu
          if (status.didJustFinish) {
            await sound.setPositionAsync(0);
            setIsPlaying(false);
            setPosition(0);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          }
        }
      });
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      console.warn("Audio file is not loaded yet.");
      return;
    }

    const status = await sound.getStatusAsync();
    if (!status.isLoaded) {
      console.warn("Audio is still loading...");
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      await sound.playAsync();
      setIsPlaying(true);

      intervalRef.current = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
        }
      }, 500);
    }
  };

  // 🎵 **Hàm vẽ sóng âm giả lập**
  const generateWaveformPath = () => {
    const path = [];
    for (let i = 0; i < 40; i++) {
      const height = Math.random() * 50 + 10; // Random chiều cao sóng âm
      const x = (i / 40) * width * 0.8; // Độ rộng sóng âm
      path.push(`M${x},60 L${x},${60 - height}`);
    }
    return path.join(" ");
  };

  return (
    <View style={styles.container}>
      <View style={styles.waveformContainer}>
        <Svg height="80" width="100%">
          <Path
            d={generateWaveformPath()}
            stroke="#1DB954"
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      </View>

      <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={32}
          color={isDarkMode ? darkTheme.text : lightTheme.text}
        />
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{(position / 1000).toFixed(0)}s</Text>
        <Text style={styles.timeText}>{(duration / 1000).toFixed(0)}s</Text>
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: any) => {
  return StyleSheet.create({
    container: {
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      padding: width * 0.02,
      borderRadius: 10,
      alignItems: "center",
      width: "80%",
    },
    waveformContainer: {
      width: "100%",
      height: height * 0.08,
      justifyContent: "center",
      alignItems: "center",
    },
    playButton: {
      marginTop: height * 0.01,
      backgroundColor: isDarkMode ? lightTheme.text : darkTheme.text,
      padding: width * 0.015,
      borderRadius: 50,
    },
    progressContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      marginTop: height * 0.01,
    },
    timeText: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
    },
  });
};

export default AudioPlayer;
