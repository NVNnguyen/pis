import conversationAPI from "@/api/conversationAPI";
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
                console.log("call api with: ", +1)
                console.log("Message in useMessage: ", response?.data)
            return response?.data || [];
            },
            enabled: !!myUserId && !!userIdProp,
          
        });
        return { message, isMessageLoading, messageError };
};
export default useMessage;

