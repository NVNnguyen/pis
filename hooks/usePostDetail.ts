import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";


const usePostDetail = (postId: number) => {

    const {
        data: postDetail,
        isLoading: isPostDetailLoading,
        error: postDetailError,
    } = useQuery({
        queryKey: ["postDetail", postId],
        queryFn: async () => {
            const response = await postsAPI.postDetails(
                postId
            );
            return response?.data?.elementPostDetail;
        },
        enabled: !!postId,
        staleTime: 1000 * 60 * 3,
     
    });
    return { postDetail, isPostDetailLoading, postDetailError };
};
export default usePostDetail;