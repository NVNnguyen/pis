import friendAPI from "@/api/friendAPI";
import { useQuery } from "@tanstack/react-query";

const useProfileInformation = (userId: number, friendId: number) => {
  const {
    data: profileInformation,
    isLoading: isProfileDetailLoading,
    error: postProfileError,
    refetch, // Thêm refetch vào đây
  } = useQuery({
    queryKey: ["profileInformation", friendId],
    queryFn: async () => {
      const response = await friendAPI.profile(userId, friendId);
      return response?.data;
    },
    enabled: !!friendId,
  });

  return { profileInformation, isProfileDetailLoading, postProfileError, refetch };
};

export default useProfileInformation;