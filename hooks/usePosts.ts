import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const usePosts = (userIdProp: number) => {
  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
    refetch,                // 👉 Thêm refetch
    isFetching              // 👉 Thêm isFetching (cho refreshing state)
  } = useQuery({
    queryKey: ["posts", userIdProp],
    queryFn: async () => {
      const response = await postsAPI.posts(userIdProp);
      return response?.data;
    },
    enabled: !!userIdProp,
  });

  return {
    posts,
    isPostsLoading,
    isFetching,
    postsError,
    refetch
  };
};

export default usePosts;
