import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "@/utils/storage";
import Http from "@/utils/API";

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
};

export default conversationAPI;
