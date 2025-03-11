import conversationAPI from "@/api/conversationAPI";
import { useQuery } from "@tanstack/react-query";

const useConversation= (userId: number) => {
        const {
            data: conversation,
            isLoading: isConversationLoading,
            error: conversationError,
        } = useQuery({
            queryKey: ["conversation", userId],
            queryFn: async () => {
            const response = await conversationAPI.conversations(userId);
            return response?.data;
            },
            enabled: !!userId ,
         
        });
        return { conversation, isConversationLoading, conversationError };
};
export default useConversation;

