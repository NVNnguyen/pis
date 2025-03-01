import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/genaral/loading/Loading";
import postsAPI from "@/api/postsAPI";
import { RootStackParamList } from "@/utils/types/MainStackType";
import Comments from "@/components/public/Comments";
import useCommentLevel1 from "@/hooks/useCommentLevel1";
import usePostDetail from "@/hooks/usePostDetail";

const { width, height } = Dimensions.get("window");

const CommentScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const route = useRoute<RouteProp<RootStackParamList, "Comments">>();
  const { id, userId } = route.params; // TypeScript sẽ tự infer kiểu
  const { commentsLevel1, isCommentLevel1Loading, commentLevel1Error } =
    useCommentLevel1(userId, id);
  const { postDetail, isPostDetailLoading, postDetailError } =
    usePostDetail(id);
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
        renderItem={({ item }) => <Comments {...item} />}
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
      fontSize: 24,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
  });

export default CommentScreen;
