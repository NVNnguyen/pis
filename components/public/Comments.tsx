import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  type TextInput,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import useCommentLevel1 from "@/hooks/useCommentLevel1";
import { textFontSize } from "@/styles/stylePrimary";
import Comment from "./Comment";
import CommentSkeleton from "@/Loading/CommentSkeleton";
import Replies from "./Replies";

const { width, height } = Dimensions.get("window");

interface commentProps {
  userId: number;
  postId: number;
  onCommentPress: (
    commentId: number,
    ref: React.RefObject<TextInput>,
    userName: string
  ) => void;
  commentInputRef: React.RefObject<TextInput>;
}

const Comments = ({
  userId,
  postId,
  onCommentPress,
  commentInputRef,
}: commentProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const { commentsLevel1, isCommentLevel1Loading, commentLevel1Error } =
    useCommentLevel1(userId, postId);
  const handleCommentPress = (
    commentId: number,
    ref: React.RefObject<TextInput>,
    userName: string
  ) => {
    ref.current?.focus(); // Focus vào ô nhập comment
    onCommentPress(commentId, ref, userName); // Truyền commentId và ref lên PostDetailScreen
  };

  // Render loading skeletons
  if (isCommentLevel1Loading) {
    return (
      <View style={styles.container}>
        {[1, 2, 3].map((item) => (
          <CommentSkeleton key={`skeleton-${item}`} />
        ))}
      </View>
    );
  }

  // Render empty state
  if (
    !isCommentLevel1Loading &&
    (!commentsLevel1 || commentsLevel1.length === 0)
  ) {
    return (
      <View style={styles.container}>
        <View style={styles.notCommentContainer}>
          <Text style={styles.notCommentTxt}>Not comment yet!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={commentsLevel1}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Comment
            item={item}
            onCommentPress={handleCommentPress}
            commentInputRef={commentInputRef}
          />
        )}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.flatListContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        initialNumToRender={10} // Giới hạn số lượng phần tử render ban đầu
        maxToRenderPerBatch={10} // Giới hạn số lượng phần tử render mỗi lần
        windowSize={5} // Điều chỉnh kích thước cửa sổ render
      />
    </View>
  );
};

// Responsive Styles
const getStyles = (isDarkMode: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode
        ? darkTheme.background
        : lightTheme.background,
    },
    notCommentContainer: {
      alignContent: "center",
      alignItems: "center",
      paddingVertical: height * 0.05,
    },
    notCommentTxt: {
      fontSize: textFontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    flatListContent: {
      flexGrow: 1,
      paddingBottom: 60,
      width: "100%",
    },
  });

export default Comments;
