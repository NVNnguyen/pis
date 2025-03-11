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
  ActivityIndicator,
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
import PostImageDetailModal from "./Modals/PostImageDetailModal";
import { MainStackType } from "@/utils/types/MainStackType";
import { PostItemType } from "@/utils/types/PostItemType";
import useHandleLikePost from "@/hooks/useHandleLikePost";
import useHandleFollow from "@/hooks/useHandleFollow";
import { grey } from "@/utils/colorPrimary";
import { useMyUserId } from "@/hooks/useMyUserId";

const { width, height } = Dimensions.get("window");

const Posts = ({
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
  const INITIAL_LINES = 3;
  const [numberLine, setNumberLine] = useState<number>(INITIAL_LINES);
  const [isExpandable, setIsExpandable] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const myUserId = useMyUserId() ?? 0;

  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [areImagesLoading, setAreImagesLoading] = useState(true);

  const getIndexById = (id: number) =>
    images.findIndex((image) => image.id === id);

  const showModal = (id: number) => {
    const index = getIndexById(id);
    if (index !== -1) {
      setCurrentIndex(index);
      setIsVisiblePostImageDetail(true);
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
            {isAvatarLoading && (
              <ActivityIndicator
                style={styles.avatarLoader}
                color={isDarkMode ? darkTheme.text : lightTheme.text}
              />
            )}
            {userPostResponse?.avatar != null && (
              <Image
                source={{ uri: userPostResponse.avatar }}
                style={styles.avatar}
                onLoadStart={() => setIsAvatarLoading(true)}
                onLoadEnd={() => setIsAvatarLoading(false)}
              />
            )}
            {userPostResponse?.avatar == null && (
              <Image
                source={require("@/assets/images/userAvatar.png")}
                style={styles.avatar}
                onLoadStart={() => setIsAvatarLoading(true)}
                onLoadEnd={() => setIsAvatarLoading(false)}
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
                if (lineCount > INITIAL_LINES) {
                  setIsExpandable(true);
                } else {
                  setIsExpandable(false);
                }
              }}
            >
              {caption}
            </Text>
          </TouchableOpacity>

          {isExpandable && (
            <TouchableOpacity
              onPress={() => {
                if (numberLine === INITIAL_LINES) {
                  setNumberLine(0);
                } else {
                  setNumberLine(INITIAL_LINES);
                }
              }}
            >
              <Text style={styles.seeMoreTxt}>
                {numberLine === INITIAL_LINES ? "See more" : "See less"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity>
          {/* <MaterialIcons
            name="more-horiz"
            size={buttonFontsize}
            color={isDarkMode ? darkTheme.text : lightTheme.text}
          /> */}
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
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => showModal(item?.id)}
              >
                {areImagesLoading && (
                  <ActivityIndicator
                    style={[
                      styles.imageLoader,
                      images.length > 1
                        ? styles.imagePost
                        : styles.imageOnePost,
                    ]}
                    color={isDarkMode ? darkTheme.text : lightTheme.text}
                  />
                )}
                <Image
                  source={{ uri: item.url }}
                  style={
                    images.length > 1 ? styles.imagePost : styles.imageOnePost
                  }
                  onLoadStart={() => setAreImagesLoading(true)}
                  onLoadEnd={() => setAreImagesLoading(false)}
                />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      )}

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
      <PostImageDetailModal
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
    avatarLoader: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    imageLoader: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      color: isDarkMode ? darkTheme.text : lightTheme.text,
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
      borderRadius: (height * 0.02) / 2,
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
    seeMoreTxt: {
      color: grey,
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

export default Posts;
