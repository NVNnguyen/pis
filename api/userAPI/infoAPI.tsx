import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/utils/API";

const BASE_URL_USERS = `${BASE_URL}/users`;
const TIMEOUT = 10000;

// **Hàm lấy token từ AsyncStorage**
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token ? `Bearer ${token}` : ""; // Bổ sung "Bearer " trước token
  } catch (error) {
    console.error("Lỗi lấy token từ AsyncStorage:", error);
    return "";
  }
};

// **Tạo instance axios có token**
const createAxiosInstance = async () => {
  const token = await getAuthToken();
  return axios.create({
    baseURL: BASE_URL_USERS,
    timeout: TIMEOUT,
    headers: {
      Authorization: token, // Truyền token đúng format
      "Content-Type": "application/json",
    },
  });
};

// **API với token**
const infoAPI = {
  userInfo: async (id: number) => {
    try {
      const api = await createAxiosInstance();
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },
};

export default infoAPI;
