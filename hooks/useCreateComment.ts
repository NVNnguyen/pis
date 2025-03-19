import { useMutation, useQueryClient } from "@tanstack/react-query";
import postsAPI from "@/api/postsAPI";
import { UseCreateCommentType } from "@/utils/types/UseCreateCommentType";

export const useCreateComment = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: UseCreateCommentType) => {
      const formData = new FormData();

      // Kiểm tra các trường bắt buộc
      if (!postData.postId || !postData.userId) {
        throw new Error("postId và userId là bắt buộc");
      }

      formData.append("postId", String(postData.postId));
      formData.append("userId", String(postData.userId));
      formData.append("content", postData.content || ""); // Nội dung có thể rỗng

      // Xác định type, mặc định là Text
      let detectedType: "Voice" | "Image" | "Text" = "Text";

      // Xử lý file nếu có
      if (postData.file && typeof postData.file === "object" && postData.file.uri) {
        const { uri } = postData.file;
        const isVoice = uri.endsWith(".mp3") || uri.endsWith(".m4a");
        detectedType = isVoice ? "Voice" : "Image";

        const fileName = isVoice ? `audio_${Date.now()}.mp3` : `image_${Date.now()}.jpg`;
        const mimeType = isVoice ? "audio/mpeg" : "image/jpeg";

        formData.append("file", {
          uri: uri.startsWith("file://") ? uri : `file://${uri}`,
          type: mimeType,
          name: fileName,
        } as any);
      } else {
        // API bắt buộc phải có trường file, tạo một file rỗng
        const emptyBlob = new Blob(["  "], { type: "application/octet-stream" });
        const emptyFile = new File([emptyBlob], "empty.txt", { type: "application/octet-stream" });
        formData.append("file", emptyFile as any);
      }

      // Xử lý parentCommentId
      if (postData.parentCommentId !== null && postData.parentCommentId !== undefined) {
        formData.append("parentCommentId", String(postData.parentCommentId));
      } else {
        formData.append("parentCommentId", "-1");
      }

      // Ghi đè type nếu đã được chỉ định trong postData
      if (postData.type) {
        detectedType = postData.type;
      }
      formData.append("type", detectedType);

      // Log FormData trước khi gửi
      console.log("form data create comment: ", formData);

      // Gửi request
      const response = await postsAPI.createComment(formData);
      return response?.data;
    },
    onSuccess: (_data, variables) => {
      // Làm mới các query liên quan
      queryClient.invalidateQueries({ queryKey: ["commentsLevel1", userId, variables.postId] });
      queryClient.invalidateQueries({
        queryKey: ["commentsLevel2", userId, variables.parentCommentId],
      });
    },
    onError: (error) => {
      console.error("Lỗi khi tạo comment:", error);
      console.error("Error details:", (error as any).response?.data || error.message);
    },
  });
};