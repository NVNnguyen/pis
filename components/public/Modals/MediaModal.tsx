import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  textFontSize,
  textPostFontSize,
  fontWeight,
} from "@/styles/stylePrimary";
import AudioPlayer from "../AudioPlayer";

const { width, height } = Dimensions.get("window");

interface MediaModalProps {
  visible: boolean;
  onClose: () => void;
  mediaType: "photo" | "voice";
  mediaItems: any[];
  initialIndex?: number;
}

const MediaModal = ({
  visible,
  onClose,
  mediaType,
  mediaItems,
  initialIndex = 0,
}: MediaModalProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, width, height);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const flatListRef = React.useRef<FlatList>(null);
  console.log("mediaItems", mediaItems);
  useEffect(() => {
    if (visible && flatListRef.current && initialIndex > 0) {
      // Scroll to initial index when modal opens
      flatListRef.current.scrollToIndex({
        index: initialIndex,
        animated: false,
      });
    }
  }, [visible, initialIndex]);

  useEffect(() => {
    // Reset current index when modal closes
    if (!visible) {
      setCurrentIndex(0);
    }
  }, [visible]);

  const renderPhotoItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.mediaItemContainer}>
      {/* {isImageLoading && <ActivityIndicator />}
      {!isImageLoading && ( */}
      <Image
        source={{ uri: item?.images?.[0]?.url }}
        style={styles.fullImage}
        onLoadStart={() => setIsImageLoading(true)}
        onLoadEnd={() => setIsImageLoading(false)}
        resizeMode="cover"
      />
      {/* )} */}
      {item.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>{item.caption}</Text>
        </View>
      )}
    </View>
  );

  const renderVoiceItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.mediaItemContainer}>
      <View style={styles.voiceContainer}>
        <AudioPlayer audioUri={item.images?.[0]?.url} />
        {item.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionText}>{item.caption}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons
              name="close"
              size={width * 0.07}
              color={isDarkMode ? darkTheme.text : lightTheme.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mediaType === "photo" ? "Photo Posts" : "Voice Posts"}
          </Text>
          <Text style={styles.counterText}>
            {currentIndex + 1}/{mediaItems.length}
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={mediaItems}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={mediaType === "photo" ? renderPhotoItem : renderVoiceItem}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          initialScrollIndex={initialIndex}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />

        {mediaItems.length > 1 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === 0 && styles.disabledButton,
              ]}
              onPress={() => {
                if (currentIndex > 0 && flatListRef.current) {
                  flatListRef.current.scrollToIndex({
                    index: currentIndex - 1,
                  });
                }
              }}
              disabled={currentIndex === 0}
            >
              <MaterialIcons
                name="navigate-before"
                size={width * 0.08}
                color={
                  currentIndex === 0
                    ? "#666"
                    : isDarkMode
                    ? darkTheme.text
                    : lightTheme.text
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === mediaItems.length - 1 && styles.disabledButton,
              ]}
              onPress={() => {
                if (
                  currentIndex < mediaItems.length - 1 &&
                  flatListRef.current
                ) {
                  flatListRef.current.scrollToIndex({
                    index: currentIndex + 1,
                  });
                }
              }}
              disabled={currentIndex === mediaItems.length - 1}
            >
              <MaterialIcons
                name="navigate-next"
                size={width * 0.08}
                color={
                  currentIndex === mediaItems.length - 1
                    ? "#666"
                    : isDarkMode
                    ? darkTheme.text
                    : lightTheme.text
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const getStyles = (isDarkMode: boolean, width: number, height: number) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.005,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#333" : "#eee",
    },
    headerTitle: {
      fontSize: textPostFontSize,
      fontWeight: "bold",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    closeButton: {
      padding: width * 0.02,
    },
    counterText: {
      fontSize: textFontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    mediaItemContainer: {
      width: width,
      height: height * 0.9,
      justifyContent: "center",
      alignItems: "center",
    },
    fullImage: {
      width: width * 0.99,
      height: height * 0.55,
      borderRadius: 30,
      marginBottom: height * 0.2,
    },
    voiceContainer: {
      width: width * 0.9,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: 15,
      padding: width * 0.05,
    },
    captionContainer: {
      marginTop: height * 0.02,
      padding: width * 0.03,
      backgroundColor: isDarkMode ? "#333" : "#eee",
      borderRadius: 10,
      width: width * 0.9,
      position: "absolute",
      bottom: height * 0.2,
    },
    captionText: {
      fontSize: textFontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      textAlign: "center",
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: width * 0.04,
      position: "absolute",
      bottom: height * 0.05,
      left: 0,
      right: 0,
    },
    navButton: {
      backgroundColor: isDarkMode
        ? "rgba(50, 50, 50, 0.7)"
        : "rgba(240, 240, 240, 0.7)",
      borderRadius: 50,
      padding: width * 0.02,
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

export default MediaModal;
