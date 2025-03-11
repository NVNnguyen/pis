import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const usePrivatePosts = (userIdProp: number) => {
  const {
    data: postsPrivate,
    isLoading: isPostsPrivateLoading,
    error: postsPrivateError,
    refetch, // ✅ Thêm refetch để gọi lại query khi cần
  } = useQuery({
    queryKey: ["postsPrivate", userIdProp],
    queryFn: async () => {
      const response = await postsAPI.privatePosts(userIdProp);
      return response?.data;
    },
    enabled: !!userIdProp,
  });

  return {
    postsPrivate,
    isPostsPrivateLoading,
    postsPrivateError,
    refetch, // ✅ Trả về refetch để có thể gọi từ component
  };
};

export default usePrivatePosts;
