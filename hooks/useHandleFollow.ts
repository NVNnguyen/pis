import friendAPI from "@/api/friendAPI";
import usePostStore from "@/stores/usePostStore";
import { PostItemType } from "@/utils/types/PostItemType";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Alert } from "react-native";

interface useHandleFollowProp {
  userName: string;
  following: boolean;
  userId: number;
  friendId: number;
}

const useHandleFollow = (props: useHandleFollowProp) => {
  // Khởi tạo trạng thái follow từ props
  const [isFollowing, setIsFollowing] = useState(props.following);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { setPosts } = usePostStore();

  // Cập nhật lại state khi props thay đổi
  useEffect(() => {
    setIsFollowing(props.following);
  }, [props.following]);

  // Hàm xử lý API call không hiển thị Alert
  const performFollowAction = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const previousState = isFollowing;
      setIsFollowing(!previousState);
      
      let response;
      if (previousState) {
        response = await friendAPI.unFollow(props.userId, props.friendId);
        if (response?.message !== "Unfollow Success") {
          // Rollback nếu thất bại
          setIsFollowing(previousState);
        }
      } else {
        response = await friendAPI.follow(props.userId, props.friendId);
        if (response?.message !== "Follow Success") {
          // Rollback nếu thất bại
          setIsFollowing(previousState);
        }
      }
     
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["followInfo", props.friendId] });
      
      // Invalidate and update posts store
      await queryClient.invalidateQueries({ queryKey: ["posts", props.userId] });
      
      // Fetch the latest posts after invalidation and update the store
      const postsData = await queryClient.fetchQuery<PostItemType[]>({ 
        queryKey: ["posts", props.userId],
        // Note: This assumes you have a query function registered for this key
        // If not, you'll need to use your API directly instead
      });
      
      // Update the posts store with new data
      if (postsData) {
        setPosts(postsData);
      }
      
      setResponseMessage(response?.message || "");
      return response;
    } catch (error) {
      console.error("Follow/Unfollow error:", error);
      // Rollback UI nếu có lỗi
      setIsFollowing(isFollowing);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý với Alert
  const handleFollowing = () => {
    Alert.alert(
      isFollowing ? `Unfollow ${props.userName}?` : `Follow ${props.userName}?`,
      "",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: performFollowAction
        },
      ]
    );
  };
  
  return { 
    isFollowing, 
    responseMessage, 
    isLoading, 
    error, 
    handleFollowing,
    performFollowAction  // Export cả hàm này nếu bạn muốn gọi trực tiếp không qua Alert
  };
};

export default useHandleFollow;