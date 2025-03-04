import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const usePosts = (userIdProp: number)=>{
    
  const {
    data: posts ,
    isLoading: isPostsLoading,
    error: postsError,
  } = useQuery({
    queryKey: ["posts", userIdProp],
    queryFn: async () => {
      const response = await postsAPI.posts(userIdProp);
      return response.data;
    },
    enabled: !!userIdProp,
    staleTime: 1000 * 60 * 3,
  });
return {
    posts,
    isPostsLoading,
    postsError
}
};
export default usePosts;