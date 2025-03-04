import Posts from "@/components/public/Posts";
import usePostStore from "@/stores/usePostStore";
import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Comments from "@/components/public/Comments";
import { MainStackType } from "@/utils/types/MainStackType";
import PostDetails from "@/components/public/PostDetail";
import { darkTheme, lightTheme } from "@/utils/themes";
import { grey } from "@/utils/colorPrimary";
import { fontWeight, textPostFontSize } from "@/styles/stylePrimary";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import CommentInput from "@/components/public/CommentInput";

const { width, height } = Dimensions.get("window");

const PostDetailScreen = () => {
  const route = useRoute<RouteProp<MainStackType, "PostDetails">>();
  const { userId, postId } = route.params;
  const { getPostById } = usePostStore();
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  console.log("PostId:", postId);

  const postDetail = getPostById(postId);

  console.log("Post details:", postDetail);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Điều chỉnh cho iOS
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {postDetail ? (
            <PostDetails {...postDetail} />
          ) : (
            <Text>Bài viết không tồn tại</Text>
          )}
          <View style={styles.repliesContainer}>
            <Text style={styles.repliesTxt}>Replies</Text>
            <View style={styles.rightReplies}>
              <Text style={styles.activityTxt}>View activity </Text>
              <Ionicons name="chevron-forward" size={20} color={grey} />
            </View>
          </View>
          <View style={styles.comment}>
            <Comments userId={userId} postId={postId} />
          </View>
        </ScrollView>

        <CommentInput />
      </View>
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
    comment: {
      flex: 1,
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
  });

export default PostDetailScreen;
