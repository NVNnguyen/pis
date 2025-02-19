import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "@/utils/storage";
import Http from "@/utils/API";

const BASE_URL_POSTS = `/posts`;
let http: any;

const initHttp = async () => {
  const token = await getToken();
  http = new Http(token || "").instance;
};
initHttp(); // Gọi khi app khởi động

// **API với token**
const postsAPI = {
  posts: async (id: number) => {
    try {
      const response = await http.get(`${BASE_URL_POSTS}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching  posts:", error);
      throw error;
    }
  },
  comments: async (userId: number, postId: number) => {
    try {
      const response = await http.post(`${BASE_URL_POSTS}/comments/level1`, {
        userId: userId,
        postId: postId,
      });

      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
  postsPublic: async (id: number) => {
    try {
      const response = await http.get(`${BASE_URL_POSTS}/${id}/public`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts public:", error);
      throw error;
    }
  },
  postsPrivate: async (id: number) => {
    try {
      const response = await http.get(`${BASE_URL_POSTS}/private/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts private:", error);
      throw error;
    }
  },
  postDetails: async (postsId: number)=>{
    try {
      const response = await http.get(`${BASE_URL_POSTS}/detail/${postsId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching post detail:", error);
      throw error;
    }
  },
  like: async (userId:number, postId: number)=>{
    try {
      const response = await http.post(`${BASE_URL_POSTS}/like`,
        {
          userId: userId,
          postId: postId,
        }
      
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching like api:", error);
      throw error;
    }
  },
  dislike: async (userId:number, postId: number)=>{
    try {
      const response = await http.post(`${BASE_URL_POSTS}/dislike`,
        {
          userId: userId,
          postId: postId,
        }
      
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dislike api:", error);
      throw error;
    }
  }
};

export default postsAPI;
