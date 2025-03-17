import conversationAPI from "@/api/conversationAPI";
import postsAPI from "@/api/postsAPI";
import { useQuery } from "@tanstack/react-query";

const useNewestMessage= (myUserId: number, userIdProp: number) => {
        const {
            data: newMessage,
            isLoading: isNewMessageLoading,
            error: newMessageError,
            refetch: refetchNewMessage,
        } = useQuery({
            queryKey: ["newMessage", myUserId, userIdProp],
            queryFn: async () => {
                const response = await conversationAPI.newMessage(myUserId, userIdProp);
                console.log("Message in useMessage newest: ", response?.data ?? [])
               
            return response?.data ?? [];
            },
            enabled: !!myUserId && !!userIdProp,
            refetchInterval: 1000,
        });
        return { newMessage, isNewMessageLoading, newMessageError, refetchNewMessage };
};
export default useNewestMessage;

