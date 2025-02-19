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
};

export default infoAPI;
