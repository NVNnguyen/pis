import friendAPI from "@/api/friendAPI";
import { useMutation } from "@tanstack/react-query";

import { Alert } from "react-native";

const useAddFriend = () => {
 
  const addFriend = useMutation({
   
    mutationFn: async ({ myUserId, userId }: { myUserId: number, userId: number }) => {
      return await friendAPI.addFriend(myUserId, userId); // Gọi API logout
    },
    onSuccess: async (response) => {
        console.log("response addFriend", response);
         return response?.data
    },
    onError: (error) => {
      console.error("acceptFriend error:", error);
    },
  });

  return { addFriend: addFriend.mutate, isLoading: addFriend.isPending , isSuccess: addFriend.isSuccess };
};

export default useAddFriend;
