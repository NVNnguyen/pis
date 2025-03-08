import Posts from "@/components/public/Posts";
import usePostStore from "@/stores/usePostStore";
import {
  RouteProp,
  useRoute,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Comments from "@/components/public/Comments";
import { MainStackType } from "@/utils/types/MainStackType";
import PostDetails from "@/components/public/PostDetail";
import { darkTheme, lightTheme } from "@/utils/themes";
import { grey } from "@/utils/colorPrimary";
import { fontWeight, textPostFontSize } from "@/styles/stylePrimary";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { PostItemType } from "@/utils/types/PostItemType";
import CommentInput from "@/components/public/CommentInput";

const { width, height } = Dimensions.get("window");

const PostDetailScreen = () => {
  const route = useRoute<RouteProp<MainStackType, "PostDetails">>();
  const userId = route?.params?.userId;
  const postId = route?.params?.postId;
  const userNameRout = route?.params?.userName;
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [currentPost, setCurrentPost] = useState<PostItemType | undefined>(
    undefined
  );
  const [userName, setUserName] = useState<string>(userNameRout);
  const { getPostById } = usePostStore();

  useFocusEffect(
    useCallback(() => {
      const post = getPostById(postId);
      console.log("PostDetailScreen focused - Post data:", post);
      setCurrentPost(post);
    }, [postId, getPostById])
  );

  const commentInputRef = useRef<TextInput>(null);
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);
  const handleCommentPress = (
    commentId: number,
    ref: React.RefObject<TextInput>,
    userName: string
  ) => {
    setParentCommentId(commentId);
    ref.current?.focus(); // Focus vào ô nhập comment
    setUserName(userName);
  };

  const handleChatBubblePress = () => {
    commentInputRef.current?.focus(); // Gọi focus để mở bàn phím
    setParentCommentId(null);
    setUserName(currentPost?.userPostResponse?.username ?? "");
    console.log("parentCommentId: ", parentCommentId);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 85 : 0}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <FlatList
            style={styles.container}
            data={currentPost ? [currentPost] : []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <>
                <PostDetails {...item} isOpenComment={handleChatBubblePress} />
                <View style={styles.repliesContainer}>
                  <Text style={styles.repliesTxt}>Replies</Text>
                  <View style={styles.rightReplies}>
                    <Text style={styles.activityTxt}>View activity </Text>
                    <Ionicons name="chevron-forward" size={20} color={grey} />
                  </View>
                </View>
                <View style={styles.commentSection}>
                  <Comments
                    userId={userId}
                    postId={postId}
                    onCommentPress={handleCommentPress}
                    commentInputRef={commentInputRef}
                  />
                </View>
              </>
            )}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />

          <View style={styles.commentInputContainer}>
            <CommentInput
              userName={userName}
              postId={postId}
              parentCommentId={parentCommentId || 0}
              inputRef={commentInputRef}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    commentSection: {
      flexGrow: 1,
      minHeight: height * 0.25,
    },
    commentInputContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    repliesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: grey,
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.02,
    },
    repliesTxt: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontWeight: fontWeight,
      fontSize: textPostFontSize,
    },
    activityTxt: {
      color: grey,
      fontSize: textPostFontSize,
    },
    rightReplies: {
      flexDirection: "row",
      alignItems: "center",
    },
    chatBubbleContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.02,
    },
    commentCount: {
      color: isDarkMode ? darkTheme.text : lightTheme.text,
      fontSize: textPostFontSize,
      marginLeft: width * 0.01,
    },
  });

export default PostDetailScreen;
