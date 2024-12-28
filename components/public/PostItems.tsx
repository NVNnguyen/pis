import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fontWeight } from "@/styles/color";

const { width, height } = Dimensions.get("window");

interface PostItemProps {
  user: {
    avatar: string;
    username: string;
    time: string;
  };
  caption: string;
  images: string[];
  likes: number;
  comments: number;
  shares: number;
}

const PostItem = ({
  user,
  caption,
  images,
  likes,
  comments,
  shares,
}: PostItemProps) => {
  const [like, setLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked); // Thay đổi trạng thái "thích"
    setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1)); // Cập nhật số lượng "thích"
  };

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.time}>{user.time}</Text>
        </View>
      </View>

      {/* Caption */}
      <Text style={styles.caption}>{caption}</Text>

      {/* Image Gallery */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageContainer}
      >
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"} // Đổi biểu tượng trái tim
            size={width * 0.05} // Responsive kích thước icon
            color={isLiked ? "red" : "#FFFFFF"} // Đổi màu sắc
          />
          <Text style={styles.iconText}>{like}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons
            name="chatbubble-outline"
            size={width * 0.05}
            color="#FFFFFF"
          />
          <Text style={styles.iconText}>{comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="share-outline" size={width * 0.05} color="#FFFFFF" />
          <Text style={styles.iconText}>{shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#202020",
    borderRadius: width * 0.03, // Responsive góc bo tròn
    padding: width * 0.04,
    marginBottom: width * 0.05,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    marginRight: width * 0.03,
  },
  username: {
    color: "#FFFFFF",
    fontWeight: fontWeight,
    fontSize: width * 0.04,
  },
  time: {
    color: "#A0A0A0",
    fontSize: width * 0.03,
  },
  caption: {
    color: "#FFFFFF",
    marginVertical: height * 0.01,
    fontSize: width * 0.04,
  },
  imageContainer: {
    flexDirection: "row",
    marginVertical: height * 0.02,
  },
  image: {
    width: width * 0.5,
    height: height * 0.3,
    borderRadius: width * 0.02,
    marginRight: width * 0.03,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: height * 0.01,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    color: "#FFFFFF",
    marginLeft: width * 0.02,
    fontSize: width * 0.035,
  },
});

export default PostItem;
