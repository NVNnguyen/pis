// Trong file Gallery.tsx
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
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { PostItemType } from "@/utils/types/PostItemType";
import { Ionicons } from "@expo/vector-icons";
import MediaModal from "./Modals/MediaModal"; // Đảm bảo import đúng

const { width } = Dimensions.get("window");
const ITEM_MARGIN = 4;
const ITEM_SIZE = (width - ITEM_MARGIN * 4) / 3;

const Gallery = ({
  id,
  caption,
  images,
  type,
  onPress, // Thêm prop onPress
}: PostItemType & { onPress?: () => void }) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
              setIsPlaying(false);
              stopWaveAnimation();
              setSound(null);
              console.error("Error playing audio:", status.error);
            }
          });
        } else {
          await sound.playAsync();
          setIsPlaying(true);
          startWaveAnimation();
        }
      } catch (err) {
        setIsLoading(false);
        console.error("Error loading audio:", err);
      }
    }
  };

  const handlePress = async () => {
    const now = Date.now();
    const isDoubleTap = lastTap.current && now - lastTap.current < 300;

    if (type === "Image" || type === "Voice") {
      if (onPress) {
        onPress(); // Gọi callback từ ProfileScreen
      } else if (type === "Voice" && !isDoubleTap) {
        await handlePlayPause();
      }
    }

    lastTap.current = now;
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      stopWaveAnimation();
    };
  }, [sound]);

  return (
    <View style={styles.itemWrapper}>
      {type === "Image" && (
        <TouchableWithoutFeedback onPress={handlePress}>
          <Image source={{ uri: images?.[0]?.url }} style={styles.image} />
        </TouchableWithoutFeedback>
      )}

      {type === "Voice" && (
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
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
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
  });

export default Gallery;
