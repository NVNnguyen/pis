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
  Alert,
  Button,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { fontWeight } from "@/styles/color";
import { formatNumber } from "@/utils/formatNumber";
import AudioPlayer from "./AudioPlayer";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { getMyUserId } from "@/hooks/getMyUserID";
import PostImageDetailModal from "./Modals/PostImageDetailModal";
import { RootStackParamList } from "@/utils/types/MainStackType";
import Replies from "./Replies";
import useHandleLikeComment from "@/hooks/useHandleLikeComment";
import useHandleFollow from "@/hooks/useHanldeFollow";
import { useQuery } from "@tanstack/react-query";
import postsAPI from "@/api/postsAPI";
import useCommentLevel2 from "@/hooks/useCommentLevel2";

const { width, height } = Dimensions.get("window");
const Comments = (item: any) => {
  const [isVisiblePostImageDetail, setIsVisiblePostImageDetail] =
    useState<boolean>(false);
  const [isOpenReplies, setIsOpenReplies] = useState<boolean>(false);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { commentsLevel2, isLoading, error } = useCommentLevel2(
    item?.userPostResponse?.userId,
    item?.id
  );
  const seeEnum = commentsLevel2?.length > 5 ? 5 : commentsLevel2?.length;
  const [seeMore, setSeeMore] = useState<number>(seeEnum);
  const myUserId = getMyUserId() ?? 0;
  const { numberLike, isLiked, handleLike } = useHandleLikeComment(
    myUserId,
    item?.id,
    item?.like,
    item?.likes
  );
  const { isFollowing, handleFollowing } = useHandleFollow(
    item?.userPostResponse?.username,
    item?.userPostResponse.follow
  );

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProfilePublic", {
                userId: item?.userPostResponse?.userId,
              })
            }
          >
            {item?.userPostResponse.avatar != null && (
              <Image
                source={{ uri: item?.userPostResponse.avatar }}
                style={styles.avatar}
              />
            )}
            {item?.userPostResponse.avatar == null && (
              <Image
                source={require("../../assets/images/userAvatar.png")}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>

          {!isFollowing && myUserId !== item?.userPostResponse?.userId && (
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
                  userId: item?.userPostResponse.userId,
                })
              }
            >
              <Text style={styles.username}>
                {item?.userPostResponse.username}
              </Text>
            </TouchableOpacity>
            <MaterialIcons name="verified" style={styles.verifiedText} />
            <Text style={styles.time}>{item?.createTime}</Text>
          </View>
          <Text style={styles.caption}>
            {item?.content}{" "}
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
      <View style={styles.cmtContainer}>
        {item?.type === "Voice" && item?.url !== null && (
          <AudioPlayer audioUri={item?.images[0].url} />
        )}
        <TouchableOpacity onPress={() => setIsVisiblePostImageDetail(true)}>
          {item?.type === "Image" && item?.url !== null && (
            <Image source={{ uri: item?.url }} style={styles.image} />
          )}
        </TouchableOpacity>
      </View>

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
          {}
          <Text style={styles.iconText}>{formatNumber(numberLike)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            setIsOpenReplies(!isOpenReplies);
          }}
        >
          <Ionicons
            name="chatbubble-outline"
            size={height * 0.02}
            style={styles.icon}
          />
          <Text style={styles.iconText}>{formatNumber(item?.comments)}</Text>
        </TouchableOpacity>
      </View>
      {/* Modal hiển thị ảnh toàn màn hình */}
      <PostImageDetailModal // Thay đổi thành PostImageDetailModal
        images={[{ url: item?.url, id: 0 }]}
        currentIndex={0}
        isModalVisible={isVisiblePostImageDetail}
        onClose={() => setIsVisiblePostImageDetail(false)}
      />
      {isOpenReplies && commentsLevel2?.length > 0 && (
        <View style={styles.repliesContainer}>
          <FlatList
            data={commentsLevel2.slice(0, seeMore)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Replies {...item} />}
          />
          {isOpenReplies && commentsLevel2?.length > seeMore && (
            <Button title="see more" onPress={() => setSeeMore(seeMore + 5)} />
          )}
          {isOpenReplies && commentsLevel2?.length < seeMore && (
            <Button
              title="see less"
              onPress={() => {
                setSeeMore(5);
              }}
            />
          )}
        </View>
      )}
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
    cmtContainer: {
      marginLeft: width * 0.14,
    },
    repliesContainer: {
      borderLeftWidth: 1,
      borderLeftColor: "grey",
      borderBottomLeftRadius: 100,
    },
  });

export default Comments;
