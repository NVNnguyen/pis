import { useMutation, useQueryClient } from "@tanstack/react-query";
import postsAPI from "@/api/postsAPI";

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

      // Thêm các file nếu có
      if (postData.files && postData.files.length > 0) {
        postData.files.forEach((file, index) => {
          const isVoice = postData.type === "Voice";
          formData.append("files", {
            uri: file.uri.startsWith("file://") ? file.uri : `file://${file.uri}`,
            type: isVoice ? "audio/mpeg" : "image/jpeg",
            name: isVoice ? `audio_${index}.mp3` : `image_${index}.jpg`,
          } as any);
        });
      }else{
        const emptyBlob = new Blob([" "], { type: 'application/octet-stream' });
        // Tạo một file từ Blob rỗng
        const emptyFile = new File([emptyBlob], 'empty.txt', { type: 'application/octet-stream' });
        formData.append("files", emptyFile as any);
      }

      // Thêm các dữ liệu khác vào formData
      formData.append("userId", postData.userId.toString());
      formData.append("type", postData.type);
      if(postData.content!==""){
        formData.append("content", postData.content);
      }else{
        formData.append("content","");
      }
     
      formData.append("mode", postData.mode);

      // Gửi formData lên server
      const response = await postsAPI.createPost(formData);
      return response?.data;
    },

    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.userId] });
    },
  });
};
