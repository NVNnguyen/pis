import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseCreateCommentType } from "@/utils/types/UseCreateCommentType";
import conversationAPI from "@/api/conversationAPI";



export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: UseCreateCommentType) => {
      const formData = new FormData();
      let detectedType: "Voice" | "Image" | "Text" = "Text"; // Mặc định là Text

      // Kiểm tra và truyền file (nếu có)
      if (postData.file && typeof postData.file === "object" && postData.file.uri) {
        const { uri } = postData.file;
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

        formData.append("conversationId", String(postData.parentCommentId));
  

      formData.append("senderId", String(postData.postId));
      formData.append("content", postData.content);
      formData.append("type", postData.type ?? detectedType);
      
      console.log("formData Comment: ", formData);
      const response = await conversationAPI.sendMessage(formData);
      return response?.data;
    },
    onSuccess: (_data, variables) => {
      
    },
    onError: (error) => {
      console.error("Lỗi khi tạo comment:", error);
    },
  });
};