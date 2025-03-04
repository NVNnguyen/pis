import infoAPI from "@/api/infoAPI";
import { useMutation } from "@tanstack/react-query";

interface UpdateProfileType {
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  userIdProp: number;
}

const useUpdateProfile = () => {
  const mutation = useMutation({
    mutationFn: async (data: UpdateProfileType) => {
      const response = await infoAPI.updateProfile(
        data.userIdProp,
        data.firstName,
        data.lastName,
        data.email,
        data.birthday
      );
      return response.data;
    },
  });

  return {
    updateProfile: mutation.mutate, // Hàm gọi API
    isLoading: mutation.isPending,  // Trạng thái loading
    data: mutation.data,            // Dữ liệu trả về
    error: mutation.error,          // Bắt lỗi
  };
};

export default useUpdateProfile;
