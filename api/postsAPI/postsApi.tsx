import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/utils/API";

const BASE_URL_POSTS = `${BASE_URL}/posts`;
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
    baseURL: BASE_URL_POSTS,
    timeout: TIMEOUT,
    headers: {
      Authorization: token, // Truyền token đúng format
      "Content-Type": "application/json",
    },
  });
};

// **API với token**
const postApi = {
  posts: async (id: number) => {
    try {
      const api = await createAxiosInstance();
      const response = await api.get(`${BASE_URL_POSTS}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },
  postsPublic: async (id: number) => {
    try {
      const api = await createAxiosInstance();
      const response = await api.get(`${BASE_URL_POSTS}/${id}/public`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },
  postsPrivate: async (id: number) => {
    try {
      const api = await createAxiosInstance();
      const response = await api.get(`${BASE_URL_POSTS}/private/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  },
};

export default postApi;
