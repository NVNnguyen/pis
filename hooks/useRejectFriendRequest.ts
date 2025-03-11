import friendAPI from "@/api/friendAPI";
import { useMutation } from "@tanstack/react-query";

import { Alert } from "react-native";

const useRejectFriendRequest = () => {
 
  const reject = useMutation({
   
    mutationFn: async ({ myUserId, userId }: { myUserId: number, userId: number }) => {
      return await friendAPI.rejectFriend(myUserId, userId); // Gọi API logout
    },
    onSuccess: async (response) => {
         return response?.data
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  return { reject: reject.mutate, isLoading: reject.isPending , isSuccess: reject.isSuccess };
};

export default useRejectFriendRequest;
