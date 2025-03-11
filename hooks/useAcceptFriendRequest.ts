import friendAPI from "@/api/friendAPI";
import { useMutation } from "@tanstack/react-query";

import { Alert } from "react-native";

const useAcceptFriendRequest = () => {
 
  const accept = useMutation({
   
    mutationFn: async ({ myUserId, userId }: { myUserId: number, userId: number }) => {
      return await friendAPI.acceptFriend(myUserId, userId); // Gọi API logout
    },
    onSuccess: async (response) => {
         return response?.data
    },
    onError: (error) => {
      console.error("acceptFriend error:", error);
    },
  });

  return { accept: accept.mutate, isLoading: accept.isPending , isSuccess: accept.isSuccess };
};

export default useAcceptFriendRequest;
