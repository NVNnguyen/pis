import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import {
  buttonFontsize,
  fontWeight,
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
}: PostItemType) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisiblePostImageDetail, setIsVisiblePostImageDetail] =
    useState<boolean>(false);
  const [numberLine, setNumberLine] = useState(3);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const [isExpandable, setIsExpandable] = useState<boolean>(false);
  const myUserId = getMyUserId() ?? 0;
  const getIndexById = (id: number) =>
    images.findIndex((image) => image.id === id);
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

  const { isFollowing, responseMessage, handleFollowing } = useHandleFollow({
    userName: userPostResponse?.username || "",
    following: userPostResponse?.isFollow || false,
    userId: myUserId,
    friendId: userPostResponse?.userId || 0,
  });
  console.log(
    "PostItem: ",
    userPostResponse,
    id,
    caption,
    images,
    likes,
    comments,
    type,
    like,
    createTime
  );
  console.log("userId: ", userPostResponse?.userId, "MyId", myUserId);
  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                userId: userPostResponse.userId,
                isFollow: userPostResponse.isFollow,
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
          {userPostResponse?.userId !== undefined && !isFollowing && (
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
                navigation.navigate("Profile", {
                  userId: userPostResponse?.userId,
                  isFollow: userPostResponse?.isFollow,
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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PostDetails", {
                userId: userPostResponse.userId,
                postId: id,
                userName: userPostResponse?.username,
              })
            }
          >
            <Text
              style={styles.caption}
              numberOfLines={numberLine}
              onTextLayout={(event) => {
                const lineCount = event.nativeEvent.lines.length;
                if (lineCount > numberLike) {
                  setIsExpandable(true);
                }
              }}
            >
              {caption}{" "}
            </Text>
          </TouchableOpacity>

          {isExpandable && numberLine < caption.length && (
            <TouchableOpacity onPress={() => setNumberLine(caption.length)}>
              <Text>See more</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity>
          <MaterialIcons
            name="more-horiz"
            size={buttonFontsize}
            color={isDarkMode ? darkTheme.text : lightTheme.text}
          />
        </TouchableOpacity>
      </View>
      {type === "Voice" && images?.length > 0 && (
        <View style={styles.audioContainer}>
          <AudioPlayer audioUri={images[0]?.url} />
        </View>
      )}
      {type === "Image" && images?.length > 0 && (
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
            renderItem={({ item }) =>
              images.length > 1 ? (
                <TouchableOpacity
                  key={item.id} // Thêm key ở đúng vị trí
                  onPress={() => {
                    showModal(item?.id);
                  }}
                >
                  <Image source={{ uri: item.url }} style={styles.imagePost} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={item.id} // Thêm key ở đúng vị trí
                  onPress={() => {
                    showModal(item?.id);
                  }}
                >
                  <Image
                    source={{ uri: item.url }}
                    style={styles.imageOnePost}
                  />
                </TouchableOpacity>
              )
            }
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
          {}
          <Text style={styles.iconText}>{formatNumber(numberLike)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() =>
            navigation.navigate("PostDetails", {
              userId: userPostResponse.userId,
              postId: id,
              userName: userPostResponse?.username,
            })
          }
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
      <PostImageDetailModal // Thay đổi thành PostImageDetailModal
        images={images}
        currentIndex={currentIndex}
        isModalVisible={isVisiblePostImageDetail}
        onClose={() => setIsVisiblePostImageDetail(false)}
      />
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
      marginBottom: height * 0.002,
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
      fontSize: text12FontSize,
    },
    caption: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
    },
    audioContainer: {
      alignItems: "center",
      marginLeft: width * 0.025,
    },
    imageContainer: {
      paddingLeft: height * 0.06,
      flexDirection: "row",
      marginTop: height * 0.01,
    },
    imagePost: {
      width: width * 0.6,
      height: height * 0.35,
      borderRadius: 10,
      marginRight: width * 0.02,
      resizeMode: "cover",
    },
    imageOnePost: {
      width: width * 0.8,
      height: height * 0.35,
      borderRadius: 10,
      marginRight: width * 0.02,
      resizeMode: "cover",
    },
    footer: {
      flexDirection: "row",
      marginTop: height * 0.01,
      marginLeft: height * 0.06,
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

export default PostItem;
