import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import {
  EvilIcons,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { fontWeight } from "@/styles/color";
import { formatNumber } from "@/utils/formatNumber";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioPlayer from "./AudioPlayer";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import postsAPI from "@/api/postsAPI";
import { getMyUserId } from "@/hooks/getMyUserID";

interface PostItemProps {
  userPostResponse: {
    userId: number;
    username: string;
    avatar: string;
    follow: boolean;
  };
  id: number;
  caption: string;
  images: {
    url: string;
    id: number;
  }[];
  likes: number;
  comments: number;
  type: string;
  like: boolean;
  createTime: string;
}

interface navigationProp extends NavigationProp<any> {
  page: string;
  id: number;
}

const { width, height } = Dimensions.get("window");
const PostItem = ({
  userPostResponse,
  id,
  caption,
  images,
  likes,
  comments,
  type,
  like,
  createTime,
}: PostItemProps) => {
  const [isLiked, setIsLiked] = useState(like);
  const [isFollowing, setIsFollowing] = useState(userPostResponse.follow);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigation = useNavigation<navigationProp>();
  const myUserId = getMyUserId();
  // Tìm index từ id
  const getIndexById = (id: number) =>
    images.findIndex((image) => image.id === id);

  // Hiển thị modal
  const showModal = (id: number) => {
    const index = getIndexById(id);
    if (index !== -1) {
      setCurrentIndex(index); // Lưu index của ảnh được chọn
      setModalVisible(true);
    }
  };
  const handleLike = async () => {
    if (!myUserId) {
      console.error("User ID is undefined or null");
      return;
    }

    try {
      let response;

      if (isLiked) {
        response = await postsAPI.dislike(myUserId, id);
        console.log("Dislike API Call with:", myUserId, id);
      } else {
        response = await postsAPI.like(myUserId, id);
        console.log("Like API Call with:", myUserId, id);
      }

      if (
        response?.message === "Like Success" ||
        response?.message === "Dislike Success"
      ) {
        setIsLiked(!isLiked);
      } else {
        console.error("Unexpected API response:", response);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleFollowing = () => {
    Alert.alert(`Follow  ${userPostResponse.username}?`, "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => setIsFollowing(!isFollowing),
      },
    ]);
  };

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProfilePublic", {
                userId: userPostResponse.userId,
              })
            }
          >
            {userPostResponse.avatar != null && (
              <Image
                source={{ uri: userPostResponse.avatar }}
                style={styles.avatar}
              />
            )}
            {userPostResponse.avatar == null && (
              <Image
                source={require("../../assets/images/userAvatar.png")}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>

          {!isFollowing && (
            <TouchableOpacity onPress={handleFollowing} style={styles.addIcon}>
              <MaterialIcons
                name="add"
                size={height * 0.012}
                color={isDarkMode ? lightTheme.text : darkTheme.text}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfilePublic", {
                  userId: userPostResponse.userId,
                })
              }
            >
              <Text style={styles.username}>{userPostResponse.username}</Text>
            </TouchableOpacity>
            <MaterialIcons name="verified" style={styles.verifiedText} />
            <Text style={styles.time}>{createTime}</Text>
          </View>
          <Text style={styles.caption}>
            {caption}{" "}
            <MaterialIcons
              name="favorite"
              size={height * 0.014}
              style={styles.icon}
            />
          </Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons
            name="more-horiz"
            size={24}
            color={isDarkMode ? darkTheme.text : lightTheme.text}
          />
        </TouchableOpacity>
      </View>
      {type === "Voice" && images.length > 0 && images[0].url && (
        <AudioPlayer audioUri={images[0].url} />
      )}
      {type === "Image" && images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageContainer}
        >
          <FlatList
            data={images}
            keyExtractor={(image) => image.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id} // Thêm key ở đúng vị trí
                onPress={() => showModal(item.id)}
              >
                <Image source={{ uri: item.url }} style={styles.image} />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconContainer} onPress={handleLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={
              isLiked ? "red" : isDarkMode ? darkTheme.text : lightTheme.text
            }
          />
          <Text style={styles.iconText}>{formatNumber(likes)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            navigation.navigate("Comments", {
              postId: id,
              userId: userPostResponse.userId,
            });
          }}
        >
          <Ionicons
            name="chatbubble-outline"
            size={height * 0.02}
            style={styles.icon}
          />
          <Text style={styles.iconText}>{formatNumber(comments)}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal hiển thị ảnh toàn màn hình */}
      <SafeAreaView>
        <Modal
          visible={isModalVisible}
          transparent={true}
          style={styles.modalContainer}
          animationType="fade"
        >
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <AntDesign
              name="close"
              size={height * 0.024}
              color={isDarkMode ? darkTheme.text : lightTheme.text}
            />
          </TouchableOpacity>
          <ImageViewer
            imageUrls={images.map((image) => ({ url: image.url }))}
            index={currentIndex} // Sử dụng index thay vì id
            onSwipeDown={() => {
              setModalVisible(false);
            }}
            enableSwipeDown={true} // Kích hoạt vuốt xuống
          />
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    postContainer: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      // marginBottom: height * 0.01,
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.04,
      borderBottomWidth: 1,
      borderBottomColor: "grey",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: height * 0.01,
    },
    avatarContainer: {
      position: "relative",
      marginRight: width * 0.03,
    },
    avatar: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: (width * 0.1) / 2,
    },
    addIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: isDarkMode ? darkTheme.text : lightTheme.text,
      padding: width * 0.002,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: (height * 0.02) / 2, // Sửa thành giá trị số
    },
    icon: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    userInfo: {
      flex: 1,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    username: {
      fontWeight: fontWeight,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: height * 0.016,
      marginRight: width * 0.008,
    },
    verifiedText: {
      color: "#1da1f2",
      fontSize: height * 0.016,
      marginRight: width * 0.008,
    },
    time: {
      color: "#A0A0A0",
      fontSize: height * 0.016,
    },
    caption: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: height * 0.016,
    },
    imageContainer: {
      paddingLeft: height * 0.06,
      flexDirection: "row",
      marginTop: 10,
    },
    fullImageContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "black",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    fullImageScrollView: {
      flex: 1,
    },
    fullImage: {
      width: "100%",
      height: "100%",
    },
    closeButton: {
      position: "absolute",
      top: 40,
      right: 20,
    },
    image: {
      width: width * 0.6,
      height: height * 0.35,
      borderRadius: 10,
      marginRight: width * 0.02,
    },
    footer: {
      flexDirection: "row",
      marginTop: height * 0.01,
      marginLeft: height * 0.06,
    },
    iconContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 20,
    },
    iconText: {
      marginLeft: width * 0.005,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: height * 0.016,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "black",
    },
    closeIcon: {
      position: "absolute",
      top: height * 0.07, // Đặt icon cách đỉnh màn hình
      left: width * 0.07, // Đặt icon cách cạnh trái
      zIndex: 10, // Hiển thị icon phía trên các thành phần khác
      backgroundColor: "grey", // Nền xám
      borderRadius: width * 0.05, // Đặt borderRadius bằng nửa chiều rộng/chiều cao để tạo hình tròn
      width: width * 0.07, // Đường kính hình tròn
      height: width * 0.07, // Đường kính hình tròn (bằng với chiều rộng để đảm bảo hình tròn)
      justifyContent: "center", // Căn giữa nội dung theo chiều dọc
      alignItems: "center", // Căn giữa nội dung theo chiều ngang
    },
  });

export default PostItem;
