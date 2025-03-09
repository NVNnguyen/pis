import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "@/utils/storage";
import Http from "@/utils/Http";

const BASE_URL_CONVERSATIONS = `/conversations`;

let http: any;

const initHttp = async () => {
  const token = await getToken();
  http = new Http(token || "").instance;
};
initHttp(); // Gọi khi app khởi động

// **API với token**
const conversationAPI = {
  conversations: async (id: number) => {
    try {
      const response = await http.get(`${BASE_URL_CONVERSATIONS}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },
  messages: async (ownerId: number, otherId: number) => {
    try {
      const response = await http.get(
        `${BASE_URL_CONVERSATIONS}/messages/${ownerId}/${otherId}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },
  checkConversations: async (ownerId: number, otherId: number) => {
    try {
      const response = await http.get(
        `${BASE_URL_CONVERSATIONS}/getId/${ownerId}/${otherId}`
      );
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Lấy error code và error message từ response
          const { code, message } = error.response.data;
          console.error(`Error Code: ${code}, Message: ${message}`);
          return { code, message }; // Trả về lỗi để xử lý phía trên
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("No response from server");
        } else {
          console.error("Request Error:", error.message);
          throw new Error(error.message);
        }
      } else {
        console.error("Unexpected Error:", error);
        throw new Error("Unexpected error occurred");
      }
    }
  },
  createConservations: async (ownerId: number, otherId: number) => {
    try {
      const response = await http.post(
        `${BASE_URL_CONVERSATIONS}/create/${ownerId}/${otherId}`
      );
      console.log("Response:", response.data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Lấy error code và error message từ response
          const { code, message } = error.response.data;
          console.error(`Error Code: ${code}, Message: ${message}`);
          return { code, message }; // Trả về lỗi để xử lý phía trên
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("No response from server");
        } else {
          console.error("Request Error:", error.message);
          throw new Error(error.message);
        }
      } else {
        console.error("Unexpected Error:", error);
        throw new Error("Unexpected error occurred");
      }
    }
  },
  sendMessage: async (formData: FormData) => {
    try {
      const response = await http.post(
        `${BASE_URL_CONVERSATIONS}/chat/send`,formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Lấy error code và error message từ response
          const { code, message } = error.response.data;
          console.error(`Error Code: ${code}, Message: ${message}`);
          return { code, message }; // Trả về lỗi để xử lý phía trên
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("No response from server");
        } else {
          console.error("Request Error:", error.message);
          throw new Error(error.message);
        }
      } else {
        console.error("Unexpected Error:", error);
        throw new Error("Unexpected error occurred");
      }
    }
  },
  newMessage: async (ownerId: number, otherId: number) => {
    try {
      const response = await http.get(
        `${BASE_URL_CONVERSATIONS}/${ownerId}/${otherId}/wait`
      );
      console.log("Response:", response.data);
      return response?.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Lấy error code và error message từ response
          const { code, message } = error.response.data;
          console.error(`Error Code: ${code}, Message: ${message}`);
          return { code, message }; // Trả về lỗi để xử lý phía trên
        } else if (error.request) {
          console.error("No response received:", error.request);
          throw new Error("No response from server");
        } else {
          console.error("Request Error:", error.message);
          throw new Error(error.message);
        }
      } else {
        console.error("Unexpected Error:", error);
        throw new Error("Unexpected error occurred");
      }
    }
  },
  
};

export default conversationAPI;
