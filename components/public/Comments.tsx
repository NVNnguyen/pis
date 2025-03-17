import React, { useMemo } from "react";
import {
  View,
  Text,
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

const { width, height } = Dimensions.get("window");

interface CommentProps {
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
}: CommentProps) => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const { commentsLevel1, isCommentLevel1Loading, commentLevel1Error } =
    useCommentLevel1(userId, postId);

  // Memoize callback để tránh re-render
  const handleCommentPress = useMemo(
    () =>
      (
        commentId: number,
        ref: React.RefObject<TextInput>,
        userName: string
      ) => {
        ref.current?.focus();
        onCommentPress(commentId, ref, userName);
      },
    [onCommentPress]
  );

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
      {commentsLevel1.map((item: any) => (
        <Comment
          key={item.id.toString()}
          item={item}
          onCommentPress={handleCommentPress}
          commentInputRef={commentInputRef}
        />
      ))}
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

export default React.memo(Comments);
