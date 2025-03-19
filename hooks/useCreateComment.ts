import { useMutation, useQueryClient } from "@tanstack/react-query";
import postsAPI from "@/api/postsAPI";
import { UseCreateCommentType } from "@/utils/types/UseCreateCommentType";
import * as FileSystem from "expo-file-system";

const createEmptyFile = async () => {
  const fileUri = `${FileSystem.cacheDirectory}empty.txt`;
  await FileSystem.writeAsStringAsync(fileUri, "", { encoding: FileSystem.EncodingType.UTF8 });
  return fileUri;
};

export const useCreateComment = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: UseCreateCommentType) => {
      const formData = new FormData();

      if (!postData.postId || !postData.userId) {
        throw new Error("postId và userId là bắt buộc");
      }

      formData.append("postId", String(postData.postId));
      formData.append("userId", String(postData.userId));
      formData.append("content", postData.content || "");

      let detectedType: "Voice" | "Image" | "Text" = "Text";

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
        // Tạo tệp rỗng bằng Expo FileSystem
        const emptyFileUri = await createEmptyFile();
        formData.append("file", {
          uri: emptyFileUri,
          type: "text/plain",
          name: "empty.txt",
        } as any);
      }

      if (postData.parentCommentId !== null && postData.parentCommentId !== undefined) {
        formData.append("parentCommentId", String(postData.parentCommentId));
      } else {
        formData.append("parentCommentId", "-1");
      }

      if (postData.type) {
        detectedType = postData.type;
      }
      formData.append("type", detectedType);

      // Log chi tiết FormData
      for (let pair of (formData as any)._parts) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await postsAPI.createComment(formData);
      return response?.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["commentsLevel1", userId, variables.postId] });
      queryClient.invalidateQueries({
        queryKey: ["commentsLevel2", userId, variables.parentCommentId],
      });
    },
    onError: (error: any) => {
      console.error("Lỗi khi tạo comment:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    },
  });
};