import conversationAPI from "@/api/conversationAPI";

export const useGetOrCreateConversationId = async (ownerId: number, otherId: number): Promise<number | null> => {
  try {
    const result = await conversationAPI.checkConversations(ownerId, otherId);
    
    if (result.code === 2000 && result?.data?.conversationId) {
      console.log("result", result?.data?.conversationId);
      return result?.data?.conversationId;
    } else if (result.code === 4020) {
      const newResult = await conversationAPI.createConservations(ownerId, otherId);
      if (newResult.code === 2000 && newResult?.data?.conversationId) {
        console.log("newResult", newResult?.data?.conversationId);
        return newResult?.data?.conversationId;
      }
    }
    console.log("result", result);
    return null;
  } catch (error) {
    console.error("getOrCreateConversationId error:", error);
    return null;
  }
};
