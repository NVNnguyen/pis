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
import { Ionicons, MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { fontWeight } from "@/styles/color";
import useImagePicker from "@/hooks/useImagePicker";
import { useQueryClient } from "@tanstack/react-query";

interface CreatePostModelProps {
  visible: boolean;
  onClose: () => void;
  imagesProp: string[];
  removeImageProp: (uri: string) => void;
}

const { width, height } = Dimensions.get("window");

const CreatePostModel: React.FC<CreatePostModelProps> = ({
  visible,
  onClose,
  imagesProp,
  removeImageProp,
}) => {
  const [postText, setPostText] = useState("");
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [imageSizes, setImageSizes] = useState<{
    [key: string]: { width: number; height: number };
  }>({});
  const { images, removeImage, permission, openImagePicker } = useImagePicker();

  // Lấy kích thước ảnh khi danh sách `images` thay đổi

  useEffect(() => {
    if (imagesProp.length > 0) {
      imagesProp.forEach((uri) => {
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
    } else if (images.length > 0) {
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
    }
  }, [imagesProp, images]);

  if (!permission) {
    return <Text>Requesting camera permissions...</Text>;
  }
  if (!permission.granted) {
    return <Text>Camera permissions are required to use this app.</Text>;
  }
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData<{ avatar: string }>(["userInfo"]); // 1 là userId (thay đổi tùy trường hợp)
  console.log("user info modal", userInfo);
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
            {userInfo && (
              <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
            )}
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
          {imagesProp.length > 0 && (
            <FlatList
              data={imagesProp}
              keyExtractor={(index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <>
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
                  <TouchableOpacity
                    style={styles.clearImage}
                    onPress={() => removeImageProp(item)}
                  >
                    <MaterialIcons name="clear" size={24} color="black" />
                  </TouchableOpacity>
                </>
              )}
            />
          )}
          {images.length > 0 && (
            <FlatList
              data={images}
              keyExtractor={(index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <>
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
                  <TouchableOpacity
                    style={styles.clearImage}
                    onPress={() => {
                      removeImageProp(item);
                      removeImage(item);
                    }}
                  >
                    <MaterialIcons name="clear" size={24} color="black" />
                  </TouchableOpacity>
                </>
              )}
            />
          )}

          {/* Action Icons */}

          <View style={styles.actionRow}>
            <TouchableOpacity>
              <SimpleLineIcons name="camera" size={24} color="#9E9E9E" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openImagePicker()}>
              <Ionicons name="images-outline" size={24} color="#9E9E9E" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="keyboard-voice" size={24} color="#9E9E9E" />
            </TouchableOpacity>
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
      color: isDarkMode ? darkTheme.text : lightTheme.text,
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
    clearImage: {
      position: "absolute",
      backgroundColor: "#fff",
      borderRadius: "50%",
      right: 0,
      margin: 10,
    },
  });

export default CreatePostModel;
