import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = width * 0.3; // Định kích thước ảnh trong lưới
const STORY_SIZE = width * 0.13; // Định kích thước ảnh Story

const stories = [
  {
    id: "1",
    title: "Kỷ niệm 1",
    image: "https://source.unsplash.com/random/1",
  },
  {
    id: "2",
    title: "Kỷ niệm 2",
    image: "https://source.unsplash.com/random/2",
  },
  {
    id: "3",
    title: "Kỷ niệm 3",
    image: "https://source.unsplash.com/random/3",
  },
  {
    id: "4",
    title: "Kỷ niệm 4",
    image: "https://source.unsplash.com/random/4",
  },
  {
    id: "5",
    title: "Kỷ niệm 5",
    image: "https://source.unsplash.com/random/5",
  },
];

const images = [
  "https://source.unsplash.com/random/6",
  "https://source.unsplash.com/random/7",
  "https://source.unsplash.com/random/8",
  "https://source.unsplash.com/random/9",
  "https://source.unsplash.com/random/10",
  "https://source.unsplash.com/random/11",
  "https://source.unsplash.com/random/12",
  "https://source.unsplash.com/random/13",
  "https://source.unsplash.com/random/14",
  "https://source.unsplash.com/random/15",
  "https://source.unsplash.com/random/16",
  "https://source.unsplash.com/random/17",
];
interface PostItemProps {
  userPostResponse: {
    userId: number;
    username: string;
    avatar: string;
    follow: boolean;
  };
  caption: string;
  images: {
    url: string;
    id: number;
  }[];
  likes: number;
  comments: number;
  type: string;
  like: number;
  createTime: string;
  navigation: any;
}
const GalleryComponent = ({
  userPostResponse,
  caption,
  images,
  likes,
  comments,
  type,
  createTime,
  navigation,
}: PostItemProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  return (
    <View style={styles.container}>
      {/* Stories */}
      <FlatList
        data={stories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.storyContainer}>
            <Image source={{ uri: item.image }} style={styles.storyImage} />
            <Text style={styles.storyText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Image Grid */}
      <FlatList
        data={images}
        keyExtractor={(image) => image.id.toString()}
        numColumns={3} // Hiển thị 3 cột
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.imageContainer}>
            <Image source={{ uri: item.url }} style={styles.image} />
          </TouchableOpacity>
        )}
      />
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
    // Styles cho Stories
    storyContainer: {
      alignItems: "center",
      marginHorizontal: width * 0.015,
    },
    storyImage: {
      width: STORY_SIZE,
      height: STORY_SIZE,
      borderRadius: STORY_SIZE / 2,
      borderWidth: 2,
      borderColor: Colors,
    },
    storyText: {
      color: Colors,
      fontSize: width * 0.035,
      marginTop: 5,
    },
    // Styles cho Image Grid
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
  });

export default GalleryComponent;
