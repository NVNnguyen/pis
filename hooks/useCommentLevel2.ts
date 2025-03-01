import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const useCommentLevel2 = (userId: number, commentId: number) => {

      const {
        data: commentsLevel2,
        isLoading: isLoading,
        error: error,
      } = useQuery({
        queryKey: ["commentsLevel2", userId, commentId],
        queryFn: async () => {
          const response = await postsAPI.commentsLevel2(
            userId,
            commentId
          );
          return response?.data?.elementCommentLevel2;
        },
        enabled: !!userId && !!commentId,
        staleTime: 1000 * 60 * 3,
       
      });
      return { commentsLevel2, isLoading, error };
};
export default useCommentLevel2;