"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import type { PostItemType } from "@/utils/types/PostItemType";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ITEM_MARGIN = 4;
const ITEM_SIZE = (width - ITEM_MARGIN * 4) / 3;

interface VoiceProp extends PostItemType {
  isLoadingUrl?: boolean;
  size?: number;
  onPress?: () => void;
}

const Voice = ({
  id,
  caption,
  images,
  type,
  isLoadingUrl,
  size = ITEM_SIZE,
  onPress,
}: VoiceProp) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, size);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const waveAnimations = useRef(
    [...Array(5)].map(() => new Animated.Value(0))
  ).current;

  const startWaveAnimation = () => {
    waveAnimations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 300 + index * 100,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300 + index * 100,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const stopWaveAnimation = () => {
    waveAnimations.forEach((anim) => anim.stopAnimation());
  };

  const handlePlayPause = async (e: any) => {
    // Stop event propagation to prevent modal from opening
    e.stopPropagation();

    if (!images?.[0]?.url) return;

    if (isPlaying && sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      stopWaveAnimation();
    } else {
      try {
        if (!sound) {
          setIsLoading(true);
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: images[0].url },
            { shouldPlay: true }
          );
          setSound(newSound);
          setIsPlaying(true);
          setIsLoading(false);
          startWaveAnimation();

          newSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
              stopWaveAnimation();
              setSound(null);
            }

            if (!status.isLoaded && status.error) {
              setIsPlaying(false);
              stopWaveAnimation();
              setSound(null);
            }
          });
        } else {
          await sound.playAsync();
          setIsPlaying(true);
          startWaveAnimation();
        }
      } catch (err) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
        setSound(null);
      }
      stopWaveAnimation();
    };
  }, [sound]);

  return (
    <View style={styles.itemWrapper}>
      {type === "Voice" && isLoadingUrl ? (
        <ActivityIndicator
          style={styles.voiceLoader}
          color={isDarkMode ? lightTheme.text : darkTheme.text}
        />
      ) : (
        <View style={styles.audioWrapper}>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={isDarkMode ? lightTheme.text : darkTheme.text}
            />
          ) : (
            <>
              <TouchableOpacity
                onPress={handlePlayPause}
                style={styles.playButton}
              >
                <Ionicons
                  name={isPlaying ? "pause-circle" : "play-circle"}
                  size={36}
                  color={isDarkMode ? lightTheme.text : darkTheme.text}
                />
              </TouchableOpacity>

              {/* Sóng âm động */}
              <View style={styles.waveContainer}>
                {waveAnimations.map((anim, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.waveBar,
                      {
                        transform: [
                          {
                            scaleY: anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [1, 2],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                ))}
              </View>

              {/* Hiển thị thông tin nếu double tap */}
              {showDetail && (
                <View style={styles.audioDetail}>
                  <Text style={styles.audioText}>
                    🎵 {caption || "Audio Detail"}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

const getStyles = (isDarkMode: boolean, size: number) =>
  StyleSheet.create({
    itemWrapper: {
      width: size,
      height: size,
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      borderRadius: 10,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },
    audioWrapper: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    playButton: {
      marginBottom: 4,
      zIndex: 10,
    },
    waveContainer: {
      flexDirection: "row",
      gap: 4,
      marginTop: 4,
      height: 20,
      alignItems: "flex-end",
    },
    waveBar: {
      width: 4,
      height: 12,
      borderRadius: 2,
      backgroundColor: "#00bfff",
    },
    audioDetail: {
      marginTop: 8,
      paddingHorizontal: 6,
      backgroundColor: isDarkMode ? "#333" : "#eee",
      borderRadius: 6,
    },
    audioText: {
      fontSize: 12,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      textAlign: "center",
    },
    voiceLoader: {
      width: "100%",
      height: "100%",
    },
  });

export default Voice;
