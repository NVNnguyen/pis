import conversationAPI from "@/api/conversationAPI";
import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const useConversation= (userId: number) => {
        const {
            data: conversation,
            isLoading: isConversationLoading,
            error: conversationError,
        } = useQuery({
            queryKey: ["conversation", userId],
            queryFn: async () => {
            const response = await conversationAPI.conversations( userId );
            return response?.data;
            },
            enabled: !!userId ,
            staleTime: 1000 * 60 * 3,
         
        });
        return { conversation, isConversationLoading, conversationError };
};
export default useConversation;

