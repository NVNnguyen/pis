import postsAPI from "@/api/postsAPI";
import { useState, useCallback } from "react";

const useHandleLikeComment = (myUserId: number, id: number, like: boolean, likes: number) => {
  const [numberLike, setNumberLike] = useState<number>(likes);
  const [isLiked, setIsLiked] = useState<boolean>(like);
  console.log("isLiked", isLiked);  
  const handleLike = useCallback(async () => {
    if (!myUserId) {
      console.error("User ID is undefined or null");
      return;
    }
    console.log(myUserId, id);
    try {
      const response = !isLiked
        ? await postsAPI.likeComment(myUserId, id)
        : await postsAPI.dislikeComment(myUserId, id);

      if (["Like Success", "Dislike Success"].includes(response?.message)) {
        setNumberLike(response?.data?.numberLike);
        setIsLiked(!isLiked);
      } else {
        console.error("Unexpected API response:", response);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  }, [isLiked, myUserId, id]); // Đảm bảo các dependencies không thay đổi bất chợt

  return { numberLike, isLiked, handleLike };   
};

export default useHandleLikeComment;
