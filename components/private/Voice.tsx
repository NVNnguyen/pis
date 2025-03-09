import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { PostItemType } from "@/utils/types/PostItemType";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ITEM_MARGIN = 4;
const ITEM_SIZE = (width - ITEM_MARGIN * 4) / 3;

interface VoiceProp extends PostItemType {
  isLoadingUrl: boolean;
}
const Voice = ({ id, caption, images, type, isLoadingUrl }: VoiceProp) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lastTap = useRef<number | null>(null);
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

  const handlePress = async () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      setShowDetail((prev) => !prev);
    } else {
      handlePlayPause();
    }
    lastTap.current = now;
  };

  const handlePlayPause = async () => {
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
              console.log("Playback Error:", status.error);
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
        console.log("Error loading audio:", err);
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
        <ActivityIndicator />
      ) : (
        <TouchableWithoutFeedback onPress={handlePress}>
          <View style={styles.audioWrapper}>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={isDarkMode ? lightTheme.text : darkTheme.text}
              />
            ) : (
              <>
                <Ionicons
                  name={isPlaying ? "pause-circle" : "play-circle"}
                  size={36}
                  color={isDarkMode ? lightTheme.text : darkTheme.text}
                  style={{ marginBottom: 4 }}
                />
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
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    itemWrapper: {
      width: ITEM_SIZE,
      height: ITEM_SIZE,
      margin: ITEM_MARGIN,
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
      color: isDarkMode ? "#fff" : "#000",
      textAlign: "center",
    },
  });

export default Voice;
