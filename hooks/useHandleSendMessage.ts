import { SendMessageType } from "@/utils/types/SendMessageType";
import { useGetOrCreateConversationId } from "./useGetOrCreateConversationId";
import { useSendMessage } from "./useSendMessage";

export const useHandleSendMessage = () => {
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async ({
    myUserId,
    partnerUserId,
    voiceUri,
    imageUri,
    message,
  }: {
    myUserId: number;
    partnerUserId: number;
    voiceUri: string;
    imageUri: string;
    message: string;
  }) => {
    if (sendMessageMutation.isPending || myUserId === null) return;

    const conversationId = await useGetOrCreateConversationId(myUserId, partnerUserId);
    console.log("conversationId", conversationId);
    if (!conversationId) return;

    let detectedType: "Voice" | "Image" | "Text" = "Text";
    let filePayload: { uri: string } | null = null;

    if (voiceUri) {
      detectedType = "Voice";
      filePayload = { uri: voiceUri };
    } else if (imageUri) {
      detectedType = "Image";
      filePayload = { uri: imageUri };
    }

    if (!message.trim() && !voiceUri && !imageUri) return;

    const payload: SendMessageType = {
      conversationId,
      senderId: myUserId,
      content: message || "",
      file: filePayload || "",
      type: detectedType,
      userId: partnerUserId,
    };

    console.log("payload", payload);

    sendMessageMutation.mutate(payload);
    console.log("sendMessageMutation", sendMessageMutation);
    return {
      isPending: sendMessageMutation.isPending,
      isError: sendMessageMutation.isError,
      isSuccess: sendMessageMutation.isSuccess,
    };
  };

  return {
    handleSendMessage,
    ...sendMessageMutation,
  };
};
