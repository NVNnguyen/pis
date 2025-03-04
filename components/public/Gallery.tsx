import postApi from "@/api/postsAPI";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Spinner from "react-native-spinkit";

const { width } = Dimensions.get("window");
interface PostItemProps {
  id: number;
  userPostResponse: {
    userId: number;
  };
  images: {
    url: string;
    id: number;
  }[];
}

const Gallery = ({ id, images }: PostItemProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [postId, setPostId] = useState<number | null>(null);

  const {
    data: postDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postDetail", postId],
    queryFn: async () => {
      if (!postId) throw new Error("PostId is invalid!");
      console.log("📡 Fetching post detail:", postId);
      const response = await postApi.postDetails(postId);
      if (!response.data) throw new Error("Cannot find post detail!");
      return response.data;
    },
    enabled: !!postId, // Chỉ gọi API khi postId có giá trị hợp lệ
    staleTime: 1000 * 60 * 3,
  });

  const handlePressImage = (imageId: number) => {
    setPostId(imageId); // Cập nhật postId khi nhấn vào ảnh
  };

  console.log("Post detail:", postDetail);
  console.log("length of images", images?.length);
  console.log(images);
  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <Spinner
            type="Bounce"
            size={50}
            color={isDarkMode ? darkTheme.text : lightTheme.text}
          />
        </View>
      )}
      {images?.length > 0 && (
        <FlatList
          data={images} // Hiển thị tất cả ảnh
          keyExtractor={(image) => image.id.toString()}
          numColumns={3} // Hiển thị 3 cột
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.imageContainer}>
              <Image source={{ uri: item.url }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background, // Dark Mode
      padding: width * 0.02,
    },
    loaderContainer: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: -25 }, { translateY: -25 }],
      zIndex: 10,
    },
    imageContainer: {
      flex: 1,
      aspectRatio: 1,
      margin: width * 0.01,
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 15,
    },
    image: {
      width: "100%", // Fill the container width
      height: "100%", // Fill the container height
      resizeMode: "cover",
      borderRadius: 15,
    },
    txtNoPosts: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });

export default Gallery;
