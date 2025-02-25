import infoAPI from "@/api/infoAPI";
import { useMutation } from "@tanstack/react-query";

interface updateProfileType {
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  userIdProp: number;
}

const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: updateProfileType) => {
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
};

export default useUpdateProfile;
