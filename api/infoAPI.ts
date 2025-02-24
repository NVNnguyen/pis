import Http from "@/utils/API";
import { getToken } from "@/utils/storage";

const BASE_URL_USERS = `/users`;
let http: any;

const initHttp = async () => {
  const token = await getToken();
  http = new Http(token || "").instance;
};
initHttp(); // Gọi khi app khởi động


// **API với token**
const infoAPI = {
  userInfo: async (id: number) => {
    try {
      const response = await http.get(`${BASE_URL_USERS}/${id}`);
      return response.data;
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
      
  
        console.log("🚀 Đang gửi formData:", formData);
  
        const response = await http.post(`${BASE_URL_USERS}/avatar/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        console.log("✅ Kết quả upload:", response.data);
        return response?.data;
      } catch (error) {
        console.error("❌ Error uploading avatar:", error.response?.data || error.message);
        throw error;
      }
    }
};

export default infoAPI;
