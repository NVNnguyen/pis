import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  buttonFontsize,
  fontWeight,
  text10FontSize,
  text12FontSize,
  textPostFontSize,
} from "@/styles/stylePrimary";
import { formatNumber } from "@/utils/formatNumber";
import AudioPlayer from "./AudioPlayer";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { getMyUserId } from "@/hooks/getMyUserID";
import PostImageDetailModal from "./Modals/PostImageDetailModal";
import { MainStackType } from "@/utils/types/MainStackType";
import { PostItemType } from "@/utils/types/PostItemType";
import useHandleLikePost from "@/hooks/useHandleLikePost";
import useHandleFollow from "@/hooks/useHandleFollow";
import { darkThemeInput, lightThemeInput } from "@/utils/colorPrimary";

const { width, height } = Dimensions.get("window");

const PostDetails = ({
  userPostResponse,
  id,
  caption,
  images,
  likes,
  comments,
  type,
  like,
  createTime,
  isOpenComment, // Thêm vào đây
}: PostItemType & {
  isOpenComment?: (isOpen: boolean) => void;
}) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisiblePostImageDetail, setIsVisiblePostImageDetail] =
    useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const myUserId = getMyUserId() ?? 0;

  // State để quản lý trạng thái follow
  const [isFollowingState, setIsFollowingState] = useState<boolean>(
    userPostResponse?.isFollow || false
  );

  // Đồng bộ isFollowingState với userPostResponse.isFollow khi props thay đổi
  useEffect(() => {
    setIsFollowingState(userPostResponse?.isFollow || false);
  }, [userPostResponse?.isFollow]);

  // Tìm index từ id
  const getIndexById = (id: number) =>
    images.findIndex((image) => image.id === id);

  // Hiển thị modal
  const showModal = (id: number) => {
    const index = getIndexById(id);
    if (index !== -1) {
      setCurrentIndex(index); // Lưu index của ảnh được chọn
      setIsVisiblePostImageDetail(true); // Mở modal
    }
  };

  const { numberLike, isLiked, handleLike } = useHandleLikePost(
    myUserId,
    id,
    like,
    likes
  );

  // Sử dụng hook useHandleFollow
  const { performFollowAction, isLoading } = useHandleFollow({
    userName: userPostResponse?.username || "",
    following: userPostResponse?.isFollow || false,
    userId: myUserId,
    friendId: userPostResponse?.userId || 0,
  });

  // Optimistic UI update cho follow/unfollow
  const handleFollowOptimistically = () => {
    setIsFollowingState(!isFollowingState); // Cập nhật UI ngay lập tức
    performFollowAction(); // Gọi API để thực hiện hành động
  };

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                userId: userPostResponse?.userId,
                isFollow: isFollowingState,
              })
            }
          >
            {userPostResponse?.avatar != null && (
              <Image
                source={{ uri: userPostResponse.avatar }}
                style={styles.avatar}
              />
            )}
            {userPostResponse?.avatar == null && (
              <Image
                source={require("@/assets/images/userAvatar.png")}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userRow}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Profile", {
                  userId: userPostResponse?.userId,
                  isFollow: isFollowingState,
                })
              }
            >
              <Text style={styles.username}>{userPostResponse?.username}</Text>
            </TouchableOpacity>
            {userPostResponse?.followers > 100000 && (
              <MaterialIcons name="verified" style={styles.verifiedText} />
            )}
            <Text style={styles.time}>{createTime}</Text>
          </View>
        </View>

        {/* Chỉ hiển thị nút follow nếu không phải người dùng hiện tại */}
        {myUserId !== userPostResponse?.userId &&
          (isFollowingState ? (
            <TouchableOpacity
              onPress={handleFollowOptimistically}
              style={styles.followingBtn}
            >
              {" "}
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isDarkMode ? darkTheme.text : lightTheme.text}
                />
              ) : (
                <Text style={styles.followingTxt}>Following</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleFollowOptimistically}
              style={styles.followBtn}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isDarkMode ? darkTheme.text : lightTheme.text}
                />
              ) : (
                <Text style={styles.followTxt}>Follow</Text>
              )}
            </TouchableOpacity>
          ))}
      </View>
      <Text style={styles.caption}>{caption} </Text>
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
                key={item.id}
                onPress={() => {
                  showModal(item?.id);
                }}
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
            size={buttonFontsize}
            color={
              isLiked ? "red" : isDarkMode ? darkTheme.text : lightTheme.text
            }
          />
          <Text style={styles.iconText}>{formatNumber(numberLike)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => isOpenComment && isOpenComment(true)}
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
      <PostImageDetailModal
        images={images}
        currentIndex={currentIndex}
        isModalVisible={isVisiblePostImageDetail}
        onClose={() => setIsVisiblePostImageDetail(false)}
      />
    </View>
  );
};

// getStyles giữ nguyên
const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    postContainer: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.04,
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
    followBtn: {
      backgroundColor: isDarkMode
        ? lightTheme.background
        : darkTheme.background,
      width: width * 0.2,
      height: height * 0.03,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
    },
    followTxt: {
      color: isDarkMode ? lightTheme.text : darkTheme.text,
      fontSize: text10FontSize,
      fontWeight: fontWeight,
    },
    followingBtn: {
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      width: width * 0.22,
      height: height * 0.03,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: isDarkMode ? lightThemeInput : darkThemeInput,
    },
    followingTxt: {
      color: isDarkMode ? lightThemeInput : darkThemeInput,
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
      fontSize: textPostFontSize,
      marginRight: width * 0.008,
    },
    verifiedText: {
      color: "#1da1f2",
      fontSize: textPostFontSize,
      marginRight: width * 0.008,
    },
    time: {
      color: "#A0A0A0",
      fontSize: text10FontSize,
    },
    caption: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
    },
    imageContainer: {
      flexDirection: "row",
      marginTop: 10,
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
    },
    iconContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: width * 0.02,
    },
    iconText: {
      marginLeft: width * 0.005,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
    },
  });

export default PostDetails;
