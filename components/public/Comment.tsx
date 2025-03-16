"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Button,
  type TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
import type { NavigationProp } from "@react-navigation/native";
import PostImageDetailModal from "./Modals/PostImageDetailModal";
import type { MainStackType } from "@/utils/types/MainStackType";
import Replies from "./Replies";
import useHandleLikeComment from "@/hooks/useHandleLikeComment";
import useCommentLevel2 from "@/hooks/useCommentLevel2";
import { useMyUserId } from "@/hooks/useMyUserId";

const { width, height } = Dimensions.get("window");

interface RepliesProp {
  item: any;
  repliesComment: (username: string, ref: React.RefObject<TextInput>) => void;
  commentInputRef: React.RefObject<TextInput>;
}

interface CommentProp {
  item: any;
  onCommentPress: (
    commentId: number,
    ref: React.RefObject<TextInput>,
    userName: string
  ) => void;
  commentInputRef: React.RefObject<TextInput>;
}

const Comment: React.FC<CommentProp> = ({
  item,
  onCommentPress,
  commentInputRef,
}) => {
  const [isVisiblePostImageDetail, setIsVisiblePostImageDetail] =
    useState<boolean>(false);
  const [isOpenReplies, setIsOpenReplies] = useState<boolean>(false);
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation<NavigationProp<MainStackType>>();
  const myUserId = useMyUserId() ?? 0;
  const { commentsLevel2, isLoading, error } = useCommentLevel2(
    myUserId,
    item?.id
  );

  // Khởi tạo seeMore: hiển thị 5 phần tử đầu tiên nếu length >= 5, ngược lại hiển thị tất cả

  const [seeMore, setSeeMore] = useState<number>(0);

  const { numberLike, isLiked, handleLike } = useHandleLikeComment(
    myUserId,
    item?.id,
    item?.like,
    item?.likes
  );

  // Cập nhật seeMore khi commentsLevel2 thay đổi
  useEffect(() => {
    const newSeeMore =
      commentsLevel2?.length >= 5 ? 5 : commentsLevel2?.length || 0;
    setSeeMore(newSeeMore);
  }, [commentsLevel2]);

  const ReplyItem = React.memo(
    ({ item, repliesComment, commentInputRef }: RepliesProp) => (
      <Replies
        item={item}
        repliesComment={repliesComment}
        commentInputRef={commentInputRef}
      />
    )
  );

  const words = item?.content?.split(" ");
  const highLighUsername = words[0];
  const currentContent = words.slice(1).join(" ");
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const handleReplyPress = (
    username: string,
    ref: React.RefObject<TextInput>
  ) => {
    onCommentPress(item?.id, commentInputRef, username);
  };

  const handleViewReplies = () => {
    setIsOpenReplies(true); // Mở replies
    setSeeMore((prev) => Math.min(prev + 5, commentsLevel2.length)); // Tăng 5 phần tử
  };

  const handleSeeLess = () => {
    setSeeMore(0); // Thu lại toàn bộ
    setIsOpenReplies(false); // Đóng replies
  };

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                userId: item?.userPostResponse?.userId,
                isFollow: item?.userPostResponse?.isFollow,
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
                  userId: item?.userPostResponse.userId,
                  isFollow: item?.userPostResponse?.isFollow,
                })
              }
            >
              <Text style={styles.username}>
                {item?.userPostResponse.username}
              </Text>
            </TouchableOpacity>
            {item?.userPostResponse?.followers > 100000 && (
              <MaterialIcons name="verified" style={styles.verifiedText} />
            )}
            <Text style={styles.time}>{item?.createTime}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            {highLighUsername === item?.userPostResponse.username ? (
              <Text style={{ color: "#1da1f2" }}>{highLighUsername}</Text>
            ) : (
              <Text style={styles.caption}> {highLighUsername}</Text>
            )}
            <Text style={styles.caption}> {currentContent}</Text>
          </View>
        </View>
        <TouchableOpacity>
          {/* <MaterialIcons
            name="more-horiz"
            size={buttonFontsize}
            color={isDarkMode ? darkTheme.text : lightTheme.text}
          /> */}
        </TouchableOpacity>
      </View>
      <View style={styles.cmtContainer}>
        {item?.type === "Voice" && item?.url !== null && (
          <AudioPlayer audioUri={item?.url} />
        )}
        <TouchableOpacity onPress={() => setIsVisiblePostImageDetail(true)}>
          {item?.type === "Image" && item?.url !== null && (
            <View style={styles.imageWrapper}>
              {imageLoading && (
                <ActivityIndicator
                  style={styles.imageLoader}
                  size="large"
                  color={isDarkMode ? darkTheme.text : lightTheme.text}
                />
              )}
              <Image
                source={{ uri: item?.url }}
                style={styles.image}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

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
          onPress={() => {
            onCommentPress(
              item?.id,
              commentInputRef,
              item?.userPostResponse.username
            );
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
      <PostImageDetailModal
        images={[{ url: item?.url, id: 0 }]}
        currentIndex={0}
        isModalVisible={isVisiblePostImageDetail}
        onClose={() => setIsVisiblePostImageDetail(false)}
      />

      {/* Nút "View replies" ban đầu */}
      {commentsLevel2?.length > 5 && !isOpenReplies && (
        <TouchableOpacity onPress={handleViewReplies}>
          <Text style={styles.txtViewReply}>
            View {commentsLevel2?.length} replies ...
          </Text>
          {isLoading && <ActivityIndicator />}
        </TouchableOpacity>
      )}

      {/* Danh sách replies */}
      {isOpenReplies && commentsLevel2?.length > 0 && (
        <View style={styles.repliesContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <FlatList
              data={commentsLevel2.slice(0, seeMore)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ReplyItem
                  item={item}
                  repliesComment={handleReplyPress}
                  commentInputRef={commentInputRef}
                />
              )}
              nestedScrollEnabled={true}
              contentContainerStyle={styles.flatListContent}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={5}
            />
          </KeyboardAvoidingView>

          {/* Nút "View replies" khi còn phần tử để hiển thị */}
          {commentsLevel2?.length - seeMore > 0 && (
            <Button
              title={`View ${commentsLevel2.length - seeMore} replies...`}
              onPress={handleViewReplies}
              color={"grey"}
            />
          )}

          {/* Nút "See less" khi có phần tử đang hiển thị */}
          {seeMore > 0 && (
            <Button
              title="Hide replies"
              onPress={handleSeeLess}
              color={"grey"}
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
    imageContainer: {
      paddingLeft: height * 0.06,
      flexDirection: "row",
      marginTop: height * 0.01,
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
      top: height * 0.04,
      right: width * 0.02,
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
      marginRight: width * 0.02,
    },
    iconText: {
      marginLeft: width * 0.005,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "black",
    },
    closeIcon: {
      position: "absolute",
      top: height * 0.07,
      left: width * 0.07,
      zIndex: 10,
      backgroundColor: "grey",
      borderRadius: width * 0.05,
      width: width * 0.07,
      height: width * 0.07,
      justifyContent: "center",
      alignItems: "center",
    },
    cmtContainer: {
      marginLeft: width * 0.14,
    },
    repliesContainer: {
      marginLeft: width * 0.05,
      borderLeftWidth: 1,
      borderLeftColor: "grey",
      borderBottomLeftRadius: 100,
      zIndex: 1000,
      flex: 2,
    },
    txtViewReply: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      marginLeft: width * 0.13,
      marginTop: height * 0.02,
    },
    imageWrapper: {
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    imageLoader: {
      position: "absolute",
      zIndex: 1,
    },
    flatListContent: {
      flexGrow: 1,
      paddingBottom: 60,
      width: "100%",
    },
  });

export default Comment;
