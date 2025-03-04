import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const useCommentLevel1= (userId: number, postId: number) => {

        const {
            data: commentsLevel1,
            isLoading: isCommentLevel1Loading,
            error: commentLevel1Error,
        } = useQuery({
            queryKey: ["commentsLevel1", userId, postId],
            queryFn: async () => {
            const response = await postsAPI.commentsLevel1(
                userId,
                postId
            );
            return response?.data;
            },
            enabled: !!userId && !!postId,
            staleTime: 1000 * 60 * 3,
         
        });
        return { commentsLevel1, isCommentLevel1Loading, commentLevel1Error };
};
export default useCommentLevel1;