import { useMutation, useQueryClient } from "@tanstack/react-query";
import postsAPI from "@/api/postsAPI";
import { UseCreateCommentType } from "@/utils/types/UseCreateCommentType";


export const useCreateComment = () => {
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

      // Handle parentCommentId properly
      if (postData.parentCommentId !== null && postData.parentCommentId !== undefined) {
        formData.append("parentCommentId", String(postData.parentCommentId));
      } else {
        formData.append("parentCommentId", "-1"); // Sử dụng -1 thay vì chuỗi rỗng
      }

      // Add other required fields
      formData.append("postId", String(postData.postId));
      formData.append("userId", String(postData.userId));
      formData.append("content", postData.content);
      formData.append("type", postData.type ?? detectedType);
      
      console.log("formData Comment: ", formData);
      const response = await postsAPI.createComment(formData);
      return response?.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["commentsLevel1", variables.userId, variables.postId],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", variables.userId],
      });
      if (variables.parentCommentId !== null && variables.parentCommentId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: ["commentsLevel2", variables.userId, variables.parentCommentId],
        });
      }
    },
    onError: (error) => {
      console.error("Lỗi khi tạo comment:", error);
    },
  });
};