import conversationAPI from "@/api/conversationAPI";
import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const useMessage= (myUserId: number, userIdProp: number) => {
        const {
            data: message,
            isLoading: isMessageLoading,
            error: messageError,
        } = useQuery({
            queryKey: ["message", myUserId, userIdProp],
            queryFn: async () => {
                const response = await conversationAPI.messages(myUserId, userIdProp);
            return response?.data;
            },
            enabled: !!myUserId && !!userIdProp,
            staleTime: 1000 * 60 * 3,
         
        });
        return { message, isMessageLoading, messageError };
};
export default useMessage;

