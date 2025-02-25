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
import { formatNumber } from "@/utils/formatNumber";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/genaral/loading/Loading";
import postsAPI from "@/api/postsAPI";

const { width, height } = Dimensions.get("window");
// Định nghĩa kiểu dữ liệu cho route params
type CommentScreenRouteProp = RouteProp<
  { CommentScreen: { postId: number; userId: number } },
  "CommentScreen"
>;
// Sample comments with replies

const CommentScreen = () => {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);
  const [selectedComment, setSelectedComment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const route = useRoute<CommentScreenRouteProp>();
  const { postId, userId } = route.params;

  const openReplies = (comment: any) => {
    setSelectedComment(comment);
    setModalVisible(true);
  };

  const {
    data: comments,
    isLoading: isLoading,
    error: error,
  } = useQuery({
    queryKey: ["comments", userId, postId],
    queryFn: async () => {
      const response = await postsAPI.comments(userId, postId);
      return response.data;
    },
    enabled: !!userId && !!postId,
    staleTime: 1000 * 60 * 3,
  });
  {
    console.log(comments);
  }
  return (
    <View style={styles.container}>
      {isLoading || (error && <Loading isLoading={isLoading} error={error} />)}
      {comments?.length === 0 && (
        <View style={styles.notCommentContainer}>
          <Text style={styles.notCommentTxt}>Not comment yet!</Text>
        </View>
      )}

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            {item?.userPostResponse?.avatar !== null && (
              <Image
                source={{ uri: item?.userPostResponse?.avatar }}
                style={styles.avatar}
              />
            )}
            {item?.userPostResponse?.avatar === null && (
              <Image
                source={require("../../../assets/images/userAvatar.png")}
                style={styles.avatar}
              />
            )}

            <View style={styles.commentContent}>
              <Text style={styles.username}>
                {item?.userPostResponse?.username}
              </Text>
              <Text style={styles.commentText}>{item?.content}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  // onPress={handleLike}
                >
                  <Ionicons
                    name={item.like ? "heart" : "heart-outline"}
                    size={height * 0.024}
                    color={
                      item.like
                        ? "red"
                        : isDarkMode
                        ? darkTheme.text
                        : lightTheme.text
                    }
                  />
                  <Text style={styles.actionText}>
                    {formatNumber(item?.likes)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => openReplies(item)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={height * 0.02}
                    color={isDarkMode ? darkTheme.text : lightTheme.text}
                  />
                  <Text style={styles.actionText}>
                    {formatNumber(item?.comments)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Reply Modal */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
           
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Replies</Text>

           
            {selectedComment && (
              <View>
                <View style={styles.selectedComment}>
                  <Image
                    source={{ uri: selectedComment.avatar }}
                    style={styles.modalAvatar}
                  />
                  <View>
                    <Text style={styles.username}>{selectedComment.user}</Text>
                    <Text style={styles.commentText}>
                      {selectedComment.text}
                    </Text>
                  </View>
                </View>

              
                <FlatList
                  data={selectedComment.repliesList}
                  keyExtractor={(reply) => reply.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.replyContainer}>
                      <Image
                        source={{ uri: selectedComment.avatar }}
                        style={styles.replyAvatar}
                      />
                      <View>
                        <Text style={styles.username}>{item.user}</Text>
                        <Text style={styles.commentText}>{item.text}</Text>
                      </View>
                      <View style={styles.likeContainer}>
                        <FontAwesome name="heart-o" size={14} color="black" />
                        <Text style={styles.actionText}>{item.likes}</Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </Modal> */}
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
      padding: width * 0.05,
    },
    commentContainer: {
      flexDirection: "row",
      marginBottom: height * 0.02,
      alignItems: "center",
    },
    avatar: {
      width: height * 0.06,
      height: height * 0.06,
      borderRadius: height * 0.03,
    },
    commentContent: {
      marginLeft: width * 0.04,
      flex: 1,
    },
    username: {
      fontWeight: "bold",
      fontSize: width * 0.04,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    commentText: {
      fontSize: width * 0.035,
      color: isDarkMode ? "#ccc" : "#333",
    },
    commentActions: {
      flexDirection: "row",
      marginTop: height * 0.01,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: width * 0.04,
    },
    actionText: {
      marginLeft: width * 0.02,
      fontSize: height * 0.016,
      color: isDarkMode ? darkTheme.text : lightTheme.text,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: width * 0.9,
      backgroundColor: "#fff",
      padding: width * 0.05,
      borderRadius: 10,
    },
    backButton: {
      position: "absolute",
      top: height * 0.02,
      left: width * 0.02,
      zIndex: 10,
    },
    modalTitle: {
      fontSize: width * 0.05,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: height * 0.02,
    },
    selectedComment: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: height * 0.02,
    },
    modalAvatar: {
      width: height * 0.06,
      height: height * 0.06,
      borderRadius: height * 0.03,
      marginRight: width * 0.04,
    },
    replyContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: height * 0.02,
    },
    replyAvatar: {
      width: height * 0.05,
      height: height * 0.05,
      borderRadius: height * 0.025,
      marginRight: width * 0.03,
    },
    likeContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: "auto",
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
