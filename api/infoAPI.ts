import Http from "@/utils/Http";
import { getToken } from "@/utils/storage";

const BASE_URL_USERS = `/users`;
const http = new Http().instance;

// **API với token**
const infoAPI = {
  userInfo: async (id: number) => {
    try {
      const response = await http.get(`${BASE_URL_USERS}/${id}`);
      return response?.data;
    } catch (error) {
      console.error("Error fetching user info for :", error);
      throw error;
    }
  },
  userFollow: async (id: number) => {
    try {
      const response = await http.get(`${BASE_URL_USERS}/follow/${id}`);
      return response?.data;
    } catch (error) {
      console.error("Error fetching userFollow info:", error);
      throw error;
    }
  },
  uploadAvatar: async (formData: FormData, id: number) => {
      try {
         const response = await http.post(`${BASE_URL_USERS}/avatar/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response?.data;
      } catch (error) {
        const err = error as any;
        console.error("❌ Error uploading avatar:", err.response?.data || err.message);
        throw error;
      }
    },
    updateProfile: async (id: number, firstName: string, lastName: string, email: string, birthday: Date) => {
      try {
        const response = await http.patch(`${BASE_URL_USERS}/${id}`, {
          firstName,
          lastName, 
          email,
          birthday
        });
        return response?.data;
      } catch (error) {
        const err = error as any;
        console.error("Error fetching api update profile:", err.response?.data || err.message);
        throw error;
      }
    },
    searchFriend: async (text: string, userId: number) => {
      try {
        const response = await http.get(`${BASE_URL_USERS}/search`, {
          params: { text, userId }
        });
        return response?.data;
      } catch (error) {
        const err = error as any;
        console.error("Error search :", err.response?.data || err.message);
        throw error;
      }
    },
};

export default infoAPI;
