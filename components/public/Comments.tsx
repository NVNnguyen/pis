import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import Loading from "@/components/genaral/loading/Loading";
import useCommentLevel1 from "@/hooks/useCommentLevel1";
import { textFontSize } from "@/styles/stylePrimary";
import Comment from "./Comment"; // Ensure this path is correct

const { width, height } = Dimensions.get("window");

interface commentProps {
  userId: number;
  postId: number;
  onCommentPress: (commentId: number, ref: React.RefObject<TextInput>, userName: string) => void;
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
  return (
    <View style={styles.container}>
      {isCommentLevel1Loading ||
        (commentLevel1Error && (
          <Loading
            isLoading={isCommentLevel1Loading}
            error={commentLevel1Error}
          />
        ))}
      {commentsLevel1?.length === 0 && (
        <View style={styles.notCommentContainer}>
          <Text style={styles.notCommentTxt}>Not comment yet!</Text>
        </View>
      )}

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
    },
    notCommentTxt: {
      fontSize: textFontSize,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });

export default Comments;
