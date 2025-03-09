import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const usePrivatePosts = (userIdProp: number)=>{
    
  const {
    data: postsPrivate ,
    isLoading: isPostsPrivateLoading,
    error: postsPrivateError,
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
    postsPrivateError
}
};
export default usePrivatePosts;