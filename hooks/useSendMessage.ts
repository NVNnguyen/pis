import { useMutation, useQueryClient } from "@tanstack/react-query";
import conversationAPI from "@/api/conversationAPI";
import { SendMessageType } from "@/utils/types/SendMessageType";

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sendMessage: SendMessageType) => {
      const formData = new FormData();

      // Kiểm tra và thêm các trường bắt buộc
      if (!sendMessage.conversationId || !sendMessage.senderId) {
        throw new Error("conversationId và senderId là bắt buộc");
      }

      formData.append("conversationId", String(sendMessage.conversationId));
      formData.append("senderId", String(sendMessage.senderId));
      formData.append("content", sendMessage.content || ""); // Nội dung có thể rỗng

      // Xác định type, mặc định là Text
      let detectedType: "Voice" | "Image" | "Text" = "Text";

      // Xử lý file nếu có
      // Kiểm tra và truyền file (nếu có)
      if (sendMessage.file && typeof sendMessage.file === "object" && sendMessage.file.uri) {
        const { uri } = sendMessage.file;
        const isVoice = uri.endsWith(".mp3") || uri.endsWith(".m4a");
        detectedType = isVoice ? "Voice" : "Image";
        
        // Prepare filename and mimetype correctly
        const fileName = isVoice ? `audio_${Date.now()}.mp3` : `image_${Date.now()}.jpg`;
        const mimeType = isVoice ? "audio/mpeg" : "image/jpeg";
        
        // Create proper file object for FormData
        formData.append("file", {
          uri: uri.startsWith("file://") ? uri : `file://${uri}`,
          type: mimeType,
          name: fileName,
        } as any);
      } else {
        // API bắt buộc phải có trường file, tạo một file rỗng
        // Tạo một Blob rỗng để gửi như một file
        const emptyBlob = new Blob([], { type: 'application/octet-stream' });
        // Tạo một file từ Blob rỗng
        const emptyFile = new File([emptyBlob], 'empty.txt', { type: 'application/octet-stream' });
        formData.append("file", emptyFile as any);
      }


      // Ghi đè type nếu đã được chỉ định trong sendMessage
      if (sendMessage.type) {
        detectedType = sendMessage.type;
      }

      formData.append("type", detectedType);
      console.log("form data send message: ", formData);
      const response = await conversationAPI.sendMessage(formData);
      return response?.data;
    },
    onSuccess: (_data, variables) => {
      // Cập nhật danh sách tin nhắn
      queryClient.refetchQueries({
        queryKey: ["message", variables?.senderId, variables?.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversation", variables?.senderId] }); 
    }

  })
}