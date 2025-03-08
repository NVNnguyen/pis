import { useMutation, useQueryClient } from "@tanstack/react-query";
import postsAPI from "@/api/postsAPI";
import { create } from "zustand";

// Định nghĩa kiểu dữ liệu cho bài post
interface UseCreatePostProps {
  files?: { uri: string }[];
  userId: number;
  type: string;
  content: string;
  mode: string;
}

// Hook để tạo bài post
export const useCreatePost = () => {
  const queryClient = useQueryClient();  

  return useMutation({
    mutationFn: async (postData: UseCreatePostProps) => {
      const formData = new FormData();
      console.log();
      postData.files?.forEach((file, index) => {
        const isVoice = postData.type === "Voice";
        formData.append("files", {
          uri: file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`, // Đảm bảo có tiền tố file://
          type: isVoice ? "audio/mpeg" : "image/jpeg",
          name: isVoice ? `audio_${index}.mp3` : `image_${index}.jpg`,
        } as any);
      });
      
      

      // Thêm các dữ liệu khác vào formData
      Object.entries(postData).forEach(([key, value]) => {
        if (key !== "files") formData.append(key, value.toString());
      });

      const response = await postsAPI.createPost(formData);
      return response?.data;
    },
    onSuccess: ( variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.userId] });
    },
  });
};
