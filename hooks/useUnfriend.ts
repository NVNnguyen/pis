import friendAPI from "@/api/friendAPI";
import { useMutation } from "@tanstack/react-query";

const useUnfriend = () => {
 
  const unfriend = useMutation({
   
    mutationFn: async ({ myUserId, userId }: { myUserId: number, userId: number }) => {
      return await friendAPI.unFriend(myUserId, userId);
    },
    onSuccess: async (response) => {
         return response?.data
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  return { unfriend: unfriend.mutate, isLoading: unfriend.isPending , isSuccess: unfriend.isSuccess };
};

export default useUnfriend;
