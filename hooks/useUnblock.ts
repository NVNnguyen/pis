import friendAPI from "@/api/friendAPI";
import { useMutation } from "@tanstack/react-query";

const useUnblock = () => {
 
  const unblock = useMutation({
   
    mutationFn: async ({ myUserId, userId }: { myUserId: number, userId: number }) => {
      return await friendAPI.unblockFriend(myUserId, userId);
    },
    onSuccess: async (response) => {
         return response?.data
    },
    onError: (error) => {
      console.error("unblock error", error);
    },
  });

  return { unblock: unblock.mutate, isLoading: unblock.isPending , isSuccess: unblock.isSuccess };
};

export default useUnblock;
