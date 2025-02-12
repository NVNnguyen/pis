import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { fontWeight } from "@/styles/color";

interface CreatePostModelProps {
  visible: boolean;
  onClose: () => void;
  images: string[];
}

const { width, height } = Dimensions.get("window");

const CreatePostModel: React.FC<CreatePostModelProps> = ({
  visible,
  onClose,
  images,
}) => {
  const [postText, setPostText] = useState("");
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [imageSizes, setImageSizes] = useState<{
    [key: string]: { width: number; height: number };
  }>({});

  // Lấy kích thước ảnh khi danh sách `images` thay đổi
  useEffect(() => {
    images.forEach((uri) => {
      Image.getSize(uri, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        setImageSizes((prevSizes) => ({
          ...prevSizes,
          [uri]: {
            width: width * 0.4, // Ảnh chiếm 80% chiều rộng màn hình
            height: (width * 0.4) / aspectRatio, // Chiều cao theo tỷ lệ gốc
          },
        }));
      });
    });
  }, [images]);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
            <TouchableOpacity
              style={[styles.postButton, !postText && styles.disabledPost]}
              disabled={!postText}
            >
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.avatar}
            />
            <TextInput
              style={styles.input}
              placeholder="What's new?"
              placeholderTextColor="#999"
              multiline
              value={postText}
              onChangeText={setPostText}
            />
          </View>

          {/* Hiển thị danh sách ảnh */}
          {images.length > 0 && (
            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item }}
                  style={[
                    styles.image,
                    imageSizes[item] && {
                      width: imageSizes[item].width,
                      height: imageSizes[item].height,
                    },
                  ]}
                />
              )}
            />
          )}

          {/* Action Icons */}
          <View style={styles.actionRow}>
            <Ionicons name="image-outline" size={24} color="#666" />
            <Ionicons name="camera-outline" size={24} color="#666" />
            <Ionicons name="mic-outline" size={24} color="#666" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: width,
      height: "80%",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderRadius: 15,
      padding: width * 0.03,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#999",
      paddingBottom: height * 0.01,
    },
    cancelText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: height * 0.016,
    },
    headerTitle: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: height * 0.018,
      fontWeight: "bold",
    },
    postButton: {
      backgroundColor: "#1E90FF",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
    },
    disabledPost: {
      backgroundColor: "#444",
    },
    postText: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontWeight: fontWeight,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 15,
    },
    avatar: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: (width * 0.1) / 2,
      marginRight: width * 0.02,
    },
    input: {
      flex: 1,
      color: Colors,
      fontSize: height * 0.016,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: height * 0.015,
    },
    image: {
      width: width * 0.5, // Mặc định
      height: width * 0.5,
      margin: 5,
      borderRadius: 10,
      resizeMode: "cover",
    },
  });

export default CreatePostModel;
