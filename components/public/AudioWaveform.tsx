import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";

const AudioWaveform = ({ isRecording, barCount = 7 }: any) => {
  // Create animated value refs for each bar
  const animatedValues = useRef(
    Array(barCount)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;

  const [animations, setAnimations] = useState<Animated.CompositeAnimation[]>(
    []
  );

  useEffect(() => {
    if (isRecording) {
      // Create animations for each bar
      const newAnimations = animatedValues.map((value, index) => {
        // Random duration between 300ms and 700ms for natural effect
        const duration = 300 + Math.random() * 400;

        // Create sequence of animations for each bar
        return Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1,
              duration: duration,
              useNativeDriver: false,
            }),
            Animated.timing(value, {
              toValue: 0,
              duration: duration,
              useNativeDriver: false,
            }),
          ])
        );
      });

      setAnimations(newAnimations);

      // Start all animations
      newAnimations.forEach((anim) => anim.start());

      // Cleanup function
      return () => {
        newAnimations.forEach((anim) => anim.stop());
      };
    } else {
      // Stop all animations when not recording
      animations.forEach((anim) => anim.stop());

      // Reset all bars to initial position
      animatedValues.forEach((value) => value.setValue(0));
    }
  }, [isRecording]);

  return (
    <View style={styles.container}>
      {animatedValues.map((value, index) => {
        // Calculate bar height - the middle bars should be taller
        const maxHeight = 30;
        const baseHeight = 10;

        // Create height distribution - taller in middle, shorter at edges
        const distributionFactor =
          1 - Math.abs((index - (barCount - 1) / 2) / ((barCount - 1) / 2));
        const barMaxHeight = baseHeight + maxHeight * distributionFactor;

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: [5, barMaxHeight],
                }),
                opacity: value.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.5, 1, 0.5],
                }),
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  bar: {
    width: 4,
    backgroundColor: "#007AFF",
    marginHorizontal: 2,
    borderRadius: 2,
  },
});

export default AudioWaveform;
